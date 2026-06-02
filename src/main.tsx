import { StrictMode, Component, type ReactNode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { AppProvider } from "./context/AppContext";
import { ThemeProvider } from "./context/ThemeContext";

class ErrorBoundary extends Component<{ children: ReactNode }, { error: string | null }> {
    state = { error: null };
    static getDerivedStateFromError(e: Error) { return { error: e.message }; }
    render() {
        if (this.state.error) {
            return (
                <div style={{ padding: 40, fontFamily: "monospace", background: "#fff1f2", minHeight: "100vh" }}>
                    <h2 style={{ color: "#dc2626" }}>Runtime Error</h2>
                    <pre style={{ whiteSpace: "pre-wrap", color: "#7f1d1d" }}>{this.state.error}</pre>
                </div>
            );
        }
        return this.props.children;
    }
}

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <ErrorBoundary>
            <BrowserRouter>
                <ThemeProvider>
                    <AuthProvider>
                        <AppProvider>
                            <App />
                        </AppProvider>
                    </AuthProvider>
                </ThemeProvider>
            </BrowserRouter>
        </ErrorBoundary>
    </StrictMode>
);
