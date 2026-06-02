import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function PublicLayout() {
    return (
        <div className="min-h-screen bg-black text-white font-sans">
            <Navbar />
            <Outlet />
            <Footer />
        </div>
    );
}
