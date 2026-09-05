import {
  Fragment,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  Search,
  SlidersHorizontal,
  RefreshCw,
  Package,
  X,
} from "lucide-react";

import { supabase } from "@/lib/supabase";
import ProductCard from "@/components/ProductCard";

const BUCKET_NAME = "product-images";
const PRODUCTS_PER_PAGE = 8;

/* =========================================================
   HELPERS
========================================================= */

function normalizeName(value) {
  return String(value || "")
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase();
}

function removeExtension(value) {
  return String(value || "")
    .replace(/\.(jpeg|jpg|png|webp)$/i, "")
    .trim();
}

function createStorageUrl(fileName) {
  if (!fileName) {
    return null;
  }

  const cleanName = String(fileName)
    .trim()
    .replace(/^\/+/, "");

  const { data } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(cleanName);

  return data?.publicUrl || null;
}

/* =========================================================
   CATEGORY NORMALIZATION
========================================================= */

function normalizeCategory(category) {
  const value = String(category || "")
    .trim()
    .toLowerCase();

  if (
    value.includes("herbicide") ||
    value.includes("herbicides")
  ) {
    return "Herbicides";
  }

  if (
    value.includes("fungicide") ||
    value.includes("fungicides")
  ) {
    return "Fungicides";
  }

  if (
    value.includes("pesticide") ||
    value.includes("pesticides")
  ) {
    return "Pesticides";
  }

  if (
    value.includes("fertilizer") ||
    value.includes("fertiliser") ||
    value.includes("nutrient") ||
    value.includes("growth")
  ) {
    return "Fertilizer";
  }

  return category || "Other";
}

/* =========================================================
   SKELETON CARD
========================================================= */

function ProductSkeleton() {
  return (
    <div className="product-skeleton">
      <div className="skeleton-image" />

      <div className="skeleton-content">
        <div className="skeleton-small" />
        <div className="skeleton-title" />
        <div className="skeleton-button" />
      </div>
    </div>
  );
}

/* =========================================================
   PRODUCTS PAGE
========================================================= */

export default function Products() {
  const [products, setProducts] = useState([]);

  const [imageMap, setImageMap] = useState({});

  const [searchTerm, setSearchTerm] = useState("");

  const [selectedCategory, setSelectedCategory] =
    useState("All");

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [refreshing, setRefreshing] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);

  /* =======================================================
     LOAD PRODUCTS
  ======================================================= */

  const loadProducts = async () => {
    try {
      setError("");

      console.log("======================================");
      console.log("LOADING PRODUCTS");
      console.log("======================================");

      /*
        Important:

        We don't use:

        .limit(58)

        We retrieve all active products.
      */

      const {
        data,
        error: productsError,
      } = await supabase
        .from("products")
        .select("*")
        .eq("is_active", true)
        .order("id", {
          ascending: true,
        });

      if (productsError) {
        console.error(
          "SUPABASE PRODUCTS ERROR:",
          productsError
        );

        throw new Error(
          productsError.message ||
            "Unable to load products."
        );
      }

      console.log(
        "PRODUCTS FROM DATABASE:",
        data
      );

      console.log(
        "TOTAL PRODUCTS:",
        data?.length || 0
      );

      setProducts(data || []);

      /* =================================================
         LOAD STORAGE IMAGES
      ================================================= */

      console.log(
        "LOADING PRODUCT IMAGE FILES..."
      );

      const {
        data: files,
        error: filesError,
      } = await supabase.storage
        .from(BUCKET_NAME)
        .list("", {
          limit: 1000,
          offset: 0,
          sortBy: {
            column: "name",
            order: "asc",
          },
        });

      if (filesError) {
        console.warn(
          "SUPABASE STORAGE LIST ERROR:",
          filesError
        );

        /*
          Don't fail the entire products page
          just because image listing failed.
        */

        setImageMap({});
      } else {
        console.log(
          "PRODUCT IMAGE FILES:",
          files
        );

        const map = {};

        (files || []).forEach((file) => {
          if (!file?.name) {
            return;
          }

          const originalName = file.name;

          const withoutExtension =
            removeExtension(
              originalName
            );

          const normalized =
            normalizeName(
              withoutExtension
            );

          const url =
            createStorageUrl(
              originalName
            );

          if (normalized && url) {
            map[normalized] = url;
          }
        });

        console.log(
          "FINAL IMAGE MAP:",
          map
        );

        setImageMap(map);
      }
    } catch (err) {
      console.error(
        "PRODUCT PAGE ERROR:",
        err
      );

      setError(
        err?.message ||
          "Something went wrong while loading products."
      );

      setProducts([]);
    } finally {
      /*
        THIS IS VERY IMPORTANT.

        Even if Supabase fails,
        the skeleton will disappear.
      */

      setLoading(false);
      setRefreshing(false);
    }
  };

  /* =======================================================
     INITIAL LOAD
  ======================================================= */

  useEffect(() => {
    loadProducts();
  }, []);

  /* =======================================================
     ADD IMAGE URL TO PRODUCTS
  ======================================================= */

  const productsWithImages = useMemo(() => {
    return products.map((product) => {
      /*
        If database already contains image_url,
        use it first.
      */

      if (
        product?.image_url &&
        !product.image_url.includes(
          "YOUR_PROJECT_ID"
        ) &&
        !product.image_url.includes(
          "your_project_id"
        )
      ) {
        return {
          ...product,
          image_url: product.image_url,
        };
      }

      /*
        Otherwise match Storage filename
        against product name.
      */

      const productName =
        normalizeName(
          product?.name
        );

      const imageUrl =
        imageMap[productName] ||
        null;

      return {
        ...product,
        image_url: imageUrl,
      };
    });
  }, [products, imageMap]);

  /* =======================================================
     CATEGORY LIST
  ======================================================= */

  const categories = useMemo(() => {
    const categorySet =
      new Set();

    productsWithImages.forEach(
      (product) => {
        const category =
          normalizeCategory(
            product?.category
          );

        if (category) {
          categorySet.add(
            category
          );
        }
      }
    );

    /*
      Keep the preferred order.
    */

    const preferredOrder = [
      "Herbicides",
      "Fungicides",
      "Pesticides",
      "Fertilizer",
      "Other",
    ];

    return preferredOrder.filter(
      (category) =>
        categorySet.has(category)
    );
  }, [productsWithImages]);

  /* =======================================================
     FILTER PRODUCTS
  ======================================================= */

  const filteredProducts = useMemo(() => {
    const search =
      searchTerm
        .trim()
        .toLowerCase();

    return productsWithImages.filter(
      (product) => {
        const name =
          String(
            product?.name || ""
          ).toLowerCase();

        const description =
          String(
            product?.description ||
              ""
          ).toLowerCase();

        const category =
          normalizeCategory(
            product?.category
          );

        const matchesSearch =
          !search ||
          name.includes(search) ||
          description.includes(
            search
          ) ||
          category
            .toLowerCase()
            .includes(search);

        const matchesCategory =
          selectedCategory ===
            "All" ||
          category ===
            selectedCategory;

        return (
          matchesSearch &&
          matchesCategory
        );
      }
    );
  }, [
    productsWithImages,
    searchTerm,
    selectedCategory,
  ]);

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredProducts.length /
        PRODUCTS_PER_PAGE
    )
  );

  const activePage = Math.min(
    currentPage,
    totalPages
  );

  const paginatedProducts = useMemo(() => {
    const startIndex =
      (activePage - 1) *
      PRODUCTS_PER_PAGE;

    return filteredProducts.slice(
      startIndex,
      startIndex + PRODUCTS_PER_PAGE
    );
  }, [filteredProducts, activePage]);

  const paginationPages = useMemo(() => {
    const pages = [
      1,
      activePage - 1,
      activePage,
      activePage + 1,
      totalPages,
    ].filter(
      (page) =>
        page >= 1 &&
        page <= totalPages
    );

    return [...new Set(pages)].sort(
      (first, second) => first - second
    );
  }, [activePage, totalPages]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory]);

  const changePage = (page) => {
    const nextPage = Math.min(
      Math.max(page, 1),
      totalPages
    );

    setCurrentPage(nextPage);

    window.setTimeout(() => {
      document
        .getElementById("products-grid")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    }, 0);
  };

  /* =======================================================
     REFRESH
  ======================================================= */

  const handleRefresh = () => {
    setRefreshing(true);
    loadProducts();
  };

  /* =======================================================
     CLEAR SEARCH
  ======================================================= */

  const clearSearch = () => {
    setSearchTerm("");
  };

  /* =======================================================
     PAGE
  ======================================================= */

  return (
    <>
      <style>{`

        /* =================================================
           PAGE
        ================================================= */

        .products-page {
          min-height: 100vh;

          background:
            linear-gradient(
              180deg,
              #ffffff 0%,
              #f7faf8 100%
            );

          padding:
            55px 5vw 90px;
        }

        .products-container {
          width: 100%;

          max-width: 1500px;

          margin: 0 auto;
        }

        /* =================================================
           HEADER
        ================================================= */

        .products-header {
          text-align: center;

          margin-bottom: 38px;
        }

        .products-eyebrow {
          color: #4f816c;

          font-size: 12px;

          font-weight: 800;

          letter-spacing: 2px;

          text-transform: uppercase;

          margin-bottom: 10px;
        }

        .products-heading {
          margin: 0;

          color: #173f33;

          font-family:
            Georgia,
            "Times New Roman",
            serif;

          font-size:
            clamp(38px, 5vw, 66px);

          line-height: 1.05;

          font-weight: 700;
        }

        .products-subheading {
          max-width: 650px;

          margin:
            16px auto 0;

          color: #6d7d76;

          font-size: 15px;

          line-height: 1.7;
        }

        /* =================================================
           SEARCH
        ================================================= */

        .products-toolbar {
          display: flex;

          align-items: center;

          justify-content: center;

          gap: 14px;

          margin:
            0 auto 28px;

          max-width: 760px;
        }

        .products-search {
          flex: 1;

          min-width: 0;

          height: 52px;

          background: #ffffff;

          border:
            1px solid #dce7e2;

          border-radius: 14px;

          display: flex;

          align-items: center;

          padding:
            0 15px;

          box-shadow:
            0 6px 20px
            rgba(30, 70, 55, 0.05);
        }

        .products-search svg {
          color: #688279;

          flex-shrink: 0;
        }

        .products-search input {
          width: 100%;

          border: none;

          outline: none;

          background: transparent;

          margin-left: 11px;

          color: #193d31;

          font-size: 14px;
        }

        .products-search input::placeholder {
          color: #98a6a0;
        }

        .clear-search {
          border: none;

          background: transparent;

          color: #74857d;

          display: flex;

          align-items: center;

          justify-content: center;

          cursor: pointer;

          padding: 4px;
        }

        .refresh-products {
          width: 52px;

          height: 52px;

          border: 1px solid #dce7e2;

          border-radius: 14px;

          background: #ffffff;

          color: #214b3c;

          display: flex;

          align-items: center;

          justify-content: center;

          cursor: pointer;

          transition:
            background 0.2s ease,
            transform 0.2s ease;
        }

        .refresh-products:hover {
          background: #edf5f1;

          transform: translateY(-1px);
        }

        .refresh-products.spinning svg {
          animation:
            spin 0.8s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        /* =================================================
           CATEGORIES
        ================================================= */

        .products-categories {
          display: flex;

          justify-content: center;

          align-items: center;

          gap: 10px;

          flex-wrap: wrap;

          margin-bottom: 42px;
        }

        .category-button {
          border:
            1px solid #dce5e1;

          background: #ffffff;

          color: #697a73;

          padding:
            12px 25px;

          border-radius: 999px;

          font-size: 13px;

          font-weight: 800;

          cursor: pointer;

          transition:
            all 0.2s ease;
        }

        .category-button:hover {
          border-color: #a9c4b8;

          color: #214d3d;
        }

        .category-button.active {
          background: #173f33;

          border-color: #173f33;

          color: #ffffff;
        }

        /* =================================================
           RESULT INFO
        ================================================= */

        .products-result-info {
          display: flex;

          align-items: center;

          justify-content: space-between;

          margin-bottom: 20px;

          color: #718079;

          font-size: 13px;

          font-weight: 600;
        }

        .products-result-info strong {
          color: #214b3c;
        }

        /* =================================================
           PRODUCT GRID
        ================================================= */

        .products-grid {
          display: grid;

          grid-template-columns:
            repeat(4, minmax(0, 1fr));

          gap: 28px;

          align-items: stretch;
        }

        /* =================================================
           SKELETON
        ================================================= */

        .product-skeleton {
          overflow: hidden;

          background: #ffffff;

          border:
            1px solid #e6ece9;

          border-radius: 20px;

          min-height: 500px;

          box-shadow:
            0 7px 24px
            rgba(24, 55, 45, 0.05);
        }

        .skeleton-image {
          height: 285px;

          background:
            linear-gradient(
              90deg,
              #eef2f0 25%,
              #f7f9f8 50%,
              #eef2f0 75%
            );

          background-size:
            200% 100%;

          animation:
            skeletonMove
            1.5s
            infinite;
        }

        .skeleton-content {
          padding: 22px;
        }

        .skeleton-small,
        .skeleton-title,
        .skeleton-button {
          background:
            linear-gradient(
              90deg,
              #eef2f0 25%,
              #f7f9f8 50%,
              #eef2f0 75%
            );

          background-size:
            200% 100%;

          animation:
            skeletonMove
            1.5s
            infinite;

          border-radius: 7px;
        }

        .skeleton-small {
          width: 35%;

          height: 13px;

          margin-bottom: 15px;
        }

        .skeleton-title {
          width: 70%;

          height: 22px;

          margin-bottom: 25px;
        }

        .skeleton-button {
          width: 100%;

          height: 45px;
        }

        @keyframes skeletonMove {
          0% {
            background-position:
              200% 0;
          }

          100% {
            background-position:
              -200% 0;
          }
        }

        /* =================================================
           ERROR
        ================================================= */

        .products-error {
          max-width: 800px;

          margin:
            30px auto;

          padding: 25px;

          background: #fff5f4;

          border:
            1px solid #f0c9c5;

          border-radius: 16px;

          color: #9b3931;

          text-align: center;
        }

        .products-error-title {
          font-size: 16px;

          font-weight: 800;

          margin-bottom: 8px;
        }

        .products-error-message {
          font-size: 13px;

          line-height: 1.6;

          word-break: break-word;
        }

        .products-error-button {
          margin-top: 16px;

          padding:
            10px 18px;

          border: none;

          border-radius: 9px;

          background: #9b3931;

          color: white;

          font-weight: 700;

          cursor: pointer;
        }

        /* =================================================
           EMPTY
        ================================================= */

        .products-empty {
          grid-column: 1 / -1;

          min-height: 300px;

          display: flex;

          flex-direction: column;

          align-items: center;

          justify-content: center;

          text-align: center;

          padding: 40px;

          color: #718079;
        }

        .products-empty-icon {
          width: 70px;

          height: 70px;

          border-radius: 50%;

          display: flex;

          align-items: center;

          justify-content: center;

          background: #edf5f1;

          color: #38715d;

          margin-bottom: 16px;
        }

        .products-empty h3 {
          margin: 0 0 8px;

          color: #234b3d;

          font-family:
            Georgia,
            "Times New Roman",
            serif;

          font-size: 24px;
        }

        .products-empty p {
          margin: 0;

          font-size: 14px;
        }

        /* =================================================
           RESPONSIVE
        ================================================= */

        @media (max-width: 1200px) {

          .products-grid {
            grid-template-columns:
              repeat(3, minmax(0, 1fr));
          }

        }

        @media (max-width: 850px) {

          .products-page {
            padding:
              40px 20px 70px;
          }

          .products-grid {
            grid-template-columns:
              repeat(2, minmax(0, 1fr));

            gap: 20px;
          }

        }

        @media (max-width: 600px) {

          .products-grid {
            grid-template-columns:
              1fr;
          }

          .products-toolbar {
            width: 100%;
          }

          .products-categories {
            justify-content: flex-start;

            overflow-x: auto;

            flex-wrap: nowrap;

            padding-bottom: 5px;
          }

          .category-button {
            white-space: nowrap;
          }

          .products-result-info {
            flex-direction: column;

            align-items: flex-start;

            gap: 5px;
          }

        }

        /* Product studio refresh */
        .products-page {
          background:
            radial-gradient(circle at 8% 0%, rgba(174, 210, 178, 0.34), transparent 25%),
            #f5f3ec;
          padding: 42px 5vw 96px;
        }

        .products-container {
          max-width: 1440px;
        }

        .products-header {
          position: relative;
          overflow: hidden;
          isolation: isolate;
          min-height: 250px;
          margin-bottom: 0;
          padding: clamp(2rem, 5vw, 4.25rem);
          text-align: left;
          border-radius: 28px;
          background:
            linear-gradient(118deg, #0e4232 0%, #195842 58%, #3b7a56 100%);
          box-shadow: 0 20px 42px rgba(25, 72, 52, 0.16);
        }

        .products-header::before {
          position: absolute;
          z-index: -1;
          top: -110px;
          right: -54px;
          width: 360px;
          height: 360px;
          border: 1px solid rgba(218, 241, 219, 0.26);
          border-radius: 50%;
          box-shadow:
            0 0 0 42px rgba(218, 241, 219, 0.07),
            0 0 0 84px rgba(218, 241, 219, 0.05);
          content: "";
        }

        .products-header::after {
          position: absolute;
          right: clamp(1.75rem, 6vw, 5rem);
          bottom: 2.25rem;
          color: rgba(224, 244, 224, 0.72);
          font-size: 0.67rem;
          font-weight: 800;
          letter-spacing: 0.18em;
          content: "FIELD · CROP · CARE";
        }

        .products-eyebrow {
          color: #bde6c8;
          font-size: 0.72rem;
          letter-spacing: 0.16em;
        }

        .products-heading {
          max-width: 850px;
          color: #ffffff;
          font-size: clamp(2.8rem, 5.1vw, 5.2rem);
          letter-spacing: -0.05em;
        }

        .products-subheading {
          max-width: 590px;
          margin: 1rem 0 0;
          color: rgba(239, 249, 239, 0.84);
          font-size: 1rem;
        }

        .products-toolbar {
          position: relative;
          z-index: 1;
          max-width: 820px;
          margin: -28px auto 18px;
          padding: 10px;
          border: 1px solid rgba(204, 222, 207, 0.78);
          border-radius: 19px;
          background: rgba(255, 255, 252, 0.94);
          box-shadow: 0 16px 30px rgba(22, 65, 48, 0.12);
          backdrop-filter: blur(12px);
        }

        .products-search {
          height: 50px;
          border: 0;
          border-radius: 11px;
          box-shadow: none;
        }

        .refresh-products {
          width: 50px;
          height: 50px;
          border-color: #cde0d3;
          border-radius: 11px;
          background: #e8f2e9;
        }

        .products-categories {
          justify-content: flex-start;
          gap: 8px;
          margin: 0 0 36px;
          padding: 0 4px;
        }

        .category-button {
          padding: 0.62rem 1.1rem;
          border-color: #d5ded5;
          background: transparent;
          color: #63736b;
        }

        .category-button.active {
          background: #174b39;
          border-color: #174b39;
          box-shadow: 0 8px 16px rgba(23, 75, 57, 0.18);
        }

        .products-result-info {
          margin-bottom: 18px;
          padding: 0 4px;
          color: #77847d;
        }

        .products-grid {
          gap: 22px;
        }

        .product-skeleton {
          min-height: 470px;
          border-radius: 20px;
          background: #fbfaf6;
        }

        .skeleton-image {
          height: 260px;
          background: linear-gradient(110deg, #e8ede7 25%, #f5f7f2 50%, #e8ede7 75%);
        }

        @media (max-width: 850px) {
          .products-header {
            min-height: auto;
          }
        }

        @media (max-width: 600px) {
          .products-page {
            padding: 20px 16px 60px;
          }

          .products-header {
            padding: 2.25rem 1.5rem 3.75rem;
            border-radius: 22px;
          }

          .products-header::after {
            left: 1.5rem;
            right: auto;
            bottom: 1.4rem;
          }

          .products-toolbar {
            margin-top: -20px;
          }
        }

        /* Seed catalogue alternate design */
        .products-page {
          background:
            linear-gradient(180deg, #f0f2ec 0, #f7f7f2 320px, #fbfbf8 100%);
        }

        .products-header {
          min-height: auto;
          padding: clamp(1.2rem, 3vw, 2.5rem) 0 2rem;
          border-radius: 0;
          background: transparent;
          box-shadow: none;
        }

        .products-header::before,
        .products-header::after {
          display: none;
        }

        .products-eyebrow {
          display: flex;
          align-items: center;
          gap: 0.7rem;
          color: #4d8664;
        }

        .products-eyebrow::before {
          width: 34px;
          height: 1px;
          background: currentColor;
          content: "";
        }

        .products-heading {
          max-width: 820px;
          color: #173f30;
          font-size: clamp(2.85rem, 5.5vw, 5.9rem);
          line-height: 0.98;
        }

        .products-subheading {
          max-width: 520px;
          margin: 1.35rem 0 0;
          color: #6c7b73;
        }

        .products-toolbar {
          justify-content: flex-start;
          max-width: none;
          margin: 0 0 1rem;
          padding: 0;
          border: 0;
          border-radius: 0;
          background: transparent;
          box-shadow: none;
          backdrop-filter: none;
        }

        .products-search {
          max-width: 600px;
          border: 1px solid #d5ddd3;
          border-radius: 8px;
          background: rgba(255, 255, 252, 0.7);
        }

        .refresh-products {
          border-radius: 8px;
          background: #ffffff;
        }

        .products-categories {
          justify-content: flex-start;
          gap: 0;
          margin: 0 0 2.2rem;
          padding: 0;
          border-bottom: 1px solid #d9dfd7;
        }

        .category-button {
          position: relative;
          padding: 0.8rem 1.2rem 0.9rem;
          border: 0;
          border-radius: 0;
          background: transparent;
        }

        .category-button::after {
          position: absolute;
          right: 1.2rem;
          bottom: -1px;
          left: 1.2rem;
          height: 2px;
          background: transparent;
          content: "";
        }

        .category-button.active {
          background: transparent;
          color: #174b39;
          box-shadow: none;
        }

        .category-button.active::after {
          background: #174b39;
        }

        .products-result-info {
          margin-bottom: 1rem;
          padding: 0;
          color: #7a8780;
          font-size: 0.72rem;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }

        .products-grid {
          gap: 16px;
        }

        @media (max-width: 600px) {
          .products-header {
            padding: 1.25rem 0 1.6rem;
          }

          .products-toolbar {
            margin-top: 0;
          }

          .products-categories {
            overflow-x: auto;
          }
        }

        /* Botanical showcase alternate design */
        .products-page {
          position: relative;
          overflow: hidden;
          background:
            radial-gradient(circle at 92% 8%, rgba(182, 220, 186, 0.54), transparent 18%),
            radial-gradient(circle at 5% 22%, rgba(235, 221, 178, 0.46), transparent 17%),
            #fbfcf8;
        }

        .products-header {
          position: relative;
          padding: clamp(2.5rem, 6vw, 5.5rem) 0 3.2rem;
          text-align: center;
        }

        .products-header::before {
          display: block;
          position: absolute;
          z-index: 0;
          top: 48%;
          left: 50%;
          width: auto;
          height: auto;
          border: 0;
          border-radius: 0;
          box-shadow: none;
          color: rgba(33, 103, 69, 0.055);
          font-family: Georgia, "Times New Roman", serif;
          font-size: clamp(5rem, 13vw, 13rem);
          font-weight: 700;
          letter-spacing: -0.08em;
          line-height: 0.7;
          transform: translate(-50%, -50%);
          content: "GROW";
        }

        .products-eyebrow,
        .products-heading,
        .products-subheading {
          position: relative;
          z-index: 1;
        }

        .products-eyebrow {
          justify-content: center;
          color: #47805b;
        }

        .products-heading {
          max-width: 1020px;
          margin: 0 auto;
          color: #143f2e;
          font-size: clamp(3rem, 5.7vw, 6.2rem);
        }

        .products-subheading {
          max-width: 610px;
          margin: 1.35rem auto 0;
          color: #687a70;
        }

        .products-toolbar {
          max-width: 900px;
          margin: 0 auto 0.85rem;
          padding: 0.7rem;
          border: 0;
          border-radius: 18px;
          background: #164936;
          box-shadow: 0 16px 28px rgba(17, 66, 46, 0.19);
        }

        .products-search {
          height: 48px;
          max-width: none;
          border: 0;
          border-radius: 11px;
          background: rgba(255, 255, 255, 0.12);
        }

        .products-search svg,
        .products-search input {
          color: #ffffff;
        }

        .products-search input::placeholder {
          color: rgba(255, 255, 255, 0.68);
        }

        .clear-search {
          color: #ffffff;
        }

        .refresh-products {
          width: 48px;
          height: 48px;
          border: 0;
          border-radius: 11px;
          background: #bfe5c4;
          color: #154634;
        }

        .products-categories {
          justify-content: center;
          gap: 0.55rem;
          margin-bottom: 2.6rem;
          padding: 0;
          border: 0;
        }

        .category-button {
          padding: 0.58rem 1rem;
          border: 1px solid #d7e2d7;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.72);
          color: #62756a;
        }

        .category-button::after {
          display: none;
        }

        .category-button.active {
          background: #c9e8ca;
          border-color: #c9e8ca;
          color: #174b39;
        }

        .products-result-info {
          margin-bottom: 1.25rem;
          padding: 0 0 0.8rem;
          border-bottom: 1px solid #dfe7de;
          letter-spacing: 0;
          text-transform: none;
        }

        .products-grid {
          gap: 24px;
        }

        @media (max-width: 600px) {
          .products-header {
            padding: 2.7rem 0 2.5rem;
          }

          .products-toolbar {
            margin-top: 0;
          }

          .products-categories {
            justify-content: flex-start;
          }
        }

        .products-pagination {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          margin-top: 2.6rem;
        }

        .pagination-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 38px;
          height: 38px;
          padding: 0 0.65rem;
          border: 1px solid #d5e2d5;
          border-radius: 10px;
          background: #ffffff;
          color: #2a6045;
          font-size: 0.78rem;
          font-weight: 800;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .pagination-button:hover:not(:disabled) {
          border-color: #91bb9a;
          background: #edf6ed;
          transform: translateY(-1px);
        }

        .pagination-button.active {
          border-color: #174b39;
          background: #174b39;
          color: #ffffff;
        }

        .pagination-button:disabled {
          opacity: 0.38;
          cursor: not-allowed;
        }

        .pagination-ellipsis {
          color: #71907c;
          font-weight: 800;
          letter-spacing: 0.1em;
        }

        .pagination-status {
          margin-left: 0.75rem;
          color: #708078;
          font-size: 0.74rem;
          font-weight: 700;
        }

        @media (max-width: 600px) {
          .products-pagination {
            gap: 0.35rem;
          }

          .pagination-status {
            display: none;
          }
        }
      `}</style>

      <main className="products-page">
        <div className="products-container">

          {/* =================================================
              HEADER
          ================================================= */}

          <header className="products-header">

            <div className="products-eyebrow">
              Our Products
            </div>

            <h1 className="products-heading">
              Premium Agricultural
              Solutions
            </h1>

            <p className="products-subheading">
              Explore our complete range
              of agricultural products
              designed to support healthy
              crops and better yields.
            </p>

          </header>

          {/* =================================================
              ERROR
          ================================================= */}

          {error && (
            <div className="products-error">

              <div className="products-error-title">
                Unable to load products
              </div>

              <div className="products-error-message">
                {error}
              </div>

              <button
                type="button"
                className="products-error-button"
                onClick={handleRefresh}
              >
                Try Again
              </button>

            </div>
          )}

          {/* =================================================
              SEARCH
          ================================================= */}

          <div className="products-toolbar">

            <div className="products-search">

              <Search size={19} />

              <input
                id="product-search"
                name="product-search"
                type="search"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(event) =>
                  setSearchTerm(
                    event.target.value
                  )
                }
              />

              {searchTerm && (
                <button
                  type="button"
                  className="clear-search"
                  aria-label="Clear search"
                  onClick={
                    clearSearch
                  }
                >
                  <X size={17} />
                </button>
              )}

            </div>

            <button
              type="button"
              className={`refresh-products ${
                refreshing
                  ? "spinning"
                  : ""
              }`}
              title="Refresh products"
              aria-label="Refresh products"
              onClick={handleRefresh}
              disabled={refreshing}
            >
              <RefreshCw size={19} />
            </button>

          </div>

          {/* =================================================
              CATEGORIES
          ================================================= */}

          <div className="products-categories">

            <button
              type="button"
              className={`category-button ${
                selectedCategory ===
                "All"
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                setSelectedCategory(
                  "All"
                )
              }
            >
              All
            </button>

            {categories.map(
              (category) => (
                <button
                  key={category}
                  type="button"
                  className={`category-button ${
                    selectedCategory ===
                    category
                      ? "active"
                      : ""
                  }`}
                  onClick={() =>
                    setSelectedCategory(
                      category
                    )
                  }
                >
                  {category}
                </button>
              )
            )}

          </div>

          {/* =================================================
              RESULT COUNT
          ================================================= */}

          {!loading &&
            !error && (
              <div className="products-result-info">

                <span>
                  Showing{" "}
                  <strong>
                    {filteredProducts.length > 0
                      ? `${
                          (activePage - 1) *
                            PRODUCTS_PER_PAGE +
                          1
                        }–${Math.min(
                          activePage *
                            PRODUCTS_PER_PAGE,
                          filteredProducts.length
                        )}`
                      : 0}
                  </strong>{" "}
                  of{" "}
                  <strong>
                    {
                      filteredProducts.length
                    }
                  </strong>{" "}
                  products
                </span>

                {searchTerm && (
                  <span>
                    Search:{" "}
                    <strong>
                      "{searchTerm}"
                    </strong>
                  </span>
                )}

              </div>
            )}

          {/* =================================================
              PRODUCTS
          ================================================= */}

          <section
            className="products-grid"
            id="products-grid"
            aria-label="Products"
          >

            {/* LOADING */}

            {loading && (
              <>
                {Array.from({
                  length: 8,
                }).map(
                  (_, index) => (
                    <ProductSkeleton
                      key={index}
                    />
                  )
                )}
              </>
            )}

            {/* LOADED */}

            {!loading &&
              filteredProducts.length >
                0 &&
              paginatedProducts.map(
                (product, index) => (
                  <ProductCard
                    key={
                      product.id ||
                      `${product.name}-${index}`
                    }
                    product={
                      product
                    }
                    animationDelay={
                      (index % 8) * 60
                    }
                  />
                )
              )}

            {/* NOTHING FOUND */}

            {!loading &&
              !error &&
              filteredProducts.length ===
                0 && (
                <div className="products-empty">

                  <div className="products-empty-icon">
                    <Package
                      size={30}
                    />
                  </div>

                  <h3>
                    No products found
                  </h3>

                  <p>
                    {searchTerm
                      ? `No products match "${searchTerm}".`
                      : "There are no products available in this category."}
                  </p>

                </div>
              )}

          </section>

          {!loading &&
            !error &&
            filteredProducts.length > 0 &&
            totalPages > 1 && (
              <nav
                className="products-pagination"
                aria-label="Product pages"
              >
                <button
                  type="button"
                  className="pagination-button"
                  onClick={() =>
                    changePage(activePage - 1)
                  }
                  disabled={activePage === 1}
                  aria-label="Previous product page"
                >
                  Prev
                </button>

                {paginationPages.map(
                  (page, index) => (
                    <Fragment
                      key={`page-group-${page}`}
                    >
                      {index > 0 &&
                        page -
                          paginationPages[
                            index - 1
                          ] >
                          1 && (
                          <span
                            key={`ellipsis-${page}`}
                            className="pagination-ellipsis"
                            aria-hidden="true"
                          >
                            ...
                          </span>
                        )}

                      <button
                        key={page}
                        type="button"
                        className={`pagination-button ${
                          activePage === page
                            ? "active"
                            : ""
                        }`}
                        onClick={() =>
                          changePage(page)
                        }
                        aria-current={
                          activePage === page
                            ? "page"
                            : undefined
                        }
                      >
                        {page}
                      </button>
                    </Fragment>
                  )
                )}

                <button
                  type="button"
                  className="pagination-button"
                  onClick={() =>
                    changePage(activePage + 1)
                  }
                  disabled={
                    activePage === totalPages
                  }
                  aria-label="Next product page"
                >
                  Next
                </button>

                <span className="pagination-status">
                  Page {activePage} of {totalPages}
                </span>
              </nav>
            )}

        </div>
      </main>
    </>
  );
}
