import Hero from "@/components/Hero";
import NewProducts from "@/components/NewProducts";
import Products from "@/components/Products";
import { Link } from "react-router-dom";
import { Leaf, Beaker, Shield, TrendingUp, Sprout, FlaskConical } from "lucide-react";

export default function Home() {
  const categories = [
    { name: "Herbicides", icon: Leaf, desc: "Effective weed control solutions", count: "6 products" },
    { name: "Fungicides", icon: Shield, desc: "Disease prevention and control", count: "3 products" },
    { name: "Pesticides", icon: Beaker, desc: "Pest management solutions", count: "4 products" },
    { name: "Fertilizer", icon: Sprout, desc: "Crop nutrition and growth", count: "6 products" },
  ];

  return (
    <div>
      <Hero />
      <NewProducts />
      <Products />

      {/* Categories section */}
      <section className="section" style={{ background: "var(--color-bg-alt)" }}>
        <div className="container">
          <div className="section-header">
            <div className="section-eyebrow">Categories</div>
            <h2 className="section-title">Explore by Category</h2>
            <p className="section-subtitle">
              Browse our comprehensive range of agricultural solutions across four key categories.
            </p>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "1.5rem",
          }}>
            {categories.map((cat, i) => (
              <Link
                key={cat.name}
                to="/products"
                className="card"
                style={{
                  padding: "2rem",
                  textAlign: "center",
                  animation: `fadeInUp 0.6s cubic-bezier(0.4,0,0.2,1) ${i * 0.1}s both`,
                }}
              >
                <div style={{
                  width: "64px",
                  height: "64px",
                  borderRadius: "16px",
                  background: "linear-gradient(135deg, var(--color-accent-soft), #d4ebde)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 1.25rem",
                  color: "var(--color-accent)",
                  transition: "transform 0.3s",
                }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.1) rotate(-5deg)"}
                  onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1) rotate(0)"}
                >
                  <cat.icon size={28} strokeWidth={2} />
                </div>
                <h3 style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "1.125rem",
                  fontWeight: 700,
                  marginBottom: "0.5rem",
                }}>
                  {cat.name}
                </h3>
                <p style={{ fontSize: "0.875rem", color: "var(--color-text-muted)", marginBottom: "0.75rem" }}>
                  {cat.desc}
                </p>
                <span style={{
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  color: "var(--color-accent)",
                  letterSpacing: "0.03em",
                }}>
                  {cat.count}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Company / Technology section */}
      <section className="section">
        <div className="container">
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "4rem",
            alignItems: "center",
          }}>
            <div>
              <div className="section-eyebrow" style={{ paddingLeft: 0 }}>
                <span style={{ paddingLeft: 0 }}>Agricultural Technology</span>
              </div>
              <h2 className="section-title" style={{ textAlign: "left", marginBottom: "1.5rem" }}>
                Science meets <br />sustainable farming
              </h2>
              <p style={{ fontSize: "1.0625rem", color: "var(--color-text-muted)", marginBottom: "1.5rem", lineHeight: 1.7 }}>
                At SYNGEn GREEN ARCHITECH, we combine cutting-edge agricultural science
                with a deep commitment to sustainability. Our products are formulated to
                maximize crop yields while minimizing environmental impact.
              </p>
              <p style={{ fontSize: "1.0625rem", color: "var(--color-text-muted)", marginBottom: "2rem", lineHeight: 1.7 }}>
                Every product undergoes rigorous testing and quality control to ensure
                it meets the highest standards of efficacy and safety for farmers and consumers alike.
              </p>

              <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}>
                {[
                  { icon: FlaskConical, label: "Lab-Tested" },
                  { icon: Shield, label: "Certified Safe" },
                  { icon: TrendingUp, label: "Proven Results" },
                ].map((item) => (
                  <div key={item.label} style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
                    <div style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "10px",
                      background: "var(--color-accent-soft)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "var(--color-accent)",
                    }}>
                      <item.icon size={20} />
                    </div>
                    <span style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--color-primary)" }}>
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ position: "relative" }}>
              <div style={{
                borderRadius: "var(--radius-xl)",
                overflow: "hidden",
                boxShadow: "var(--shadow-xl)",
                aspectRatio: "4/3",
              }}>
                <img
                  src="https://images.pexels.com/photos/36489873/pexels-photo-36489873.jpeg?auto=compress&cs=tinysrgb&w=1200"
                  alt="Farmer spraying crops"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
              <div style={{
                position: "absolute",
                bottom: "-1.5rem",
                left: "-1.5rem",
                background: "var(--color-surface)",
                padding: "1.5rem 2rem",
                borderRadius: "var(--radius-lg)",
                boxShadow: "var(--shadow-lg)",
                border: "1px solid var(--color-border-soft)",
              }}>
                <div style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "2.5rem",
                  fontWeight: 800,
                  color: "var(--color-primary)",
                  lineHeight: 1,
                }}>
                  19+
                </div>
                <div style={{
                  fontSize: "0.75rem",
                  color: "var(--color-text-muted)",
                  fontWeight: 500,
                  marginTop: "0.25rem",
                }}>
                  Premium Products
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 1024px) {
          section > div > div[style*="grid-template-columns: repeat(4"] {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          section > div > div[style*="grid-template-columns: 1fr 1fr"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
