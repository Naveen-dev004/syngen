import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
  ShoppingCart,
  Package,
  Check,
  X,
  Info,
} from "lucide-react";

import { useCart } from "@/context/CartContext";
import { supabase } from "@/lib/supabase";

const BUCKET_NAME = "product-images";

/* =========================================================
   CREATE SUPABASE IMAGE URL
========================================================= */

function createImageUrl(fileName) {
  if (!fileName) return null;

  const cleanName = String(fileName)
    .trim()
    .replace(/^\/+/, "");

  if (!cleanName) return null;

  const { data } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(cleanName);

  return data?.publicUrl || null;
}

/* =========================================================
   PRODUCT CARD
========================================================= */

export default function ProductCard({
  product,
  animationDelay = 0,
}) {
  const { addToCart } = useCart();

  const [added, setAdded] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [imageError, setImageError] = useState(false);

  /* =======================================================
     IMAGE
  ======================================================= */

  const imageUrl = product?.image
    ? createImageUrl(product.image)
    : product?.image_url
    ? createImageUrl(product.image_url)
    : null;

  /* =======================================================
     PRICE
  ======================================================= */

  const price = Number(product?.price || 0);

  /* =======================================================
     DEBUG
  ======================================================= */

  console.log("PRODUCT CARD DATA:", product);
  console.log(
    "PRODUCT IMAGE:",
    product?.name,
    product?.image,
    imageUrl
  );

  /* =======================================================
     ADD TO CART
  ======================================================= */

  const handleAddToCart = (event) => {
    if (event) {
      event.stopPropagation();
    }

    if (!product) return;

    // Only active products can be purchased.
    if (product.is_active !== true) {
      return;
    }

    addToCart({
      ...product,
      quantity: 1,
    });

    setAdded(true);

    setTimeout(() => {
      setAdded(false);
    }, 1500);
  };

  /* =======================================================
     OPEN POPUP
  ======================================================= */

  const handleOpenDetails = () => {
    console.log("OPENING PRODUCT:", product);
    setShowDetails(true);
  };

  /* =======================================================
     CLOSE POPUP
  ======================================================= */

  const handleCloseDetails = () => {
    setShowDetails(false);
  };

  /* =======================================================
     ESC KEY + BODY SCROLL
  ======================================================= */

  useEffect(() => {
    if (!showDetails) return;

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setShowDetails(false);
      }
    };

    document.addEventListener(
      "keydown",
      handleEscape
    );

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener(
        "keydown",
        handleEscape
      );

      document.body.style.overflow =
        previousOverflow;
    };
  }, [showDetails]);

  /* =======================================================
     DETAILS DATA

     Your database currently uses use_description.
     We also check common dosage column names so the
     popup works if you have added one.
  ======================================================= */

  const productDetails =
    product?.use_description ||
    product?.description ||
    product?.usage ||
    product?.use ||
    null;

  const dosage =
    product?.dosage ||
    product?.dose ||
    product?.dosage_description ||
    product?.application_dosage ||
    null;

  const technicalName =
    product?.technical_name ||
    product?.technicalName ||
    product?.active_ingredient ||
    null;

  /* =======================================================
     PRODUCT POPUP

     IMPORTANT:
     createPortal puts the popup directly under <body>.
     This prevents parent containers from hiding it.
  ======================================================= */

  const productPopup = showDetails
    ? createPortal(
        <div
          className="product-modal-overlay"
          onClick={handleCloseDetails}
        >
          <div
            className="product-modal"
            onClick={(event) => {
              event.stopPropagation();
            }}
          >
            {/* ============================================
                CLOSE BUTTON
            ============================================ */}

            <button
              type="button"
              className="product-modal-close"
              onClick={handleCloseDetails}
              aria-label="Close"
            >
              <X size={20} />
            </button>

            {/* ============================================
                TOP AREA
            ============================================ */}

            <div className="product-modal-top">
              {/* IMAGE */}

              <div className="product-modal-image">
                {!imageError && imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={
                      product?.name ||
                      "Product"
                    }
                    onError={() => {
                      console.error(
                        "POPUP IMAGE FAILED:",
                        imageUrl
                      );

                      setImageError(true);
                    }}
                  />
                ) : (
                  <div className="product-modal-no-image">
                    <Package size={40} />
                    <span>
                      Image unavailable
                    </span>
                  </div>
                )}
              </div>

              {/* BASIC INFO */}

              <div className="product-modal-info">
                <div className="product-modal-category">
                  {product?.category ||
                    "Agricultural Product"}
                </div>

                <h2 className="product-modal-title">
                  {product?.name ||
                    "Unnamed Product"}
                </h2>

                <div className="product-modal-price">
                  {price > 0
                    ? `₹${price.toLocaleString(
                        "en-IN"
                      )}`
                    : "Price on request"}
                </div>

                <button
                  type="button"
                  className="product-modal-cart"
                  onClick={handleAddToCart}
                  disabled={product?.is_active !== true}
                  style={{
                    opacity: product?.is_active === true ? 1 : 0.6,
                    cursor: product?.is_active === true ? "pointer" : "not-allowed",
                  }}
                >
                  {product?.is_active !== true ? (
                    <>
                      <Package size={18} />
                      Currently Unavailable
                    </>
                  ) : added ? (
                    <>
                      <Check size={18} />
                      Added to Cart
                    </>
                  ) : (
                    <>
                      <ShoppingCart size={18} />
                      Add to Cart
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* ============================================
                DETAILS
            ============================================ */}

            <div className="product-modal-details">
              <h3 className="product-modal-heading">
                <Info
                  size={20}
                  color="#28734f"
                />

                Product Details
              </h3>

              {/* USE / DETAILS */}

              <div className="detail-section">
                <div className="detail-label">
                  Use / Description
                </div>

                <div className="detail-value">
                  {productDetails ||
                    "Details not available yet."}
                </div>
              </div>

              {/* DOSAGE */}

              <div className="detail-section dosage-section">
                <div className="detail-label">
                  Dosage
                </div>

                <div className="detail-value">
                  {dosage ||
                    "Dosage information not available yet."}
                </div>
              </div>

              {/* TECHNICAL NAME */}

              {technicalName && (
                <div className="detail-section">
                  <div className="detail-label">
                    Technical Name
                  </div>

                  <div className="detail-value">
                    {technicalName}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>,
        document.body
      )
    : null;

  /* =======================================================
     CARD
  ======================================================= */

  return (
    <>
      {/* ===================================================
          CSS
      =================================================== */}

      <style>{`

        /* ================================================
           PRODUCT CARD
        ================================================ */

        .product-card {
          width: 280px;
          max-width: 280px;
          min-width: 280px;

          background: #ffffff;

          border: 1px solid #e5ebe7;
          border-radius: 16px;

          overflow: hidden;

          box-shadow:
            0 4px 15px rgba(0, 0, 0, 0.06);

          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease;

          animation:
            productCardFade
            0.4s ease
            forwards;

          opacity: 0;

          cursor: pointer;
        }

        .product-card:hover {
          transform: translateY(-3px);

          box-shadow:
            0 8px 22px rgba(0, 0, 0, 0.10);
        }

        @keyframes productCardFade {
          from {
            opacity: 0;
            transform: translateY(8px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* ================================================
           CARD IMAGE
        ================================================ */

        .product-card-image {
          width: 100%;
          height: 190px;

          background: #f7f9f7;

          display: flex;
          align-items: center;
          justify-content: center;

          overflow: hidden;
        }

        .product-card-image img {
          width: 165px;
          height: 165px;

          object-fit: contain;

          display: block;

          transition:
            transform 0.2s ease;
        }

        .product-card:hover
        .product-card-image img {
          transform: scale(1.02);
        }

        .product-card-no-image {
          width: 100%;
          height: 100%;

          display: flex;
          flex-direction: column;

          align-items: center;
          justify-content: center;

          gap: 7px;

          color: #8a958f;

          font-size: 12px;
        }

        /* ================================================
           CARD CONTENT
        ================================================ */

        .product-card-content {
          padding: 15px;
        }

        .product-card-category {
          font-size: 11px;

          font-weight: 700;

          letter-spacing: 0.6px;

          text-transform: uppercase;

          color: #28734f;

          margin-bottom: 6px;
        }

        .product-card-title {
          margin: 0;

          font-family:
            Georgia,
            "Times New Roman",
            serif;

          font-size: 20px;

          line-height: 1.2;

          color: #143d2d;

          font-weight: 700;
        }

        .product-card-description {
          margin: 7px 0 0;

          color: #68766f;

          font-size: 12px;

          line-height: 1.45;

          display: -webkit-box;

          -webkit-line-clamp: 2;

          -webkit-box-orient: vertical;

          overflow: hidden;
        }

        /* ================================================
           CARD FOOTER
        ================================================ */

        .product-card-footer {
          margin-top: 13px;
        }

        .product-card-price {
          color: #28734f;

          font-size: 17px;

          font-weight: 700;

          margin-bottom: 10px;
        }

        .price-on-request {
          font-size: 15px;
        }

        /* ================================================
           CART BUTTON
        ================================================ */

        .product-add-button {
          width: 100%;

          height: 40px;

          border: none;

          border-radius: 9px;

          background: #104b36;

          color: #ffffff;

          display: flex;

          align-items: center;

          justify-content: center;

          gap: 7px;

          font-size: 13px;

          font-weight: 700;

          cursor: pointer;
        }

        .product-add-button:hover {
          background: #0b3d2c;
        }

        .product-add-button.added {
          background: #28734f;
        }

        /* ================================================
           DETAILS BUTTON
        ================================================ */

        .product-details-link {
          margin-top: 9px;

          width: 100%;

          border: none;

          background: transparent;

          color: #28734f;

          font-size: 12px;

          font-weight: 700;

          cursor: pointer;
        }

        .product-details-link:hover {
          text-decoration: underline;
        }

        /* ================================================
           POPUP OVERLAY

           Because this is rendered into document.body,
           it will appear above the entire website.
        ================================================ */

        .product-modal-overlay {
          position: fixed;

          top: 0;
          left: 0;
          right: 0;
          bottom: 0;

          width: 100vw;
          height: 100vh;

          z-index: 2147483647;

          background:
            rgba(0, 0, 0, 0.60);

          display: flex;

          align-items: center;

          justify-content: center;

          padding: 18px;

          box-sizing: border-box;
        }

        /* ================================================
           POPUP
        ================================================ */

        .product-modal {
          position: relative;

          width: 760px;

          max-width: 94vw;

          max-height: 88vh;

          overflow-y: auto;

          background: #ffffff;

          border-radius: 18px;

          box-shadow:
            0 25px 70px
            rgba(0, 0, 0, 0.28);

          animation:
            productModalOpen
            0.2s ease;
        }

        @keyframes productModalOpen {
          from {
            opacity: 0;
            transform: scale(0.96);
          }

          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        /* ================================================
           CLOSE
        ================================================ */

        .product-modal-close {
          position: absolute;

          top: 12px;
          right: 12px;

          z-index: 20;

          width: 34px;
          height: 34px;

          border: none;

          border-radius: 50%;

          background: #f0f3f1;

          display: flex;

          align-items: center;
          justify-content: center;

          cursor: pointer;

          color: #233d31;
        }

        .product-modal-close:hover {
          background: #e4e9e6;
        }

        /* ================================================
           MODAL TOP
        ================================================ */

        .product-modal-top {
          display: grid;

          grid-template-columns:
            280px 1fr;

          gap: 28px;

          padding: 28px;
        }

        /* ================================================
           MODAL IMAGE
        ================================================ */

        .product-modal-image {
          width: 280px;

          height: 280px;

          background: #f7f9f7;

          border-radius: 14px;

          display: flex;

          align-items: center;
          justify-content: center;

          overflow: hidden;
        }

        .product-modal-image img {
          width: 235px;
          height: 235px;

          object-fit: contain;

          display: block;
        }

        .product-modal-no-image {
          display: flex;

          flex-direction: column;

          align-items: center;

          justify-content: center;

          gap: 8px;

          color: #8a958f;

          font-size: 13px;
        }

        /* ================================================
           MODAL INFO
        ================================================ */

        .product-modal-info {
          display: flex;

          flex-direction: column;

          justify-content: center;

          padding-right: 25px;
        }

        .product-modal-category {
          color: #28734f;

          font-size: 12px;

          font-weight: 700;

          text-transform: uppercase;

          letter-spacing: 0.6px;

          margin-bottom: 9px;
        }

        .product-modal-title {
          margin: 0 0 13px;

          color: #143d2d;

          font-family:
            Georgia,
            "Times New Roman",
            serif;

          font-size: 31px;

          line-height: 1.15;
        }

        .product-modal-price {
          color: #28734f;

          font-size: 21px;

          font-weight: 700;

          margin-bottom: 18px;
        }

        .product-modal-cart {
          width: 100%;

          max-width: 300px;

          height: 44px;

          border: none;

          border-radius: 9px;

          background: #104b36;

          color: #ffffff;

          display: flex;

          align-items: center;

          justify-content: center;

          gap: 8px;

          font-size: 13px;

          font-weight: 700;

          cursor: pointer;
        }

        .product-modal-cart:hover {
          background: #0b3d2c;
        }

        /* ================================================
           DETAILS AREA
        ================================================ */

        .product-modal-details {
          border-top:
            1px solid #e5e9e6;

          padding:
            21px 28px 27px;
        }

        .product-modal-heading {
          display: flex;

          align-items: center;

          gap: 8px;

          margin: 0 0 15px;

          color: #143d2d;

          font-family:
            Georgia,
            "Times New Roman",
            serif;

          font-size: 21px;
        }

        /* ================================================
           DETAIL SECTIONS
        ================================================ */

        .detail-section {
          margin-bottom: 12px;

          border-radius: 10px;

          background: #f7f9f7;

          padding: 13px 15px;
        }

        .detail-section:last-child {
          margin-bottom: 0;
        }

        .detail-label {
          color: #143d2d;

          font-size: 13px;

          font-weight: 700;

          margin-bottom: 5px;
        }

        .detail-value {
          color: #596760;

          font-size: 13px;

          line-height: 1.55;

          white-space: pre-line;
        }

        .dosage-section {
          background: #eef7f1;

          border-left:
            3px solid #28734f;
        }

        /* ================================================
           MOBILE
        ================================================ */

        @media (max-width: 700px) {

          .product-card {
            width: 260px;
            max-width: 260px;
            min-width: 260px;
          }

          .product-card-image {
            height: 175px;
          }

          .product-card-image img {
            width: 150px;
            height: 150px;
          }

          .product-modal-overlay {
            padding: 10px;
          }

          .product-modal {
            max-width: 96vw;
            max-height: 92vh;
          }

          .product-modal-top {
            grid-template-columns: 1fr;

            padding: 20px;

            gap: 18px;
          }

          .product-modal-image {
            width: 100%;
            height: 220px;
          }

          .product-modal-image img {
            width: 185px;
            height: 185px;
          }

          .product-modal-info {
            padding: 0;
          }

          .product-modal-title {
            font-size: 26px;
          }

          .product-modal-cart {
            max-width: 100%;
          }

          .product-modal-details {
            padding: 18px 20px 22px;
          }
        }

        /* Product studio refresh */
        .product-card {
          width: 100%;
          max-width: none;
          min-width: 0;
          border: 1px solid #e0e6dd;
          border-radius: 20px;
          background: #fffefb;
          box-shadow: 0 10px 26px rgba(31, 63, 49, 0.06);
        }

        .product-card:hover {
          transform: translateY(-7px);
          border-color: #bdd4c2;
          box-shadow: 0 20px 38px rgba(24, 72, 52, 0.14);
        }

        .product-card-image {
          position: relative;
          height: 260px;
          background:
            radial-gradient(circle at 50% 12%, #f9fcf6 0%, #edf3e9 66%, #e3ece0 100%);
        }

        .product-card-image::after {
          position: absolute;
          right: 15px;
          bottom: 13px;
          width: 34px;
          height: 34px;
          border: 1px solid rgba(37, 91, 65, 0.17);
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.55);
          content: "";
        }

        .product-card-image img {
          position: relative;
          z-index: 1;
          width: 205px;
          height: 205px;
          filter: drop-shadow(0 15px 11px rgba(29, 65, 47, 0.16));
          transition: transform 0.35s ease;
        }

        .product-card:hover .product-card-image img {
          transform: translateY(-6px) scale(1.035);
        }

        .product-card-content {
          padding: 19px 20px 20px;
        }

        .product-card-category {
          display: inline-block;
          margin-bottom: 8px;
          padding: 0.3rem 0.52rem;
          border-radius: 999px;
          background: #e5f1e6;
          color: #317052;
          font-size: 0.62rem;
          letter-spacing: 0.08em;
        }

        .product-card-title {
          color: #173f30;
          font-size: 1.45rem;
          letter-spacing: -0.025em;
        }

        .product-card-description {
          min-height: 35px;
          color: #718078;
          font-size: 0.78rem;
          line-height: 1.5;
        }

        .product-card-footer {
          margin-top: 17px;
        }

        .product-card-price {
          color: #1b6247;
        }

        .product-add-button {
          height: 43px;
          border-radius: 10px;
          background: #174b39;
          transition: transform 0.2s ease, background 0.2s ease;
        }

        .product-add-button:hover {
          background: #0e3d2d;
          transform: translateY(-1px);
        }

        .product-details-link {
          margin-top: 10px;
          color: #3e775d;
        }

        @media (max-width: 700px) {
          .product-card {
            width: 100%;
            max-width: none;
            min-width: 0;
          }

          .product-card-image {
            height: 235px;
          }
        }

        /* Seed catalogue alternate design */
        .product-card {
          border-color: #dfe5dc;
          border-radius: 8px;
          background: #fffefb;
          box-shadow: none;
        }

        .product-card:hover {
          transform: translateY(-4px);
          border-color: #a6c5ac;
          box-shadow: 0 14px 27px rgba(32, 69, 50, 0.1);
        }

        .product-card-image {
          height: 280px;
          border-bottom: 1px solid #e1e7df;
          border-radius: 0;
          background:
            linear-gradient(145deg, #f7f8f3 0%, #edf1e9 100%);
        }

        .product-card-image::after {
          top: 14px;
          right: auto;
          bottom: auto;
          left: 14px;
          width: 28px;
          height: 28px;
          border-radius: 0;
          background: #ffffff;
          box-shadow: 3px 3px 0 #dfe9df;
        }

        .product-card-image img {
          width: 215px;
          height: 215px;
          filter: drop-shadow(0 13px 9px rgba(29, 65, 47, 0.12));
        }

        .product-card-content {
          padding: 18px 18px 19px;
        }

        .product-card-category {
          margin-bottom: 0.55rem;
          padding: 0;
          border-radius: 0;
          background: transparent;
          color: #4f8664;
          font-size: 0.64rem;
          letter-spacing: 0.12em;
        }

        .product-card-title {
          font-size: 1.38rem;
        }

        .product-card-description {
          min-height: 0;
          color: #79847d;
        }

        .product-card-footer {
          display: grid;
          grid-template-columns: 1fr auto;
          align-items: center;
          gap: 0.7rem;
          margin-top: 1.25rem;
          padding-top: 0.9rem;
          border-top: 1px solid #e4e9e2;
        }

        .product-card-price {
          margin-bottom: 0;
          font-size: 1rem;
        }

        .product-add-button {
          width: auto;
          height: 38px;
          padding: 0 0.85rem;
          border-radius: 5px;
          font-size: 0.72rem;
        }

        .product-details-link {
          grid-column: 1 / -1;
          margin-top: 0;
          padding-top: 0.1rem;
          text-align: left;
          font-size: 0.7rem;
        }

        @media (max-width: 700px) {
          .product-card-image {
            height: 245px;
          }
        }

        /* Botanical showcase alternate design */
        .product-card {
          overflow: hidden;
          border: 1px solid #e1e9e0;
          border-radius: 18px;
          background: #ffffff;
          box-shadow: 0 10px 24px rgba(25, 71, 51, 0.06);
        }

        .product-card:hover {
          transform: translateY(-6px);
          border-color: #bdd8c0;
          box-shadow: 0 19px 36px rgba(25, 71, 51, 0.13);
        }

        .product-card-image {
          height: 245px;
          background: #ffffff;
        }

        .product-card-image::after {
          display: none;
        }

        .product-card-image img {
          width: 190px;
          height: 190px;
          filter: drop-shadow(0 14px 10px rgba(30, 81, 54, 0.16));
        }

        .product-card-content {
          position: relative;
          padding: 19px 20px 20px;
        }

        .product-card-category {
          display: inline-block;
          margin-bottom: 0.7rem;
          padding: 0.28rem 0.58rem;
          border-radius: 999px;
          background: #e1f0e0;
          color: #337352;
          font-size: 0.62rem;
          letter-spacing: 0.1em;
        }

        .product-card-title {
          font-size: 1.5rem;
        }

        .product-card-description {
          min-height: 35px;
          color: #6f7f75;
        }

        .product-card-footer {
          display: block;
          margin-top: 1.25rem;
          padding: 0;
          border: 0;
        }

        .product-card-price {
          margin-bottom: 0.8rem;
          color: #206144;
        }

        .product-add-button {
          width: 100%;
          height: 42px;
          padding: 0;
          border-radius: 9px;
          background: #164936;
          font-size: 0.78rem;
        }

        .product-details-link {
          display: block;
          margin-top: 0.65rem;
          padding: 0;
          text-align: center;
          font-size: 0.72rem;
        }

        @media (max-width: 700px) {
          .product-card-image {
            height: 235px;
          }
        }
      `}</style>

      {/* ===================================================
          PRODUCT CARD
      =================================================== */}

      <article
        className="product-card"
        style={{
          animationDelay: `${animationDelay}ms`,
        }}
        onClick={handleOpenDetails}
      >
        {/* IMAGE */}

        <div className="product-card-image">
          {!imageError && imageUrl ? (
            <img
              src={imageUrl}
              alt={
                product?.name ||
                "Product"
              }
              loading="lazy"
              onError={() => {
                console.error(
                  "PRODUCT IMAGE FAILED:",
                  product?.name,
                  imageUrl
                );

                setImageError(true);
              }}
            />
          ) : (
            <div className="product-card-no-image">
              <Package size={32} />
              <span>
                Image unavailable
              </span>
            </div>
          )}
        </div>

        {/* CONTENT */}

        <div className="product-card-content">
          <div className="product-card-category">
            {product?.category ||
              "Agricultural Product"}
          </div>

          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "5px",
              marginLeft: "8px",
              padding: "3px 8px",
              borderRadius: "999px",
              background:
                product?.is_active === true ? "#e7f5eb" : "#f1f1ef",
              color:
                product?.is_active === true ? "#28734f" : "#777f79",
              fontSize: "10px",
              fontWeight: 700,
              letterSpacing: "0.04em",
              verticalAlign: "middle",
            }}
          >
            <span
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background:
                  product?.is_active === true ? "#3f9b63" : "#9aa19c",
              }}
            />
            {product?.is_active === true
              ? "AVAILABLE"
              : "UNAVAILABLE"}
          </div>

          <h3 className="product-card-title">
            {product?.name ||
              "Unnamed Product"}
          </h3>

          {product?.use_description && (
            <p className="product-card-description">
              {product.use_description}
            </p>
          )}

          <div className="product-card-footer">
            {/* PRICE */}

            <div className="product-card-price">
              {price > 0 ? (
                <>
                  ₹
                  {price.toLocaleString(
                    "en-IN"
                  )}
                </>
              ) : (
                <span className="price-on-request">
                  Price on request
                </span>
              )}
            </div>

            {/* CART */}

            <button
              type="button"
              className={`product-add-button ${
                added ? "added" : ""
              }`}
              onClick={handleAddToCart}
              disabled={product?.is_active !== true}
              style={{
                opacity: product?.is_active === true ? 1 : 0.55,
                cursor: product?.is_active === true ? "pointer" : "not-allowed",
              }}
            >
              {product?.is_active !== true ? (
                <>
                  <Package size={15} />
                  Unavailable
                </>
              ) : added ? (
                <>
                  <Check size={15} />
                  Added
                </>
              ) : (
                <>
                  <ShoppingCart size={15} />
                  Add to cart
                </>
              )}
            </button>

            {/* DETAILS */}

            <button
              type="button"
              className="product-details-link"
              onClick={(event) => {
                event.stopPropagation();
                handleOpenDetails();
              }}
            >
              View details & dosage
            </button>
          </div>
        </div>
      </article>

      {/* ===================================================
          POPUP
      =================================================== */}

      {productPopup}
    </>
  );
}
