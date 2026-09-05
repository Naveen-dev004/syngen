import React, { useEffect } from "react";
import { X, CheckCircle2, ShieldAlert, Droplet } from "lucide-react";

export default function ProductModal({ product, onClose }) {
  if (!product) return null;

  // Prevent background body scroll when modal is active
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  // Split benefits string into bullet points if stored as comma/newline separated text
  const benefitsList = Array.isArray(product.benefits)
    ? product.benefits
    : typeof product.benefits === "string"
    ? product.benefits.split(/\n|,|;/).map((b) => b.trim()).filter(Boolean)
    : [];

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.65)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: "1rem",
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: "#fff",
          borderRadius: "16px",
          width: "100%",
          maxWidth: "650px",
          maxHeight: "90vh",
          overflowY: "auto",
          position: "relative",
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2)",
          display: "flex",
          flexDirection: "column",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "1rem",
            right: "1rem",
            background: "#f3f4f6",
            border: "none",
            borderRadius: "50%",
            width: "36px",
            height: "36px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            zIndex: 10,
          }}
        >
          <X size={20} color="#374151" />
        </button>

        {/* Modal Header / Image Header */}
        <div
          style={{
            display: "flex",
            gap: "1.5rem",
            padding: "1.5rem",
            borderBottom: "1px solid #f3f4f6",
            alignItems: "center",
          }}
        >
          {product.image_url || product.image ? (
            <img
              src={product.image_url || product.image}
              alt={product.name}
              style={{
                width: "120px",
                height: "120px",
                objectFit: "contain",
                borderRadius: "12px",
                backgroundColor: "#f9fafb",
                padding: "0.5rem",
              }}
            />
          ) : (
            <div
              style={{
                width: "120px",
                height: "120px",
                borderRadius: "12px",
                backgroundColor: "#e6f4ea",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#183f32",
                fontWeight: "bold",
              }}
            >
              No Image
            </div>
          )}

          <div style={{ flex: 1 }}>
            <span
              style={{
                fontSize: "0.75rem",
                fontWeight: 700,
                textTransform: "uppercase",
                color: "#183f32",
                letterSpacing: "0.05em",
              }}
            >
              {product.category || "Agricultural Product"}
            </span>
            <h2
              style={{
                fontSize: "1.5rem",
                fontWeight: 800,
                color: "#111827",
                margin: "0.25rem 0 0.5rem 0",
              }}
            >
              {product.name}
            </h2>

            {product.technical_name && (
              <p
                style={{
                  fontSize: "0.875rem",
                  color: "#4b5563",
                  fontStyle: "italic",
                  margin: 0,
                }}
              >
                Technical: {product.technical_name}
              </p>
            )}

            {product.price > 0 && (
              <div
                style={{
                  fontSize: "1.25rem",
                  fontWeight: 700,
                  color: "#183f32",
                  marginTop: "0.5rem",
                }}
              >
                ₹{Number(product.price).toLocaleString("en-IN")}
              </div>
            )}
          </div>
        </div>

        {/* Modal Body */}
        <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          {/* Recommended Dosage */}
          {(product.dosage || product.recommended_dosage) && (
            <div
              style={{
                backgroundColor: "#f0fdf4",
                border: "1px solid #bbf7d0",
                borderRadius: "12px",
                padding: "1rem",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  fontSize: "0.95rem",
                  fontWeight: 700,
                  color: "#166534",
                  marginBottom: "0.35rem",
                }}
              >
                <Droplet size={18} /> Recommended Dosage
              </div>
              <p
                style={{
                  margin: 0,
                  fontSize: "0.9rem",
                  color: "#15803d",
                  lineHeight: 1.5,
                  whiteSpace: "pre-line",
                }}
              >
                {product.dosage || product.recommended_dosage}
              </p>
            </div>
          )}

          {/* Description */}
          {product.description && (
            <div>
              <h4 style={{ fontSize: "0.95rem", fontWeight: 700, color: "#111827", marginBottom: "0.5rem" }}>
                Description
              </h4>
              <p style={{ fontSize: "0.875rem", color: "#4b5563", lineHeight: 1.6, margin: 0 }}>
                {product.description}
              </p>
            </div>
          )}

          {/* Benefits */}
          {benefitsList.length > 0 && (
            <div>
              <h4 style={{ fontSize: "0.95rem", fontWeight: 700, color: "#111827", marginBottom: "0.5rem" }}>
                Key Benefits
              </h4>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {benefitsList.map((benefit, idx) => (
                  <li key={idx} style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem", fontSize: "0.875rem", color: "#374151" }}>
                    <CheckCircle2 size={16} color="#16a34a" style={{ flexShrink: 0, marginTop: "2px" }} />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}