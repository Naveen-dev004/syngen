import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { CheckCircle2, ArrowLeft, AlertCircle } from "lucide-react";

export default function Checkout() {
  const { cart, cartTotal, clearCart } = useCart();
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState(profile?.name || "");
  const [phone, setPhone] = useState(profile?.phone || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!user) {
    navigate("/login");
    return null;
  }

  if (cart.length === 0) {
    return (
      <div className="container" style={{ padding: "4rem 2rem", minHeight: "60vh" }}>
        <div className="empty-state">
          <div className="empty-state-icon">
            <AlertCircle size={32} />
          </div>
          <h3 className="empty-state-title">Your cart is empty</h3>
          <p className="empty-state-text">Add products to your cart before checking out.</p>
          <Link to="/products" className="btn btn-primary">Browse Products</Link>
        </div>
      </div>
    );
  }

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setError(null);

    if (!name.trim() || !phone.trim()) {
      setError("Please provide your full name and phone number.");
      return;
    }

    setLoading(true);

    try {
      // Fetch real products from Supabase to validate
      const productIds = cart.map((item) => item.id);
      const { data: dbProducts, error: fetchError } = await supabase
        .from("products")
        .select("id, name, price, is_active, is_upcoming")
        .in("id", productIds);

      if (fetchError) throw fetchError;

      // Validate every cart item exists and is purchasable
      const validatedItems = [];
      let total = 0;

      for (const cartItem of cart) {
        const dbProduct = dbProducts.find((p) => p.id === cartItem.id);
        if (!dbProduct) {
          throw new Error(`Product "${cartItem.name}" is no longer available.`);
        }
        if (!dbProduct.is_active || dbProduct.is_upcoming) {
          throw new Error(`Product "${cartItem.name}" is not available for purchase.`);
        }
        const itemPrice = Number(dbProduct.price) || 0;
        validatedItems.push({
          product_id: dbProduct.id,
          product_name: dbProduct.name,
          quantity: cartItem.quantity,
          price: itemPrice,
        });
        total += itemPrice * cartItem.quantity;
      }

      // Create order
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          user_id: user.id,
          status: "pending",
          total: total,
          delivery_name: name.trim(),
          phone: phone.trim(),
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItemsData = validatedItems.map((item) => ({
        ...item,
        order_id: order.id,
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItemsData);

      if (itemsError) {
        // Order was created but items failed — attempt to clean up
        console.error("Order items failed, cleaning up order:", itemsError);
        await supabase.from("orders").delete().eq("id", order.id);
        throw new Error("Failed to create order items. Please try again.");
      }

      // Success — clear cart and redirect
      clearCart();
      navigate("/orders");
    } catch (err) {
      console.error("Checkout error:", err);
      setError(err.message || "Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ paddingTop: "2rem", paddingBottom: "4rem" }}>
      <div className="container">
        <div style={{ marginBottom: "2rem" }}>
          <Link to="/cart" style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.375rem",
            fontSize: "0.875rem",
            fontWeight: 500,
            color: "var(--color-text-muted)",
            marginBottom: "1rem",
          }}>
            <ArrowLeft size={16} /> Back to Cart
          </Link>
          <h1 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", marginBottom: "0.5rem" }}>Checkout</h1>
          <p style={{ color: "var(--color-text-muted)" }}>Review your order and complete your purchase.</p>
        </div>

        {error && <div className="error-banner"><AlertCircle size={16} /> {error}</div>}

        <form onSubmit={handlePlaceOrder} style={{
          display: "grid",
          gridTemplateColumns: "1fr 380px",
          gap: "2rem",
          alignItems: "start",
        }}>
          {/* Customer details + order summary */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {/* Customer details */}
            <div className="card" style={{ padding: "1.75rem", borderRadius: "var(--radius-lg)" }}>
              <h3 style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "1.125rem",
                fontWeight: 700,
                marginBottom: "1.25rem",
              }}>
                Customer Details
              </h3>

              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input
                  type="tel"
                  className="form-input"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter your phone number"
                  required
                />
              </div>
            </div>

            {/* Order summary */}
            <div className="card" style={{ padding: "1.75rem", borderRadius: "var(--radius-lg)" }}>
              <h3 style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "1.125rem",
                fontWeight: 700,
                marginBottom: "1.25rem",
              }}>
                Order Summary
              </h3>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {cart.map((item) => {
                  const price = Number(item.price) || 0;
                  return (
                    <div key={item.id} style={{
                      display: "flex",
                      gap: "0.875rem",
                      alignItems: "center",
                      padding: "0.75rem",
                      borderRadius: "var(--radius-sm)",
                      background: "var(--color-bg-alt)",
                    }}>
                      <div style={{
                        width: "55px",
                        height: "55px",
                        borderRadius: "8px",
                        background: "var(--color-surface)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        overflow: "hidden",
                      }}>
                        {item.image_url ? (
                          <img src={item.image_url} alt={item.name} className="admin-order-product-image" />
                        ) : (
                          <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "var(--color-accent-soft)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-accent)" }}>
                            <span style={{ fontSize: "0.75rem", fontWeight: 700 }}>P</span>
                          </div>
                        )}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: "0.9375rem", fontWeight: 700, color: "var(--color-primary)" }}>
                          {item.name}
                        </div>
                        <div style={{ fontSize: "0.8125rem", color: "var(--color-text-muted)" }}>
                          Qty: {item.quantity} {price > 0 ? `× ₹${price.toLocaleString("en-IN")}` : ""}
                        </div>
                      </div>
                      <div style={{
                        fontWeight: 700,
                        fontSize: "0.9375rem",
                        color: "var(--color-primary)",
                        flexShrink: 0,
                      }}>
                        {price > 0 ? `₹${(price * item.quantity).toLocaleString("en-IN")}` : "—"}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Summary sidebar */}
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
              marginBottom: "1.25rem",
            }}>
              Payment Summary
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

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full"
              style={{ borderRadius: "10px", width: "100%" }}
            >
              {loading ? (
                <><span className="spinner" style={{ width: "16px", height: "16px", borderWidth: "2px" }} /> Placing Order...</>
              ) : (
                <><CheckCircle2 size={20} /> Place Order</>
              )}
            </button>

            <p style={{
              fontSize: "0.75rem",
              color: "var(--color-text-light)",
              textAlign: "center",
              marginTop: "1rem",
              lineHeight: 1.5,
            }}>
              By placing this order, you agree to our terms and conditions.
              Your order will be processed promptly.
            </p>
          </div>
        </form>
      </div>

      <style>{`
        @media (max-width: 768px) {
          form[style*="grid-template-columns: 1fr 380px"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
