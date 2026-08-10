import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import ProductCard from "@/components/ProductCard";

export default function Products({ filter }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = ["All", "Herbicides", "Fungicides", "Pesticides", "Fertilizer"];

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        let query = supabase
          .from("products")
          .select("*")
          .order("created_at", { ascending: true });

        if (filter === "new") {
          query = query.eq("is_new", true).eq("is_active", true);
        } else {
          query = query.eq("is_active", true);
        }

        const { data, error } = await query;
        if (error) throw error;
        setProducts(data || []);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [filter]);

  const filtered = activeCategory === "All"
    ? products
    : products.filter((p) => p.category === activeCategory);

  if (loading) {
    return (
      <div className="section">
        <div className="container">
          <div className="section-header">
            <div className="section-eyebrow">Our Products</div>
            <h2 className="section-title">Premium Agricultural Solutions</h2>
          </div>
          <div className="products-grid">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="card" style={{ overflow: "hidden" }}>
                <div className="skeleton" style={{ height: "220px", borderRadius: 0 }} />
                <div style={{ padding: "1.25rem" }}>
                  <div className="skeleton" style={{ height: "12px", width: "60%", marginBottom: "0.75rem" }} />
                  <div className="skeleton" style={{ height: "16px", width: "80%", marginBottom: "1rem" }} />
                  <div className="skeleton" style={{ height: "36px", width: "100%", borderRadius: "8px" }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="section">
        <div className="container">
          <div className="error-banner">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="section" id="products">
      <div className="container">
        <div className="section-header">
          <div className="section-eyebrow">
            {filter === "new" ? "New Arrivals" : "Our Products"}
          </div>
          <h2 className="section-title">
            {filter === "new" ? "Newly Launching Products" : "Premium Agricultural Solutions"}
          </h2>
          <p className="section-subtitle">
            {filter === "new"
              ? "Discover our latest innovations in crop protection and nutrition."
              : "Explore our comprehensive range of science-backed agricultural products."}
          </p>
        </div>

        {/* Category filter */}
        {filter !== "new" && (
          <div style={{
            display: "flex",
            justifyContent: "center",
            gap: "0.5rem",
            marginBottom: "2.5rem",
            flexWrap: "wrap",
          }}>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  padding: "0.625rem 1.5rem",
                  fontSize: "0.8125rem",
                  fontWeight: 600,
                  letterSpacing: "0.03em",
                  textTransform: "uppercase",
                  borderRadius: "100px",
                  transition: "all 0.3s",
                  background: activeCategory === cat ? "var(--color-primary)" : "transparent",
                  color: activeCategory === cat ? "white" : "var(--color-text-muted)",
                  border: `1.5px solid ${activeCategory === cat ? "var(--color-primary)" : "var(--color-border)"}`,
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6"/></svg>
            </div>
            <h3 className="empty-state-title">No products available</h3>
            <p className="empty-state-text">There are no products in this category yet. Check back soon.</p>
            <Link to="/products" className="btn btn-outline">View All Products</Link>
          </div>
        ) : (
          <div className="products-grid">
            {filtered.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
