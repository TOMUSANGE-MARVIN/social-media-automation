import { Link } from "react-router-dom";

const sections = [
    { title: "1. Acceptance of terms",        content: 'By accessing or using Postify ("Service"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree, you may not use the Service. These Terms apply to all users, including free, Pro, and Agency plan subscribers.' },
    { title: "2. Description of the service", content: "Postify is an AI-powered social media scheduling and content generation platform. We provide tools to schedule, publish, and analyse social media content across multiple platforms using a unified interface." },
    { title: "3. Account registration",        content: "You must provide accurate registration information and keep it current. You are responsible for maintaining the confidentiality of your credentials and all activity under your account. You must be at least 16 years old to use Postify." },
    { title: "4. Subscription and billing",    content: "Paid plans are billed monthly or annually in advance. Prices are listed in USD and subject to applicable taxes. Upgrades are charged immediately (prorated). Downgrades take effect at the next billing cycle. We use Stripe for payment processing." },
    { title: "5. Refund policy",               content: "If you are not satisfied within 7 days of your first paid charge, you may request a full refund by contacting hello@postify.app. Refunds are not available for subsequent billing cycles or after 7 days of each charge." },
    { title: "6. Acceptable use",              content: "You agree not to: post spam, hate speech, or illegal content; violate the terms of service of connected social platforms; attempt to reverse-engineer, scrape, or resell the Service; use the Service to harass, abuse, or harm others." },
    { title: "7. AI-generated content",        content: "You are solely responsible for content you publish using Postify, including AI-generated content. Do not use AI generation features to create misinformation, deepfakes, or content that violates platform policies or applicable law." },
    { title: "8. Intellectual property",        content: "You retain all rights to content you create and publish through Postify. You grant Postify a limited licence to store and process your content solely to provide the Service. Postify's software and branding remain our exclusive property." },
    { title: "9. Third-party platforms",       content: "Postify connects to third-party social media platforms. Your use of those platforms is subject to their respective terms of service. We are not responsible for changes, outages, or policy changes on connected platforms." },
    { title: "10. Limitation of liability",    content: "To the maximum extent permitted by law, Postify is not liable for indirect, incidental, special, or consequential damages. Our total liability for any claim shall not exceed the amount you paid in the 3 months preceding the claim." },
    { title: "11. Termination",                content: "You may cancel your account at any time via your account settings. We may suspend or terminate your account for material breach of these Terms. Upon termination, your data will be deleted within 30 days per our Privacy Policy." },
    { title: "12. Governing law",              content: "These Terms are governed by the laws of Uganda. Any disputes shall be resolved through binding arbitration, except that either party may seek injunctive relief for IP violations." },
    { title: "13. Changes to terms",           content: "We may update these Terms. Material changes will be notified by email 14 days before they take effect. Continued use of the Service after changes constitutes acceptance of the new Terms." },
];

const half = Math.ceil(sections.length / 2);

export default function Terms() {
    return (
        <>
            {/* Header + first half — cream */}
            <section className="bg-[#F4F4EE] py-20 px-5 sm:px-8">
                <div className="max-w-3xl mx-auto">
                    <div className="mb-12">
                        <h1 className="text-4xl font-black text-black mb-3">Terms of Service</h1>
                        <p className="text-sm text-black/30">Last updated: January 14, 2025</p>
                        <div className="mt-6 p-5 bg-white border border-black/[0.08] rounded-xl text-sm text-black/50 leading-relaxed">
                            Please read these Terms carefully before using Postify. If you have questions, <Link to="/contact" className="font-bold text-black hover:underline">contact us</Link>.
                        </div>
                    </div>
                    <div className="space-y-10">
                        {sections.slice(0, half).map((s) => (
                            <div key={s.title}>
                                <h2 className="text-base font-black text-black mb-3">{s.title}</h2>
                                <p className="text-sm text-black/50 leading-relaxed">{s.content}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Second half — white */}
            <section className="bg-white py-16 px-5 sm:px-8">
                <div className="max-w-3xl mx-auto">
                    <div className="space-y-10">
                        {sections.slice(half).map((s) => (
                            <div key={s.title}>
                                <h2 className="text-base font-black text-black mb-3">{s.title}</h2>
                                <p className="text-sm text-black/50 leading-relaxed">{s.content}</p>
                            </div>
                        ))}
                    </div>
                    <div className="mt-12 pt-10 border-t border-black/[0.08] flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                        <p className="text-sm text-black/40">Questions about these terms?</p>
                        <Link to="/contact" className="inline-flex items-center gap-2 text-sm bg-black text-white font-bold px-5 py-2.5 rounded-full hover:bg-neutral-800 transition-colors">
                            Contact us →
                        </Link>
                    </div>
                </div>
            </section>
        </>
    );
}
