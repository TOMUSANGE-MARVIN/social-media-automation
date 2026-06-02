import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { RefreshCw, CheckCircle2, XCircle, Plug2 } from "lucide-react";
import { SiTiktok, SiInstagram, SiFacebook, SiYoutube, SiWhatsapp, SiX } from "@icons-pack/react-simple-icons";
import LinkedinIcon from "../components/icons/LinkedinIcon";
import { useApp } from "../context/AppContext";
import { zernioApi, type ZernioAccount } from "../services/api";

const PLATFORMS = [
    { id: "tiktok",    name: "TikTok",    Icon: SiTiktok,    bg: "bg-slate-900" },
    { id: "instagram", name: "Instagram", Icon: SiInstagram, bg: "bg-gradient-to-br from-pink-500 to-purple-600" },
    { id: "facebook",  name: "Facebook",  Icon: SiFacebook,  bg: "bg-blue-600" },
    { id: "linkedin",  name: "LinkedIn",  Icon: LinkedinIcon, bg: "bg-blue-700" },
    { id: "youtube",   name: "YouTube",   Icon: SiYoutube,   bg: "bg-red-600" },
    { id: "whatsapp",  name: "WhatsApp",  Icon: SiWhatsapp,  bg: "bg-green-600" },
    { id: "twitter",   name: "X (Twitter)", Icon: SiX,       bg: "bg-black" },
];

type Toast = { type: "success" | "error"; message: string } | null;

export default function Accounts() {
    const { accounts, loadingAccounts, refreshAccounts } = useApp();
    const [searchParams, setSearchParams] = useSearchParams();
    const [connecting, setConnecting] = useState<string | null>(null);
    const [disconnecting, setDisconnecting] = useState<string | null>(null);
    const [toast, setToast] = useState<Toast>(null);

    // Handle OAuth redirect callback
    useEffect(() => {
        const status = searchParams.get("status");
        const error = searchParams.get("error");
        if (status === "success") {
            showToast("success", "Account connected successfully!");
            refreshAccounts();
            setSearchParams({}, { replace: true });
        } else if (status === "error" || error) {
            showToast("error", error ?? "Failed to connect account. Please try again.");
            setSearchParams({}, { replace: true });
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    function showToast(type: "success" | "error", message: string) {
        setToast({ type, message });
        setTimeout(() => setToast(null), 4000);
    }

    async function handleConnect(platformId: string) {
        setConnecting(platformId);
        try {
            const redirectUrl = `${window.location.origin}/accounts`;
            const { authUrl } = await zernioApi.connect.start(platformId, redirectUrl);
            window.location.href = authUrl;
        } catch {
            showToast("error", `Failed to start ${platformId} connection. Please try again.`);
            setConnecting(null);
        }
    }

    async function handleDisconnect(account: ZernioAccount) {
        setDisconnecting(account._id);
        try {
            await zernioApi.accounts.disconnect(account._id);
            await refreshAccounts();
            showToast("success", `${account.displayName || account.username} disconnected.`);
        } catch {
            showToast("error", "Failed to disconnect account.");
        } finally {
            setDisconnecting(null);
        }
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-xl font-bold text-gray-900">Connected Accounts</h1>
                    <p className="text-sm text-gray-500 mt-0.5">Manage your social media connections</p>
                </div>
                <button onClick={refreshAccounts} disabled={loadingAccounts}
                    className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors">
                    <RefreshCw className={`size-4 ${loadingAccounts ? "animate-spin" : ""}`} />
                    Refresh
                </button>
            </div>

            {toast && (
                <div className={`mb-6 p-4 rounded-2xl flex items-center gap-3 text-sm ${toast.type === "success"
                    ? "bg-green-50 border border-green-200 text-green-700"
                    : "bg-red-50 border border-red-200 text-red-600"}`}>
                    {toast.type === "success"
                        ? <CheckCircle2 className="size-4 shrink-0" />
                        : <XCircle className="size-4 shrink-0" />}
                    {toast.message}
                </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {PLATFORMS.map((platform) => {
                    const connected = accounts.find((a) => a.platform === platform.id) ?? null;
                    return (
                        <div key={platform.id} className="bg-white rounded-xl border border-gray-200 p-5">
                            <div className="flex items-center gap-4">
                                <div className={`size-12 rounded-xl ${platform.bg} flex items-center justify-center shrink-0`}>
                                    <platform.Icon size={22} color="white" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-gray-900">{platform.name}</p>
                                    {connected
                                        ? <p className="text-sm text-gray-500 truncate">@{connected.username || connected.displayName}</p>
                                        : <p className="text-sm text-gray-400">Not connected</p>}
                                </div>
                                {connected ? (
                                    <button
                                        onClick={() => handleDisconnect(connected)}
                                        disabled={disconnecting === connected._id}
                                        className="text-xs text-red-500 hover:text-red-600 border border-red-200 hover:border-red-300 px-3 py-1.5 rounded-full transition-colors disabled:opacity-50 shrink-0">
                                        {disconnecting === connected._id ? "…" : "Disconnect"}
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => handleConnect(platform.id)}
                                        disabled={connecting === platform.id}
                                        className="flex items-center gap-1.5 text-xs font-semibold text-black bg-[#AAFF00] hover:bg-[#c8ff33] px-3 py-1.5 rounded-full transition-colors disabled:opacity-50 shrink-0">
                                        <Plug2 className="size-3" />
                                        {connecting === platform.id ? "Redirecting…" : "Connect"}
                                    </button>
                                )}
                            </div>
                            {connected && (
                                <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-1.5">
                                    <div className={`size-2 rounded-full ${connected.isActive ? "bg-green-500" : "bg-slate-300"}`} />
                                    <span className="text-xs text-gray-500">{connected.isActive ? "Active" : "Inactive"}</span>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
