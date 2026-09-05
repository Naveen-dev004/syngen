import { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle, XCircle, Info, ShoppingBag } from "lucide-react";

const ToastContext = createContext(null);

let toastId = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((message, type = "success") => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => removeToast(id), 3000);
  }, [removeToast]);

  const icons = {
    success: <CheckCircle size={18} />,
    error: <XCircle size={18} />,
    info: <Info size={18} />,
    cart: <ShoppingBag size={18} />,
  };

  const colors = {
    success: { bg: "#f0fdf4", border: "#bbf7d0", text: "#166534", icon: "#16a34a" },
    error: { bg: "#fef2f2", border: "#fecaca", text: "#991b1b", icon: "#dc2626" },
    info: { bg: "#eff6ff", border: "#bfdbfe", text: "#1e40af", icon: "#2563eb" },
    cart: { bg: "#e8f3ed", border: "#a7d8c3", text: "#166534", icon: "#4a8b6f" },
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div style={{
        position: "fixed",
        bottom: "2rem",
        right: "2rem",
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        gap: "0.75rem",
        pointerEvents: "none",
      }}>
        {toasts.map((toast) => {
          const c = colors[toast.type] || colors.success;
          return (
            <div
              key={toast.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                padding: "1rem 1.5rem",
                background: c.bg,
                border: `1px solid ${c.border}`,
                borderRadius: "12px",
                boxShadow: "0 12px 32px rgba(0,0,0,0.12)",
                color: c.text,
                fontSize: "0.9375rem",
                fontWeight: 600,
                pointerEvents: "auto",
                animation: "toastIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
                maxWidth: "380px",
              }}
            >
              <span style={{ color: c.icon, display: "flex", flexShrink: 0 }}>
                {icons[toast.type] || icons.success}
              </span>
              {toast.message}
            </div>
          );
        })}
      </div>
      <style>{`
        @keyframes toastIn {
          from { opacity: 0; transform: translateX(100px) scale(0.9); }
          to { opacity: 1; transform: translateX(0) scale(1); }
        }
        @keyframes toastOut {
          to { opacity: 0; transform: translateX(100px) scale(0.9); }
        }
      `}</style>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
