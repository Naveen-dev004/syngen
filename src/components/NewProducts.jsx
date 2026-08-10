import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Sparkles, Clock } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function NewProducts() {
  const [newProducts, setNewProducts] = useState([]);
  const [upcomingProducts, setUpcomingProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNewAndUpcoming = async () => {
      try {
        const [{ data: newData, error: newError }, { data: upcomingData, error: upcomingError }] =
          await Promise.all([
            supabase.from("products").select("*").eq("is_new", true).eq("is_active", true),
            supabase.from("products").select("*").eq("is_upcoming", true),
          ]);

        if (newError) console.error("New products error:", newError);
        if (upcomingError) console.error("Upcoming products error:", upcomingError);

        setNewProducts(newData || []);
        setUpcomingProducts(upcomingData || []);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNewAndUpcoming();
  }, []);

  if (loading) {
    return (
      <div className="section" style={{ paddingTop: "4rem" }}>
        <div className="container">
          <div className="products-grid">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="card" style={{ overflow: "hidden" }}>
                <div className="skeleton" style={{ height: "220px", borderRadius: 0 }} />
                <div style={{ padding: "1.25rem" }}>
                  <div className="skeleton" style={{ height: "12px", width: "50%", marginBottom: "0.75rem" }} />
                  <div className="skeleton" style={{ height: "16px", width: "70%", marginBottom: "1rem" }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const hasNew = newProducts.length > 0;
  const hasUpcoming = upcomingProducts.length > 0;

  if (!hasNew && !hasUpcoming) return null;

  return (
    <div style={{ paddingTop: "4rem" }}>
      {/* New Arrivals */}
      {hasNew && (
        <div className="container" style={{ marginBottom: "4rem" }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "2.5rem",
            flexWrap: "wrap",
            gap: "1rem",
          }}>
            <div>
              <div style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.375rem 0.875rem",
                background: "#dcfce7",
                borderRadius: "100px",
                marginBottom: "0.75rem",
              }}>
                <Sparkles size={14} style={{ color: "#166534" }} />
                <span style={{
                  fontSize: "0.6875rem",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "#166534",
                }}>
                  New Arrivals
                </span>
              </div>
              <h2 style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)", fontWeight: 700 }}>
                Newly Launching Products
              </h2>
            </div>
            <Link to="/products?filter=new" className="btn btn-outline btn-sm" style={{ borderRadius: "8px" }}>
              View All
            </Link>
          </div>

          <div className="products-grid">
            {newProducts.slice(0, 4).map((product, i) => (
              <Link
                key={product.id}
                to={`/products/${product.id}`}
                className="card"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  animation: `fadeInUp 0.6s cubic-bezier(0.4,0,0.2,1) ${i * 0.1}s both`,
                }}
              >
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
                      color: "var(--color-accent)",
                    }}>
                      <Sparkles size={28} />
                    </div>
                  )}
                  <span className="badge badge-new" style={{ position: "absolute", top: "0.75rem", left: "0.75rem" }}>
                    New
                  </span>
                </div>
                <div style={{ padding: "1.25rem" }}>
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
                  }}>
                    {product.name}
                  </h3>
                  <div style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.375rem",
                    fontSize: "0.8125rem",
                    fontWeight: 600,
                    color: "var(--color-accent)",
                  }}>
                    View Product
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Upcoming Products */}
      {hasUpcoming && (
        <div className="container" style={{ marginBottom: "4rem" }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "2.5rem",
            flexWrap: "wrap",
            gap: "1rem",
          }}>
            <div>
              <div style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.375rem 0.875rem",
                background: "#fef3c7",
                borderRadius: "100px",
                marginBottom: "0.75rem",
              }}>
                <Clock size={14} style={{ color: "#92400e" }} />
                <span style={{
                  fontSize: "0.6875rem",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "#92400e",
                }}>
                  Coming Soon
                </span>
              </div>
              <h2 style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)", fontWeight: 700 }}>
                Upcoming Products
              </h2>
            </div>
          </div>

          <div className="products-grid">
            {upcomingProducts.map((product, i) => (
              <div
                key={product.id}
                className="card"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  opacity: 0.85,
                  animation: `fadeInUp 0.6s cubic-bezier(0.4,0,0.2,1) ${i * 0.1}s both`,
                }}
              >
                <div className="product-image-container" style={{ position: "relative" }}>
                  {product.image_url ? (
                    <img src={product.image_url} alt={product.name} style={{ filter: "grayscale(30%)" }} />
                  ) : (
                    <div style={{
                      width: "60px",
                      height: "60px",
                      borderRadius: "50%",
                      background: "#fef3c7",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#92400e",
                    }}>
                      <Clock size={28} />
                    </div>
                  )}
                  <span className="badge badge-upcoming" style={{ position: "absolute", top: "0.75rem", left: "0.75rem" }}>
                    Coming Soon
                  </span>
                </div>
                <div style={{ padding: "1.25rem" }}>
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
                  }}>
                    {product.name}
                  </h3>
                  <div style={{
                    fontSize: "0.8125rem",
                    fontWeight: 600,
                    color: "var(--color-text-muted)",
                  }}>
                    Not yet available for purchase
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
