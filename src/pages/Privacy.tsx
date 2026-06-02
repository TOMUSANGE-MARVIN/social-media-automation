import { Link } from "react-router-dom";

const sections = [
    { title: "1. Information we collect",   content: "We collect information you provide directly (name, email, password) when you register, as well as information generated through your use of Postify (scheduled posts, account connections, usage analytics). We also collect basic technical information such as IP address, browser type, and device identifiers." },
    { title: "2. How we use your information", content: "We use your information to: provide and improve the Postify service; authenticate your identity; process payments; send product updates and support communications; and generate aggregate, anonymised analytics to improve our platform. We never sell your personal data to third parties." },
    { title: "3. Social account data",      content: "When you connect a social media account, Postify requests OAuth permissions scoped to the features you use (posting, reading analytics). We store access tokens securely using AES-256 encryption at rest. We never access content on your social accounts beyond what is required to execute your instructions." },
    { title: "4. AI-generated content",     content: "Text and image content you generate using Postify's AI features is sent to OpenAI for processing. We do not use your prompts or generated content to train AI models. Please review OpenAI's privacy policy for their data handling practices." },
    { title: "5. Data sharing",             content: "We share data with trusted service providers (e.g., payment processors, hosting, email delivery) under strict data processing agreements. We may disclose data if required by law. We do not share your personal information for advertising purposes." },
    { id: "security", title: "6. Security", content: "We implement industry-standard security measures including TLS encryption in transit, AES-256 encryption at rest, SOC 2-compliant infrastructure, and regular security audits. However, no method of transmission over the internet is 100% secure." },
    { id: "cookies",  title: "7. Cookies",  content: "We use strictly necessary cookies for authentication (session tokens) and optional analytics cookies to understand how users interact with Postify. You can disable analytics cookies via your browser settings without affecting core functionality." },
    { title: "8. Your rights",              content: "Depending on your location, you may have rights to access, correct, delete, or export your personal data; object to or restrict processing; and withdraw consent. To exercise your rights, contact us at privacy@postify.app. We respond within 30 days." },
    { title: "9. Data retention",           content: "We retain your data for as long as your account is active or as needed to provide the service. After account deletion, we remove personal data within 30 days, except where retention is required by law." },
    { title: "10. Changes to this policy",  content: "We may update this policy. When we do, we'll update the 'last updated' date below and notify you by email for material changes. Continued use of Postify after changes constitutes acceptance." },
];

// Split into two halves for visual variety
const half = Math.ceil(sections.length / 2);

export default function Privacy() {
    return (
        <>
            {/* Header + first half — white */}
            <section className="bg-white py-20 px-5 sm:px-8">
                <div className="max-w-3xl mx-auto">
                    <div className="mb-12">
                        <h1 className="text-4xl font-black text-black mb-3">Privacy Policy</h1>
                        <p className="text-sm text-black/30">Last updated: January 14, 2025</p>
                        <div className="mt-6 p-5 bg-[#AAFF00]/10 border border-[#AAFF00]/30 rounded-xl text-sm text-black/60 leading-relaxed">
                            <strong className="text-black">TL;DR:</strong> We collect only what we need to run Postify, we never sell your data, and we never train AI on your content. Your social account credentials are encrypted and never shared.
                        </div>
                    </div>
                    <div className="space-y-10">
                        {sections.slice(0, half).map((s) => (
                            <div key={s.title} id={s.id}>
                                <h2 className="text-base font-black text-black mb-3">{s.title}</h2>
                                <p className="text-sm text-black/50 leading-relaxed">{s.content}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Second half — cream */}
            <section className="bg-[#F4F4EE] py-16 px-5 sm:px-8">
                <div className="max-w-3xl mx-auto">
                    <div className="space-y-10">
                        {sections.slice(half).map((s) => (
                            <div key={s.title} id={s.id}>
                                <h2 className="text-base font-black text-black mb-3">{s.title}</h2>
                                <p className="text-sm text-black/50 leading-relaxed">{s.content}</p>
                            </div>
                        ))}
                    </div>
                    <div className="mt-12 pt-10 border-t border-black/[0.08]">
                        <p className="text-sm text-black/40 mb-4">Questions about this policy?</p>
                        <Link to="/contact" className="inline-flex items-center gap-2 text-sm bg-black text-white font-bold px-5 py-2.5 rounded-full hover:bg-neutral-800 transition-colors">
                            Contact our privacy team →
                        </Link>
                    </div>
                </div>
            </section>
        </>
    );
}
