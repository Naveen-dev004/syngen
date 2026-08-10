import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";

export default function Hero() {
  return (
    <section style={{
      position: "relative",
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      overflow: "hidden",
      background: "linear-gradient(180deg, #f4f7f5 0%, #fafafa 100%)",
    }}>
      {/* Background image with overlay */}
      <div style={{
        position: "absolute",
        inset: 0,
        backgroundImage: `url(https://images.pexels.com/photos/9560384/pexels-photo-9560384.jpeg?auto=compress&cs=tinysrgb&w=1920)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        opacity: 0.15,
      }} />

      {/* Decorative shapes */}
      <div style={{
        position: "absolute",
        top: "-200px",
        right: "-100px",
        width: "600px",
        height: "600px",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(74,139,111,0.08), transparent 70%)",
        animation: "float 8s ease-in-out infinite",
      }} />
      <div style={{
        position: "absolute",
        bottom: "-150px",
        left: "-100px",
        width: "500px",
        height: "500px",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(26,58,46,0.06), transparent 70%)",
        animation: "float 10s ease-in-out infinite reverse",
      }} />

      <div className="container" style={{ position: "relative", zIndex: 1, padding: "4rem 2rem" }}>
        <div style={{ maxWidth: "800px" }}>
          <div className="animate-fade-in-up" style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.5rem 1rem",
            background: "var(--color-accent-soft)",
            borderRadius: "100px",
            marginBottom: "2rem",
          }}>
            <Sparkles size={14} style={{ color: "var(--color-accent)" }} />
            <span style={{
              fontSize: "0.75rem",
              fontWeight: 600,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--color-accent)",
            }}>
              Agricultural Innovation
            </span>
          </div>

          <h1 className="animate-fade-in-up stagger-1" style={{
            fontSize: "clamp(2.5rem, 6vw, 5.5rem)",
            fontWeight: 800,
            lineHeight: 1.05,
            marginBottom: "1.5rem",
            letterSpacing: "-0.03em",
          }}>
            Growing better.
            <br />
            <span style={{
              background: "linear-gradient(135deg, var(--color-accent), var(--color-primary-light))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>
              Building smarter.
            </span>
          </h1>

          <p className="animate-fade-in-up stagger-2" style={{
            fontSize: "1.25rem",
            color: "var(--color-text-muted)",
            maxWidth: "560px",
            marginBottom: "2.5rem",
            lineHeight: 1.6,
            fontFamily: "'Inter', sans-serif",
            fontWeight: 400,
          }}>
            Premium agricultural solutions engineered for the modern farm.
            From herbicides to fertilizers, we deliver science-backed products
            that cultivate healthier crops and sustainable yields.
          </p>

          <div className="animate-fade-in-up stagger-3" style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <Link to="/products" className="btn btn-primary btn-lg" style={{ borderRadius: "12px" }}>
              Explore Products <ArrowRight size={18} />
            </Link>
            <Link to="/products?filter=new" className="btn btn-outline btn-lg" style={{ borderRadius: "12px" }}>
              New Launches
            </Link>
          </div>

          {/* Stats */}
          <div className="animate-fade-in-up stagger-4" style={{
            display: "flex",
            gap: "3rem",
            marginTop: "4rem",
            flexWrap: "wrap",
          }}>
            {[
              { value: "19+", label: "Products" },
              { value: "4", label: "Categories" },
              { value: "100%", label: "Science-Backed" },
            ].map((stat) => (
              <div key={stat.label}>
                <div style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "2.5rem",
                  fontWeight: 800,
                  color: "var(--color-primary)",
                  lineHeight: 1,
                }}>
                  {stat.value}
                </div>
                <div style={{
                  fontSize: "0.8125rem",
                  color: "var(--color-text-muted)",
                  marginTop: "0.25rem",
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                  fontWeight: 500,
                }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div style={{
        position: "absolute",
        bottom: "2rem",
        left: "50%",
        transform: "translateX(-50%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "0.5rem",
        color: "var(--color-text-muted)",
        animation: "float 3s ease-in-out infinite",
      }}>
        <div style={{
          width: "24px",
          height: "40px",
          border: "2px solid var(--color-text-muted)",
          borderRadius: "12px",
          position: "relative",
        }}>
          <div style={{
            position: "absolute",
            top: "8px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "4px",
            height: "8px",
            borderRadius: "2px",
            background: "var(--color-text-muted)",
            animation: "float 1.5s ease-in-out infinite",
          }} />
        </div>
      </div>
    </section>
  );
}
