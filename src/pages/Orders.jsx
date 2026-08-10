import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { Package, ShoppingBag, ChevronDown, ChevronUp } from "lucide-react";

export default function Orders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState({});

  const fetchOrders = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from("orders")
        .select(`
          *,
          order_items (*)
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError("Failed to load orders. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const toggleExpand = (orderId) => {
    setExpanded((prev) => ({ ...prev, [orderId]: !prev[orderId] }));
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: "4rem 2rem" }}>
        <div className="loading-container">
          <div className="spinner spinner-lg" />
          <p>Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ paddingTop: "2rem", paddingBottom: "4rem", minHeight: "calc(100vh - 72px)" }}>
      <div className="container">
        <div style={{ marginBottom: "2rem" }}>
          <h1 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", marginBottom: "0.5rem" }}>My Orders</h1>
          <p style={{ color: "var(--color-text-muted)" }}>
            Track and manage all your orders in one place.
          </p>
        </div>

        {error && <div className="error-banner">{error}</div>}

        {orders.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              <ShoppingBag size={32} />
            </div>
            <h3 className="empty-state-title">You haven't placed any orders yet</h3>
            <p className="empty-state-text">
              When you place an order, it will appear here with full details and status tracking.
            </p>
            <Link to="/products" className="btn btn-primary">Browse Products</Link>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {orders.map((order, i) => (
              <div
                key={order.id}
                className="card"
                style={{
                  borderRadius: "var(--radius-lg)",
                  overflow: "hidden",
                  animation: `fadeInUp 0.4s ease ${i * 0.05}s both`,
                }}
              >
                {/* Order header */}
                <div
                  onClick={() => toggleExpand(order.id)}
                  style={{
                    padding: "1.25rem 1.5rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    cursor: "pointer",
                    flexWrap: "wrap",
                  }}
                >
                  <div style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "12px",
                    background: "var(--color-accent-soft)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--color-accent)",
                    flexShrink: 0,
                  }}>
                    <Package size={22} />
                  </div>

                  <div style={{ flex: 1, minWidth: "120px" }}>
                    <div style={{
                      fontSize: "1.0625rem",
                      fontWeight: 700,
                      color: "var(--color-primary)",
                    }}>
                      Order #{order.id}
                    </div>
                    <div style={{ fontSize: "0.8125rem", color: "var(--color-text-muted)" }}>
                      {new Date(order.created_at).toLocaleDateString("en-IN", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </div>
                  </div>

                  <span className={`status-badge status-${order.status}`}>
                    {order.status}
                  </span>

                  <div style={{ textAlign: "right" }}>
                    <div style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: "1.25rem",
                      fontWeight: 800,
                      color: "var(--color-primary)",
                    }}>
                      ₹{Number(order.total).toLocaleString("en-IN")}
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>
                      {order.order_items?.length || 0} items
                    </div>
                  </div>

                  <div style={{ color: "var(--color-text-muted)" }}>
                    {expanded[order.id] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>
                </div>

                {/* Expanded items */}
                {expanded[order.id] && (
                  <div style={{
                    borderTop: "1px solid var(--color-border-soft)",
                    padding: "1.25rem 1.5rem",
                    background: "var(--color-bg-alt)",
                    animation: "slideDown 0.3s ease",
                  }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                      {order.order_items?.map((item) => (
                        <div key={item.id} style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.875rem",
                          padding: "0.75rem",
                          borderRadius: "var(--radius-sm)",
                          background: "var(--color-surface)",
                        }}>
                          <div style={{
                            width: "70px",
                            height: "70px",
                            borderRadius: "8px",
                            background: "var(--color-bg-alt)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                            overflow: "hidden",
                          }}>
                            {item.product_name ? (
                              <div style={{
                                width: "40px",
                                height: "40px",
                                borderRadius: "50%",
                                background: "var(--color-accent-soft)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "var(--color-accent)",
                                fontSize: "0.75rem",
                                fontWeight: 700,
                              }}>
                                {item.product_name[0]}
                              </div>
                            ) : (
                              <Package size={24} style={{ color: "var(--color-text-light)" }} />
                            )}
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: "0.9375rem", fontWeight: 700, color: "var(--color-primary)" }}>
                              {item.product_name}
                            </div>
                            <div style={{ fontSize: "0.8125rem", color: "var(--color-text-muted)" }}>
                              Qty: {item.quantity} × ₹{Number(item.price).toLocaleString("en-IN")}
                            </div>
                          </div>
                          <div style={{ fontWeight: 700, fontSize: "0.9375rem", color: "var(--color-primary)", flexShrink: 0 }}>
                            ₹{(Number(item.price) * item.quantity).toLocaleString("en-IN")}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Delivery info */}
                    <div style={{
                      marginTop: "1rem",
                      padding: "1rem",
                      borderRadius: "var(--radius-sm)",
                      background: "var(--color-surface)",
                    }}>
                      <div style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--color-text-muted)", marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                        Delivery Details
                      </div>
                      <div style={{ fontSize: "0.9375rem", color: "var(--color-text)" }}>
                        {order.delivery_name} · {order.phone}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
