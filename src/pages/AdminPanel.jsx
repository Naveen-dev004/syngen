import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";

import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  Plus,
  Clock,
  LogOut,
  Trash2,
  Edit,
  X,
  Save,
  Upload,
  AlertCircle,
  CheckCircle,
  DollarSign,
  UserCheck,
  Boxes,
  Leaf,
  Search,
  ChevronDown,
  Menu,
  Phone,
  CalendarDays,
  RefreshCw,
} from "lucide-react";

/* =========================================================
   CONSTANTS
========================================================= */

const STORAGE_BUCKET = "product-images";

const STATUS_OPTIONS = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

/*
  These are the categories listed in the Syngen brochure.
*/
const CATEGORY_OPTIONS = [
  "Herbicides",
  "Fungicides",
  "Pesticides",
  "Fertilizer",
  "Growth Promoter",
  "Enzymes & Mineral Activators",
];

/*
  Product classification based on the product information
  shown in the supplied Syngen brochure.

  Database category takes priority when it is one of the
  supported categories.

  If category is empty/incorrect, this mapping is used.
*/
const PRODUCT_CATEGORY_MAP = {
  /* ================= HERBICIDES ================= */
  "WEEDKILL-58": "Herbicides",
  "GLYKILL-41": "Herbicides",
  "OXYMAX": "Herbicides",
  "GLYKILL-71": "Herbicides",
  "METRI-71": "Herbicides",
  "ATRAZINE-50": "Herbicides",
  "RAZEL": "Herbicides",
  "NUCLUEUS": "Herbicides",
  "BUTAZIN": "Herbicides",
  "WEEDRUST": "Herbicides",
  "SYNTRAN-80": "Herbicides",
  "PRETILZENN": "Herbicides",
  "PENDIMIX": "Herbicides",

  /* ================= FUNGICIDES ================= */
  "SYNOM-M": "Fungicides",
  "HEXON": "Fungicides",
  "PROZOLE": "Fungicides",
  "DEXAZOLE": "Fungicides",
  "M-75": "Fungicides",
  "SAFIX": "Fungicides",
  "BAVIST-ON": "Fungicides",
  "TORRENT": "Fungicides",
  "TEBULTRA": "Fungicides",
  "COPPEROX": "Fungicides",
  "AZOXEN": "Fungicides",
  "ZOXYLIN": "Fungicides",

  /* ================= PESTICIDES ================= */
  "CHLOROZEN": "Pesticides",
  "CHLOROZENT": "Pesticides",
  "CHLOROX": "Pesticides",
  "THIOXAM": "Pesticides",
  "LAMADAZEN": "Pesticides",
  "EMAZEN": "Pesticides",
  "SYN-ACE": "Pesticides",
  "PRO-FOS": "Pesticides",
  "EMAXAM": "Pesticides",
  "THIOPROLE": "Pesticides",
  "TRANMEC": "Pesticides",
  "COGEN": "Pesticides",
  "BIFENOL": "Pesticides",
  "DELTAGEN": "Pesticides",
  "ALPHACYON": "Pesticides",
  "CYPEREX": "Pesticides",
  "ABAMEN": "Pesticides",
  "ETHROX": "Pesticides",
  "CYPEROLE": "Pesticides",
  "FENGIN": "Pesticides",

  /* ================= GROWTH PROMOTER ================= */
  "SEAZOLE": "Growth Promoter",
  "SEAZOLE ULTRA": "Growth Promoter",

  /* ================= FERTILIZER ================= */
  "NUTRIFIX": "Fertilizer",
  "SYNHUMI-K20": "Fertilizer",
  "HYDROX": "Fertilizer",
  "PHOSGEN": "Fertilizer",
};

/* =========================================================
   CATEGORY HELPERS
========================================================= */

function normalizeCategory(category) {
  if (!category) return "";

  const value = String(category).trim().toLowerCase();

  const map = {
    herbicide: "Herbicides",
    herbicides: "Herbicides",
    weedicide: "Herbicides",
    weedicides: "Herbicides",

    fungicide: "Fungicides",
    fungicides: "Fungicides",

    pesticide: "Pesticides",
    pesticides: "Pesticides",
    insecticide: "Pesticides",
    insecticides: "Pesticides",
    "bio-pesticide": "Pesticides",
    "bio-pesticides": "Pesticides",

    fertilizer: "Fertilizer",
    fertilizers: "Fertilizer",
    fertiliser: "Fertilizer",
    fertilisers: "Fertilizer",

    "growth promoter": "Growth Promoter",
    "growth promoters": "Growth Promoter",
    "plant growth promoter": "Growth Promoter",
    "plant growth regulators": "Growth Promoter",
    "plant growth regulator": "Growth Promoter",

    "enzymes & mineral activators":
      "Enzymes & Mineral Activators",
    "enzymes and mineral activators":
      "Enzymes & Mineral Activators",
    enzymes: "Enzymes & Mineral Activators",
    "mineral activators":
      "Enzymes & Mineral Activators",
  };

  return map[value] || String(category).trim();
}

function getProductCategory(product) {
  const databaseCategory = normalizeCategory(product?.category);

  if (CATEGORY_OPTIONS.includes(databaseCategory)) {
    return databaseCategory;
  }

  const productName = String(product?.name || "")
    .trim()
    .toUpperCase();

  return PRODUCT_CATEGORY_MAP[productName] || "Uncategorized";
}

function formatDate(date) {
  if (!date) return "—";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatCurrency(value) {
  return `₹${Number(value || 0).toLocaleString("en-IN")}`;
}

/* =========================================================
   MAIN ADMIN PANEL
========================================================= */

export default function AdminPanel() {
  const {
    user,
    profile,
    logout,
    isAdmin,
    loading: authLoading,
  } = useAuth();

  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (authLoading) {
    return (
      <div className="loading-container" style={{ minHeight: "100vh" }}>
        <div className="spinner spinner-lg" />
        <p>Loading admin panel...</p>
      </div>
    );
  }

  if (!user) {
    navigate("/login");
    return null;
  }

  if (!isAdmin) {
    navigate("/account");
    return null;
  }

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const navItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      id: "orders",
      label: "Orders",
      icon: ShoppingBag,
    },
    {
      id: "products",
      label: "Products",
      icon: Package,
    },
    {
      id: "customers",
      label: "Customers",
      icon: Users,
    },
    {
      id: "newproducts",
      label: "New Products",
      icon: Plus,
    },
    {
      id: "upcoming",
      label: "Upcoming Products",
      icon: Clock,
    },
  ];

  return (
    <div className="admin-layout">
      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <aside
        className={`admin-sidebar ${
          sidebarOpen ? "admin-sidebar-open" : ""
        }`}
      >
        <div className="admin-brand">
          <div className="admin-brand-icon">
            <Leaf size={21} />
          </div>

          <div>
            <div className="admin-brand-title">
              SYNGEN
            </div>

            <div className="admin-brand-subtitle">
              GREEN AGRITECH
            </div>
          </div>
        </div>

        <div className="admin-panel-label">
          ADMINISTRATION
        </div>

        <nav className="admin-nav">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                type="button"
                className={`admin-nav-item ${
                  activeTab === item.id
                    ? "admin-nav-item-active"
                    : ""
                }`}
                onClick={() => {
                  setActiveTab(item.id);
                  setSidebarOpen(false);
                }}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="admin-sidebar-footer">
          <div className="admin-user-card">
            <div className="admin-avatar">
              {(profile?.name ||
                user.email ||
                "A")[0].toUpperCase()}
            </div>

            <div className="admin-user-info">
              <strong>
                {profile?.name || "Administrator"}
              </strong>

              <span>{user.email}</span>
            </div>
          </div>

          <button
            type="button"
            className="admin-logout"
            onClick={handleLogout}
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* MOBILE OVERLAY */}

      {sidebarOpen && (
        <div
          className="admin-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* =====================================================
          MAIN
      ===================================================== */}

      <main className="admin-main">
        <div className="admin-mobile-header">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="admin-mobile-menu"
          >
            <Menu size={22} />
          </button>

          <div>
            <strong>SYNGEn</strong>
            <span>Admin Panel</span>
          </div>
        </div>

        {activeTab === "dashboard" && <DashboardTab />}

        {activeTab === "orders" && <OrdersTab />}

        {activeTab === "products" && <ProductsTab />}

        {activeTab === "customers" && <CustomersTab />}

        {activeTab === "newproducts" && (
          <ProductsTab filter="new" />
        )}

        {activeTab === "upcoming" && (
          <ProductsTab filter="upcoming" />
        )}
      </main>

      {/* =====================================================
          ADMIN CSS
      ===================================================== */}

      <style>{`
        .admin-layout {
          min-height: 100vh;
          background: #f6f8f7;
          display: flex;
        }

        .admin-sidebar {
          width: 270px;
          min-width: 270px;
          background:
            linear-gradient(
              180deg,
              #123c31 0%,
              #0d3027 100%
            );
          color: white;
          position: fixed;
          inset: 0 auto 0 0;
          z-index: 1000;
          display: flex;
          flex-direction: column;
          padding: 22px 16px;
          box-shadow: 10px 0 30px rgba(12, 47, 38, 0.12);
          transition: transform 0.3s ease;
        }

        .admin-brand {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 6px 8px 22px;
          border-bottom: 1px solid rgba(255,255,255,.1);
        }

        .admin-brand-icon {
          width: 43px;
          height: 43px;
          border-radius: 13px;
          display: grid;
          place-items: center;
          background: linear-gradient(
            135deg,
            #4a8b6f,
            #75ad8f
          );
          box-shadow:
            0 8px 20px rgba(0,0,0,.15);
        }

        .admin-brand-title {
          font-family: "Playfair Display", serif;
          font-weight: 800;
          font-size: 1.15rem;
          letter-spacing: .03em;
        }

        .admin-brand-subtitle {
          font-size: .63rem;
          font-weight: 700;
          letter-spacing: .14em;
          color: #9bd1b5;
        }

        .admin-panel-label {
          font-size: .68rem;
          font-weight: 800;
          letter-spacing: .14em;
          color: rgba(255,255,255,.42);
          margin: 24px 9px 9px;
        }

        .admin-nav {
          display: flex;
          flex-direction: column;
          gap: 5px;
          flex: 1;
        }

        .admin-nav-item {
          border: 0;
          width: 100%;
          padding: 12px 13px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          gap: 12px;
          color: rgba(255,255,255,.65);
          background: transparent;
          cursor: pointer;
          text-align: left;
          font-size: .88rem;
          font-weight: 650;
          transition:
            background .2s ease,
            color .2s ease,
            transform .2s ease;
        }

        .admin-nav-item:hover {
          background: rgba(255,255,255,.07);
          color: white;
          transform: translateX(2px);
        }

        .admin-nav-item-active {
          background:
            linear-gradient(
              135deg,
              rgba(74,139,111,.38),
              rgba(74,139,111,.18)
            );
          color: white;
          box-shadow:
            inset 3px 0 0 #79b596;
        }

        .admin-sidebar-footer {
          border-top: 1px solid rgba(255,255,255,.1);
          padding-top: 15px;
        }

        .admin-user-card {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 11px;
          border-radius: 12px;
          background: rgba(255,255,255,.055);
          margin-bottom: 8px;
        }

        .admin-avatar {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          display: grid;
          place-items: center;
          flex-shrink: 0;
          background: #4a8b6f;
          color: white;
          font-weight: 800;
        }

        .admin-user-info {
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .admin-user-info strong {
          font-size: .8rem;
          color: white;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .admin-user-info span {
          font-size: .68rem;
          color: rgba(255,255,255,.48);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .admin-logout {
          width: 100%;
          border: 0;
          background: transparent;
          color: #fca5a5;
          padding: 11px 12px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          font-weight: 650;
          transition: .2s ease;
        }

        .admin-logout:hover {
          background: rgba(239,68,68,.12);
        }

        .admin-main {
          flex: 1;
          margin-left: 270px;
          min-width: 0;
          padding: 34px;
        }

        .admin-mobile-header {
          display: none;
        }

        .admin-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,.45);
          z-index: 999;
        }

        .admin-page-header {
          margin-bottom: 28px;
        }

        .admin-eyebrow {
          color: #4a8b6f;
          font-size: .7rem;
          font-weight: 800;
          letter-spacing: .15em;
          text-transform: uppercase;
          margin-bottom: 7px;
        }

        .admin-page-header h1 {
          margin: 0 0 7px;
          font-family: "Playfair Display", serif;
          font-size: clamp(1.8rem, 3vw, 2.5rem);
          color: #153e32;
        }

        .admin-page-header p {
          margin: 0;
          color: #758078;
        }

        .admin-card {
          background: white;
          border: 1px solid #e7ece9;
          border-radius: 18px;
          box-shadow:
            0 8px 30px rgba(19,62,50,.055);
        }

        .admin-stat-grid {
          display: grid;
          grid-template-columns:
            repeat(3, minmax(0, 1fr));
          gap: 16px;
          margin-bottom: 24px;
        }

        .admin-stat-card {
          padding: 20px;
          display: flex;
          align-items: center;
          gap: 14px;
          transition:
            transform .25s ease,
            box-shadow .25s ease;
        }

        .admin-stat-card:hover {
          transform: translateY(-3px);
          box-shadow:
            0 15px 35px rgba(19,62,50,.09);
        }

        .admin-stat-icon {
          width: 50px;
          height: 50px;
          border-radius: 14px;
          display: grid;
          place-items: center;
          flex-shrink: 0;
        }

        .admin-stat-value {
          font-family: "Playfair Display", serif;
          font-size: 1.65rem;
          font-weight: 800;
          line-height: 1;
          color: #153e32;
        }

        .admin-stat-label {
          margin-top: 5px;
          color: #7a847e;
          font-size: .78rem;
          font-weight: 600;
        }

        .admin-section-card {
          padding: 22px;
        }

        .admin-section-title {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 15px;
          margin-bottom: 18px;
        }

        .admin-section-title h3 {
          margin: 0;
          font-size: 1.05rem;
          color: #153e32;
        }

        .admin-order-mini {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          border-radius: 12px;
          background: #f6f8f7;
          margin-bottom: 8px;
        }

        .admin-order-mini-icon {
          width: 40px;
          height: 40px;
          border-radius: 11px;
          background: #e7f2ec;
          color: #4a8b6f;
          display: grid;
          place-items: center;
          flex-shrink: 0;
        }

        .admin-order-mini-info {
          flex: 1;
          min-width: 0;
        }

        .admin-order-mini-info strong {
          display: block;
          color: #153e32;
          font-size: .85rem;
        }

        .admin-order-mini-info span {
          display: block;
          margin-top: 2px;
          color: #7c8680;
          font-size: .73rem;
        }

        .admin-search {
          position: relative;
          max-width: 520px;
        }

        .admin-search input {
          width: 100%;
          height: 48px;
          border: 1px solid #dfe7e2;
          border-radius: 13px;
          padding: 0 42px 0 43px;
          background: white;
          color: #153e32;
          outline: none;
          transition: .2s ease;
          box-sizing: border-box;
        }

        .admin-search input:focus {
          border-color: #4a8b6f;
          box-shadow:
            0 0 0 4px rgba(74,139,111,.1);
        }

        .admin-search-icon {
          position: absolute;
          left: 15px;
          top: 50%;
          transform: translateY(-50%);
          color: #719080;
          pointer-events: none;
        }

        .admin-search-clear {
          position: absolute;
          right: 9px;
          top: 50%;
          transform: translateY(-50%);
          width: 30px;
          height: 30px;
          border: 0;
          border-radius: 50%;
          display: grid;
          place-items: center;
          background: #e7f2ec;
          color: #4a8b6f;
          cursor: pointer;
        }

        .admin-toolbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          flex-wrap: wrap;
          margin-bottom: 20px;
        }

        .admin-category-tabs {
          display: flex;
          flex-wrap: wrap;
          gap: 7px;
          margin-bottom: 20px;
        }

        .admin-category-tab {
          border: 1px solid #dfe7e2;
          background: white;
          color: #68756e;
          border-radius: 999px;
          padding: 9px 15px;
          cursor: pointer;
          font-size: .75rem;
          font-weight: 750;
          transition: .2s ease;
        }

        .admin-category-tab:hover {
          border-color: #4a8b6f;
          color: #4a8b6f;
          transform: translateY(-1px);
        }

        .admin-category-tab.active {
          background: #153e32;
          border-color: #153e32;
          color: white;
          box-shadow: 0 6px 15px rgba(21,62,50,.15);
        }

        .admin-category-count {
          opacity: .7;
          margin-left: 4px;
        }

        .admin-products-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .admin-product-row {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 14px;
          background: white;
          border: 1px solid #e7ece9;
          border-radius: 15px;
          transition: .25s ease;
        }

        .admin-product-row:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(19,62,50,.07);
        }

        .admin-product-image {
          width: 72px;
          height: 72px;
          border-radius: 13px;
          background: #f4f7f5;
          border: 1px solid #e6ece8;
          display: grid;
          place-items: center;
          flex-shrink: 0;
          overflow: hidden;
        }

        .admin-product-image img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          padding: 7px;
          box-sizing: border-box;
        }

        .admin-product-info {
          flex: 1;
          min-width: 150px;
        }

        .admin-product-name {
          color: #153e32;
          font-weight: 800;
          margin-bottom: 5px;
        }

        .admin-product-meta {
          color: #7a847e;
          font-size: .74rem;
        }

        .admin-product-category {
          display: inline-flex;
          padding: 5px 9px;
          border-radius: 999px;
          background: #e8f3ed;
          color: #377357;
          font-size: .65rem;
          font-weight: 800;
        }

        .admin-product-badges {
          display: flex;
          align-items: center;
          gap: 6px;
          flex-wrap: wrap;
          margin-top: 7px;
        }

        .admin-product-status {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 5px 9px;
          border-radius: 999px;
          background: #f1f5f3;
          color: #617069;
          font-size: .62rem;
          font-weight: 800;
        }

        .admin-product-status.is-active {
          background: #edf8f1;
          color: #2e7a51;
        }

        .admin-product-status.is-inactive {
          background: #f4f5f5;
          color: #78827d;
        }

        .admin-product-status.is-new {
          background: #eef4ff;
          color: #4169a8;
        }

        .admin-product-status.is-upcoming {
          background: #fff6e5;
          color: #9a6a17;
        }

        .admin-status-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: currentColor;
        }

        .admin-product-price {
          min-width: 90px;
          text-align: right;
          color: #153e32;
          font-weight: 800;
        }

        .admin-actions {
          display: flex;
          gap: 6px;
        }

        .admin-icon-btn {
          width: 36px;
          height: 36px;
          border: 0;
          border-radius: 10px;
          display: grid;
          place-items: center;
          cursor: pointer;
          transition: .2s ease;
        }

        .admin-edit-btn {
          background: #e8f3ed;
          color: #4a8b6f;
        }

        .admin-edit-btn:hover {
          background: #4a8b6f;
          color: white;
          transform: translateY(-2px);
        }

        .admin-delete-btn {
          background: #fff1f1;
          color: #dc5353;
        }

        .admin-delete-btn:hover {
          background: #dc5353;
          color: white;
          transform: translateY(-2px);
        }

        .admin-order-card {
          overflow: hidden;
        }

        .admin-order-header {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 18px;
        }

        .admin-order-number {
          font-size: 1rem;
          font-weight: 800;
          color: #153e32;
        }

        .admin-customer-name {
          color: #4a8b6f;
        }

        .admin-order-details {
          color: #78837d;
          font-size: .74rem;
          margin-top: 5px;
        }

        .admin-status-select {
          border: 0;
          appearance: none;
          padding: 9px 34px 9px 13px;
          border-radius: 999px;
          font-size: .73rem;
          font-weight: 800;
          text-transform: capitalize;
          cursor: pointer;
          outline: none;
          background-repeat: no-repeat;
          background-position: right 10px center;
          background-size: 13px;
        }

        .admin-status-select.pending {
          color: #a16207;
          background-color: #fef3c7;
        }

        .admin-status-select.confirmed {
          color: #1d4ed8;
          background-color: #dbeafe;
        }

        .admin-status-select.processing {
          color: #6d28d9;
          background-color: #ede9fe;
        }

        .admin-status-select.shipped {
          color: #0369a1;
          background-color: #e0f2fe;
        }

        .admin-status-select.delivered {
          color: #15803d;
          background-color: #dcfce7;
        }

        .admin-status-select.cancelled {
          color: #b91c1c;
          background-color: #fee2e2;
        }

        .admin-order-items {
          padding: 14px 18px 18px;
          border-top: 1px solid #e8edea;
          background: #f6f8f7;
        }

        .admin-order-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px;
          background: white;
          border-radius: 12px;
          margin-bottom: 7px;
        }

        .admin-order-item-image {
          width: 58px;
          height: 58px;
          border-radius: 10px;
          background: #f4f7f5;
          overflow: hidden;
          display: grid;
          place-items: center;
          flex-shrink: 0;
        }

        .admin-order-item-image img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          padding: 5px;
          box-sizing: border-box;
        }

        .admin-order-item-info {
          flex: 1;
          min-width: 0;
        }

        .admin-order-item-info strong {
          display: block;
          color: #153e32;
          font-size: .82rem;
        }

        .admin-order-item-info span {
          display: block;
          color: #7c8680;
          font-size: .7rem;
          margin-top: 4px;
        }

        .admin-customer-details {
          margin-top: 12px;
          padding: 14px;
          border-radius: 12px;
          background: white;
        }

        .admin-customer-details-title {
          font-size: .67rem;
          text-transform: uppercase;
          letter-spacing: .12em;
          color: #7a847e;
          font-weight: 800;
          margin-bottom: 10px;
        }

        .admin-customer-detail {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #153e32;
          font-size: .8rem;
          margin-bottom: 7px;
        }

        .admin-customer-detail svg {
          color: #4a8b6f;
        }

        .admin-customers-grid {
          display: grid;
          grid-template-columns:
            repeat(3, minmax(0, 1fr));
          gap: 16px;
        }

        .admin-customer-card {
          padding: 20px;
        }

        .admin-customer-head {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 18px;
        }

        .admin-customer-avatar {
          width: 48px;
          height: 48px;
          border-radius: 14px;
          display: grid;
          place-items: center;
          color: white;
          background:
            linear-gradient(
              135deg,
              #153e32,
              #4a8b6f
            );
          font-weight: 800;
        }

        .admin-customer-info {
          min-width: 0;
        }

        .admin-customer-info strong {
          display: block;
          color: #153e32;
        }

        .admin-customer-info span {
          display: block;
          color: #7a847e;
          font-size: .72rem;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .admin-customer-meta {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .admin-customer-meta-row {
          display: flex;
          justify-content: space-between;
          gap: 10px;
          font-size: .77rem;
        }

        .admin-customer-meta-row span:first-child {
          color: #7a847e;
        }

        .admin-customer-meta-row strong {
          color: #153e32;
        }

        .admin-modal-overlay {
          position: fixed;
          inset: 0;
          z-index: 3000;
          background: rgba(8,27,22,.58);
          backdrop-filter: blur(5px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          animation: adminFadeIn .2s ease;
        }

        .admin-modal {
          width: 100%;
          max-width: 620px;
          max-height: 92vh;
          overflow-y: auto;
          background: white;
          border-radius: 22px;
          padding: 25px;
          box-shadow: 0 30px 80px rgba(0,0,0,.22);
          animation: adminScaleIn .25s ease;
        }

        .admin-modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 15px;
          margin-bottom: 22px;
        }

        .admin-modal-header h2 {
          margin: 0;
          color: #153e32;
          font-family: "Playfair Display", serif;
        }

        .admin-modal-close {
          width: 36px;
          height: 36px;
          border: 0;
          border-radius: 10px;
          background: #f3f6f4;
          color: #68756e;
          display: grid;
          place-items: center;
          cursor: pointer;
        }

        .admin-modal-close:hover {
          background: #e7eeea;
        }

        .admin-form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
        }

        .admin-form-full {
          grid-column: 1 / -1;
        }

        .admin-form-group {
          margin-bottom: 15px;
        }

        .admin-form-label {
          display: block;
          margin-bottom: 7px;
          color: #415149;
          font-size: .76rem;
          font-weight: 750;
        }

        .admin-form-input,
        .admin-form-select,
        .admin-form-textarea {
          width: 100%;
          box-sizing: border-box;
          border: 1px solid #dfe7e2;
          border-radius: 11px;
          background: #fbfcfb;
          color: #153e32;
          padding: 11px 12px;
          outline: none;
          transition: .2s ease;
          font-family: inherit;
        }

        .admin-form-input:focus,
        .admin-form-select:focus,
        .admin-form-textarea:focus {
          background: white;
          border-color: #4a8b6f;
          box-shadow:
            0 0 0 4px rgba(74,139,111,.09);
        }

        .admin-form-textarea {
          min-height: 100px;
          resize: vertical;
        }

        .admin-upload-box {
          padding: 15px;
          border: 1.5px dashed #cddbd3;
          border-radius: 13px;
          background: #f7faf8;
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .admin-upload-preview {
          width: 70px;
          height: 70px;
          border-radius: 11px;
          background: white;
          border: 1px solid #e2e9e5;
          display: grid;
          place-items: center;
          overflow: hidden;
          flex-shrink: 0;
        }

        .admin-upload-preview img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          padding: 6px;
          box-sizing: border-box;
        }

        .admin-upload-button {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 9px 13px;
          border-radius: 9px;
          background: #153e32;
          color: white;
          font-size: .75rem;
          font-weight: 700;
          cursor: pointer;
        }

        .admin-checks {
          display: flex;
          flex-direction: column;
          gap: 9px;
          margin: 5px 0 20px;
        }

        .admin-check {
          display: flex;
          align-items: center;
          gap: 9px;
          font-size: .8rem;
          color: #415149;
          cursor: pointer;
        }

        .admin-check input {
          accent-color: #4a8b6f;
        }

        .admin-modal-actions {
          display: flex;
          gap: 10px;
        }

        .admin-primary-btn,
        .admin-secondary-btn {
          min-height: 44px;
          border-radius: 11px;
          padding: 0 16px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          cursor: pointer;
          font-weight: 750;
          border: 0;
        }

        .admin-primary-btn {
          flex: 1;
          background: #153e32;
          color: white;
        }

        .admin-primary-btn:hover {
          background: #1e5645;
        }

        .admin-secondary-btn {
          background: #f1f5f3;
          color: #4c5b53;
        }

        .admin-secondary-btn:hover {
          background: #e6ece8;
        }

        @keyframes adminFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes adminScaleIn {
          from {
            opacity: 0;
            transform: scale(.96) translateY(8px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        @media (max-width: 1100px) {
          .admin-stat-grid {
            grid-template-columns:
              repeat(2, minmax(0, 1fr));
          }

          .admin-customers-grid {
            grid-template-columns:
              repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 800px) {
          .admin-sidebar {
            transform: translateX(-100%);
          }

          .admin-sidebar-open {
            transform: translateX(0);
          }

          .admin-main {
            margin-left: 0;
            padding: 18px;
          }

          .admin-mobile-header {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 22px;
          }

          .admin-mobile-menu {
            width: 42px;
            height: 42px;
            border: 1px solid #dfe7e2;
            border-radius: 11px;
            background: white;
            color: #153e32;
            display: grid;
            place-items: center;
            cursor: pointer;
          }

          .admin-mobile-header div {
            display: flex;
            flex-direction: column;
          }

          .admin-mobile-header strong {
            color: #153e32;
          }

          .admin-mobile-header span {
            font-size: .7rem;
            color: #758078;
          }

          .admin-customers-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 600px) {
          .admin-stat-grid {
            grid-template-columns: 1fr;
          }

          .admin-form-grid {
            grid-template-columns: 1fr;
          }

          .admin-form-full {
            grid-column: auto;
          }

          .admin-product-row {
            align-items: flex-start;
          }

          .admin-product-price {
            min-width: auto;
            text-align: left;
          }

          .admin-order-header {
            align-items: flex-start;
            flex-wrap: wrap;
          }

          .admin-order-header > div:first-child {
            min-width: calc(100% - 20px);
          }

          .admin-status-select {
            order: 3;
          }

          .admin-modal {
            padding: 18px;
            border-radius: 17px;
          }
        }
      `}</style>
      <style>{`
        .product-admin-modal-overlay {
          position: fixed;
          inset: 0;
          z-index: 5000;
          background: rgba(8, 27, 22, 0.62);
          backdrop-filter: blur(5px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          overflow-y: auto;
        }

        .product-admin-modal {
          width: min(720px, 100%);
          max-height: 92vh;
          overflow-y: auto;
          box-sizing: border-box;
          background: #ffffff;
          border-radius: 22px;
          padding: 26px;
          box-shadow: 0 30px 80px rgba(0, 0, 0, 0.25);
          animation: adminScaleIn 0.22s ease;
        }

        .product-admin-modal-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 22px;
        }

        .product-admin-modal-header span {
          color: #438d70;
          font-size: 0.68rem;
          font-weight: 800;
          letter-spacing: 0.14em;
        }

        .product-admin-modal-header h2 {
          margin: 5px 0 0;
          color: #153e32;
          font-family: "Playfair Display", serif;
          font-size: 1.8rem;
        }

        .product-admin-close {
          width: 38px;
          height: 38px;
          border: 0;
          border-radius: 10px;
          background: #f1f5f3;
          color: #153e32;
          font-size: 24px;
          cursor: pointer;
          display: grid;
          place-items: center;
        }

        .product-admin-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .product-admin-field {
          display: flex;
          flex-direction: column;
          gap: 7px;
          min-width: 0;
        }

        .product-admin-field.full {
          grid-column: 1 / -1;
        }

        .product-admin-field label {
          color: #355849;
          font-size: 0.76rem;
          font-weight: 800;
        }

        .product-admin-field input,
        .product-admin-field select,
        .product-admin-field textarea {
          width: 100%;
          box-sizing: border-box;
          border: 1px solid #dbe5df;
          border-radius: 11px;
          background: #fbfcfb;
          color: #153e32;
          padding: 11px 12px;
          outline: none;
          font: inherit;
        }

        .product-admin-field textarea {
          min-height: 180px;
          resize: vertical;
          line-height: 1.55;
        }

        .product-admin-field input:focus,
        .product-admin-field select:focus,
        .product-admin-field textarea:focus {
          background: white;
          border-color: #438d70;
          box-shadow: 0 0 0 4px rgba(67, 141, 112, 0.1);
        }

        .product-admin-field small {
          color: #7a847e;
          font-size: 0.7rem;
        }

        .product-admin-preview {
          width: 90px;
          height: 90px;
          border: 1px solid #e0e8e4;
          border-radius: 12px;
          background: #f7faf8;
          overflow: hidden;
          display: grid;
          place-items: center;
        }

        .product-admin-preview img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          padding: 5px;
          box-sizing: border-box;
        }

        .product-admin-checks {
          display: flex;
          gap: 18px;
          flex-wrap: wrap;
          padding: 4px 0;
        }

        .product-admin-checks label {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: #48665a;
          font-size: 0.8rem;
          font-weight: 700;
        }

        .product-admin-actions-row {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          margin-top: 22px;
        }

        .product-admin-cancel,
        .product-admin-save {
          min-height: 44px;
          padding: 0 18px;
          border-radius: 11px;
          font-weight: 800;
          cursor: pointer;
        }

        .product-admin-cancel {
          border: 1px solid #dbe5df;
          background: white;
          color: #52665d;
        }

        .product-admin-save {
          border: 0;
          background: #153e32;
          color: white;
        }

        .product-admin-save:disabled {
          opacity: 0.6;
          cursor: wait;
        }

        .product-admin-error {
          margin-bottom: 15px;
          padding: 11px 13px;
          border-radius: 10px;
          background: #fff0f0;
          color: #c53e3e;
          font-size: 0.8rem;
          display: flex;
          align-items: center;
          gap: 7px;
        }

        @media (max-width: 700px) {
          .product-admin-grid {
            grid-template-columns: 1fr;
          }

          .product-admin-field.full {
            grid-column: auto;
          }

          .product-admin-modal {
            padding: 18px;
            border-radius: 17px;
          }

          .product-admin-actions-row {
            flex-direction: column-reverse;
          }

          .product-admin-cancel,
          .product-admin-save {
            width: 100%;
          }
        }
      `}</style>

      {/* =====================================================
          PREMIUM ADMIN PANEL OVERRIDES
          Visual-only layer: existing Supabase CRUD and routing
          remain unchanged.
      ===================================================== */}
      <style>{`
        .admin-layout {
          position: relative;
          overflow-x: hidden;
          background:
            radial-gradient(circle at 92% 0%, rgba(101, 164, 132, .08), transparent 28%),
            radial-gradient(circle at 0% 100%, rgba(21, 62, 50, .045), transparent 30%),
            #f5f8f6;
        }

        .admin-sidebar {
          width: 292px;
          min-width: 292px;
          padding: 24px 18px;
          background:
            radial-gradient(circle at 100% 0%, rgba(112, 179, 146, .16), transparent 34%),
            linear-gradient(180deg, #123e32 0%, #0b3027 100%);
          border-right: 1px solid rgba(255,255,255,.06);
          box-shadow: 18px 0 50px rgba(10, 48, 38, .13);
        }

        .admin-brand {
          min-height: 58px;
          padding: 4px 8px 23px;
        }

        .admin-brand-icon {
          width: 47px;
          height: 47px;
          border-radius: 15px;
          background: linear-gradient(145deg, #6cad8d, #3d7e61);
          box-shadow: 0 10px 26px rgba(0,0,0,.18);
        }

        .admin-brand-title {
          font-size: 1.22rem;
          letter-spacing: .045em;
        }

        .admin-brand-subtitle {
          color: #a6d7bf;
          font-size: .61rem;
        }

        .admin-panel-label {
          margin: 27px 10px 11px;
          color: rgba(255,255,255,.38);
        }

        .admin-nav {
          gap: 7px;
        }

        .admin-nav-item {
          min-height: 46px;
          padding: 12px 14px;
          border: 1px solid transparent;
          border-radius: 13px;
          color: rgba(255,255,255,.62);
        }

        .admin-nav-item svg {
          color: rgba(190, 224, 207, .72);
        }

        .admin-nav-item:hover {
          background: rgba(255,255,255,.065);
          border-color: rgba(255,255,255,.045);
          transform: translateX(3px);
        }

        .admin-nav-item-active {
          background:
            linear-gradient(90deg, rgba(91, 165, 128, .30), rgba(91, 165, 128, .10));
          border-color: rgba(130, 194, 160, .13);
          box-shadow:
            inset 3px 0 0 #7fbe9c,
            0 8px 22px rgba(0,0,0,.08);
        }

        .admin-nav-item-active svg {
          color: #a7d9bd;
        }

        .admin-sidebar-footer {
          padding-top: 18px;
        }

        .admin-user-card {
          padding: 12px;
          border: 1px solid rgba(255,255,255,.055);
          background: rgba(255,255,255,.045);
        }

        .admin-avatar {
          width: 40px;
          height: 40px;
          background: linear-gradient(145deg, #6cad8d, #3d7e61);
          box-shadow: 0 7px 18px rgba(0,0,0,.12);
        }

        .admin-logout {
          min-height: 42px;
        }

        .admin-main {
          margin-left: 292px;
          padding: 38px 42px 55px;
        }

        .admin-page-header {
          position: relative;
          margin-bottom: 30px;
          padding-bottom: 4px;
        }

        .admin-page-header::after {
          content: "";
          display: block;
          width: 56px;
          height: 3px;
          margin-top: 17px;
          border-radius: 99px;
          background: #6aa786;
          opacity: .75;
        }

        .admin-eyebrow {
          display: inline-flex;
          align-items: center;
          padding: 6px 10px;
          border-radius: 999px;
          background: #e8f3ed;
          color: #4a8b6f;
          font-size: .63rem;
          letter-spacing: .12em;
        }

        .admin-page-header h1 {
          margin-top: 10px;
          font-size: clamp(2rem, 3vw, 2.7rem);
          letter-spacing: -.025em;
        }

        .admin-page-header p {
          max-width: 700px;
          color: #748078;
          font-size: .92rem;
        }

        .admin-card {
          border-color: #e2eae5;
          border-radius: 20px;
          box-shadow: 0 10px 35px rgba(19,62,50,.045);
        }

        .admin-stat-grid {
          grid-template-columns: repeat(6, minmax(0, 1fr));
          gap: 13px;
          margin-bottom: 26px;
        }

        .admin-stat-card {
          min-height: 112px;
          padding: 17px;
          align-items: flex-start;
          flex-direction: column;
          gap: 14px;
          justify-content: space-between;
        }

        .admin-stat-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 18px 38px rgba(19,62,50,.10);
        }

        .admin-stat-icon {
          width: 42px;
          height: 42px;
          border-radius: 12px;
        }

        .admin-stat-value {
          font-size: 1.42rem;
        }

        .admin-stat-label {
          margin-top: 6px;
          font-size: .7rem;
          letter-spacing: .015em;
        }

        .admin-section-card {
          padding: 24px;
        }

        .admin-section-title {
          margin-bottom: 17px;
        }

        .admin-section-title h3 {
          font-size: 1.08rem;
        }

        .admin-order-mini {
          padding: 13px;
          border: 1px solid #e8eeeb;
          background: #f8faf9;
        }

        .admin-toolbar {
          align-items: stretch;
          margin-bottom: 15px;
        }

        .admin-search {
          flex: 1;
          max-width: 680px;
        }

        .admin-search input {
          height: 52px;
          border-radius: 15px;
          border-color: #dce6e0;
          box-shadow: 0 5px 18px rgba(19,62,50,.025);
          font-size: .88rem;
        }

        .admin-search input::placeholder {
          color: #9aa59f;
        }

        .admin-primary-btn,
        .admin-secondary-btn {
          min-height: 52px;
          border-radius: 14px;
          padding: 0 18px;
        }

        .admin-primary-btn {
          box-shadow: 0 10px 24px rgba(21,62,50,.14);
        }

        .admin-primary-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 14px 28px rgba(21,62,50,.18);
        }

        .admin-category-tabs {
          gap: 8px;
          padding-bottom: 4px;
          margin-bottom: 17px;
          overflow-x: auto;
          scrollbar-width: none;
        }

        .admin-category-tabs::-webkit-scrollbar {
          display: none;
        }

        .admin-category-tab {
          flex: 0 0 auto;
          min-height: 39px;
          padding: 9px 13px;
          background: rgba(255,255,255,.92);
          box-shadow: 0 3px 12px rgba(19,62,50,.025);
        }

        .admin-category-tab.active {
          background: #153e32;
          box-shadow: 0 8px 18px rgba(21,62,50,.14);
        }

        .admin-products-list {
          gap: 11px;
        }

        .admin-product-row {
          position: relative;
          min-height: 92px;
          padding: 15px 16px;
          border-color: #e3ebe6;
          border-radius: 17px;
          box-shadow: 0 3px 14px rgba(19,62,50,.025);
        }

        .admin-product-row::before {
          content: "";
          width: 3px;
          height: 34px;
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          border-radius: 0 4px 4px 0;
          background: #6aa786;
          opacity: 0;
          transition: opacity .2s ease;
        }

        .admin-product-row:hover::before {
          opacity: 1;
        }

        .admin-product-image {
          width: 78px;
          height: 78px;
          border-radius: 15px;
          background:
            radial-gradient(circle at 50% 25%, #ffffff, #f3f7f4);
          box-shadow: inset 0 0 0 1px rgba(255,255,255,.7);
        }

        .admin-product-info {
          padding: 2px 0;
        }

        .admin-product-name {
          font-size: .94rem;
          letter-spacing: -.01em;
        }

        .admin-product-meta {
          font-size: .7rem;
        }

        .admin-product-price {
          min-width: 125px;
          font-size: .88rem;
        }

        .admin-actions {
          padding-left: 2px;
        }

        .admin-icon-btn {
          width: 39px;
          height: 39px;
          border-radius: 11px;
        }

        .admin-order-card {
          border-radius: 19px;
        }

        .admin-order-header {
          min-height: 82px;
          padding: 17px 19px;
        }

        .admin-order-items {
          padding: 15px 19px 19px;
          background: #f7f9f8;
        }

        .admin-order-item {
          padding: 11px;
          border: 1px solid #e8eeeb;
        }

        .admin-customer-details {
          border: 1px solid #e7eeea;
        }

        .admin-customers-grid {
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 14px;
        }

        .admin-customer-card {
          padding: 20px;
          transition: transform .22s ease, box-shadow .22s ease;
        }

        .admin-customer-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 15px 35px rgba(19,62,50,.09);
        }

        .admin-customer-avatar {
          width: 50px;
          height: 50px;
          border-radius: 15px;
        }

        .admin-modal-overlay,
        .product-admin-modal-overlay {
          background: rgba(8, 27, 22, .52);
          backdrop-filter: blur(8px);
        }

        .admin-modal,
        .product-admin-modal {
          border: 1px solid rgba(255,255,255,.7);
          box-shadow: 0 35px 100px rgba(4, 26, 19, .28);
        }

        .product-admin-modal {
          max-width: 760px;
        }

        .product-admin-field input,
        .product-admin-field select,
        .product-admin-field textarea {
          min-height: 45px;
          border-radius: 12px;
          background: #f9fbfa;
        }

        .product-admin-field textarea {
          min-height: 190px;
        }

        .product-admin-preview {
          width: 96px;
          height: 96px;
          border-radius: 14px;
        }

        .product-admin-save {
          min-width: 150px;
          box-shadow: 0 9px 22px rgba(21,62,50,.14);
        }

        .product-admin-cancel {
          min-width: 100px;
        }

        @media (max-width: 1250px) {
          .admin-stat-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }

          .admin-customers-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 950px) {
          .admin-sidebar {
            width: 270px;
            min-width: 270px;
          }

          .admin-main {
            margin-left: 270px;
            padding: 30px 26px 45px;
          }

          .admin-product-row {
            flex-wrap: wrap;
          }

          .admin-product-info {
            min-width: calc(100% - 175px);
          }

          .admin-product-price {
            margin-left: 93px;
          }
        }

        @media (max-width: 800px) {
          .admin-main {
            margin-left: 0;
            padding: 18px 16px 35px;
          }

          .admin-mobile-header {
            min-height: 54px;
            margin: -2px 0 22px;
            padding: 7px 10px;
            border: 1px solid #e1e9e4;
            border-radius: 15px;
            background: rgba(255,255,255,.88);
            box-shadow: 0 7px 22px rgba(19,62,50,.05);
          }

          .admin-stat-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .admin-toolbar {
            flex-direction: column;
          }

          .admin-search {
            max-width: none;
            width: 100%;
          }

          .admin-primary-btn,
          .admin-secondary-btn {
            width: 100%;
          }

          .admin-product-row {
            display: grid;
            grid-template-columns: 64px minmax(0, 1fr) auto;
            align-items: start;
            gap: 12px;
          }

          .admin-product-image {
            width: 64px;
            height: 64px;
          }

          .admin-product-info {
            min-width: 0;
          }

          .admin-product-price {
            grid-column: 2 / -1;
            margin-left: 0;
            text-align: left;
            min-width: 0;
          }

          .admin-actions {
            grid-column: 3;
            grid-row: 1;
          }
        }

        @media (max-width: 600px) {
          .admin-page-header {
            margin-bottom: 24px;
          }

          .admin-page-header h1 {
            font-size: 1.9rem;
          }

          .admin-stat-grid {
            grid-template-columns: 1fr 1fr;
            gap: 10px;
          }

          .admin-stat-card {
            min-height: 104px;
            padding: 14px;
          }

          .admin-stat-value {
            font-size: 1.25rem;
          }

          .admin-section-card {
            padding: 17px;
          }

          .admin-customers-grid {
            grid-template-columns: 1fr;
          }

          .admin-product-row {
            grid-template-columns: 58px minmax(0, 1fr);
          }

          .admin-product-image {
            width: 58px;
            height: 58px;
          }

          .admin-actions {
            grid-column: 2;
            grid-row: 3;
            justify-content: flex-start;
          }

          .admin-product-price {
            grid-column: 2;
          }

          .product-admin-modal {
            max-height: 94vh;
          }
        }

        @media (max-width: 420px) {
          .admin-main {
            padding-left: 12px;
            padding-right: 12px;
          }

          .admin-stat-grid {
            grid-template-columns: 1fr;
          }

          .admin-product-badges {
            gap: 5px;
          }
        }
      `}</style>
    </div>
  );
}

/* =========================================================
   DASHBOARD
========================================================= */

function DashboardTab() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    pending: 0,
    processing: 0,
    completed: 0,
    revenue: 0,
    customers: 0,
  });

  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = useCallback(async () => {
    setLoading(true);

    try {
      const [
        ordersRes,
        pendingRes,
        processingRes,
        deliveredRes,
        customersRes,
        recentRes,
      ] = await Promise.all([
        supabase
          .from("orders")
          .select("id,total,status", {
            count: "exact",
          }),

        supabase
          .from("orders")
          .select("id", {
            count: "exact",
            head: true,
          })
          .in("status", ["pending", "confirmed"]),

        supabase
          .from("orders")
          .select("id", {
            count: "exact",
            head: true,
          })
          .eq("status", "processing"),

        supabase
          .from("orders")
          .select("id", {
            count: "exact",
            head: true,
          })
          .eq("status", "delivered"),

        supabase
          .from("profiles")
          .select("id", {
            count: "exact",
            head: true,
          }),

        supabase
          .from("orders")
          .select(
            `
              *,
              order_items (*)
            `
          )
          .order("created_at", {
            ascending: false,
          })
          .limit(5),
      ]);

      const revenue = (ordersRes.data || []).reduce(
        (sum, order) =>
          sum + Number(order.total || 0),
        0
      );

      setStats({
        totalOrders: ordersRes.count || 0,
        pending: pendingRes.count || 0,
        processing: processingRes.count || 0,
        completed: deliveredRes.count || 0,
        revenue,
        customers: customersRes.count || 0,
      });

      setRecentOrders(recentRes.data || []);
    } catch (error) {
      console.error(
        "Dashboard error:",
        error
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner spinner-lg" />
        <p>Loading dashboard...</p>
      </div>
    );
  }

  const cards = [
    {
      label: "Total Orders",
      value: stats.totalOrders,
      icon: ShoppingBag,
      background: "#e8f3ed",
      color: "#39745a",
    },
    {
      label: "Pending",
      value: stats.pending,
      icon: Clock,
      background: "#fef3c7",
      color: "#a16207",
    },
    {
      label: "Processing",
      value: stats.processing,
      icon: Boxes,
      background: "#e0e7ff",
      color: "#4338ca",
    },
    {
      label: "Completed",
      value: stats.completed,
      icon: CheckCircle,
      background: "#dcfce7",
      color: "#15803d",
    },
    {
      label: "Revenue",
      value: formatCurrency(stats.revenue),
      icon: DollarSign,
      background: "#e8f3ed",
      color: "#39745a",
    },
    {
      label: "Customers",
      value: stats.customers,
      icon: UserCheck,
      background: "#e8f3ed",
      color: "#39745a",
    },
  ];

  return (
    <div>
      <div className="admin-page-header">
        <div className="admin-eyebrow">
          Administration
        </div>

        <h1>
          Welcome back, Admin.
        </h1>

        <p>
          Manage your orders and agricultural products.
        </p>
      </div>

      <div className="admin-stat-grid">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.label}
              className="admin-card admin-stat-card"
            >
              <div
                className="admin-stat-icon"
                style={{
                  background: card.background,
                  color: card.color,
                }}
              >
                <Icon size={23} />
              </div>

              <div>
                <div className="admin-stat-value">
                  {card.value}
                </div>

                <div className="admin-stat-label">
                  {card.label}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="admin-card admin-section-card">
        <div className="admin-section-title">
          <h3>Recent Orders</h3>

          <button
            type="button"
            onClick={fetchDashboard}
            className="admin-icon-btn admin-edit-btn"
            title="Refresh"
          >
            <RefreshCw size={16} />
          </button>
        </div>

        {recentOrders.length === 0 ? (
          <p style={{ color: "#78837d" }}>
            No orders yet.
          </p>
        ) : (
          recentOrders.map((order) => (
            <div
              key={order.id}
              className="admin-order-mini"
            >
              <div className="admin-order-mini-icon">
                <Package size={18} />
              </div>

              <div className="admin-order-mini-info">
                <strong>
                  Order #{order.id}
                </strong>

                <span>
                  {order.delivery_name ||
                    "Customer"}{" "}
                  ·{" "}
                  {formatDate(order.created_at)}
                </span>
              </div>

              <span
                className={`admin-status-select ${order.status}`}
                style={{
                  padding: "6px 10px",
                }}
              >
                {order.status}
              </span>

              <strong>
                {formatCurrency(order.total)}
              </strong>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

/* =========================================================
   ORDERS
========================================================= */

function OrdersTab() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [search, setSearch] = useState("");
  const [error, setError] = useState(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from("orders")
        .select(
          `
            *,
            order_items (*)
          `
        )
        .order("created_at", {
          ascending: false,
        });

      if (error) throw error;

      setOrders(data || []);
    } catch (err) {
      console.error(
        "Orders error:",
        err
      );

      setError(
        err.message ||
          "Failed to load orders."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  /* -------------------------------------------------------
     STATUS UPDATE
  ------------------------------------------------------- */

  const handleStatusChange = async (
    orderId,
    newStatus
  ) => {
    setUpdatingId(orderId);

    try {
      const { data, error } = await supabase
        .from("orders")
        .update({
          status: newStatus,
        })
        .eq("id", orderId)
        .select("id,status")
        .single();

      if (error) {
        throw error;
      }

      setOrders((current) =>
        current.map((order) =>
          String(order.id) ===
          String(orderId)
            ? {
                ...order,
                status:
                  data?.status ||
                  newStatus,
              }
            : order
        )
      );
    } catch (err) {
      console.error(
        "Status update error:",
        err
      );

      alert(
        `Failed to update status: ${
          err.message || "Unknown error"
        }`
      );
    } finally {
      setUpdatingId(null);
    }
  };

  /* -------------------------------------------------------
     DELETE
  ------------------------------------------------------- */

  const handleDelete = async (orderId) => {
    const confirmed = window.confirm(
      "Delete this order permanently?"
    );

    if (!confirmed) return;

    setDeletingId(orderId);

    try {
      /*
        Delete child order_items first.
        This avoids foreign-key problems.
      */

      const { error: itemError } =
        await supabase
          .from("order_items")
          .delete()
          .eq("order_id", orderId);

      if (itemError) {
        throw itemError;
      }

      const { error } =
        await supabase
          .from("orders")
          .delete()
          .eq("id", orderId);

      if (error) {
        throw error;
      }

      setOrders((current) =>
        current.filter(
          (order) =>
            String(order.id) !==
            String(orderId)
        )
      );
    } catch (err) {
      console.error(
        "Delete order error:",
        err
      );

      alert(
        `Failed to delete order: ${
          err.message || ""
        }`
      );
    } finally {
      setDeletingId(null);
    }
  };

  const filteredOrders = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return orders;

    return orders.filter((order) => {
      return (
        String(order.id)
          .toLowerCase()
          .includes(query) ||
        String(
          order.delivery_name || ""
        )
          .toLowerCase()
          .includes(query) ||
        String(order.phone || "")
          .toLowerCase()
          .includes(query)
      );
    });
  }, [orders, search]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner spinner-lg" />
        <p>Loading orders...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="admin-page-header">
        <div className="admin-eyebrow">
          Order Management
        </div>

        <h1>Orders</h1>

        <p>
          Manage customer orders and update their status.
        </p>
      </div>

      {error && (
        <div className="error-banner">
          <AlertCircle size={17} />
          {error}
        </div>
      )}

      <div className="admin-toolbar">
        <div className="admin-search">
          <Search
            size={18}
            className="admin-search-icon"
          />

          <input
            type="search"
            placeholder="Search by order number, customer name or phone..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

          {search && (
            <button
              type="button"
              className="admin-search-clear"
              onClick={() => setSearch("")}
            >
              <X size={15} />
            </button>
          )}
        </div>

        <button
          type="button"
          className="admin-secondary-btn"
          onClick={fetchOrders}
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            <ShoppingBag size={32} />
          </div>

          <h3 className="empty-state-title">
            No orders found
          </h3>

          <p className="empty-state-text">
            Try changing your search.
          </p>
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}
        >
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="admin-card admin-order-card"
            >
              <div className="admin-order-header">
                <div
                  className="admin-order-mini-icon"
                  style={{
                    width: 48,
                    height: 48,
                  }}
                >
                  <Package size={21} />
                </div>

                <div
                  style={{
                    flex: 1,
                    minWidth: 160,
                  }}
                >
                  <div className="admin-order-number">
                    Order #{order.id}

                    {order.delivery_name && (
                      <>
                        {" "}
                        <span className="admin-customer-name">
                          · {order.delivery_name}
                        </span>
                      </>
                    )}
                  </div>

                  <div className="admin-order-details">
                    {order.order_items?.length ||
                      0}{" "}
                    {order.order_items?.length === 1
                      ? "item"
                      : "items"}{" "}
                    ·{" "}
                    {formatDate(order.created_at)}
                  </div>
                </div>

                {/* ADMIN ONLY STATUS CONTROL */}

                <select
                  value={
                    order.status || "pending"
                  }
                  onChange={(e) =>
                    handleStatusChange(
                      order.id,
                      e.target.value
                    )
                  }
                  disabled={
                    updatingId === order.id
                  }
                  className={`admin-status-select ${
                    order.status || "pending"
                  }`}
                  title="Update order status"
                >
                  {STATUS_OPTIONS.map(
                    (status) => (
                      <option
                        key={status}
                        value={status}
                      >
                        {updatingId === order.id &&
                        order.status === status
                          ? "Updating..."
                          : status
                              .charAt(0)
                              .toUpperCase() +
                            status.slice(1)}
                      </option>
                    )
                  )}
                </select>

                <strong
                  style={{
                    fontFamily:
                      "'Playfair Display', serif",
                    fontSize: "1.15rem",
                    color: "#153e32",
                  }}
                >
                  {formatCurrency(
                    order.total
                  )}
                </strong>

                <button
                  type="button"
                  onClick={() =>
                    handleDelete(order.id)
                  }
                  disabled={
                    deletingId === order.id
                  }
                  className="admin-icon-btn admin-delete-btn"
                  title="Delete order"
                >
                  {deletingId === order.id ? (
                    <span
                      className="spinner"
                      style={{
                        width: 15,
                        height: 15,
                        borderWidth: 2,
                      }}
                    />
                  ) : (
                    <Trash2 size={16} />
                  )}
                </button>
              </div>

              <div className="admin-order-items">
                {order.order_items?.map(
                  (item) => (
                    <AdminOrderItem
                      key={item.id}
                      item={item}
                    />
                  )
                )}

                <div className="admin-customer-details">
                  <div className="admin-customer-details-title">
                    Customer Details
                  </div>

                  <div className="admin-customer-detail">
                    <Users size={16} />

                    <strong>
                      {order.delivery_name ||
                        "Customer"}
                    </strong>
                  </div>

                  <div className="admin-customer-detail">
                    <Phone size={16} />

                    {order.phone ||
                      "Phone not available"}
                  </div>

                  <div className="admin-customer-detail">
                    <CalendarDays size={16} />

                    {formatDate(
                      order.created_at
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* =========================================================
   ADMIN ORDER ITEM
========================================================= */

function AdminOrderItem({ item }) {
  const [imageError, setImageError] =
    useState(false);

  const image =
    item.image_url ||
    item.product_image ||
    null;

  return (
    <div className="admin-order-item">
      <div className="admin-order-item-image">
        {image && !imageError ? (
          <img
            src={image}
            alt={
              item.product_name ||
              "Product"
            }
            onError={() =>
              setImageError(true)
            }
          />
        ) : (
          <Leaf
            size={24}
            color="#4a8b6f"
          />
        )}
      </div>

      <div className="admin-order-item-info">
        <strong>
          {item.product_name ||
            "Product"}
        </strong>

        <span>
          Qty: {item.quantity} ×{" "}
          {formatCurrency(item.price)}
        </span>
      </div>

      <strong
        style={{
          color: "#153e32",
        }}
      >
        {formatCurrency(
          Number(item.price || 0) *
            Number(item.quantity || 0)
        )}
      </strong>
    </div>
  );
}

/* =========================================================
   PRODUCTS
========================================================= */

function ProductsTab({ filter }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const getImageUrl = (product) => {
    if (!product) return "";

    // Your current Supabase table stores the image filename
    // in the `image` column.
    if (product.image && String(product.image).startsWith("http")) {
      return product.image;
    }

    if (product.image_url && String(product.image_url).startsWith("http")) {
      return product.image_url;
    }

    const fileName = product.image || product.image_file;

    if (!fileName) return "";

    const { data } = supabase.storage
      .from("product-images")
      .getPublicUrl(fileName);

    return data?.publicUrl || "";
  };

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      let query = supabase
        .from("products")
        .select("*")
        .order("id", { ascending: true });

      if (filter === "new") {
        query = query.eq("is_new", true);
      }

      if (filter === "upcoming") {
        query = query.eq("is_upcoming", true);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;

      const normalizedProducts = (data || []).map((product) => ({
        ...product,
        image_url: getImageUrl(product),
      }));

      setProducts(normalizedProducts);
    } catch (err) {
      console.error("PRODUCTS LOAD ERROR:", err);
      setError(err.message || "Failed to load products.");
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  /* -------------------------------------------------------
     ADD / EDIT
  ------------------------------------------------------- */

  const openAddProduct = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  const openEditProduct = (product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const closeProductForm = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  const handleProductSaved = async () => {
    closeProductForm();
    await fetchProducts();
  };

  /* -------------------------------------------------------
     DELETE
  ------------------------------------------------------- */

  const handleDelete = async (product) => {
    if (!product?.id) return;

    const confirmed = window.confirm(
      `Delete "${product.name}"?`
    );

    if (!confirmed) return;

    setDeletingId(product.id);
    setError(null);

    try {
      // If the product is already present in an order,
      // archive it instead of deleting it.
      const {
        count,
        error: countError,
      } = await supabase
        .from("order_items")
        .select("id", {
          count: "exact",
          head: true,
        })
        .eq("product_id", product.id);

      if (countError) throw countError;

      if ((count || 0) > 0) {
        const { error: archiveError } = await supabase
          .from("products")
          .update({ is_active: false })
          .eq("id", product.id);

        if (archiveError) throw archiveError;

        alert(
          `"${product.name}" is already used in an order, so it was archived instead of permanently deleted.`
        );
      } else {
        const imageFile =
          product.image_file ||
          (
            product.image &&
            !String(product.image).startsWith("http")
              ? product.image
              : null
          );

        const { error: deleteError } = await supabase
          .from("products")
          .delete()
          .eq("id", product.id);

        if (deleteError) throw deleteError;

        // Clean up the uploaded image if one exists.
        if (imageFile) {
          const { error: imageDeleteError } = await supabase.storage
            .from("product-images")
            .remove([imageFile]);

          if (imageDeleteError) {
            console.warn(
              "IMAGE CLEANUP WARNING:",
              imageDeleteError
            );
          }
        }
      }

      await fetchProducts();
    } catch (err) {
      console.error("DELETE PRODUCT ERROR:", err);

      alert(
        `Failed to delete product: ${
          err.message || "Unknown error"
        }`
      );
    } finally {
      setDeletingId(null);
    }
  };

  /* -------------------------------------------------------
     FILTERING
  ------------------------------------------------------- */

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();

    return products.filter((product) => {
      const category = getProductCategory(product);

      const categoryMatch =
        activeCategory === "All" ||
        category === activeCategory;

      const searchMatch =
        !query ||
        String(product.name || "")
          .toLowerCase()
          .includes(query) ||
        String(product.category || "")
          .toLowerCase()
          .includes(query) ||
        String(product.use_description || "")
          .toLowerCase()
          .includes(query) ||
        String(product.id || "")
          .toLowerCase()
          .includes(query);

      return categoryMatch && searchMatch;
    });
  }, [products, search, activeCategory]);

  const categoryCounts = useMemo(() => {
    const counts = {
      All: products.length,
    };

    CATEGORY_OPTIONS.forEach((category) => {
      counts[category] = products.filter(
        (product) => getProductCategory(product) === category
      ).length;
    });

    return counts;
  }, [products]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner spinner-lg" />
        <p>Loading products...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="admin-page-header">
        <div className="admin-eyebrow">
          Product Management
        </div>

        <h1>
          {filter === "new"
            ? "New Products"
            : filter === "upcoming"
            ? "Upcoming Products"
            : "Products"}
        </h1>

        <p>
          {filter === "new"
            ? "Manage products marked as new."
            : filter === "upcoming"
            ? "Manage upcoming products."
            : "Manage and organize your agricultural product catalog."}
        </p>
      </div>

      {error && (
        <div className="error-banner">
          <AlertCircle size={17} />
          {error}
        </div>
      )}

      {/* TOOLBAR */}

      <div className="admin-toolbar">
        <div className="admin-search">
          <Search
            size={18}
            className="admin-search-icon"
          />

          <input
            type="search"
            placeholder="Search product name, category, ID or details..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {search && (
            <button
              type="button"
              className="admin-search-clear"
              onClick={() => setSearch("")}
            >
              <X size={15} />
            </button>
          )}
        </div>

        <button
          type="button"
          className="admin-primary-btn"
          style={{ flex: "none" }}
          onClick={openAddProduct}
        >
          <Plus size={18} />
          Add Product
        </button>
      </div>

      {/* CATEGORY FILTER */}

      {!filter && (
        <div className="admin-category-tabs">
          {["All", ...CATEGORY_OPTIONS].map((category) => (
            <button
              key={category}
              type="button"
              className={`admin-category-tab ${
                activeCategory === category ? "active" : ""
              }`}
              onClick={() => setActiveCategory(category)}
            >
              {category}
              <span className="admin-category-count">
                ({categoryCounts[category] || 0})
              </span>
            </button>
          ))}
        </div>
      )}

      {/* PRODUCTS */}

      {filteredProducts.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            <Package size={32} />
          </div>

          <h3 className="empty-state-title">
            No products found
          </h3>

          <p className="empty-state-text">
            Try another search or category.
          </p>

          {(search || activeCategory !== "All") && (
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => {
                setSearch("");
                setActiveCategory("All");
              }}
            >
              Show All Products
            </button>
          )}
        </div>
      ) : (
        <div className="admin-products-list">
          {filteredProducts.map((product) => {
            const category = getProductCategory(product);
            const price = Number(product.price) || 0;

            return (
              <div
                key={product.id}
                className="admin-product-row"
              >
                {/* IMAGE */}

                <div className="admin-product-image">
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      onError={(event) => {
                        event.currentTarget.style.display = "none";
                      }}
                    />
                  ) : (
                    <Leaf
                      size={25}
                      color="#4a8b6f"
                    />
                  )}
                </div>

                {/* INFORMATION */}

                <div className="admin-product-info">
                  <div className="admin-product-name">
                    {product.name}
                  </div>

                  <div className="admin-product-meta">
                    Product ID #{product.id}
                  </div>

                  <div className="admin-product-badges">
                    <span className="admin-product-category">
                      {category}
                    </span>

                    <span
                      className={`admin-product-status ${
                        product.is_active
                          ? "is-active"
                          : "is-inactive"
                      }`}
                    >
                      <span className="admin-status-dot" />
                      {product.is_active ? "Active" : "Inactive"}
                    </span>

                    {product.is_new && (
                      <span className="admin-product-status is-new">
                        New
                      </span>
                    )}

                    {product.is_upcoming && (
                      <span className="admin-product-status is-upcoming">
                        Upcoming
                      </span>
                    )}
                  </div>

                  {product.use_description && (
                    <div
                      style={{
                        marginTop: "8px",
                        color: "#6d7973",
                        fontSize: "0.72rem",
                        lineHeight: 1.4,
                        maxWidth: "700px",
                      }}
                    >
                      {String(product.use_description)
                        .replace(/\s+/g, " ")
                        .slice(0, 150)}
                      {String(product.use_description).length > 150
                        ? "..."
                        : ""}
                    </div>
                  )}
                </div>

                {/* PRICE */}

                <div className="admin-product-price">
                  {price > 0
                    ? formatCurrency(price)
                    : "Price on request"}
                </div>

                {/* ACTIONS */}

                <div className="admin-actions">
                  <button
                    type="button"
                    className="admin-icon-btn admin-edit-btn"
                    onClick={() => openEditProduct(product)}
                    title="Edit product"
                    aria-label={`Edit ${product.name}`}
                  >
                    <Edit size={16} />
                  </button>

                  <button
                    type="button"
                    className="admin-icon-btn admin-delete-btn"
                    disabled={deletingId === product.id}
                    onClick={() => handleDelete(product)}
                    title="Delete product"
                    aria-label={`Delete ${product.name}`}
                  >
                    {deletingId === product.id ? (
                      <span
                        className="spinner"
                        style={{
                          width: 14,
                          height: 14,
                          borderWidth: 2,
                        }}
                      />
                    ) : (
                      <Trash2 size={16} />
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ADD / EDIT MODAL */}

      {showForm && (
        <ProductForm
          product={editingProduct}
          onClose={closeProductForm}
          onSaved={handleProductSaved}
        />
      )}
    </div>
  );
}


/* =========================================================
   PRODUCT FORM
========================================================= */

function ProductForm({
  product,
  onClose,
  onSaved,
}) {
  const getExistingImageUrl = () => {
    if (!product) return "";

    if (
      product.image_url &&
      String(product.image_url).startsWith("http")
    ) {
      return product.image_url;
    }

    if (
      product.image &&
      String(product.image).startsWith("http")
    ) {
      return product.image;
    }

    const fileName =
      product.image_file ||
      product.image;

    if (!fileName) return "";

    const { data } = supabase.storage
      .from("product-images")
      .getPublicUrl(fileName);

    return data?.publicUrl || "";
  };

  const [formData, setFormData] = useState({
    name: product?.name || "",
    category:
      normalizeCategory(product?.category) ||
      "Pesticides",
    price:
      product?.price ?? "",
    use_description:
      product?.use_description || "",
    image_file:
      product?.image_file ||
      (
        product?.image &&
        !String(product.image).startsWith("http")
          ? product.image
          : ""
      ),
    image_url: getExistingImageUrl(),
    is_active:
      product?.is_active ?? true,
    is_new:
      product?.is_new ?? false,
    is_upcoming:
      product?.is_upcoming ?? false,
  });

  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const categories = [
    "Herbicide",
    "Fungicide",
    "Pesticide",
    "Fertilizer",
    "Growth Promoter",
    "Enzymes & Mineral Activators",
  ];

  const updateField = (field, value) => {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      return;
    }

    try {
      setUploading(true);
      setError("");

      const extension =
        file.name.split(".").pop() || "jpg";

      const safeBaseName =
        file.name
          .replace(/\.[^/.]+$/, "")
          .replace(/[^a-zA-Z0-9._-]/g, "-");

      const fileName =
        `${Date.now()}-${safeBaseName}.${extension}`;

      const { error: uploadError } =
        await supabase.storage
          .from("product-images")
          .upload(
            fileName,
            file,
            {
              upsert: false,
            }
          );

      if (uploadError) {
        throw uploadError;
      }

      const { data } =
        supabase.storage
          .from("product-images")
          .getPublicUrl(fileName);

      updateField("image_file", fileName);
      updateField(
        "image_url",
        data?.publicUrl || ""
      );
    } catch (uploadError) {
      console.error(
        "IMAGE UPLOAD ERROR:",
        uploadError
      );

      setError(
        uploadError.message ||
          "Could not upload image."
      );
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.name.trim()) {
      setError("Product name is required.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      /*
        IMPORTANT:
        Your Supabase products table uses:
        - name
        - category
        - price
        - use_description
        - image
        - is_active
        - is_new
        - is_upcoming

        Do NOT send `description`, `use` or `image_url`
        as database columns.
      */

      const payload = {
        name: formData.name.trim(),
        category: normalizeCategory(formData.category),
        price:
          formData.price === ""
            ? 0
            : Number(formData.price) || 0,
        use_description:
          formData.use_description.trim() || null,
        image:
          formData.image_file || null,
        is_active:
          Boolean(formData.is_active),
        is_new:
          Boolean(formData.is_new),
        is_upcoming:
          Boolean(formData.is_upcoming),
      };

      let saveError = null;

      if (product?.id) {
        const result = await supabase
          .from("products")
          .update(payload)
          .eq("id", product.id);

        saveError = result.error;
      } else {
        const result = await supabase
          .from("products")
          .insert(payload);

        saveError = result.error;
      }

      if (saveError) {
        throw saveError;
      }

      await onSaved();
    } catch (saveError) {
      console.error(
        "SAVE PRODUCT ERROR:",
        saveError
      );

      setError(
        saveError.message ||
          "Could not save product."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="product-admin-modal-overlay"
      onClick={onClose}
    >
      <form
        className="product-admin-modal"
        onClick={(event) =>
          event.stopPropagation()
        }
        onSubmit={handleSubmit}
      >
        <div className="product-admin-modal-header">
          <div>
            <span>PRODUCT MANAGEMENT</span>
            <h2>
              {product
                ? "Edit Product"
                : "Add Product"}
            </h2>
          </div>

          <button
            type="button"
            className="product-admin-close"
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {error && (
          <div className="product-admin-error">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        <div className="product-admin-grid">
          {/* NAME */}

          <div className="product-admin-field">
            <label htmlFor="admin-product-name">
              Product Name
            </label>

            <input
              id="admin-product-name"
              type="text"
              value={formData.name}
              onChange={(event) =>
                updateField(
                  "name",
                  event.target.value
                )
              }
              placeholder="Enter product name"
              required
            />
          </div>

          {/* CATEGORY */}

          <div className="product-admin-field">
            <label htmlFor="admin-product-category">
              Category
            </label>

            <select
              id="admin-product-category"
              value={formData.category}
              onChange={(event) =>
                updateField(
                  "category",
                  event.target.value
                )
              }
            >
              {categories.map((category) => (
                <option
                  value={category}
                  key={category}
                >
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* PRICE */}

          <div className="product-admin-field">
            <label htmlFor="admin-product-price">
              Price (₹)
            </label>

            <input
              id="admin-product-price"
              type="number"
              min="0"
              step="0.01"
              value={formData.price}
              onChange={(event) =>
                updateField(
                  "price",
                  event.target.value
                )
              }
              placeholder="0 for price on request"
            />
          </div>

          {/* IMAGE */}

          <div className="product-admin-field">
            <label htmlFor="admin-product-image">
              Product Image
            </label>

            <input
              id="admin-product-image"
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={handleImageUpload}
              disabled={uploading}
            />

            <small>
              {uploading
                ? "Uploading image..."
                : "PNG, JPG, JPEG or WEBP"}
            </small>
          </div>

          {/* IMAGE PREVIEW */}

          {formData.image_url && (
            <div className="product-admin-field">
              <label>
                Preview
              </label>

              <div className="product-admin-preview">
                <img
                  src={formData.image_url}
                  alt="Product preview"
                  onError={(event) => {
                    event.currentTarget.style.display =
                      "none";
                  }}
                />
              </div>
            </div>
          )}

          {/* DETAILS + DOSAGE */}

          <div className="product-admin-field full">
            <label htmlFor="admin-product-details">
              Details & Dosage
            </label>

            <textarea
              id="admin-product-details"
              value={formData.use_description}
              onChange={(event) =>
                updateField(
                  "use_description",
                  event.target.value
                )
              }
              placeholder={`Technical Name: ...

Benefits:
1. ...
2. ...
3. ...

Recommended Dosage:
...`}
            />

            <small>
              Enter the complete product details,
              benefits, usage and recommended dosage here.
            </small>
          </div>

          {/* STATUS */}

          <div className="product-admin-field full">
            <div className="product-admin-checks">
              <label>
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(event) =>
                    updateField(
                      "is_active",
                      event.target.checked
                    )
                  }
                />
                Active product
              </label>

              <label>
                <input
                  type="checkbox"
                  checked={formData.is_new}
                  onChange={(event) =>
                    updateField(
                      "is_new",
                      event.target.checked
                    )
                  }
                />
                New product
              </label>

              <label>
                <input
                  type="checkbox"
                  checked={formData.is_upcoming}
                  onChange={(event) =>
                    updateField(
                      "is_upcoming",
                      event.target.checked
                    )
                  }
                />
                Upcoming product
              </label>
            </div>
          </div>
        </div>

        <div className="product-admin-actions-row">
          <button
            type="button"
            className="product-admin-cancel"
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="product-admin-save"
            disabled={saving || uploading}
          >
            {saving
              ? "Saving..."
              : product
              ? "Save Changes"
              : "Add Product"}
          </button>
        </div>
      </form>
    </div>
  );
}


/* =========================================================
   PRODUCT CRUD MODAL STYLES
========================================================= */

/* =========================================================
   CUSTOMERS
========================================================= */

function CustomersTab() {
  const [customers, setCustomers] =
    useState([]);

  const [orders, setOrders] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  useEffect(() => {
    const fetchCustomers =
      async () => {
        setLoading(true);

        try {
          const [
            profilesRes,
            ordersRes,
          ] = await Promise.all([
            supabase
              .from("profiles")
              .select("*")
              .order(
                "created_at",
                {
                  ascending: false,
                }
              ),

            supabase
              .from("orders")
              .select(
                "id,user_id,total,status"
              ),
          ]);

          if (
            profilesRes.error
          ) {
            throw profilesRes.error;
          }

          if (
            ordersRes.error
          ) {
            throw ordersRes.error;
          }

          setCustomers(
            profilesRes.data ||
              []
          );

          setOrders(
            ordersRes.data ||
              []
          );
        } catch (error) {
          console.error(
            "Customers error:",
            error
          );
        } finally {
          setLoading(false);
        }
      };

    fetchCustomers();
  }, []);

  const filteredCustomers =
    useMemo(() => {
      const query =
        search
          .trim()
          .toLowerCase();

      if (!query) {
        return customers;
      }

      return customers.filter(
        (customer) =>
          String(
            customer.name || ""
          )
            .toLowerCase()
            .includes(query) ||
          String(
            customer.email || ""
          )
            .toLowerCase()
            .includes(query) ||
          String(
            customer.phone || ""
          )
            .toLowerCase()
            .includes(query)
      );
    }, [
      customers,
      search,
    ]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner spinner-lg" />
        <p>Loading customers...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="admin-page-header">
        <div className="admin-eyebrow">
          Customer Management
        </div>

        <h1>Customers</h1>

        <p>
          View registered customers and their order history.
        </p>
      </div>

      <div className="admin-toolbar">
        <div className="admin-search">
          <Search
            size={18}
            className="admin-search-icon"
          />

          <input
            type="search"
            placeholder="Search customer name, email or phone..."
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
          />

          {search && (
            <button
              type="button"
              className="admin-search-clear"
              onClick={() =>
                setSearch("")
              }
            >
              <X size={15} />
            </button>
          )}
        </div>
      </div>

      {filteredCustomers.length ===
      0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            <Users size={32} />
          </div>

          <h3 className="empty-state-title">
            No customers found
          </h3>

          <p className="empty-state-text">
            No customers match your search.
          </p>
        </div>
      ) : (
        <div className="admin-customers-grid">
          {filteredCustomers.map(
            (customer) => {
              const customerOrders =
                orders.filter(
                  (order) =>
                    String(
                      order.user_id
                    ) ===
                    String(
                      customer.id
                    )
                );

              const name =
                customer.name ||
                "Unnamed";

              return (
                <div
                  key={customer.id}
                  className="admin-card admin-customer-card"
                >
                  <div className="admin-customer-head">
                    <div className="admin-customer-avatar">
                      {(
                        name[0] ||
                        "U"
                      ).toUpperCase()}
                    </div>

                    <div className="admin-customer-info">
                      <strong>
                        {name}
                      </strong>

                      <span>
                        {customer.email ||
                          "No email"}
                      </span>
                    </div>
                  </div>

                  <div className="admin-customer-meta">
                    <div className="admin-customer-meta-row">
                      <span>
                        Phone
                      </span>

                      <strong>
                        {customer.phone ||
                          "—"}
                      </strong>
                    </div>

                    <div className="admin-customer-meta-row">
                      <span>
                        Role
                      </span>

                      <strong
                        style={{
                          textTransform:
                            "capitalize",
                        }}
                      >
                        {customer.role ||
                          "user"}
                      </strong>
                    </div>

                    <div className="admin-customer-meta-row">
                      <span>
                        Orders
                      </span>

                      <strong>
                        {
                          customerOrders.length
                        }
                      </strong>
                    </div>

                    <div className="admin-customer-meta-row">
                      <span>
                        Joined
                      </span>

                      <strong>
                        {formatDate(
                          customer.created_at
                        )}
                      </strong>
                    </div>
                  </div>
                </div>
              );
            }
          )}
        </div>
      )}
    </div>
  );
}
