import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";

export default function Hero() {
  return (
    <section
      style={{
        position: "relative",
        minHeight: "calc(100vh - 76px)",
        overflow: "hidden",
        background: "#123d2e",
      }}
    >
      {/* Background image */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "url(/outside.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      {/* Green fade: dark enough for text on right, image remains visible on left */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(270deg, rgba(7, 52, 38, 0.92) 0%, rgba(7, 52, 38, 0.8) 30%, rgba(7, 52, 38, 0.42) 56%, rgba(7, 52, 38, 0.08) 78%, rgba(7, 52, 38, 0.02) 100%)",
        }}
      />

      {/* Content on the right */}
      <div
        className="hero-content"
        style={{
          position: "absolute",
          zIndex: 2,
          top: "50%",
          right: "clamp(1.5rem, 7vw, 8rem)",
          transform: "translateY(-50%)",
          width: "min(560px, 40vw)",
          textAlign: "left",
        }}
      >
        {/* Badge */}
        <div
          className="animate-fade-in-up"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.55rem 1rem",
            marginBottom: "1.4rem",
            border: "1px solid rgba(214, 246, 225, 0.32)",
            borderRadius: "999px",
            background: "rgba(214, 246, 225, 0.1)",
          }}
        >
          <Sparkles size={14} color="#a7efc2" />

          <span
            style={{
              color: "#e1f8e9",
              fontSize: "0.7rem",
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            Agricultural Innovation
          </span>
        </div>

        {/* Heading */}
        <h1
          className="animate-fade-in-up stagger-1"
          style={{
            margin: "0 0 1.4rem",
            color: "#ffffff",
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(3rem, 4.6vw, 5.2rem)",
            fontWeight: 800,
            lineHeight: 1.02,
            letterSpacing: "-0.045em",
            textShadow: "0 3px 18px rgba(0, 0, 0, 0.2)",
          }}
        >
          Growing better.
          <br />
          <span style={{ color: "#9ee6bd" }}>Building smarter.</span>
        </h1>

        {/* Description */}
        <p
          className="animate-fade-in-up stagger-2"
          style={{
            margin: "0 0 2rem",
            color: "rgba(255, 255, 255, 0.9)",
            fontFamily: "'Inter', sans-serif",
            fontSize: "clamp(1rem, 1.35vw, 1.16rem)",
            lineHeight: 1.65,
          }}
        >
          Premium agricultural solutions engineered for the modern farm. From
          herbicides to fertilizers, we deliver science-backed products that
          cultivate healthier crops and sustainable yields.
        </p>

        {/* Button */}
        <div className="animate-fade-in-up stagger-3">
          <Link
            to="/products"
            className="btn btn-primary btn-lg"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.65rem",
              borderRadius: "12px",
              boxShadow: "0 12px 28px rgba(0, 0, 0, 0.2)",
            }}
          >
            Explore Products
            <ArrowRight size={18} />
          </Link>
        </div>

        {/* Stats */}
        <div
          className="animate-fade-in-up stagger-4"
          style={{
            display: "flex",
            gap: "clamp(1.25rem, 3vw, 2.75rem)",
            flexWrap: "wrap",
            marginTop: "2.5rem",
            paddingTop: "1.35rem",
            borderTop: "1px solid rgba(255, 255, 255, 0.22)",
          }}
        >
          {[
            { value: "69+", label: "Products" },
            { value: "4", label: "Categories" },
            { value: "100%", label: "Science-Backed" },
          ].map((stat) => (
            <div key={stat.label}>
              <div
                style={{
                  color: "#ffffff",
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "2rem",
                  fontWeight: 800,
                  lineHeight: 1,
                }}
              >
                {stat.value}
              </div>

              <div
                style={{
                  marginTop: "0.4rem",
                  color: "rgba(255, 255, 255, 0.72)",
                  fontSize: "0.68rem",
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        style={{
          position: "absolute",
          zIndex: 2,
          bottom: "1.75rem",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "0.5rem",
        }}
      >
        <div
          style={{
            position: "relative",
            width: "22px",
            height: "36px",
            border: "2px solid rgba(255, 255, 255, 0.7)",
            borderRadius: "12px",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "7px",
              left: "50%",
              transform: "translateX(-50%)",
              width: "4px",
              height: "7px",
              borderRadius: "2px",
              background: "#ffffff",
            }}
          />
        </div>
      </div>

      <style>
        {`
          @media (max-width: 900px) {
            .hero-content {
              right: 1.5rem !important;
              left: 1.5rem !important;
              width: auto !important;
            }
          }

          @media (max-width: 560px) {
            .hero-content {
              top: 52% !important;
            }
          }
        `}
      </style>
    </section>
  );
}