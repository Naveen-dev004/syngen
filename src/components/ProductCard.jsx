import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ShoppingCart, Check } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import { useScrollReveal } from "@/hooks/useScrollReveal";

export default function ProductCard({ product, index = 0 }) {
  const { addToCart } = useCart();
  const { addToast } = useToast();
  const { ref, visible } = useScrollReveal();
  const cardRef = useRef(null);
  const [added, setAdded] = useState(false);

  const handleCardMove = (event) => {
    const card = cardRef.current;
    if (!card || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rect = card.getBoundingClientRect();
    const rotateX = ((event.clientY - rect.top) / rect.height - 0.5) * -5;
    const rotateY = ((event.clientX - rect.left) / rect.width - 0.5) * 5;
    card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
  };

  const resetCard = () => {
    if (cardRef.current) cardRef.current.style.transform = "";
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.is_upcoming || !product.is_active) return;
    addToCart(product);
    setAdded(true);
    addToast(`${product.name} added to your cart`, "cart");
    window.setTimeout(() => setAdded(false), 1400);
  };

  const isPurchasable = !product.is_upcoming && product.is_active;
  const price = Number(product.price) || 0;

  return (
    <Link
      ref={(node) => { ref.current = node; cardRef.current = node; }}
      to={`/products/${product.id}`}
      className={`card product-card ${visible ? "is-visible" : ""}`}
      onMouseMove={handleCardMove}
      onMouseLeave={resetCard}
      style={{
        display: "flex",
        flexDirection: "column",
        animationDelay: `${index * 0.08}s`,
      }}
    >
      {/* Image */}
      <div className="product-image-container" style={{ position: "relative" }}>
        {product.image_url ? (
          <img src={product.image_url} alt={product.name} />
        ) : (
          <div style={{
            width: "60px",
            height: "60px",
            borderRadius: "50%",
            background: "var(--color-accent-soft)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
            <LeafIcon />
          </div>
        )}

        {/* Badges */}
        <div style={{ position: "absolute", top: "0.75rem", left: "0.75rem", display: "flex", flexDirection: "column", gap: "0.375rem" }}>
          {product.is_new && <span className="badge badge-new">New</span>}
          {product.is_upcoming && <span className="badge badge-upcoming">Coming Soon</span>}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: "1.25rem", flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{
          fontSize: "0.6875rem",
          fontWeight: 600,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "var(--color-accent)",
          marginBottom: "0.5rem",
        }}>
          {product.category}
        </div>

        <h3 style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: "1.0625rem",
          fontWeight: 700,
          color: "var(--color-primary)",
          marginBottom: "0.75rem",
          lineHeight: 1.3,
        }}>
          {product.name}
        </h3>

        <div style={{ flex: 1 }} />

        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: "1rem",
          paddingTop: "1rem",
          borderTop: "1px solid var(--color-border-soft)",
        }}>
          <div>
            {product.is_upcoming ? (
              <span style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--color-text-muted)" }}>
                Coming Soon
              </span>
            ) : price > 0 ? (
              <span style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "1.25rem",
                fontWeight: 700,
                color: "var(--color-primary)",
              }}>
                ₹{price.toLocaleString("en-IN")}
              </span>
            ) : (
              <span style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--color-text-muted)" }}>
                Price on request
              </span>
            )}
          </div>

          <div style={{ display: "flex", gap: "0.375rem" }}>
            {isPurchasable && (
              <button
                onClick={handleAddToCart}
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "8px",
                  background: "var(--color-accent-soft)",
                  color: "var(--color-accent)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "var(--color-accent)";
                  e.currentTarget.style.color = "white";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "var(--color-accent-soft)";
                  e.currentTarget.style.color = "var(--color-accent)";
                }}
                title="Add to cart"
              >
                {added ? <Check size={16} /> : <ShoppingCart size={16} />}
              </button>
            )}
            <div style={{
              width: "36px",
              height: "36px",
              borderRadius: "8px",
              background: "var(--color-primary)",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--color-primary-light)";
              e.currentTarget.style.transform = "translateX(2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "var(--color-primary)";
              e.currentTarget.style.transform = "translateX(0)";
            }}
          >
              <ArrowRight size={16} />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

function LeafIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--color-accent)" }}>
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
      <path d="M2 21c0-3 1.85-5.36 5.08-6" />
    </svg>
  );
}
