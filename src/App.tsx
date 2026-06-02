import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Accounts from "./pages/Accounts";
import Compose from "./pages/Compose";
import Posts from "./pages/Posts";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import DashboardLayout from "./components/Dashboard/DashboardLayout";
import PublicLayout from "./components/Home/PublicLayout";
import FeaturesPage from "./pages/Features";
import PricingPage from "./pages/PricingPage";
import About from "./pages/About";
import Blog from "./pages/Blog";
import Contact from "./pages/Contact";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import { useAuth } from "./context/AuthContext";

function AuthGuard() {
    const { user, loading } = useAuth();
    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-white/30 text-sm">Loading…</div>
            </div>
        );
    }
    return user ? <Outlet /> : <Navigate to="/login" replace />;
}

export default function App() {
    return (
        <Routes>
            {/* Home has its own Navbar/Footer inline */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />

            {/* Public pages with shared layout */}
            <Route element={<PublicLayout />}>
                <Route path="/features" element={<FeaturesPage />} />
                <Route path="/pricing"  element={<PricingPage />} />
                <Route path="/about"    element={<About />} />
                <Route path="/blog"     element={<Blog />} />
                <Route path="/contact"  element={<Contact />} />
                <Route path="/privacy"  element={<Privacy />} />
                <Route path="/terms"    element={<Terms />} />
            </Route>

            {/* Protected dashboard */}
            <Route element={<AuthGuard />}>
                <Route element={<DashboardLayout />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/compose"   element={<Compose />} />
                    <Route path="/posts"     element={<Posts />} />
                    <Route path="/analytics" element={<Analytics />} />
                    <Route path="/accounts"  element={<Accounts />} />
                    <Route path="/settings"  element={<Settings />} />
                </Route>
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}
