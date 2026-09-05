import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Zap, ArrowLeft, Check, Package } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useCart } from "@/context/CartContext";
import ProductCard from "@/components/ProductCard";

export default function ProductDetails() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .eq("id", productId)
          .maybeSingle();

        if (error) throw error;
        if (!data) {
          setError("Product not found.");
          return;
        }
        setProduct(data);

        const { data: relData } = await supabase
          .from("products")
          .select("*")
          .eq("category", data.category)
          .eq("is_active", true)
          .neq("id", data.id)
          .limit(4);

        setRelated(relData || []);
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Failed to load product details.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
    window.scrollTo(0, 0);
  }, [productId]);

  const handleAddToCart = () => {
    if (!product || product.is_upcoming || !product.is_active) return;
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    if (!product || product.is_upcoming || !product.is_active) return;
    addToCart(product);
    navigate("/checkout");
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: "4rem 2rem" }}>
        <div style={{ display: "flex", gap: "3rem", flexWrap: "wrap" }}>
          <div className="skeleton" style={{ width: "450px", height: "450px", borderRadius: "20px" }} />
          <div style={{ flex: 1, minWidth: "300px" }}>
            <div className="skeleton" style={{ height: "16px", width: "40%", marginBottom: "1rem" }} />
            <div className="skeleton" style={{ height: "32px", width: "80%", marginBottom: "1.5rem" }} />
            <div className="skeleton" style={{ height: "20px", width: "100%", marginBottom: "0.75rem" }} />
            <div className="skeleton" style={{ height: "20px", width: "90%", marginBottom: "0.75rem" }} />
            <div className="skeleton" style={{ height: "20px", width: "85%", marginBottom: "2rem" }} />
            <div className="skeleton" style={{ height: "48px", width: "200px", borderRadius: "12px" }} />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container" style={{ padding: "4rem 2rem" }}>
        <div className="empty-state">
          <div className="empty-state-icon">
            <Package size={32} />
          </div>
          <h3 className="empty-state-title">Product not found</h3>
          <p className="empty-state-text">{error || "This product may have been removed."}</p>
          <Link to="/products" className="btn btn-primary">Browse Products</Link>
        </div>
      </div>
    );
  }

  const isPurchasable = !product.is_upcoming && product.is_active;
  const price = Number(product.price) || 0;

  return (
    <div style={{ paddingTop: "2rem", paddingBottom: "4rem" }}>
      <div className="container">
        {/* Breadcrumb */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "2rem" }}>
          <Link to="/products" style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.375rem",
            fontSize: "0.875rem",
            fontWeight: 500,
            color: "var(--color-text-muted)",
            transition: "color 0.2s",
          }}
            onMouseEnter={(e) => e.currentTarget.style.color = "var(--color-primary)"}
            onMouseLeave={(e) => e.currentTarget.style.color = "var(--color-text-muted)"}
          >
            <ArrowLeft size={16} /> Back to Products
          </Link>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "3rem",
          alignItems: "start",
        }}>
          {/* Image */}
          <div className="card" style={{
            padding: "2rem",
            borderRadius: "var(--radius-xl)",
            position: "sticky",
            top: "100px",
          }}>
            <div style={{
              height: "400px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "var(--color-bg-alt)",
              borderRadius: "var(--radius-lg)",
            }}>
              {product.image_url ? (
                <img src={product.image_url} alt={product.name} style={{
                  maxWidth: "75%",
                  maxHeight: "320px",
                  objectFit: "contain",
                }} />
              ) : (
                <div style={{
                  width: "100px",
                  height: "100px",
                  borderRadius: "50%",
                  background: "var(--color-accent-soft)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--color-accent)",
                }}>
                  <Package size={48} />
                </div>
              )}
            </div>
          </div>

          {/* Details */}
          <div style={{ animation: "fadeInUp 0.5s ease" }}>
            <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem", flexWrap: "wrap" }}>
              <span className="badge badge-active">{product.category}</span>
              {product.is_new && <span className="badge badge-new">New Product</span>}
              {product.is_upcoming && <span className="badge badge-upcoming">Coming Soon</span>}
              {!product.is_active && <span className="badge badge-archived">Archived</span>}
            </div>

            <h1 style={{
              fontSize: "clamp(1.75rem, 4vw, 2.75rem)",
              fontWeight: 800,
              marginBottom: "0.75rem",
              letterSpacing: "-0.02em",
            }}>
              {product.name}
            </h1>

            <div style={{
              fontSize: "0.875rem",
              color: "var(--color-text-muted)",
              marginBottom: "1.5rem",
              fontFamily: "'Inter', monospace",
            }}>
              Product ID: #{product.id}
            </div>

            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              marginBottom: "2rem",
              padding: "1.25rem 1.5rem",
              background: "var(--color-accent-soft)",
              borderRadius: "var(--radius-md)",
            }}>
              {product.is_upcoming ? (
                <span style={{ fontSize: "1.125rem", fontWeight: 700, color: "var(--color-warning)" }}>
                  Coming Soon — Not yet available
                </span>
              ) : price > 0 ? (
                <span style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "2rem",
                  fontWeight: 800,
                  color: "var(--color-primary)",
                }}>
                  ₹{price.toLocaleString("en-IN")}
                </span>
              ) : (
                <span style={{ fontSize: "1.125rem", fontWeight: 600, color: "var(--color-text-muted)" }}>
                  Price on request
                </span>
              )}
            </div>

            {product.use && (
              <div style={{ marginBottom: "1.5rem" }}>
                <h3 style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "0.8125rem",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "var(--color-accent)",
                  marginBottom: "0.5rem",
                }}>
                Usage
                </h3>
                <p style={{ fontSize: "1rem", color: "var(--color-text)", lineHeight: 1.7 }}>
                  {product.use}
                </p>
              </div>
            )}

            {product.description && (
              <div style={{ marginBottom: "2rem" }}>
                <h3 style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "0.8125rem",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "var(--color-accent)",
                  marginBottom: "0.5rem",
                }}>
                  Description
                </h3>
                <p style={{ fontSize: "1rem", color: "var(--color-text)", lineHeight: 1.7 }}>
                  {product.description}
                </p>
              </div>
            )}

            {/* Action buttons */}
            {isPurchasable && (
              <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                <button
                  onClick={handleAddToCart}
                  className="btn btn-accent btn-lg"
                  style={{ borderRadius: "12px", flex: 1, minWidth: "200px" }}
                >
                  {added ? (
                    <><Check size={20} /> Added to Cart</>
                  ) : (
                    <><ShoppingCart size={20} /> Add to Cart</>
                  )}
                </button>
                <button
                  onClick={handleBuyNow}
                  className="btn btn-primary btn-lg"
                  style={{ borderRadius: "12px", flex: 1, minWidth: "200px" }}
                >
                  <Zap size={20} /> Buy Now
                </button>
              </div>
            )}

            {!isPurchasable && product.is_upcoming && (
              <div style={{
                padding: "1.25rem 1.5rem",
                background: "#fef3c7",
                border: "1px solid #fde68a",
                borderRadius: "var(--radius-md)",
                color: "#92400e",
                fontSize: "0.9375rem",
                fontWeight: 500,
              }}>
                This product is coming soon and is not yet available for purchase.
              </div>
            )}
          </div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <div style={{ marginTop: "5rem" }}>
            <h2 style={{
              fontSize: "clamp(1.5rem, 3vw, 2rem)",
              marginBottom: "2rem",
              textAlign: "center",
            }}>
              Related Products
            </h2>
            <div className="products-grid">
              {related.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 768px) {
          div[style*="grid-template-columns: 1fr 1fr"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
