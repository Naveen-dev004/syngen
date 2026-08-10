import { Link } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight, ArrowLeft } from "lucide-react";

export default function Cart() {
  const { cart, cartTotal, increaseQuantity, decreaseQuantity, removeFromCart, clearCart } = useCart();

  if (cart.length === 0) {
    return (
      <div className="container" style={{ padding: "4rem 2rem", minHeight: "60vh" }}>
        <div className="empty-state">
          <div className="empty-state-icon">
            <ShoppingBag size={32} />
          </div>
          <h3 className="empty-state-title">Your cart is empty</h3>
          <p className="empty-state-text">
            You haven't added any products to your cart yet. Browse our catalog to get started.
          </p>
          <Link to="/products" className="btn btn-primary">
            Browse Products <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ paddingTop: "2rem", paddingBottom: "4rem" }}>
      <div className="container">
        <div style={{ marginBottom: "2rem" }}>
          <h1 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", marginBottom: "0.5rem" }}>Shopping Cart</h1>
          <p style={{ color: "var(--color-text-muted)" }}>
            {cart.length} {cart.length === 1 ? "item" : "items"} in your cart
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: "2rem", alignItems: "start" }}>
          {/* Cart items */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {cart.map((item, i) => {
              const price = Number(item.price) || 0;
              return (
                <div
                  key={item.id}
                  className="card"
                  style={{
                    padding: "1.25rem",
                    display: "flex",
                    gap: "1.25rem",
                    alignItems: "center",
                    animation: `fadeInUp 0.4s ease ${i * 0.05}s both`,
                  }}
                >
                  {/* Image */}
                  <div style={{
                    width: "90px",
                    height: "90px",
                    borderRadius: "var(--radius-sm)",
                    background: "var(--color-bg-alt)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    overflow: "hidden",
                  }}>
                    {item.image_url ? (
                      <img src={item.image_url} alt={item.name} style={{
                        maxWidth: "75%",
                        maxHeight: "70px",
                        objectFit: "contain",
                      }} />
                    ) : (
                      <div style={{
                        width: "36px",
                        height: "36px",
                        borderRadius: "50%",
                        background: "var(--color-accent-soft)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "var(--color-accent)",
                      }}>
                        <ShoppingBag size={18} />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontSize: "0.6875rem",
                      fontWeight: 600,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: "var(--color-accent)",
                      marginBottom: "0.25rem",
                    }}>
                      {item.category}
                    </div>
                    <Link to={`/products/${item.id}`} style={{
                      fontSize: "1.0625rem",
                      fontWeight: 700,
                      color: "var(--color-primary)",
                      display: "block",
                      marginBottom: "0.5rem",
                      transition: "color 0.2s",
                    }}
                      onMouseEnter={(e) => e.currentTarget.style.color = "var(--color-accent)"}
                      onMouseLeave={(e) => e.currentTarget.style.color = "var(--color-primary)"}
                    >
                      {item.name}
                    </Link>
                    <div style={{ fontSize: "0.875rem", color: "var(--color-text-muted)" }}>
                      {price > 0 ? `₹${price.toLocaleString("en-IN")} each` : "Price on request"}
                    </div>
                  </div>

                  {/* Quantity */}
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    flexShrink: 0,
                  }}>
                    <button
                      onClick={() => decreaseQuantity(item.id)}
                      style={{
                        width: "32px",
                        height: "32px",
                        borderRadius: "8px",
                        border: "1.5px solid var(--color-border)",
                        background: "var(--color-surface)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "var(--color-primary)",
                        transition: "all 0.2s",
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.borderColor = "var(--color-accent)"}
                      onMouseLeave={(e) => e.currentTarget.style.borderColor = "var(--color-border)"}
                    >
                      <Minus size={14} />
                    </button>
                    <span style={{
                      minWidth: "32px",
                      textAlign: "center",
                      fontWeight: 700,
                      fontSize: "0.9375rem",
                      color: "var(--color-primary)",
                    }}>
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => increaseQuantity(item.id)}
                      style={{
                        width: "32px",
                        height: "32px",
                        borderRadius: "8px",
                        border: "1.5px solid var(--color-border)",
                        background: "var(--color-surface)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "var(--color-primary)",
                        transition: "all 0.2s",
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.borderColor = "var(--color-accent)"}
                      onMouseLeave={(e) => e.currentTarget.style.borderColor = "var(--color-border)"}
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  {/* Price + Remove */}
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <div style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: "1.25rem",
                      fontWeight: 700,
                      color: "var(--color-primary)",
                      marginBottom: "0.5rem",
                    }}>
                      {price > 0 ? `₹${(price * item.quantity).toLocaleString("en-IN")}` : "—"}
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.25rem",
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        color: "var(--color-error)",
                        padding: "0.375rem 0.625rem",
                        borderRadius: "6px",
                        transition: "background 0.2s",
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = "#fef2f2"}
                      onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                    >
                      <Trash2 size={14} /> Remove
                    </button>
                  </div>
                </div>
              );
            })}

            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "1rem" }}>
              <Link to="/products" className="btn btn-outline" style={{ borderRadius: "10px" }}>
                <ArrowLeft size={18} /> Continue Shopping
              </Link>
              <button
                onClick={clearCart}
                className="btn btn-ghost"
                style={{ color: "var(--color-error)", borderRadius: "10px" }}
              >
                <Trash2 size={16} /> Clear Cart
              </button>
            </div>
          </div>

          {/* Summary */}
          <div className="card" style={{
            padding: "1.75rem",
            borderRadius: "var(--radius-lg)",
            position: "sticky",
            top: "100px",
          }}>
            <h3 style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "1.125rem",
              fontWeight: 700,
              marginBottom: "1.5rem",
            }}>
              Order Summary
            </h3>

            <div style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "0.75rem",
              fontSize: "0.9375rem",
            }}>
              <span style={{ color: "var(--color-text-muted)" }}>Items</span>
              <span style={{ fontWeight: 600 }}>{cart.length}</span>
            </div>

            <div style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "0.75rem",
              fontSize: "0.9375rem",
            }}>
              <span style={{ color: "var(--color-text-muted)" }}>Subtotal</span>
              <span style={{ fontWeight: 600 }}>
                {cartTotal > 0 ? `₹${cartTotal.toLocaleString("en-IN")}` : "—"}
              </span>
            </div>

            <div style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "0.75rem",
              fontSize: "0.9375rem",
            }}>
              <span style={{ color: "var(--color-text-muted)" }}>Shipping</span>
              <span style={{ fontWeight: 600, color: "var(--color-success)" }}>Free</span>
            </div>

            <div style={{
              paddingTop: "1rem",
              marginTop: "0.5rem",
              borderTop: "1px solid var(--color-border)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1.5rem",
            }}>
              <span style={{ fontSize: "1.125rem", fontWeight: 700, color: "var(--color-primary)" }}>Total</span>
              <span style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "1.75rem",
                fontWeight: 800,
                color: "var(--color-primary)",
              }}>
                {cartTotal > 0 ? `₹${cartTotal.toLocaleString("en-IN")}` : "—"}
              </span>
            </div>

            <Link to="/checkout" className="btn btn-primary w-full" style={{ borderRadius: "10px", width: "100%" }}>
              Proceed to Checkout <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          div[style*="grid-template-columns: 1fr 380px"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
