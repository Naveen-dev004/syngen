import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Package,
  XCircle,
  Clock,
  CheckCircle,
  Truck,
} from "lucide-react";

import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";

const BUCKET_NAME = "product-images";

/* =========================================================
   GET PRODUCT IMAGE URL
========================================================= */

function getProductImage(imageName) {
  if (!imageName) {
    return null;
  }

  const cleanName = String(imageName)
    .trim()
    .replace(/^\/+/, "");

  if (!cleanName) {
    return null;
  }

  if (
    cleanName.startsWith("http://") ||
    cleanName.startsWith("https://")
  ) {
    return cleanName;
  }

  const { data } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(cleanName);

  return data?.publicUrl || null;
}

/* =========================================================
   ORDERS PAGE
========================================================= */

export default function Orders() {
  const { user } = useAuth();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);



  /* =======================================================
     LOAD ORDERS
  ======================================================= */

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    loadOrders();
  }, [user]);

  /* =======================================================
     FETCH ORDERS
  ======================================================= */

  const loadOrders = async () => {
    try {
      setLoading(true);

      console.log(
        "========================================"
      );

      console.log(
        "LOADING ORDERS FOR USER:",
        user.id
      );

      /* =====================================================
         GET ORDERS
      ===================================================== */

      const {
        data: orderData,
        error: orderError,
      } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", {
          ascending: false,
        });

      if (orderError) {
        console.error(
          "ORDERS ERROR:",
          orderError
        );

        setOrders([]);
        return;
      }

      console.log(
        "ORDERS FROM DATABASE:",
        orderData
      );

      if (!orderData || orderData.length === 0) {
        setOrders([]);
        return;
      }

      /* =====================================================
         GET ORDER ITEMS
      ===================================================== */

      const orderIds = orderData.map(
        (order) => order.id
      );

      const {
        data: orderItems,
        error: orderItemsError,
      } = await supabase
        .from("order_items")
        .select("*")
        .in("order_id", orderIds);

      if (orderItemsError) {
        console.error(
          "ORDER ITEMS ERROR:",
          orderItemsError
        );

        setOrders(
          orderData.map((order) => ({
            ...order,
            items: [],
          }))
        );

        return;
      }

      console.log(
        "ORDER ITEMS FROM DATABASE:",
        orderItems
      );

      /* =====================================================
         GET PRODUCT IDS
      ===================================================== */

      const productIds = [
        ...new Set(
          (orderItems || [])
            .map(
              (item) =>
                item.product_id
            )
            .filter(Boolean)
        ),
      ];

      console.log(
        "PRODUCT IDS:",
        productIds
      );

      /* =====================================================
         GET PRODUCTS
      ===================================================== */

      let products = [];

      if (productIds.length > 0) {
        const {
          data: productData,
          error: productError,
        } = await supabase
          .from("products")
          .select(
            `
              id,
              name,
              category,
              image,
              price,
              use_description
            `
          )
          .in("id", productIds);

        if (productError) {
          console.error(
            "PRODUCTS ERROR:",
            productError
          );
        } else {
          products = productData || [];
        }
      }

      console.log(
        "PRODUCTS FROM DATABASE:",
        products
      );

      /* =====================================================
         COMBINE DATA
      ===================================================== */

      const completeOrders =
        orderData.map((order) => {
          const currentItems =
            (orderItems || []).filter(
              (item) =>
                String(item.order_id) ===
                String(order.id)
            );

          const completeItems =
            currentItems.map((item) => {
              const product =
                products.find(
                  (p) =>
                    String(p.id) ===
                    String(item.product_id)
                );

              return {
                ...item,
                product:
                  product || null,
              };
            });

          return {
            ...order,
            items: completeItems,
          };
        });

      console.log(
        "COMPLETE ORDERS:",
        completeOrders
      );

      setOrders(completeOrders);

    } catch (error) {
      console.error(
        "LOAD ORDERS ERROR:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  /* =========================================================
     FORMAT DATE
  ========================================================= */

  const formatDate = (date) => {
    if (!date) {
      return "";
    }

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "numeric",
        month: "numeric",
        year: "numeric",
      }
    );
  };

  /* =========================================================
     FORMAT PRICE
  ========================================================= */

  const formatPrice = (price) => {
    const value = Number(price || 0);

    return `₹${value.toLocaleString(
      "en-IN"
    )}`;
  };

  /* =========================================================
     STATUS ICON
  ========================================================= */

  const getStatusIcon = (status) => {
    const value = String(
      status || ""
    ).toLowerCase();

    if (
      value === "cancelled" ||
      value === "canceled"
    ) {
      return <XCircle size={15} />;
    }

    if (
      value === "delivered" ||
      value === "completed"
    ) {
      return (
        <CheckCircle size={15} />
      );
    }

    if (
      value === "shipped" ||
      value === "out_for_delivery"
    ) {
      return <Truck size={15} />;
    }

    return <Clock size={15} />;
  };

  /* =========================================================
     STATUS CLASS
  ========================================================= */

  const getStatusClass = (status) => {
    const value = String(
      status || ""
    ).toLowerCase();

    if (
      value === "cancelled" ||
      value === "canceled"
    ) {
      return "status-cancelled";
    }

    if (
      value === "delivered" ||
      value === "completed"
    ) {
      return "status-completed";
    }

    if (
      value === "shipped" ||
      value === "out_for_delivery"
    ) {
      return "status-shipped";
    }

    return "status-pending";
  };

  /* =========================================================
     NOT LOGGED IN
  ========================================================= */

  if (!user) {
    return (
      <>
        <style>{`

          .orders-page {
            min-height: 80vh;
            padding: 60px 20px;
            background: #ffffff;
          }

          .orders-login {
            max-width: 450px;
            margin: auto;
            text-align: center;
          }

          .orders-login-icon {
            width: 65px;
            height: 65px;
            margin: 0 auto 20px;

            border-radius: 50%;

            background: #edf7f1;
            color: #17543d;

            display: flex;
            align-items: center;
            justify-content: center;
          }

          .orders-login h1 {
            margin: 0 0 10px;

            color: #173f30;

            font-family: Georgia, serif;

            font-size: 32px;
          }

          .orders-login p {
            color: #6d7c74;

            margin-bottom: 25px;
          }

          .orders-login a {
            display: inline-block;

            padding: 11px 22px;

            background: #124c37;

            color: white;

            border-radius: 8px;

            text-decoration: none;

            font-weight: 600;
          }

        `}</style>

        <main className="orders-page">

          <div className="orders-login">

            <div className="orders-login-icon">
              <Package size={30} />
            </div>

            <h1>
              My Orders
            </h1>

            <p>
              Please login to view your orders.
            </p>

            <Link to="/login">
              Login
            </Link>

          </div>

        </main>
      </>
    );
  }

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <>
        <style>{`

          .orders-loading {
            min-height: 70vh;

            display: flex;
            align-items: center;
            justify-content: center;

            color: #17543d;

            font-size: 17px;
          }

          .orders-spinner {
            width: 28px;
            height: 28px;

            border: 3px solid #dcebe3;
            border-top-color: #17543d;

            border-radius: 50%;

            animation:
              ordersSpin
              0.8s linear infinite;

            margin-right: 10px;
          }

          @keyframes ordersSpin {
            to {
              transform: rotate(360deg);
            }
          }

        `}</style>

        <div className="orders-loading">

          <div className="orders-spinner" />

          Loading your orders...

        </div>
      </>
    );
  }

  /* =========================================================
     MAIN PAGE
  ========================================================= */

  return (
    <>
      <style>{`

        /* ================================================
           PAGE
        ================================================ */

        .orders-page {
          width: 100%;
          min-height: 80vh;

          background: #ffffff;

          padding:
            45px
            20px
            80px;

          box-sizing: border-box;
        }

        .orders-container {
          width: 100%;
          max-width: 1180px;

          margin: 0 auto;
        }

        /* ================================================
           HEADING
        ================================================ */

        .orders-heading {
          margin-bottom: 35px;
        }

        .orders-heading h1 {
          margin: 0 0 7px;

          color: #173f30;

          font-family: Georgia, serif;

          font-size: 38px;

          line-height: 1.2;
        }

        .orders-heading p {
          margin: 0;

          color: #687870;

          font-size: 17px;
        }

        /* ================================================
           EMPTY
        ================================================ */

        .orders-empty {
          padding: 60px 30px;

          text-align: center;

          border:
            1px solid #e2eae5;

          border-radius: 18px;

          background: #fbfdfc;
        }

        .orders-empty-icon {
          width: 65px;
          height: 65px;

          margin:
            0
            auto
            18px;

          border-radius: 50%;

          background: #edf7f1;

          color: #17543d;

          display: flex;

          align-items: center;
          justify-content: center;
        }

        .orders-empty h2 {
          margin: 0 0 8px;

          color: #173f30;

          font-size: 23px;
        }

        .orders-empty p {
          margin: 0 0 22px;

          color: #738078;
        }

        .orders-shop-button {
          display: inline-block;

          padding:
            11px
            22px;

          background: #124c37;

          color: white;

          text-decoration: none;

          border-radius: 8px;

          font-weight: 600;
        }

        /* ================================================
           ORDER CARD
        ================================================ */

        .order-card {
          margin-bottom: 20px;

          border:
            1px solid #e0e9e4;

          border-radius: 17px;

          overflow: hidden;

          background: #ffffff;

          box-shadow:
            0
            5px
            20px
            rgba(20, 61, 44, 0.05);
        }

        /* ================================================
           ORDER HEADER
        ================================================ */

        .order-header {
          display: grid;

          grid-template-columns:
            62px
            1fr
            auto
            35px;

          align-items: center;

          gap: 15px;

          padding:
            20px
            24px;

          background: #fbfdfc;

          cursor: pointer;
        }

        /* ================================================
           PRODUCT IMAGE BOX
        ================================================ */

        .order-header-image {
          width: 55px;
          height: 55px;

          border-radius: 10px;

          background: #edf7f1;

          border:
            1px solid #dfeae4;

          overflow: hidden;

          display: flex;

          align-items: center;

          justify-content: center;
        }

        .order-header-image img {
          width: 100%;
          height: 100%;

          object-fit: contain;

          display: block;
        }

        .order-header-image-placeholder {
          width: 100%;
          height: 100%;

          display: flex;

          align-items: center;

          justify-content: center;

          color: #17543d;
        }

        /* ================================================
           ORDER INFO
        ================================================ */

        .order-main-info {
          min-width: 0;
        }

        .order-title {
          margin:
            0
            4px;

          color: #173f30;

          font-family: Georgia, serif;

          font-size: 18px;
        }

        .order-product-name {
          color: #4a6b5d;

          font-size: 14px;

          font-weight: 500;

          margin: 3px 0 0;

          white-space: nowrap;

          overflow: hidden;

          text-overflow: ellipsis;
        }

        .order-meta {
          color: #718078;

          font-size: 14px;
        }

        .order-total {
          color: #173f30;

          font-size: 17px;

          font-weight: 700;
        }

        .order-expand {
          color: #235740;

          display: flex;

          justify-content: center;
        }

        /* ================================================
           STATUS
        ================================================ */

        .order-status {
          display: inline-flex;

          align-items: center;

          gap: 5px;

          margin-top: 9px;

          padding:
            5px
            9px;

          border-radius: 6px;

          font-size: 12px;

          font-weight: 600;
        }

        .status-cancelled {
          color: #d32929;

          background: #fff0f0;
        }

        .status-completed {
          color: #187448;

          background: #eaf7ef;
        }

        .status-shipped {
          color: #28658a;

          background: #edf6fb;
        }

        .status-pending {
          color: #996b14;

          background: #fff8e7;
        }

        /* ================================================
           ORDER CONTENT
        ================================================ */

        .order-content {
          padding: 18px;

          border-top:
            1px solid #e5ebe7;
        }

        /* ================================================
           PRODUCT ROW
           NO IMAGE HERE
        ================================================ */

        .order-item {
          display: flex;

          align-items: center;

          gap: 18px;

          padding:
            15px
            17px;

          margin-bottom: 10px;

          border:
            1px solid #e7ece9;

          border-radius: 13px;

          background: #ffffff;
        }

        .order-item:last-child {
          margin-bottom: 0;
        }

        /* ================================================
           PRODUCT INFO
        ================================================ */

        .order-item-info {
          flex: 1;

          min-width: 0;
        }

        .order-item-category {
          color: #278057;

          font-size: 10px;

          font-weight: 700;

          text-transform: uppercase;

          letter-spacing: 0.08em;

          margin-bottom: 4px;
        }

        .order-item-name {
          margin:
            0
            0
            6px;

          color: #173f30;

          font-family: Georgia, serif;

          font-size: 19px;

          font-weight: 700;
        }

        .order-item-quantity {
          color: #718078;

          font-size: 13px;
        }

        /* ================================================
           PRICE
        ================================================ */

        .order-item-price {
          min-width: 140px;

          text-align: right;
        }

        .order-item-price-label {
          display: block;

          color: #89938e;

          font-size: 11px;

          margin-bottom: 3px;
        }

        .order-item-price-value {
          color: #216848;

          font-size: 16px;

          font-weight: 700;
        }

        /* ================================================
           MOBILE
        ================================================ */

        @media (max-width: 700px) {

          .orders-page {
            padding:
              30px
              15px
              60px;
          }

          .orders-heading h1 {
            font-size: 31px;
          }

          .order-header {
            grid-template-columns:
              52px
              1fr
              30px;

            padding: 17px;
          }

          .order-header-image {
            width: 48px;
            height: 48px;
          }

          .order-total {
            display: none;
          }

          .order-content {
            padding: 12px;
          }

          .order-item {
            gap: 12px;

            padding:
              12px;
              ;
          }

          .order-item-name {
            font-size: 17px;
          }

          .order-item-price {
            min-width: auto;
          }
        }

        @media (max-width: 500px) {

          .order-header {
            grid-template-columns:
              48px
              1fr
              28px;
          }

          .order-header-image {
            width: 44px;
            height: 44px;
          }

          .order-item {
            display: block;
          }

          .order-item-price {
            margin-top: 10px;

            text-align: left;
          }

          .order-item-price-label {
            display: inline;

            margin-right: 5px;
          }

        }

      `}</style>

      <main className="orders-page">

        <div className="orders-container">

          {/* =================================================
              PAGE HEADING
          ================================================= */}

          <div className="orders-heading">

            <h1>
              My Orders
            </h1>

            <p>
              Track and manage all your
              orders in one place.
            </p>

          </div>

          {/* =================================================
              NO ORDERS
          ================================================= */}

          {orders.length === 0 ? (

            <div className="orders-empty">

              <div className="orders-empty-icon">
                <Package size={30} />
              </div>

              <h2>
                No orders yet
              </h2>

              <p>
                Your placed orders will
                appear here.
              </p>

              <Link
                to="/products"
                className="orders-shop-button"
              >
                Browse Products
              </Link>

            </div>

          ) : (

            <div>

              {orders.map(
                (order, index) => {

                  const items =
                    order.items || [];



                  const status =
                    order.status ||
                    "Pending";

                  const orderNumber =
                    order.order_number ||
                    order.id ||
                    index + 1;

                  const total =
                    order.total_amount ??
                    order.total ??
                    order.amount ??
                    0;

                  /* =========================================
                     FIRST PRODUCT IMAGE
                  ========================================= */

                  const firstProduct =
                    items[0]?.product;

                  const firstItem =
                    items[0];

                  const firstImage =
                    firstProduct?.image ||
                    firstItem?.image ||
                    firstItem?.image_url ||
                    null;

                  const firstImageUrl =
                    getProductImage(
                      firstImage
                    );

                  return (
                    <section
                      className="order-card"
                      key={
                        order.id ||
                        index
                      }
                    >

                      {/* =====================================
                          ORDER HEADER
                      ===================================== */}

                      <div
                        className="order-header"
                      >

                        {/* =================================
                            SMALL PRODUCT IMAGE
                        ================================= */}

                        <div className="order-header-image">

                          {firstImageUrl ? (

                            <img
                              src={
                                firstImageUrl
                              }
                              alt={
                                firstProduct?.name ||
                                "Product"
                              }
                            />

                          ) : (

                            <div className="order-header-image-placeholder">

                              <Package
                                size={25}
                              />

                            </div>

                          )}

                        </div>

                        {/* =================================
                            ORDER INFORMATION
                        ================================= */}

                        <div className="order-main-info">

                          <h2 className="order-title">
                            Order #
                            {
                              orderNumber
                            }
                          </h2>

                          <div className="order-product-name">
                            {items
                              .map(
                                (item) =>
                                  item.product?.name ||
                                  item.product_name ||
                                  item.name ||
                                  "Product"
                              )
                              .join(", ")}
                          </div>

                          <div className="order-meta">

                            {items.length}

                            {" "}

                            {items.length ===
                            1
                              ? "item"
                              : "items"}

                            {" • "}

                            {formatDate(
                              order.created_at
                            )}

                          </div>

                          <div
                            className={`order-status ${getStatusClass(
                              status
                            )}`}
                          >

                            {getStatusIcon(
                              status
                            )}

                            {String(
                              status
                            )
                              .charAt(
                                0
                              )
                              .toUpperCase() +
                              String(
                                status
                              ).slice(
                                1
                              )}

                          </div>

                        </div>

                        {/* =================================
                            TOTAL
                        ================================= */}

                        <div className="order-total">

                          {formatPrice(
                            total
                          )}

                        </div>



                      </div>



                    </section>
                  );
                }
              )}

            </div>

          )}

        </div>

      </main>
    </>
  );
}