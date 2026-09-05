import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Sparkles, Clock, ArrowRight } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function NewProducts() {
  const [newProducts, setNewProducts] = useState([]);
  const [upcomingProducts, setUpcomingProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Supabase stores the uploaded image filename/path in `image`.
  // Convert it into a public URL for the Home page.
  const getImageUrl = (product) => {
    if (!product) return "";

    if (product.image_url && String(product.image_url).startsWith("http")) {
      return product.image_url;
    }

    if (product.image && String(product.image).startsWith("http")) {
      return product.image;
    }

    const fileName = product.image || product.image_file;

    if (!fileName) return "";

    const { data } = supabase.storage
      .from("product-images")
      .getPublicUrl(fileName);

    return data?.publicUrl || "";
  };

  useEffect(() => {
    const fetchNewAndUpcoming = async () => {
      setLoading(true);

      try {
        const [newResult, upcomingResult] = await Promise.all([
          supabase
            .from("products")
            .select("*")
            .eq("is_new", true)
            .order("created_at", { ascending: false }),

          supabase
            .from("products")
            .select("*")
            .eq("is_upcoming", true)
            .order("created_at", { ascending: false }),
        ]);

        if (newResult.error) {
          console.error("New products error:", newResult.error);
        }

        if (upcomingResult.error) {
          console.error("Upcoming products error:", upcomingResult.error);
        }

        const normalizedNewProducts = (newResult.data || []).map((product) => ({
          ...product,
          image_url: getImageUrl(product),
        }));

        const normalizedUpcomingProducts = (upcomingResult.data || []).map(
          (product) => ({
            ...product,
            image_url: getImageUrl(product),
          })
        );

        setNewProducts(normalizedNewProducts);
        setUpcomingProducts(normalizedUpcomingProducts);
      } catch (error) {
        console.error("Products fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNewAndUpcoming();

    // Keep Home in sync immediately after an Admin product is added/edited.
    const channel = supabase
      .channel("home-products-live")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "products" },
        () => {
          fetchNewAndUpcoming();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  /* ---------------- UI ---------------- */

  if (loading) {
    return (
      <section
        style={{
          padding: "5rem 0",
          background: "linear-gradient(180deg, #f7faf8 0%, #ffffff 100%)",
        }}
      >
        <div className="container">
          <div
            style={{
              width: "180px",
              height: "18px",
              background: "#e5ebe8",
              borderRadius: "20px",
              margin: "0 auto 1rem",
            }}
          />
          <div
            style={{
              width: "420px",
              maxWidth: "90%",
              height: "45px",
              background: "#e5ebe8",
              borderRadius: "10px",
              margin: "0 auto 2.5rem",
            }}
          />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
              gap: "2rem",
            }}
          >
            {[1, 2].map((item) => (
              <div
                key={item}
                style={{
                  height: "430px",
                  background: "#edf2ef",
                  borderRadius: "28px",
                }}
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  const hasNew = newProducts.length > 0;
  const hasUpcoming = upcomingProducts.length > 0;

  if (!hasNew && !hasUpcoming) return null;

  const renderNewCard = (product, index) => (
    <Link
      key={`new-${product.id}`}
      to={`/products/${product.id}`}
      className="home-product-card"
      style={{
        textDecoration: "none",
        color: "inherit",
        display: "flex",
        flexDirection: "column",
        background: "#ffffff",
        border: "1px solid rgba(27,72,55,0.09)",
        borderRadius: "22px",
        overflow: "hidden",
        boxShadow: "0 12px 30px rgba(27,72,55,0.07)",
        animation: `fadeInUp 0.6s ease ${index * 0.1}s both`,
      }}
    >
      <div
        style={{
          position: "relative",
          height: "220px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "1.25rem",
          background: "linear-gradient(135deg, #f4f8f5, #edf4f0)",
        }}
      >
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
            }}
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        ) : (
          <div className="product-placeholder">
            <Sparkles size={32} />
          </div>
        )}

        <span className="new-badge">
          <Sparkles size={12} />
          New Product
        </span>
      </div>

      <div
        style={{
          padding: "1.25rem",
          display: "flex",
          flexDirection: "column",
          flex: 1,
        }}
      >
        <div className="product-category">
          {product.category || "Agricultural Solution"}
        </div>

        <h3
          style={{
            fontSize: "1.12rem",
            fontWeight: 800,
            color: "var(--color-primary)",
            margin: "0 0 0.9rem",
          }}
        >
          {product.name}
        </h3>

        <div className="explore-link">
          Explore Product <ArrowRight size={16} />
        </div>
      </div>
    </Link>
  );

  const renderUpcomingCard = (product, index) => (
    <Link
      key={`upcoming-${product.id}`}
      to={`/products/${product.id}`}
      className="home-product-card upcoming-card"
      style={{
        textDecoration: "none",
        color: "inherit",
        display: "flex",
        flexDirection: "column",
        background: "rgba(255,255,255,0.95)",
        border: "1px solid rgba(190,154,72,0.22)",
        borderRadius: "22px",
        overflow: "hidden",
        boxShadow: "0 12px 30px rgba(27,72,55,0.07)",
        animation: `fadeInUp 0.6s ease ${index * 0.1}s both`,
      }}
    >
      <div
        style={{
          position: "relative",
          height: "220px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "1.25rem",
          background: "linear-gradient(135deg, #fbfcf8, #fffaf0)",
        }}
      >
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              filter: "drop-shadow(0 12px 18px rgba(27,72,55,0.12))",
              animation: "productFloat 3.5s ease-in-out infinite",
            }}
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        ) : (
          <div className="product-placeholder upcoming-placeholder">
            <span>🌱</span>
          </div>
        )}

        <span className="upcoming-badge">
          <Clock size={12} />
          Upcoming Product
        </span>
      </div>

      <div
        style={{
          padding: "1.25rem",
          display: "flex",
          flexDirection: "column",
          flex: 1,
        }}
      >
        <div className="upcoming-category">
          {product.category || "Agricultural Solution"}
        </div>

        <h3
          style={{
            fontSize: "1.12rem",
            fontWeight: 800,
            color: "#274f3d",
            margin: "0 0 0.9rem",
          }}
        >
          {product.name}
        </h3>

        <div className="explore-upcoming">
          Preparing for launch <span>🚀</span>
        </div>
      </div>
    </Link>
  );

  return (
    <section
      className="new-upcoming-section"
      style={{
        position: "relative",
        overflow: "hidden",
        padding: "5rem 0 5.5rem",
        background:
          "linear-gradient(180deg, #f5faf7 0%, #ffffff 100%)",
      }}
    >
      <div className="new-upcoming-glow glow-right" />
      <div className="new-upcoming-glow glow-left" />

      <div
        className="container new-upcoming-container"
        style={{
          position: "relative",
          zIndex: 2,
        }}
      >
        {/* ONE COMMON SECTION HEADER */}
        <div
          style={{
            textAlign: "center",
            marginBottom: "3rem",
          }}
        >
          <div className="combined-pill">
            <Sparkles size={15} />
            New & Upcoming
            <Sparkles size={15} />
          </div>

          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(2rem, 4vw, 3.5rem)",
              lineHeight: 1.1,
              fontWeight: 700,
              color: "var(--color-primary)",
              margin: 0,
            }}
          >
            Latest Products
          </h2>

          <p
            style={{
              maxWidth: "650px",
              margin: "1rem auto 0",
              fontSize: "1.05rem",
              lineHeight: 1.7,
              color: "var(--color-text-muted)",
            }}
          >
            Discover our newest agricultural solutions and products
            coming soon to your farm.
          </p>
        </div>

        {/* BOTH GROUPS SIDE BY SIDE */}
        <div className="new-upcoming-columns">
          {/* NEW PRODUCTS */}
          {hasNew && (
            <div className="product-group new-group">
              <div className="group-header">
                <div>
                  <div className="group-label new-label">
                    <Sparkles size={14} />
                    New Products
                  </div>
                  <h3>New Arrivals</h3>
                  <p>Recently launched products</p>
                </div>

                <Link
                  to="/products?filter=new"
                  className="group-view-link"
                >
                  View All <ArrowRight size={15} />
                </Link>
              </div>

              <div className="group-products">
                {newProducts.map(renderNewCard)}
              </div>
            </div>
          )}

          {/* UPCOMING PRODUCTS */}
          {hasUpcoming && (
            <div className="product-group upcoming-group">
              <div className="upcoming-decoration" aria-hidden="true">
                {["✦", "✧", "✦", "✧"].map((s, i) => (
                  <span key={i} style={{ "--n": i }}>
                    {s}
                  </span>
                ))}
              </div>

              <div className="group-header">
                <div>
                  <div className="group-label upcoming-label">
                    <Clock size={14} />
                    Upcoming Products
                  </div>
                  <h3>Coming Soon</h3>
                  <p>Products preparing for launch</p>
                </div>

                <Link
                  to="/products?filter=upcoming"
                  className="group-view-link upcoming-view-link"
                >
                  View All <ArrowRight size={15} />
                </Link>
              </div>

              <div className="group-products">
                {upcomingProducts.map(renderUpcomingCard)}
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .new-upcoming-section {
          isolation: isolate;
        }

        .new-upcoming-glow {
          position: absolute;
          width: 500px;
          height: 500px;
          border-radius: 50%;
          pointer-events: none;
          z-index: 0;
        }

        .glow-right {
          top: -220px;
          right: -180px;
          background: radial-gradient(
            circle,
            rgba(72,145,112,0.13),
            transparent 70%
          );
        }

        .glow-left {
          bottom: -260px;
          left: -200px;
          background: radial-gradient(
            circle,
            rgba(27,72,55,0.08),
            transparent 70%
          );
        }

        .new-upcoming-columns {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
          gap: 2rem;
          align-items: start;
        }

        .product-group {
          position: relative;
          min-width: 0;
          padding: 1.75rem;
          border-radius: 30px;
          background: rgba(255,255,255,0.9);
          border: 1px solid rgba(27,72,55,0.08);
          box-shadow: 0 18px 45px rgba(27,72,55,0.08);
          overflow: hidden;
        }

        .new-group {
          background: linear-gradient(
            145deg,
            rgba(255,255,255,0.98),
            rgba(244,250,246,0.95)
          );
        }

        .upcoming-group {
          background: linear-gradient(
            145deg,
            #fffdf5,
            #fff8df 55%,
            #f7fbf8
          );
          border-color: rgba(190,154,72,0.22);
        }

        .group-header {
          position: relative;
          z-index: 3;
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .group-label {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.42rem 0.75rem;
          border-radius: 100px;
          font-size: 0.68rem;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin-bottom: 0.7rem;
        }

        .new-label {
          color: #166534;
          background: #dcfce7;
        }

        .upcoming-label {
          color: #805b0e;
          background: #fff0bd;
        }

        .group-header h3 {
          margin: 0;
          color: var(--color-primary);
          font-family: "Playfair Display", serif;
          font-size: clamp(1.55rem, 2.5vw, 2.15rem);
          line-height: 1.1;
        }

        .group-header p {
          margin: 0.45rem 0 0;
          color: var(--color-text-muted);
          font-size: 0.85rem;
        }

        .group-view-link {
          flex-shrink: 0;
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          color: var(--color-accent);
          font-size: 0.75rem;
          font-weight: 800;
          text-decoration: none;
          padding-top: 0.65rem;
        }

        .upcoming-view-link {
          color: #9a751d;
        }

        .group-products {
          display: grid;
          grid-template-columns: repeat(
            auto-fit,
            minmax(190px, 1fr)
          );
          gap: 1rem;
          position: relative;
          z-index: 3;
        }

        .home-product-card {
          min-width: 0;
          transition:
            transform 0.3s ease,
            box-shadow 0.3s ease;
        }

        .home-product-card:hover {
          transform: translateY(-7px);
          box-shadow: 0 22px 45px rgba(27,72,55,0.14) !important;
        }

        .new-badge,
        .upcoming-badge {
          position: absolute;
          top: 0.8rem;
          left: 0.8rem;
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          padding: 0.42rem 0.68rem;
          border-radius: 100px;
          font-size: 0.65rem;
          font-weight: 800;
          z-index: 2;
        }

        .new-badge {
          color: #166534;
          background: #dcfce7;
        }

        .upcoming-badge {
          color: #805b0e;
          background: linear-gradient(135deg, #fff0bd, #fef3c7);
          animation: upcomingBadgePulse 2.5s ease-in-out infinite;
        }

        .product-placeholder {
          width: 76px;
          height: 76px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #dcfce7;
          color: #27805f;
        }

        .upcoming-placeholder {
          background: #eef7f1;
          font-size: 2.6rem;
        }

        .product-category,
        .upcoming-category {
          font-size: 0.65rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-bottom: 0.45rem;
        }

        .product-category {
          color: var(--color-accent);
        }

        .upcoming-category {
          color: #a16207;
        }

        .explore-link,
        .explore-upcoming {
          margin-top: auto;
          display: flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.78rem;
          font-weight: 800;
        }

        .explore-link {
          color: var(--color-accent);
        }

        .explore-upcoming {
          color: #9a751d;
          justify-content: space-between;
        }

        .explore-upcoming span {
          animation: rocketFloat 1.8s ease-in-out infinite;
        }

        .upcoming-decoration {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 1;
        }

        .upcoming-decoration span {
          position: absolute;
          color: rgba(190,154,72,0.35);
          font-size: 1.2rem;
          animation: sparkleFloat 2.8s ease-in-out infinite;
        }

        .upcoming-decoration span:nth-child(1) {
          top: 10%;
          right: 12%;
        }

        .upcoming-decoration span:nth-child(2) {
          top: 34%;
          right: 4%;
          animation-delay: 0.6s;
        }

        .upcoming-decoration span:nth-child(3) {
          bottom: 12%;
          left: 5%;
          animation-delay: 1s;
        }

        .upcoming-decoration span:nth-child(4) {
          bottom: 30%;
          right: 7%;
          animation-delay: 1.4s;
        }

        .combined-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          border-radius: 100px;
          background: linear-gradient(135deg, #dcfce7, #fff0bd);
          color: #32634d;
          font-size: 0.75rem;
          font-weight: 800;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          margin-bottom: 1rem;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(25px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes productFloat {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-7px);
          }
        }

        @keyframes upcomingBadgePulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.04);
          }
        }

        @keyframes rocketFloat {
          0%, 100% {
            transform: translateY(0) rotate(0);
          }
          50% {
            transform: translateY(-3px) rotate(-7deg);
          }
        }

        @keyframes sparkleFloat {
          0%, 100% {
            opacity: 0.25;
            transform: translateY(0) rotate(0);
          }
          50% {
            opacity: 0.9;
            transform: translateY(-8px) rotate(15deg);
          }
        }

        @media (max-width: 900px) {
          .new-upcoming-columns {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 600px) {
          .product-group {
            padding: 1.2rem;
            border-radius: 24px;
          }

          .group-header {
            flex-direction: column;
          }

          .group-view-link {
            padding-top: 0;
          }

          .group-products {
            grid-template-columns: 1fr;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .new-upcoming-section *,
          .new-upcoming-section *::before,
          .new-upcoming-section *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </section>
  );
}
