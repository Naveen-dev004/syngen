import { Link, useLocation } from "react-router-dom";
import {
  Leaf,
  Mail,
  Phone,
  MapPin,
  ArrowRight,
} from "lucide-react";

export default function Footer() {
  const location = useLocation();

  // ============================================================
  // DO NOT SHOW FOOTER ON ADMIN PANEL
  // ============================================================

  if (location.pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <footer
      style={{
        background: "var(--color-primary-dark)",
        color: "rgba(255,255,255,0.8)",
        paddingTop: "5rem",
        paddingBottom: "2rem",
      }}
    >
      <div className="container">

        {/* ======================================================
            CTA SECTION
        ====================================================== */}

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "3rem",
            borderRadius: "var(--radius-xl)",
            background:
              "linear-gradient(135deg, var(--color-primary), var(--color-primary-light))",
            marginBottom: "4rem",
            flexWrap: "wrap",
            gap: "2rem",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Decorative circle */}

          <div
            style={{
              position: "absolute",
              top: "-50%",
              right: "-10%",
              width: "400px",
              height: "400px",
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(74,139,111,0.3), transparent 70%)",
            }}
          />

          {/* CTA Content */}

          <div
            style={{
              position: "relative",
              zIndex: 1,
            }}
          >
            <h2
              style={{
                color: "white",
                fontSize: "clamp(1.5rem, 3vw, 2.25rem)",
                marginBottom: "0.75rem",
              }}
            >
              Ready to transform your farm?
            </h2>

            <p
              style={{
                color: "rgba(255,255,255,0.8)",
                fontSize: "1.0625rem",
                maxWidth: "500px",
              }}
            >
              Explore our premium range of agricultural products and start
              growing better today.
            </p>
          </div>

          {/* CTA Button */}

          <Link
            to="/products"
            className="btn btn-accent btn-lg"
            style={{
              position: "relative",
              zIndex: 1,
              borderRadius: "12px",
            }}
          >
            Browse Products
            <ArrowRight size={18} />
          </Link>
        </div>

        {/* ======================================================
            FOOTER COLUMNS
        ====================================================== */}

        <div
          className="footer-columns"
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr 1fr",
            gap: "3rem",
            marginBottom: "3rem",
          }}
        >

          {/* ====================================================
              BRAND
          ==================================================== */}

          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.625rem",
                marginBottom: "1.5rem",
              }}
            >
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "10px",
                  background:
                    "linear-gradient(135deg, var(--color-accent), var(--color-accent-light))",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                }}
              >
                <Leaf size={22} strokeWidth={2.5} />
              </div>

              <div>
                <div
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontWeight: 800,
                    fontSize: "1.125rem",
                    color: "white",
                    lineHeight: 1,
                  }}
                >
                  SYNGEn
                </div>

                <div
                  style={{
                    fontSize: "0.625rem",
                    fontWeight: 600,
                    letterSpacing: "0.15em",
                    color: "var(--color-accent-light)",
                    textTransform: "uppercase",
                  }}
                >
                  GREEN ARCHITECH
                </div>
              </div>
            </div>

            <p
              style={{
                fontSize: "0.9375rem",
                lineHeight: 1.7,
                maxWidth: "350px",
                marginBottom: "1.5rem",
              }}
            >
              Premium agricultural solutions engineered for the modern farm.
              Science-backed products for healthier crops and sustainable
              yields.
            </p>
          </div>

          {/* ====================================================
              PRODUCTS
          ==================================================== */}

          <div>
            <h4
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "0.8125rem",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "white",
                marginBottom: "1.25rem",
              }}
            >
              Products
            </h4>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
              }}
            >
              {[
                "Herbicides",
                "Fungicides",
                "Pesticides",
                "Fertilizer",
              ].map((cat) => (
                <Link
                  key={cat}
                  to="/products"
                  style={{
                    fontSize: "0.9375rem",
                    color: "rgba(255,255,255,0.7)",
                    transition: "color 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "white";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color =
                      "rgba(255,255,255,0.7)";
                  }}
                >
                  {cat}
                </Link>
              ))}
            </div>
          </div>

          {/* ====================================================
              COMPANY
          ==================================================== */}

          <div>
            <h4
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "0.8125rem",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "white",
                marginBottom: "1.25rem",
              }}
            >
              Company
            </h4>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
              }}
            >
              <Link
                to="/"
                className="footer-link"
              >
                Home
              </Link>

              <Link
                to="/products"
                className="footer-link"
              >
                Products
              </Link>

              <Link
                to="/account"
                className="footer-link"
              >
                Account
              </Link>

              <Link
                to="/orders"
                className="footer-link"
              >
                Orders
              </Link>
            </div>
          </div>

          {/* ====================================================
              CONTACT
          ==================================================== */}

          <div>
            <h4
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "0.8125rem",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "white",
                marginBottom: "1.25rem",
              }}
            >
              Contact
            </h4>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.875rem",
              }}
            >

              {/* Email */}

              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "0.625rem",
                }}
              >
                <Mail
                  size={16}
                  style={{
                    color: "var(--color-accent-light)",
                    marginTop: "2px",
                    flexShrink: 0,
                  }}
                />

                <span
                  style={{
                    fontSize: "0.9375rem",
                    color: "rgba(255,255,255,0.7)",
                  }}
                >
                  syngengreenagri@rediffmail.com
                </span>
              </div>

              {/* Phone */}

              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "0.625rem",
                }}
              >
                <Phone
                  size={16}
                  style={{
                    color: "var(--color-accent-light)",
                    marginTop: "2px",
                    flexShrink: 0,
                  }}
                />

                <span
                  style={{
                    fontSize: "0.9375rem",
                    color: "rgba(255,255,255,0.7)",
                  }}
                >
                  +91 98765 43210
                </span>
              </div>

              {/* Location */}

              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "0.625rem",
                }}
              >
                <MapPin
                  size={16}
                  style={{
                    color: "var(--color-accent-light)",
                    marginTop: "2px",
                    flexShrink: 0,
                  }}
                />

                <span
                  style={{
                    fontSize: "0.9375rem",
                    color: "rgba(255,255,255,0.7)",
                  }}
                >
                  India
                </span>
              </div>

            </div>
          </div>
        </div>

        {/* ======================================================
            BOTTOM BAR
        ====================================================== */}

        <div
          style={{
            paddingTop: "2rem",
            borderTop: "1px solid rgba(255,255,255,0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <p
            style={{
              fontSize: "0.875rem",
              color: "rgba(255,255,255,0.5)",
            }}
          >
            © {new Date().getFullYear()} SYNGEn GREEN ARCHITECH.
            All rights reserved.
          </p>

          <p
            style={{
              fontSize: "0.875rem",
              color: "rgba(255,255,255,0.5)",
            }}
          >
            Engineered for sustainable agriculture.
          </p>
        </div>
      </div>

      {/* ========================================================
          FOOTER STYLES
      ======================================================== */}

      <style>{`
        .footer-link {
          font-size: 0.9375rem;
          color: rgba(255,255,255,0.7);
          transition: color 0.2s ease;
        }

        .footer-link:hover {
          color: white;
        }

        @media (max-width: 900px) {
          .footer-columns {
            grid-template-columns: 1fr 1fr !important;
          }
        }

        @media (max-width: 768px) {
          .footer-columns {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
          }
        }

        @media (max-width: 600px) {
          footer {
            padding-top: 3rem !important;
          }

          footer .container > div:first-child {
            padding: 2rem !important;
          }
        }
      `}</style>
    </footer>
  );
}