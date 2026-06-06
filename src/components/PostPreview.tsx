import { useState } from "react";
import { X, Heart, MessageCircle, Send, Bookmark, MoreHorizontal,
  Repeat2, BarChart2, ThumbsUp, Share2, Globe, ChevronDown } from "lucide-react";
import type { ZernioAccount } from "../services/api";

// ─── types ────────────────────────────────────────────────────────────────────

interface PreviewProps {
  content: string;
  hashtags: string[];
  mediaUrl: string;
  accounts: ZernioAccount[];
  selectedIds: Set<string>;
  onClose: () => void;
}

// ─── helpers ──────────────────────────────────────────────────────────────────

const CHAR_LIMITS: Record<string, number> = {
  twitter: 280, threads: 500, instagram: 2200, facebook: 63206,
  linkedin: 3000, tiktok: 2200, youtube: 5000, pinterest: 500,
  reddit: 40000, telegram: 4096, discord: 2000, bluesky: 300,
  whatsapp: 65536, googlebusiness: 1500,
};

const PLATFORM_LABELS: Record<string, string> = {
  twitter: "X (Twitter)", threads: "Threads", instagram: "Instagram",
  facebook: "Facebook", linkedin: "LinkedIn", tiktok: "TikTok",
  youtube: "YouTube", pinterest: "Pinterest", reddit: "Reddit",
  telegram: "Telegram", discord: "Discord", bluesky: "Bluesky",
  whatsapp: "WhatsApp", googlebusiness: "Google Business",
};

function Avatar({ name, size = 8, bg = "bg-gray-700" }: { name: string; size?: number; bg?: string }) {
  return (
    <div className={`size-${size} rounded-full ${bg} flex items-center justify-center text-white font-semibold shrink-0`}
      style={{ fontSize: size * 1.6 }}>
      {name?.[0]?.toUpperCase() ?? "U"}
    </div>
  );
}

function truncate(text: string, limit: number) {
  if (text.length <= limit) return { text, truncated: false };
  return { text: text.slice(0, limit), truncated: true };
}

function fmtNum(n: number) {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return String(n);
}

// ─── platform previews ────────────────────────────────────────────────────────

function InstagramPreview({ content, hashtags, mediaUrl, account }: {
  content: string; hashtags: string[]; mediaUrl: string; account: ZernioAccount;
}) {
  const [expanded, setExpanded] = useState(false);
  const full = hashtags.length ? `${content}\n\n${hashtags.map(h => `#${h}`).join(" ")}` : content;
  const { text, truncated } = truncate(full, 125);

  return (
    <div className="bg-white rounded-xl overflow-hidden border border-gray-200 font-sans text-[13px] max-w-sm mx-auto">
      {/* Header */}
      <div className="flex items-center gap-2.5 px-3 py-2.5">
        <Avatar name={account.displayName} size={8} bg="bg-gradient-to-br from-pink-500 to-purple-600" />
        <div className="flex-1">
          <p className="font-semibold text-gray-900 text-xs leading-tight">{account.username || account.displayName}</p>
          <p className="text-gray-400 text-[10px]">Sponsored</p>
        </div>
        <MoreHorizontal className="size-4 text-gray-500" />
      </div>

      {/* Media */}
      {mediaUrl ? (
        <img src={mediaUrl} alt="" className="w-full aspect-square object-cover" />
      ) : (
        <div className="w-full aspect-square bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
          <p className="text-gray-400 text-xs">No image</p>
        </div>
      )}

      {/* Actions */}
      <div className="px-3 pt-2.5 pb-1 flex items-center gap-3">
        <Heart className="size-5 text-gray-800" />
        <MessageCircle className="size-5 text-gray-800" />
        <Send className="size-5 text-gray-800" />
        <Bookmark className="size-5 text-gray-800 ml-auto" />
      </div>

      {/* Likes */}
      <div className="px-3 pb-1">
        <p className="font-semibold text-xs text-gray-900">{fmtNum(1247)} likes</p>
      </div>

      {/* Caption */}
      <div className="px-3 pb-3 text-xs text-gray-900 leading-relaxed">
        <span className="font-semibold mr-1">{account.username || account.displayName}</span>
        {expanded ? full : text}
        {truncated && !expanded && (
          <button className="text-gray-400 ml-1" onClick={() => setExpanded(true)}>more</button>
        )}
      </div>
    </div>
  );
}

function TwitterPreview({ content, hashtags, mediaUrl, account }: {
  content: string; hashtags: string[]; mediaUrl: string; account: ZernioAccount;
}) {
  const full = hashtags.length ? `${content} ${hashtags.map(h => `#${h}`).join(" ")}` : content;
  const { text, truncated } = truncate(full, CHAR_LIMITS.twitter);
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-black rounded-xl overflow-hidden border border-gray-800 text-white font-sans text-[13px] max-w-sm mx-auto p-4">
      <div className="flex gap-3">
        <Avatar name={account.displayName} size={10} bg="bg-gray-600" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-sm">{account.displayName}</span>
            <svg className="size-3.5 fill-[#1d9bf0]" viewBox="0 0 24 24"><path d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.9-.81-3.91s-2.52-1.27-3.91-.81c-.66-1.31-1.91-2.19-3.34-2.19s-2.67.88-3.33 2.19c-1.4-.46-2.91-.2-3.92.81s-1.26 2.52-.8 3.91C3.13 9.33 2.25 10.57 2.25 12s.88 2.67 2.19 3.34c-.46 1.39-.21 2.9.8 3.91s2.52 1.26 3.91.8c.67 1.31 1.91 2.19 3.34 2.19s2.68-.88 3.34-2.19c1.39.46 2.9.2 3.91-.8s1.26-2.52.81-3.91c1.31-.67 2.19-1.91 2.19-3.34z"/></svg>
            <span className="text-gray-500 text-xs">@{account.username || account.displayName}</span>
          </div>
          <p className="mt-1 text-sm leading-relaxed text-gray-100 whitespace-pre-line">
            {expanded ? full : text}
            {truncated && !expanded && (
              <button className="text-[#1d9bf0] ml-1 text-xs" onClick={() => setExpanded(true)}>Show more</button>
            )}
            {truncated && (
              <span className="block text-[10px] text-red-400 mt-1">
                {full.length}/{CHAR_LIMITS.twitter} chars — will be truncated
              </span>
            )}
          </p>

          {mediaUrl && (
            <img src={mediaUrl} alt="" className="mt-2 rounded-xl w-full max-h-64 object-cover border border-gray-800" />
          )}

          <div className="flex items-center justify-between mt-3 text-gray-500">
            <div className="flex items-center gap-1 hover:text-[#1d9bf0] cursor-pointer">
              <MessageCircle className="size-4" /><span className="text-xs">24</span>
            </div>
            <div className="flex items-center gap-1 hover:text-green-400 cursor-pointer">
              <Repeat2 className="size-4" /><span className="text-xs">87</span>
            </div>
            <div className="flex items-center gap-1 hover:text-pink-400 cursor-pointer">
              <Heart className="size-4" /><span className="text-xs">342</span>
            </div>
            <div className="flex items-center gap-1 hover:text-[#1d9bf0] cursor-pointer">
              <BarChart2 className="size-4" /><span className="text-xs">5.2K</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function LinkedInPreview({ content, hashtags, mediaUrl, account }: {
  content: string; hashtags: string[]; mediaUrl: string; account: ZernioAccount;
}) {
  const full = hashtags.length ? `${content}\n\n${hashtags.map(h => `#${h}`).join(" ")}` : content;
  const { text, truncated } = truncate(full, 210);
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white rounded-xl overflow-hidden border border-gray-200 font-sans text-[13px] max-w-sm mx-auto">
      <div className="p-3">
        <div className="flex items-start gap-2.5">
          <Avatar name={account.displayName} size={10} bg="bg-blue-700" />
          <div className="flex-1">
            <p className="font-semibold text-gray-900 text-xs">{account.displayName}</p>
            <p className="text-gray-500 text-[10px]">Social Media Manager</p>
            <div className="flex items-center gap-1 text-gray-400 text-[10px] mt-0.5">
              <span>2h</span><span>·</span><Globe className="size-2.5" />
            </div>
          </div>
          <ChevronDown className="size-4 text-gray-400" />
        </div>

        <p className="mt-2.5 text-xs text-gray-800 leading-relaxed whitespace-pre-line">
          {expanded ? full : text}
          {truncated && !expanded && (
            <button className="text-blue-600 ml-1" onClick={() => setExpanded(true)}>…see more</button>
          )}
        </p>
      </div>

      {mediaUrl && (
        <img src={mediaUrl} alt="" className="w-full max-h-56 object-cover" />
      )}

      <div className="px-3 py-2 border-t border-gray-100">
        <div className="flex items-center gap-1 text-[10px] text-gray-500 mb-2">
          <span>👍❤️</span><span>{fmtNum(234)} reactions</span>
          <span className="ml-auto">{fmtNum(41)} comments</span>
        </div>
        <div className="flex items-center justify-around border-t border-gray-100 pt-2">
          {["Like", "Comment", "Repost", "Send"].map(a => (
            <button key={a} className="flex items-center gap-1 text-[10px] text-gray-500 hover:text-blue-600 font-medium">
              {a === "Like" && <ThumbsUp className="size-3.5" />}
              {a === "Comment" && <MessageCircle className="size-3.5" />}
              {a === "Repost" && <Repeat2 className="size-3.5" />}
              {a === "Send" && <Share2 className="size-3.5" />}
              {a}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function FacebookPreview({ content, hashtags, mediaUrl, account }: {
  content: string; hashtags: string[]; mediaUrl: string; account: ZernioAccount;
}) {
  const full = hashtags.length ? `${content}\n\n${hashtags.map(h => `#${h}`).join(" ")}` : content;
  const { text, truncated } = truncate(full, 200);
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white rounded-xl overflow-hidden border border-gray-200 font-sans text-[13px] max-w-sm mx-auto">
      <div className="p-3">
        <div className="flex items-center gap-2.5">
          <Avatar name={account.displayName} size={10} bg="bg-blue-600" />
          <div className="flex-1">
            <p className="font-semibold text-gray-900 text-xs">{account.displayName}</p>
            <div className="flex items-center gap-1 text-gray-400 text-[10px]">
              <span>2h</span><span>·</span><Globe className="size-2.5" />
            </div>
          </div>
          <MoreHorizontal className="size-4 text-gray-400" />
        </div>
        <p className="mt-2 text-xs text-gray-800 leading-relaxed whitespace-pre-line">
          {expanded ? full : text}
          {truncated && !expanded && (
            <button className="text-blue-600 ml-1" onClick={() => setExpanded(true)}>See more</button>
          )}
        </p>
      </div>

      {mediaUrl && (
        <img src={mediaUrl} alt="" className="w-full max-h-64 object-cover" />
      )}

      <div className="px-3 py-2 border-t border-gray-100">
        <div className="flex items-center justify-between text-[10px] text-gray-500 mb-2">
          <span>👍❤️😂 {fmtNum(891)}</span>
          <div className="flex gap-2"><span>{fmtNum(62)} comments</span><span>{fmtNum(18)} shares</span></div>
        </div>
        <div className="flex items-center justify-around border-t border-gray-100 pt-1.5">
          {[{ icon: <ThumbsUp className="size-3.5" />, label: "Like" },
            { icon: <MessageCircle className="size-3.5" />, label: "Comment" },
            { icon: <Share2 className="size-3.5" />, label: "Share" }].map(({ icon, label }) => (
            <button key={label} className="flex items-center gap-1 text-[10px] text-gray-500 hover:text-blue-600 font-medium">
              {icon}{label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function TikTokPreview({ content, hashtags, mediaUrl, account }: {
  content: string; hashtags: string[]; mediaUrl: string; account: ZernioAccount;
}) {
  const caption = hashtags.length ? `${content} ${hashtags.map(h => `#${h}`).join(" ")}` : content;
  const { text, truncated } = truncate(caption, 150);

  return (
    <div className="bg-black rounded-xl overflow-hidden border border-gray-800 text-white font-sans text-[13px] max-w-[220px] mx-auto relative" style={{ aspectRatio: "9/16" }}>
      {mediaUrl ? (
        <img src={mediaUrl} alt="" className="absolute inset-0 w-full h-full object-cover" />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
          <p className="text-gray-600 text-xs">No video/image</p>
        </div>
      )}
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

      {/* Right actions */}
      <div className="absolute right-2 bottom-24 flex flex-col items-center gap-4">
        <Avatar name={account.displayName} size={8} bg="bg-gray-500" />
        <div className="flex flex-col items-center gap-0.5">
          <Heart className="size-5" /><span className="text-[9px]">24.5K</span>
        </div>
        <div className="flex flex-col items-center gap-0.5">
          <MessageCircle className="size-5" /><span className="text-[9px]">1.2K</span>
        </div>
        <div className="flex flex-col items-center gap-0.5">
          <Share2 className="size-5" /><span className="text-[9px]">Share</span>
        </div>
      </div>

      {/* Bottom caption */}
      <div className="absolute bottom-4 left-3 right-12">
        <p className="font-semibold text-xs">@{account.username || account.displayName}</p>
        <p className="text-[10px] leading-tight mt-0.5 text-gray-200">
          {text}{truncated && "…"}
        </p>
      </div>
    </div>
  );
}

function BlueskyPreview({ content, hashtags, mediaUrl, account }: {
  content: string; hashtags: string[]; mediaUrl: string; account: ZernioAccount;
}) {
  const full = hashtags.length ? `${content} ${hashtags.map(h => `#${h}`).join(" ")}` : content;
  const { text, truncated } = truncate(full, CHAR_LIMITS.bluesky);

  return (
    <div className="bg-white rounded-xl overflow-hidden border border-gray-200 font-sans text-[13px] max-w-sm mx-auto p-3">
      <div className="flex gap-2.5">
        <Avatar name={account.displayName} size={9} bg="bg-sky-500" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-xs text-gray-900">{account.displayName}</span>
            <span className="text-gray-400 text-[10px]">@{account.username || account.displayName}.bsky.social</span>
          </div>
          <p className="mt-1 text-xs text-gray-800 leading-relaxed whitespace-pre-line">
            {text}
            {truncated && (
              <span className="block text-[10px] text-red-400 mt-1">
                {full.length}/{CHAR_LIMITS.bluesky} chars — will be truncated
              </span>
            )}
          </p>
          {mediaUrl && (
            <img src={mediaUrl} alt="" className="mt-2 rounded-lg w-full max-h-48 object-cover border border-gray-200" />
          )}
          <div className="flex items-center gap-4 mt-2.5 text-gray-400">
            <div className="flex items-center gap-1 hover:text-blue-500 cursor-pointer">
              <MessageCircle className="size-3.5" /><span className="text-[10px]">12</span>
            </div>
            <div className="flex items-center gap-1 hover:text-green-500 cursor-pointer">
              <Repeat2 className="size-3.5" /><span className="text-[10px]">34</span>
            </div>
            <div className="flex items-center gap-1 hover:text-pink-500 cursor-pointer">
              <Heart className="size-3.5" /><span className="text-[10px]">127</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function GenericPreview({ content, hashtags, mediaUrl, account, platform }: {
  content: string; hashtags: string[]; mediaUrl: string; account: ZernioAccount; platform: string;
}) {
  const limit = CHAR_LIMITS[platform] ?? 5000;
  const full = hashtags.length ? `${content}\n\n${hashtags.map(h => `#${h}`).join(" ")}` : content;
  const over = full.length > limit;

  return (
    <div className="bg-white rounded-xl overflow-hidden border border-gray-200 font-sans text-[13px] max-w-sm mx-auto p-4">
      <div className="flex items-center gap-2.5 mb-3">
        <Avatar name={account.displayName} size={9} bg="bg-gray-600" />
        <div>
          <p className="font-semibold text-xs text-gray-900">{account.displayName}</p>
          <p className="text-[10px] text-gray-400">@{account.username || account.displayName}</p>
        </div>
      </div>
      {mediaUrl && (
        <img src={mediaUrl} alt="" className="w-full max-h-52 object-cover rounded-lg mb-3" />
      )}
      <p className="text-xs text-gray-800 leading-relaxed whitespace-pre-line">{full}</p>
      {over && (
        <p className="mt-2 text-[10px] text-red-500">
          {full.length}/{limit} chars — exceeds {PLATFORM_LABELS[platform] ?? platform} limit
        </p>
      )}
    </div>
  );
}

// ─── main export ──────────────────────────────────────────────────────────────

export default function PostPreviewPanel({ content, hashtags, mediaUrl, accounts, selectedIds, onClose }: PreviewProps) {
  const selectedAccounts = accounts.filter(a => selectedIds.has(a._id));
  const [activeIdx, setActiveIdx] = useState(0);

  if (selectedAccounts.length === 0) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
        <div className="relative bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center">
          <p className="text-gray-500 text-sm mb-4">Select at least one platform to preview.</p>
          <button onClick={onClose} className="px-4 py-2 bg-gray-900 text-white text-sm rounded-lg">Close</button>
        </div>
      </div>
    );
  }

  const account = selectedAccounts[activeIdx] ?? selectedAccounts[0];
  const platform = account.platform;

  function renderPreview() {
    const props = { content, hashtags, mediaUrl, account };
    switch (platform) {
      case "instagram":      return <InstagramPreview {...props} />;
      case "twitter":        return <TwitterPreview   {...props} />;
      case "linkedin":       return <LinkedInPreview  {...props} />;
      case "facebook":       return <FacebookPreview  {...props} />;
      case "tiktok":         return <TikTokPreview    {...props} />;
      case "bluesky":        return <BlueskyPreview   {...props} />;
      default:               return <GenericPreview   {...props} platform={platform} />;
    }
  }

  const limit  = CHAR_LIMITS[platform] ?? 99999;
  const full   = hashtags.length ? `${content} ${hashtags.map(h => `#${h}`).join(" ")}` : content;
  const pct    = Math.min(100, Math.round((full.length / limit) * 100));
  const barColor = pct >= 100 ? "bg-red-500" : pct >= 80 ? "bg-amber-400" : "bg-green-400";

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-gray-50 rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-lg max-h-[92vh] flex flex-col overflow-hidden">
        {/* Modal header */}
        <div className="flex items-center justify-between px-5 py-4 bg-white border-b border-gray-100 shrink-0">
          <h2 className="font-semibold text-gray-900 text-sm">Post Preview</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 p-1 rounded-lg hover:bg-gray-100 transition-colors">
            <X className="size-4" />
          </button>
        </div>

        {/* Platform tabs */}
        <div className="flex gap-1.5 px-4 py-3 bg-white border-b border-gray-100 overflow-x-auto shrink-0">
          {selectedAccounts.map((acc, i) => (
            <button key={acc._id} onClick={() => setActiveIdx(i)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                i === activeIdx ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}>
              <span className="size-2 rounded-full inline-block" style={{
                backgroundColor: i === activeIdx ? "#AAFF00" : "#9ca3af"
              }} />
              {PLATFORM_LABELS[acc.platform] ?? acc.platform}
            </button>
          ))}
        </div>

        {/* Character counter */}
        <div className="px-5 py-2.5 bg-white border-b border-gray-100 shrink-0">
          <div className="flex items-center justify-between text-[10px] text-gray-400 mb-1.5">
            <span className="capitalize">{PLATFORM_LABELS[platform] ?? platform} character limit</span>
            <span className={full.length > limit ? "text-red-500 font-semibold" : ""}>
              {full.length} / {limit.toLocaleString()}
            </span>
          </div>
          <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
            <div className={`h-full rounded-full transition-all ${barColor}`} style={{ width: `${pct}%` }} />
          </div>
          {full.length > limit && (
            <p className="text-[10px] text-red-500 mt-1">Content exceeds the limit and will be truncated or rejected.</p>
          )}
        </div>

        {/* Preview area */}
        <div className="flex-1 overflow-y-auto p-5">
          {renderPreview()}
        </div>

        <div className="px-5 py-3 bg-white border-t border-gray-100 shrink-0">
          <p className="text-[10px] text-center text-gray-400">
            This is a simulated preview — actual appearance may vary slightly per platform.
          </p>
        </div>
      </div>
    </div>
  );
}
