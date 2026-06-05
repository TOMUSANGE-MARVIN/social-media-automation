import { useScrollAnimation } from "../../hooks/useScrollAnimation";

const steps = [
    { label: "Create",   sub: "AI writes content",     x: 120 },
    { label: "Schedule", sub: "Pick the perfect time",  x: 380 },
    { label: "Publish",  sub: "All platforms at once",  x: 640 },
    { label: "Analyze",  sub: "Track performance",      x: 900 },
];

export default function PipelineFlow() {
    const { ref, visible } = useScrollAnimation(0.2);

    return (
        <div
            ref={ref as React.RefObject<HTMLDivElement>}
            className={`svg-pipeline ${visible ? "sa-visible" : ""} w-full overflow-hidden`}
            aria-hidden
        >
            <svg
                viewBox="0 0 1020 160"
                className="w-full max-w-3xl mx-auto block"
                preserveAspectRatio="xMidYMid meet"
            >
                {/* Connecting path — drawn on scroll via stroke-dashoffset */}
                <path
                    className="pipe-path"
                    d="M120 70 C200 70 300 70 380 70 C460 70 560 70 640 70 C720 70 820 70 900 70"
                    fill="none"
                    stroke="#AAFF00"
                    strokeWidth="2"
                    strokeLinecap="round"
                    pathLength="1"
                />

                {/* Dashed background track */}
                <line x1="120" y1="70" x2="900" y2="70"
                    stroke="black" strokeWidth="1.5" strokeOpacity="0.1"
                    strokeDasharray="4 6" strokeLinecap="round"
                />

                {/* Nodes */}
                <g className="pipe-node">
                    <circle cx="120" cy="70" r="18" fill="black" />
                    <circle cx="120" cy="70" r="18" fill="none" stroke="#AAFF00" strokeWidth="2" />
                    {/* Pencil icon */}
                    <text x="120" y="75" textAnchor="middle" fontSize="14" fill="#AAFF00">✦</text>
                </g>
                <g className="pipe-node">
                    <circle cx="380" cy="70" r="18" fill="black" />
                    <circle cx="380" cy="70" r="18" fill="none" stroke="#AAFF00" strokeWidth="2" />
                    <text x="380" y="75" textAnchor="middle" fontSize="14" fill="#AAFF00">◷</text>
                </g>
                <g className="pipe-node">
                    <circle cx="640" cy="70" r="18" fill="#AAFF00" />
                    <text x="640" y="75" textAnchor="middle" fontSize="14" fill="black">▶</text>
                </g>
                <g className="pipe-node">
                    <circle cx="900" cy="70" r="18" fill="black" />
                    <circle cx="900" cy="70" r="18" fill="none" stroke="#AAFF00" strokeWidth="2" />
                    <text x="900" y="75" textAnchor="middle" fontSize="13" fill="#AAFF00">↗</text>
                </g>

                {/* Step labels */}
                <g className="pipe-label">
                    <text x="120" y="106" textAnchor="middle" fontSize="12" fontWeight="700" fill="black">Create</text>
                    <text x="120" y="120" textAnchor="middle" fontSize="10" fill="#00000066">AI writes content</text>
                </g>
                <g className="pipe-label">
                    <text x="380" y="106" textAnchor="middle" fontSize="12" fontWeight="700" fill="black">Schedule</text>
                    <text x="380" y="120" textAnchor="middle" fontSize="10" fill="#00000066">Perfect timing</text>
                </g>
                <g className="pipe-label">
                    <text x="640" y="106" textAnchor="middle" fontSize="12" fontWeight="700" fill="black">Publish</text>
                    <text x="640" y="120" textAnchor="middle" fontSize="10" fill="#00000066">All platforms</text>
                </g>
                <g className="pipe-label">
                    <text x="900" y="106" textAnchor="middle" fontSize="12" fontWeight="700" fill="black">Analyze</text>
                    <text x="900" y="120" textAnchor="middle" fontSize="10" fill="#00000066">Track growth</text>
                </g>

                {/* Step numbers (top) */}
                {steps.map((s, i) => (
                    <text key={i} x={s.x} y="42" textAnchor="middle" fontSize="10"
                        fill="#AAFF00" fontWeight="700" opacity="0.6">
                        {String(i + 1).padStart(2, "0")}
                    </text>
                ))}
            </svg>
        </div>
    );
}
