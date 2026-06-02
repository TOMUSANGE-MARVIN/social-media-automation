import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import OpenAI from 'openai';

const router = Router();
const ZERNIO = 'https://zernio.com/api/v1';

function openai() {
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

const PLATFORM_TIPS = {
  tiktok:    'TikTok (short, punchy, trending — keep it under 150 characters)',
  instagram: 'Instagram (visual storytelling, up to 2200 characters, emojis welcome)',
  facebook:  'Facebook (conversational and engaging, any length)',
  linkedin:  'LinkedIn (professional and insightful, up to 1300 characters)',
};

const TONE_PROMPTS = {
  casual:       'casual and friendly',
  professional: 'professional and authoritative',
  funny:        'humorous and witty',
  inspiring:    'motivational and inspiring',
  educational:  'educational and informative',
};

// POST /api/ai/content
router.post('/content', requireAuth, async (req, res) => {
  try {
    const { topic, platform = 'instagram', tone = 'casual', includeHashtags = true } = req.body;
    if (!topic?.trim()) return res.status(400).json({ error: 'topic is required' });

    const platformTip = PLATFORM_TIPS[platform] || platform;
    const toneTip = TONE_PROMPTS[tone] || tone;

    const completion = await openai().chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are an expert social media content writer. Write an engaging post optimized for ${platformTip}. Tone: ${toneTip}. ${
            includeHashtags
              ? 'Include 3–5 relevant hashtags at the end.'
              : 'Do NOT include hashtags.'
          } Return ONLY the post text — no quotes, no labels, no explanations.`,
        },
        { role: 'user', content: `Write a social media post about: ${topic}` },
      ],
      max_tokens: 500,
      temperature: 0.8,
    });

    const content = completion.choices[0]?.message?.content?.trim() ?? '';
    res.json({ content });
  } catch (err) {
    console.error('[AI /content]', err.message);
    res.status(500).json({ error: err.message || 'Failed to generate content' });
  }
});

// POST /api/ai/image
// Generates via DALL-E 3, downloads, uploads to Zernio CDN, returns publicUrl
router.post('/image', requireAuth, async (req, res) => {
  try {
    const { prompt, style = 'vivid' } = req.body;
    if (!prompt?.trim()) return res.status(400).json({ error: 'prompt is required' });

    // 1. Generate with DALL-E 2
    const result = await openai().images.generate({
      model: 'dall-e-2',
      prompt,
      n: 1,
      size: '1024x1024',
    });

    const tempUrl = result.data[0]?.url;
    if (!tempUrl) throw new Error('No image URL returned from DALL-E');

    // 2. Download image bytes from OpenAI CDN
    const imgRes = await fetch(tempUrl);
    if (!imgRes.ok) throw new Error('Failed to download generated image');
    const imageBuffer = await imgRes.arrayBuffer();

    // 3. Get presigned upload URL from Zernio
    const filename = `ai-${Date.now()}.png`;
    const presignRes = await fetch(`${ZERNIO}/media/presign`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.ZERNIO_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ filename, contentType: 'image/png' }),
    });
    const presignData = await presignRes.json();
    if (!presignRes.ok) throw new Error(presignData.error || 'Failed to get presigned URL');

    // 4. Upload to Zernio CDN
    const { uploadUrl, publicUrl } = presignData;
    const uploadRes = await fetch(uploadUrl, {
      method: 'PUT',
      headers: { 'Content-Type': 'image/png' },
      body: imageBuffer,
    });
    if (!uploadRes.ok) throw new Error(`CDN upload failed (${uploadRes.status})`);

    res.json({ publicUrl });
  } catch (err) {
    console.error('[AI /image]', err.message);
    res.status(500).json({ error: err.message || 'Failed to generate image' });
  }
});

export default router;
