import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useScrollAnimation } from "../hooks/useScrollAnimation";

const posts = [
    { slug: "grow-tiktok-2025",           tag: "TikTok",      tagColor: "bg-pink-100 text-pink-600",    title: "5 Proven Strategies to Grow Your TikTok in 2025",                      excerpt: "The TikTok algorithm rewards consistency and engagement. Here's the exact posting strategy we used to grow to 100k followers in 3 months.", readTime: "7 min", date: "Jan 14, 2025" },
    { slug: "ai-social-media-content",    tag: "AI",          tagColor: "bg-[#AAFF00]/15 text-[#5a8800]", title: "How AI Is Changing the Way Brands Create Social Media Content",          excerpt: "From caption writing to image generation — AI tools are transforming content creation. Here's what every creator needs to know.",          readTime: "5 min", date: "Jan 8, 2025" },
    { slug: "best-time-post-instagram",   tag: "Instagram",   tagColor: "bg-purple-100 text-purple-600", title: "The Best Times to Post on Instagram in 2025 (By Industry)",             excerpt: "Timing is everything. We analysed 10 million posts to find the exact windows when your audience is most likely to engage.",                readTime: "6 min", date: "Dec 30, 2024" },
    { slug: "linkedin-content-strategy",  tag: "LinkedIn",    tagColor: "bg-blue-100 text-blue-600",    title: "LinkedIn Content Strategy That Generated 500 Leads in 30 Days",          excerpt: "B2B brands that understand LinkedIn's algorithm can generate a consistent flow of qualified leads. Here's our exact playbook.",              readTime: "9 min", date: "Dec 20, 2024" },
    { slug: "content-calendar-template",  tag: "Productivity", tagColor: "bg-orange-100 text-orange-600", title: "The Ultimate Content Calendar Template for Social Media Managers",      excerpt: "A well-structured content calendar eliminates the daily 'what should I post' panic. Download our free template and start planning.",        readTime: "4 min", date: "Dec 12, 2024" },
    { slug: "repurpose-content-strategy", tag: "Strategy",    tagColor: "bg-gray-100 text-gray-600",    title: "How to Repurpose One Piece of Content Across 7 Platforms",               excerpt: "The most efficient creators don't create 7× the content — they create once and repurpose strategically. Here's the exact framework.",       readTime: "8 min", date: "Dec 5, 2024" },
];

const tags = ["All", "TikTok", "Instagram", "LinkedIn", "AI", "Strategy", "Productivity"];

export default function Blog() {
    const header = useScrollAnimation();
    const featured = useScrollAnimation(0.1);
    const grid = useScrollAnimation(0.1);

    return (
        <>
            {/* Header — cream */}
            <section className="bg-[#F4F4EE] py-24 px-5 sm:px-8">
                <div ref={header.ref as React.RefObject<HTMLDivElement>}
                    className={`max-w-3xl mx-auto text-center sa-fade-up ${header.visible ? "sa-visible" : ""}`}>
                    <h1 className="text-4xl sm:text-5xl font-black text-black leading-tight mb-4">The Postify Blog</h1>
                    <p className="text-black/50 text-base">Tips, strategies, and insights to help you grow on social media.</p>
                </div>
            </section>

            {/* Tag bar — white */}
            <section className="bg-white border-b border-black/[0.06] px-5 sm:px-8 py-4 sticky top-14 z-30">
                <div className="max-w-7xl mx-auto flex flex-wrap gap-2">
                    {tags.map((tag) => (
                        <button key={tag}
                            className={`text-xs font-semibold px-4 py-1.5 rounded-full border transition-colors ${tag === "All"
                                ? "bg-black text-white border-black"
                                : "border-black/10 text-black/50 hover:border-black/30 hover:text-black"}`}>
                            {tag}
                        </button>
                    ))}
                </div>
            </section>

            {/* Featured posts — white */}
            <section className="bg-white py-10 px-5 sm:px-8">
                <div className="max-w-7xl mx-auto">
                    <div ref={featured.ref as React.RefObject<HTMLDivElement>}
                        className={`grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5 sa-fade-up ${featured.visible ? "sa-visible" : ""}`}>
                        {posts.slice(0, 2).map((post) => (
                            <Link key={post.slug} to={`/blog/${post.slug}`}
                                className="group bg-neutral-50 border border-black/[0.07] rounded-2xl p-7 hover:shadow-lg transition-all">
                                <div className={`inline-block text-xs font-bold px-3 py-1 rounded-full mb-4 ${post.tagColor}`}>{post.tag}</div>
                                <h2 className="font-black text-black text-xl leading-snug mb-3 group-hover:text-[#5a8800] transition-colors">{post.title}</h2>
                                <p className="text-sm text-black/50 leading-relaxed mb-5">{post.excerpt}</p>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-black/30">{post.date} · {post.readTime} read</span>
                                    <ArrowUpRight className="size-4 text-black/30 group-hover:text-black transition-colors" />
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Rest of posts — cream */}
            <section className="bg-[#F4F4EE] py-10 px-5 sm:px-8">
                <div className="max-w-7xl mx-auto">
                    <div ref={grid.ref as React.RefObject<HTMLDivElement>}
                        className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sa-fade-up ${grid.visible ? "sa-visible" : ""}`}>
                        {posts.slice(2).map((post, i) => (
                            <Link key={post.slug} to={`/blog/${post.slug}`}
                                className={`group bg-white border border-black/[0.07] rounded-2xl p-5 hover:shadow-md transition-all sa-fade-up sa-delay-${(i + 1) * 100} ${grid.visible ? "sa-visible" : ""}`}>
                                <div className={`inline-block text-xs font-bold px-3 py-1 rounded-full mb-3 ${post.tagColor}`}>{post.tag}</div>
                                <h3 className="font-bold text-black text-sm leading-snug mb-2 group-hover:text-[#5a8800] transition-colors">{post.title}</h3>
                                <p className="text-xs text-black/45 leading-relaxed mb-4">{post.excerpt}</p>
                                <span className="text-xs text-black/30">{post.date}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Newsletter — black */}
            <section className="bg-black py-16 px-5 sm:px-8">
                <div className="max-w-xl mx-auto text-center">
                    <h2 className="text-xl font-black text-white mb-2">Get articles in your inbox</h2>
                    <p className="text-sm text-white/40 mb-6">Weekly insights on growing your social media presence. No spam.</p>
                    <div className="flex gap-2">
                        <input type="email" placeholder="you@example.com"
                            className="flex-1 bg-white/5 border border-white/10 rounded-full px-5 py-3 text-sm text-white placeholder-white/25 focus:outline-none focus:border-[#AAFF00]/50" />
                        <button className="bg-[#AAFF00] text-black text-sm font-black px-6 py-3 rounded-full hover:bg-[#c8ff33] transition-colors shrink-0">
                            Subscribe
                        </button>
                    </div>
                </div>
            </section>
        </>
    );
}
