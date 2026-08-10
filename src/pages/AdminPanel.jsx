import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  Plus,
  Clock,
  LogOut,
  Trash2,
  Edit,
  X,
  Save,
  Upload,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  DollarSign,
  UserCheck,
  Boxes,
  Leaf,
  Search,
} from "lucide-react";

export default function AdminPanel() {
  const { user, profile, logout, isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (authLoading) {
    return (
      <div className="loading-container" style={{ minHeight: "100vh" }}>
        <div className="spinner spinner-lg" />
      </div>
    );
  }

  if (!user) {
    navigate("/login");
    return null;
  }

  if (!isAdmin) {
    navigate("/account");
    return null;
  }

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "orders", label: "Orders", icon: ShoppingBag },
    { id: "products", label: "Products", icon: Package },
    { id: "customers", label: "Customers", icon: Users },
    { id: "newproducts", label: "New Products", icon: Plus },
    { id: "upcoming", label: "Upcoming Products", icon: Clock },
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--color-bg-alt)" }}>
      {/* Sidebar */}
      <aside style={{
        width: "260px",
        background: "var(--color-primary-dark)",
        color: "white",
        padding: "1.5rem 1rem",
        position: "fixed",
        top: 0,
        left: 0,
        bottom: 0,
        zIndex: 100,
        display: "flex",
        flexDirection: "column",
        transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)",
        transition: "transform 0.3s cubic-bezier(0.4,0,0.2,1)",
      }}
        className="admin-sidebar"
      >
        {/* Logo */}
        <div style={{ padding: "0.5rem 0.75rem 1.5rem", marginBottom: "0.5rem", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
            <div style={{
              width: "36px",
              height: "36px",
              borderRadius: "10px",
              background: "linear-gradient(135deg, var(--color-accent), var(--color-accent-light))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
            }}>
              <Leaf size={20} strokeWidth={2.5} />
            </div>
            <div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 800, fontSize: "1rem", color: "white" }}>
                SYNGEn
              </div>
              <div style={{ fontSize: "0.625rem", fontWeight: 600, letterSpacing: "0.1em", color: "var(--color-accent-light)", textTransform: "uppercase" }}>
                Admin Panel
              </div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, display: "flex", flexDirection: "column", gap: "0.25rem" }}>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                padding: "0.75rem 1rem",
                borderRadius: "10px",
                fontSize: "0.875rem",
                fontWeight: 600,
                color: activeTab === item.id ? "white" : "rgba(255,255,255,0.6)",
                background: activeTab === item.id ? "rgba(74,139,111,0.2)" : "transparent",
                transition: "all 0.2s",
                width: "100%",
                textAlign: "left",
              }}
              onMouseEnter={(e) => {
                if (activeTab !== item.id) e.currentTarget.style.background = "rgba(255,255,255,0.05)";
              }}
              onMouseLeave={(e) => {
                if (activeTab !== item.id) e.currentTarget.style.background = "transparent";
              }}
            >
              <item.icon size={18} />
              {item.label}
            </button>
          ))}
        </nav>

        {/* User + Logout */}
        <div style={{ paddingTop: "1rem", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
          <div style={{
            padding: "0.75rem",
            borderRadius: "10px",
            background: "rgba(255,255,255,0.05)",
            marginBottom: "0.5rem",
          }}>
            <div style={{ fontSize: "0.8125rem", fontWeight: 600, color: "white" }}>
              {profile?.name || "Admin"}
            </div>
            <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.5)" }}>
              {user.email}
            </div>
          </div>
          <button
            onClick={handleLogout}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              padding: "0.75rem 1rem",
              borderRadius: "10px",
              fontSize: "0.875rem",
              fontWeight: 600,
              color: "#fca5a5",
              width: "100%",
              textAlign: "left",
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = "rgba(239,68,68,0.1)"}
            onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 99 }}
        />
      )}

      {/* Main content */}
      <main style={{
        flex: 1,
        marginLeft: "260px",
        padding: "2rem",
        minHeight: "100vh",
      }}
      className="admin-main"
      >
        {/* Mobile toggle */}
        <button
          onClick={() => setSidebarOpen(true)}
          style={{
            display: "none",
            marginBottom: "1rem",
            padding: "0.5rem",
            borderRadius: "8px",
            background: "var(--color-surface)",
            border: "1px solid var(--color-border)",
          }}
          className="admin-menu-toggle"
        >
          <LayoutDashboard size={20} />
        </button>

        {activeTab === "dashboard" && <DashboardTab />}
        {activeTab === "orders" && <OrdersTab />}
        {activeTab === "products" && <ProductsTab />}
        {activeTab === "customers" && <CustomersTab />}
        {activeTab === "newproducts" && <ProductsTab filter="new" />}
        {activeTab === "upcoming" && <ProductsTab filter="upcoming" />}
      </main>

      <style>{`
        @media (max-width: 768px) {
          .admin-sidebar { transform: translateX(-100%); }
          .admin-sidebar.open { transform: translateX(0); }
          .admin-main { margin-left: 0 !important; padding: 1rem !important; }
          .admin-menu-toggle { display: block !important; }
        }
      `}</style>
    </div>
  );
}

// ===================== DASHBOARD TAB =====================
function DashboardTab() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    pending: 0,
    processing: 0,
    completed: 0,
    revenue: 0,
    customers: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [ordersRes, pendingRes, processingRes, deliveredRes, customersRes, recentRes] = await Promise.all([
          supabase.from("orders").select("id, total, status", { count: "exact" }),
          supabase.from("orders").select("*", { count: "exact" }).in("status", ["pending", "confirmed"]),
          supabase.from("orders").select("*", { count: "exact" }).eq("status", "processing"),
          supabase.from("orders").select("*", { count: "exact" }).eq("status", "delivered"),
          supabase.from("profiles").select("*", { count: "exact" }),
          supabase.from("orders").select(`*, order_items (*)`).order("created_at", { ascending: false }).limit(5),
        ]);

        const revenue = (ordersRes.data || []).reduce((sum, o) => sum + (Number(o.total) || 0), 0);

        setStats({
          totalOrders: ordersRes.count || 0,
          pending: pendingRes.count || 0,
          processing: processingRes.count || 0,
          completed: deliveredRes.count || 0,
          revenue,
          customers: customersRes.count || 0,
        });
        setRecentOrders(recentRes.data || []);
      } catch (err) {
        console.error("Dashboard stats error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner spinner-lg" />
      </div>
    );
  }

  const cards = [
    { label: "Total Orders", value: stats.totalOrders, icon: ShoppingBag, color: "var(--color-primary)", bg: "var(--color-accent-soft)" },
    { label: "Pending", value: stats.pending, icon: Clock, color: "var(--color-warning)", bg: "#fef3c7" },
    { label: "Processing", value: stats.processing, icon: Boxes, color: "var(--color-info)", bg: "#dbeafe" },
    { label: "Completed", value: stats.completed, icon: CheckCircle, color: "var(--color-success)", bg: "#dcfce7" },
    { label: "Revenue", value: `₹${stats.revenue.toLocaleString("en-IN")}`, icon: DollarSign, color: "var(--color-primary)", bg: "var(--color-accent-soft)" },
    { label: "Customers", value: stats.customers, icon: UserCheck, color: "var(--color-primary)", bg: "var(--color-accent-soft)" },
  ];

  return (
    <div>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", marginBottom: "0.5rem" }}>Dashboard</h1>
        <p style={{ color: "var(--color-text-muted)" }}>Overview of your store performance.</p>
      </div>

      {/* Stats grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "1.25rem",
        marginBottom: "2rem",
      }}
      className="stats-grid"
      >
        {cards.map((card, i) => (
          <div key={card.label} className="card" style={{
            padding: "1.5rem",
            borderRadius: "var(--radius-lg)",
            animation: `fadeInUp 0.4s ease ${i * 0.08}s both`,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <div style={{
                width: "48px",
                height: "48px",
                borderRadius: "12px",
                background: card.bg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: card.color,
              }}>
                <card.icon size={24} />
              </div>
              <div>
                <div style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "1.75rem",
                  fontWeight: 800,
                  color: "var(--color-primary)",
                  lineHeight: 1,
                }}>
                  {card.value}
                </div>
                <div style={{
                  fontSize: "0.8125rem",
                  color: "var(--color-text-muted)",
                  fontWeight: 500,
                  marginTop: "0.25rem",
                }}>
                  {card.label}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent orders */}
      <div className="card" style={{ padding: "1.5rem", borderRadius: "var(--radius-lg)" }}>
        <h3 style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: "1.125rem",
          fontWeight: 700,
          marginBottom: "1.25rem",
        }}>
          Recent Orders
        </h3>
        {recentOrders.length === 0 ? (
          <p style={{ color: "var(--color-text-muted)", textAlign: "center", padding: "2rem" }}>
            No orders yet.
          </p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {recentOrders.map((order) => (
              <div key={order.id} style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                padding: "0.875rem",
                borderRadius: "var(--radius-sm)",
                background: "var(--color-bg-alt)",
              }}>
                <div style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "10px",
                  background: "var(--color-surface)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--color-accent)",
                  flexShrink: 0,
                }}>
                  <Package size={18} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: "0.875rem", fontWeight: 700, color: "var(--color-primary)" }}>
                    Order #{order.id}
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>
                    {order.delivery_name || "Customer"} · {new Date(order.created_at).toLocaleDateString()}
                  </div>
                </div>
                <span className={`status-badge status-${order.status}`} style={{ fontSize: "0.6875rem" }}>
                  {order.status}
                </span>
                <div style={{ fontWeight: 700, fontSize: "0.875rem", color: "var(--color-primary)", flexShrink: 0 }}>
                  ₹{Number(order.total).toLocaleString("en-IN")}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 768px) {
          .stats-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

// ===================== ORDERS TAB =====================
function OrdersTab() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from("orders")
        .select(`*, order_items (*)`)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError("Failed to load orders.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      const { error } = await supabase
        .from("orders")
        .update({ status: newStatus })
        .eq("id", orderId);

      if (error) throw error;

      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
    } catch (err) {
      console.error("Status update error:", err);
      alert("Failed to update order status.");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (orderId) => {
    if (!window.confirm("Are you sure you want to delete this order? This action cannot be undone.")) return;
    setDeletingId(orderId);
    try {
      const { error } = await supabase.from("orders").delete().eq("id", orderId);
      if (error) throw error;
      setOrders((prev) => prev.filter((o) => o.id !== orderId));
    } catch (err) {
      console.error("Delete order error:", err);
      alert("Failed to delete order.");
    } finally {
      setDeletingId(null);
    }
  };

  const filtered = search
    ? orders.filter((o) =>
        String(o.id).includes(search) ||
        o.delivery_name?.toLowerCase().includes(search.toLowerCase()) ||
        o.phone?.includes(search)
      )
    : orders;

  if (loading) {
    return <div className="loading-container"><div className="spinner spinner-lg" /></div>;
  }

  return (
    <div>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", marginBottom: "0.5rem" }}>Orders</h1>
        <p style={{ color: "var(--color-text-muted)" }}>Manage all customer orders.</p>
      </div>

      {error && <div className="error-banner">{error}</div>}

      {/* Search */}
      <div style={{ position: "relative", marginBottom: "1.5rem", maxWidth: "400px" }}>
        <Search size={18} style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "var(--color-text-light)" }} />
        <input
          type="text"
          className="form-input"
          style={{ paddingLeft: "2.75rem" }}
          placeholder="Search by order ID, name, or phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon"><ShoppingBag size={32} /></div>
          <h3 className="empty-state-title">No orders yet</h3>
          <p className="empty-state-text">Orders will appear here once customers start placing them.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {filtered.map((order, i) => (
            <div key={order.id} className="card" style={{
              borderRadius: "var(--radius-lg)",
              overflow: "hidden",
              animation: `fadeInUp 0.3s ease ${i * 0.05}s both`,
            }}>
              {/* Order header */}
              <div style={{
                padding: "1.25rem 1.5rem",
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                flexWrap: "wrap",
                background: "var(--color-surface)",
              }}>
                <div style={{ flex: 1, minWidth: "120px" }}>
                  <div style={{ fontSize: "1.0625rem", fontWeight: 700, color: "var(--color-primary)" }}>
                    Order #{order.id}
                  </div>
                  <div style={{ fontSize: "0.8125rem", color: "var(--color-text-muted)", marginTop: "0.25rem" }}>
                    {order.delivery_name || "N/A"} · {order.phone || "N/A"} · {new Date(order.created_at).toLocaleDateString()}
                  </div>
                </div>

                <select
                  value={order.status}
                  onChange={(e) => handleStatusChange(order.id, e.target.value)}
                  disabled={updatingId === order.id}
                  className={`status-badge status-${order.status}`}
                  style={{
                    border: "none",
                    cursor: "pointer",
                    fontWeight: 600,
                    padding: "0.375rem 0.875rem",
                    borderRadius: "100px",
                    fontSize: "0.75rem",
                    textTransform: "capitalize",
                    outline: "none",
                  }}
                >
                  {["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"].map((s) => (
                    <option key={s} value={s} style={{ textTransform: "capitalize" }}>{s}</option>
                  ))}
                </select>

                <div style={{ fontWeight: 800, fontSize: "1.125rem", color: "var(--color-primary)", fontFamily: "'Playfair Display', serif" }}>
                  ₹{Number(order.total).toLocaleString("en-IN")}
                </div>

                <button
                  onClick={() => handleDelete(order.id)}
                  disabled={deletingId === order.id}
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "8px",
                    background: "#fef2f2",
                    color: "var(--color-error)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "var(--color-error)"; e.currentTarget.style.color = "white"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "#fef2f2"; e.currentTarget.style.color = "var(--color-error)"; }}
                  title="Delete order"
                >
                  {deletingId === order.id ? <span className="spinner" style={{ width: "14px", height: "14px", borderWidth: "2px" }} /> : <Trash2 size={16} />}
                </button>
              </div>

              {/* Order items */}
              <div style={{
                padding: "1rem 1.5rem",
                background: "var(--color-bg-alt)",
                borderTop: "1px solid var(--color-border-soft)",
              }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  {order.order_items?.map((item) => (
                    <div key={item.id} style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                      padding: "0.5rem",
                      borderRadius: "8px",
                      background: "var(--color-surface)",
                    }}>
                      <div style={{
                        width: "55px",
                        height: "55px",
                        borderRadius: "8px",
                        background: "var(--color-bg-alt)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}>
                        <div style={{
                          width: "32px",
                          height: "32px",
                          borderRadius: "50%",
                          background: "var(--color-accent-soft)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "var(--color-accent)",
                          fontSize: "0.75rem",
                          fontWeight: 700,
                        }}>
                          {item.product_name?.[0] || "P"}
                        </div>
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: "0.875rem", fontWeight: 700, color: "var(--color-primary)" }}>
                          {item.product_name}
                        </div>
                        <div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>
                          Qty: {item.quantity} × ₹{Number(item.price).toLocaleString("en-IN")}
                        </div>
                      </div>
                      <div style={{ fontWeight: 700, fontSize: "0.875rem", color: "var(--color-primary)", flexShrink: 0 }}>
                        ₹{(Number(item.price) * item.quantity).toLocaleString("en-IN")}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ===================== PRODUCTS TAB =====================
function ProductsTab({ filter }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      let query = supabase.from("products").select("*").order("created_at", { ascending: true });
      if (filter === "new") {
        query = query.eq("is_new", true);
      } else if (filter === "upcoming") {
        query = query.eq("is_upcoming", true);
      }
      const { data, error } = await query;
      if (error) throw error;
      setProducts(data || []);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Failed to load products.");
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleDelete = async (product) => {
    // Check if product has order_items
    try {
      const { count } = await supabase
        .from("order_items")
        .select("*", { count: "exact" })
        .eq("product_id", product.id);

      if (count > 0) {
        if (!window.confirm(`This product has ${count} order references. It will be archived (deactivated) instead of deleted to preserve order history. Continue?`)) {
          return;
        }
        // Archive instead of delete
        setDeletingId(product.id);
        const { error } = await supabase
          .from("products")
          .update({ is_active: false })
          .eq("id", product.id);
        if (error) throw error;
        setProducts((prev) => prev.filter((p) => p.id !== product.id));
      } else {
        if (!window.confirm(`Are you sure you want to delete "${product.name}"?`)) return;
        setDeletingId(product.id);

        // Delete image from storage if exists
        if (product.image_url) {
          const pathMatch = product.image_url.match(/product-images\/(.+)$/);
          if (pathMatch) {
            await supabase.storage.from("product-images").remove([pathMatch[1]]);
          }
        }

        const { error } = await supabase.from("products").delete().eq("id", product.id);
        if (error) throw error;
        setProducts((prev) => prev.filter((p) => p.id !== product.id));
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete product: " + err.message);
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return <div className="loading-container"><div className="spinner spinner-lg" /></div>;
  }

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", marginBottom: "0.5rem" }}>
            {filter === "new" ? "New Products" : filter === "upcoming" ? "Upcoming Products" : "Products"}
          </h1>
          <p style={{ color: "var(--color-text-muted)" }}>
            {filter === "new" ? "Manage products marked as new arrivals." : filter === "upcoming" ? "Manage upcoming products." : "Manage your product catalog."}
          </p>
        </div>
        <button
          onClick={() => { setEditingProduct(null); setShowForm(true); }}
          className="btn btn-primary"
          style={{ borderRadius: "10px" }}
        >
          <Plus size={18} /> Add Product
        </button>
      </div>

      {error && <div className="error-banner">{error}</div>}

      {products.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon"><Package size={32} /></div>
          <h3 className="empty-state-title">No products available</h3>
          <p className="empty-state-text">Add your first product to get started.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {products.map((product, i) => {
            const price = Number(product.price) || 0;
            return (
              <div key={product.id} className="card" style={{
                padding: "1.25rem",
                borderRadius: "var(--radius-lg)",
                display: "flex",
                alignItems: "center",
                gap: "1.25rem",
                animation: `fadeInUp 0.3s ease ${i * 0.05}s both`,
                flexWrap: "wrap",
              }}>
                {/* Image */}
                <div style={{
                  width: "70px",
                  height: "70px",
                  borderRadius: "10px",
                  background: "var(--color-bg-alt)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  overflow: "hidden",
                }}>
                  {product.image_url ? (
                    <img src={product.image_url} alt={product.name} style={{ maxWidth: "75%", maxHeight: "55px", objectFit: "contain" }} />
                  ) : (
                    <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "var(--color-accent-soft)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-accent)" }}>
                      <Leaf size={18} />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: "150px" }}>
                  <div style={{ display: "flex", gap: "0.375rem", marginBottom: "0.375rem", flexWrap: "wrap" }}>
                    {product.is_new && <span className="badge badge-new" style={{ fontSize: "0.625rem", padding: "0.125rem 0.5rem" }}>New</span>}
                    {product.is_upcoming && <span className="badge badge-upcoming" style={{ fontSize: "0.625rem", padding: "0.125rem 0.5rem" }}>Upcoming</span>}
                    {!product.is_active && <span className="badge badge-archived" style={{ fontSize: "0.625rem", padding: "0.125rem 0.5rem" }}>Archived</span>}
                    {product.is_active && !product.is_new && !product.is_upcoming && <span className="badge badge-active" style={{ fontSize: "0.625rem", padding: "0.125rem 0.5rem" }}>Active</span>}
                  </div>
                  <div style={{ fontSize: "1rem", fontWeight: 700, color: "var(--color-primary)", marginBottom: "0.25rem" }}>
                    {product.name}
                  </div>
                  <div style={{ fontSize: "0.8125rem", color: "var(--color-text-muted)" }}>
                    {product.category} · ID #{product.id}
                  </div>
                </div>

                {/* Price */}
                <div style={{ textAlign: "center", flexShrink: 0 }}>
                  <div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", marginBottom: "0.125rem" }}>Price</div>
                  <div style={{ fontWeight: 700, fontSize: "0.9375rem", color: "var(--color-primary)" }}>
                    {price > 0 ? `₹${price.toLocaleString("en-IN")}` : "—"}
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: "flex", gap: "0.375rem", flexShrink: 0 }}>
                  <button
                    onClick={() => { setEditingProduct(product); setShowForm(true); }}
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
                    onMouseEnter={(e) => { e.currentTarget.style.background = "var(--color-accent)"; e.currentTarget.style.color = "white"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "var(--color-accent-soft)"; e.currentTarget.style.color = "var(--color-accent)"; }}
                    title="Edit product"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(product)}
                    disabled={deletingId === product.id}
                    style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "8px",
                      background: "#fef2f2",
                      color: "var(--color-error)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "var(--color-error)"; e.currentTarget.style.color = "white"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "#fef2f2"; e.currentTarget.style.color = "var(--color-error)"; }}
                    title="Delete product"
                  >
                    {deletingId === product.id ? <span className="spinner" style={{ width: "14px", height: "14px", borderWidth: "2px" }} /> : <Trash2 size={16} />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Product form modal */}
      {showForm && (
        <ProductForm
          product={editingProduct}
          onClose={() => { setShowForm(false); setEditingProduct(null); }}
          onSaved={() => { setShowForm(false); setEditingProduct(null); fetchProducts(); }}
        />
      )}
    </div>
  );
}

// ===================== PRODUCT FORM =====================
function ProductForm({ product, onClose, onSaved }) {
  const [formData, setFormData] = useState({
    name: product?.name || "",
    category: product?.category || "Herbicides",
    description: product?.description || "",
    use: product?.use || "",
    price: product?.price || 0,
    image_url: product?.image_url || "",
    is_new: product?.is_new || false,
    is_upcoming: product?.is_upcoming || false,
    is_active: product?.is_active ?? true,
  });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const categories = ["Herbicides", "Fungicides", "Pesticides", "Fertilizer"];

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = fileName;

      const { error: uploadError } = await supabase.storage
        .from("product-images")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("product-images")
        .getPublicUrl(filePath);

      setFormData({ ...formData, image_url: publicUrl });
    } catch (err) {
      console.error("Upload error:", err);
      setError("Failed to upload image. " + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const payload = {
        name: formData.name.trim(),
        category: formData.category,
        description: formData.description.trim(),
        use: formData.use.trim(),
        price: Number(formData.price) || 0,
        image_url: formData.image_url,
        is_new: formData.is_new,
        is_upcoming: formData.is_upcoming,
        is_active: formData.is_active,
      };

      if (product) {
        const { error } = await supabase
          .from("products")
          .update(payload)
          .eq("id", product.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("products")
          .insert(payload);
        if (error) throw error;
      }

      onSaved();
    } catch (err) {
      console.error("Save product error:", err);
      setError("Failed to save product. " + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.5)",
      zIndex: 200,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "2rem",
      animation: "fadeIn 0.2s ease",
    }}
    onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="card"
        style={{
          width: "100%",
          maxWidth: "560px",
          maxHeight: "90vh",
          overflowY: "auto",
          borderRadius: "var(--radius-xl)",
          padding: "2rem",
          animation: "scaleIn 0.3s ease",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
          <h2 style={{ fontSize: "1.5rem" }}>
            {product ? "Edit Product" : "Add Product"}
          </h2>
          <button onClick={onClose} style={{
            width: "36px",
            height: "36px",
            borderRadius: "8px",
            background: "var(--color-bg-alt)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--color-text-muted)",
          }}>
            <X size={20} />
          </button>
        </div>

        {error && <div className="error-banner"><AlertCircle size={16} /> {error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Product Name</label>
            <input
              type="text"
              className="form-input"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. WEEDKILL-58"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Category</label>
            <select
              className="form-select"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              className="form-textarea"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Product description..."
            />
          </div>

          <div className="form-group">
            <label className="form-label">Usage Instructions</label>
            <textarea
              className="form-textarea"
              value={formData.use}
              onChange={(e) => setFormData({ ...formData, use: e.target.value })}
              placeholder="How to use this product..."
            />
          </div>

          <div className="form-group">
            <label className="form-label">Price (₹)</label>
            <input
              type="number"
              className="form-input"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              min="0"
              step="0.01"
              placeholder="0"
            />
          </div>

          {/* Image upload */}
          <div className="form-group">
            <label className="form-label">Product Image</label>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              padding: "1rem",
              borderRadius: "var(--radius-md)",
              border: "2px dashed var(--color-border)",
              background: "var(--color-bg-alt)",
            }}>
              {formData.image_url ? (
                <div style={{
                  width: "60px",
                  height: "60px",
                  borderRadius: "8px",
                  background: "var(--color-surface)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                  flexShrink: 0,
                }}>
                  <img src={formData.image_url} alt="Preview" style={{ maxWidth: "75%", maxHeight: "50px", objectFit: "contain" }} />
                </div>
              ) : (
                <div style={{
                  width: "60px",
                  height: "60px",
                  borderRadius: "8px",
                  background: "var(--color-surface)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--color-text-light)",
                  flexShrink: 0,
                }}>
                  <Upload size={24} />
                </div>
              )}
              <div style={{ flex: 1 }}>
                <label style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.5rem 1rem",
                  borderRadius: "8px",
                  background: "var(--color-primary)",
                  color: "white",
                  fontSize: "0.8125rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "background 0.2s",
                }}
                  onMouseEnter={(e) => e.currentTarget.style.background = "var(--color-primary-light)"}
                  onMouseLeave={(e) => e.currentTarget.style.background = "var(--color-primary)"}
                >
                  <Upload size={16} /> {uploading ? "Uploading..." : "Choose Image"}
                  <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: "none" }} disabled={uploading} />
                </label>
                {formData.image_url && (
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, image_url: "" })}
                    style={{ marginLeft: "0.5rem", fontSize: "0.75rem", color: "var(--color-error)", fontWeight: 600 }}
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Checkboxes */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "1.5rem" }}>
            <label className="form-checkbox">
              <input type="checkbox" checked={formData.is_new} onChange={(e) => setFormData({ ...formData, is_new: e.target.checked })} />
              Mark as New Product
            </label>
            <label className="form-checkbox">
              <input type="checkbox" checked={formData.is_upcoming} onChange={(e) => setFormData({ ...formData, is_upcoming: e.target.checked })} />
              Mark as Upcoming Product
            </label>
            <label className="form-checkbox">
              <input type="checkbox" checked={formData.is_active} onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })} />
              Active (visible to customers)
            </label>
          </div>

          <div style={{ display: "flex", gap: "0.75rem" }}>
            <button type="submit" disabled={saving} className="btn btn-primary" style={{ flex: 1, borderRadius: "10px" }}>
              {saving ? <><span className="spinner" style={{ width: "16px", height: "16px", borderWidth: "2px" }} /> Saving...</> : <><Save size={18} /> {product ? "Update" : "Create"} Product</>}
            </button>
            <button type="button" onClick={onClose} className="btn btn-outline" style={{ borderRadius: "10px" }}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ===================== CUSTOMERS TAB =====================
function CustomersTab() {
  const [customers, setCustomers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const [profilesRes, ordersRes] = await Promise.all([
          supabase.from("profiles").select("*").order("created_at", { ascending: false }),
          supabase.from("orders").select("id, user_id, total, status"),
        ]);

        setCustomers(profilesRes.data || []);
        setOrders(ordersRes.data || []);
      } catch (err) {
        console.error("Customers fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  if (loading) {
    return <div className="loading-container"><div className="spinner spinner-lg" /></div>;
  }

  return (
    <div>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", marginBottom: "0.5rem" }}>Customers</h1>
        <p style={{ color: "var(--color-text-muted)" }}>View all registered customers.</p>
      </div>

      {customers.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon"><Users size={32} /></div>
          <h3 className="empty-state-title">No customers found</h3>
          <p className="empty-state-text">Customers will appear here once they register.</p>
        </div>
      ) : (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "1.25rem",
        }}
        className="customers-grid"
        >
          {customers.map((customer, i) => {
            const customerOrders = orders.filter((o) => o.user_id === customer.id);
            return (
              <div key={customer.id} className="card" style={{
                padding: "1.5rem",
                borderRadius: "var(--radius-lg)",
                animation: `fadeInUp 0.3s ease ${i * 0.05}s both`,
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.25rem" }}>
                  <div style={{
                    width: "52px",
                    height: "52px",
                    borderRadius: "14px",
                    background: "linear-gradient(135deg, var(--color-primary), var(--color-accent))",
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.25rem",
                    fontWeight: 800,
                    fontFamily: "'Playfair Display', serif",
                    flexShrink: 0,
                  }}>
                    {customer.name?.[0]?.toUpperCase() || customer.email?.[0]?.toUpperCase() || "U"}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: "1rem", fontWeight: 700, color: "var(--color-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {customer.name || "Unnamed"}
                    </div>
                    <div style={{ fontSize: "0.8125rem", color: "var(--color-text-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {customer.email}
                    </div>
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", fontSize: "0.8125rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "var(--color-text-muted)" }}>Phone</span>
                    <span style={{ fontWeight: 600 }}>{customer.phone || "—"}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "var(--color-text-muted)" }}>Role</span>
                    <span className={`badge ${customer.role === "admin" ? "badge-new" : "badge-active"}`} style={{ fontSize: "0.6875rem", textTransform: "capitalize" }}>
                      {customer.role}
                    </span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "var(--color-text-muted)" }}>Orders</span>
                    <span style={{ fontWeight: 700, color: "var(--color-primary)" }}>{customerOrders.length}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "var(--color-text-muted)" }}>Joined</span>
                    <span style={{ fontWeight: 600 }}>{new Date(customer.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .customers-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
