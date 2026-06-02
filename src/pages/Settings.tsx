import { Key, User, CheckCircle2, AlertTriangle } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Settings() {
    const { user } = useAuth();

    return (
        <div className="max-w-xl">
            <div className="mb-8">
                <h1 className="text-2xl font-semibold text-white">Settings</h1>
                <p className="text-slate-500 text-sm mt-1">Your account information and integration status</p>
            </div>

            {/* Account Info */}
            <div className="bg-white rounded-2xl shadow-sm p-5 mb-5">
                <div className="flex items-center gap-2 mb-4">
                    <User className="size-4 text-slate-400" />
                    <h2 className="text-sm font-semibold text-slate-700">Account</h2>
                </div>
                <div className="space-y-3 text-sm">
                    <div>
                        <p className="text-xs text-slate-500 mb-1">Name</p>
                        <p className="text-white bg-slate-50 rounded-xl px-3 py-2.5">{user?.name}</p>
                    </div>
                    <div>
                        <p className="text-xs text-slate-500 mb-1">Email</p>
                        <p className="text-white bg-slate-50 rounded-xl px-3 py-2.5">{user?.email}</p>
                    </div>
                </div>
            </div>

            {/* Zernio Status */}
            <div className="bg-white rounded-2xl shadow-sm p-5">
                <div className="flex items-center gap-2 mb-4">
                    <Key className="size-4 text-slate-400" />
                    <h2 className="text-sm font-semibold text-slate-700">Zernio Integration</h2>
                </div>

                <div className={`p-4 rounded-xl flex items-start gap-3 ${user?.zernioProfileId ? "bg-green-50" : "bg-amber-50"}`}>
                    {user?.zernioProfileId ? (
                        <>
                            <CheckCircle2 className="size-4 text-green-600 mt-0.5 shrink-0" />
                            <div>
                                <p className="text-sm font-medium text-green-800">Connected</p>
                                <p className="text-xs text-green-700 mt-0.5">
                                    Your account has a Zernio profile. Go to{" "}
                                    <a href="/accounts" className="underline">Accounts</a>{" "}
                                    to connect your social platforms.
                                </p>
                            </div>
                        </>
                    ) : (
                        <>
                            <AlertTriangle className="size-4 text-amber-500 mt-0.5 shrink-0" />
                            <div>
                                <p className="text-sm font-medium text-amber-800">Profile not linked</p>
                                <p className="text-xs text-amber-700 mt-0.5">
                                    There was an issue creating your Zernio profile at registration.
                                    Please contact support.
                                </p>
                            </div>
                        </>
                    )}
                </div>

                {user?.zernioProfileId && (
                    <div className="mt-4">
                        <p className="text-xs text-slate-500 mb-1">Zernio Profile ID</p>
                        <p className="text-xs font-mono text-slate-600 bg-slate-50 rounded-xl px-3 py-2.5 break-all select-all">
                            {user.zernioProfileId}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
