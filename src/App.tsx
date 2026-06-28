import { useState, useEffect } from "react";
import { Product, CartItem, Order, ViewType, Coupon } from "./types";
import { INITIAL_PRODUCTS, INITIAL_ORDERS, AVAILABLE_COUPONS } from "./data";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HomeView from "./components/HomeView";
import ProductDetailView from "./components/ProductDetailView";
import CartView from "./components/CartView";
import CheckoutView from "./components/CheckoutView";
import OrderTrackingView from "./components/OrderTrackingView";
import MyAccountView from "./components/MyAccountView";
import AdminDashboardView from "./components/AdminDashboardView";
import TermsView from "./components/TermsView";
import PrivacyView from "./components/PrivacyView";
import RefundView from "./components/RefundView";
import AuthView from "./components/AuthView";
import { seedUsers, UserSession } from "./lib/authUtils";
import { Clock, AlertCircle, MessageSquareDot } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { db, handleFirestoreError, OperationType } from "./lib/firebase";
import { collection, doc, setDoc, onSnapshot, updateDoc, writeBatch, getDocFromServer } from "firebase/firestore";

// Helper to parse the path or hash or search query parameters and return routing state
const getViewFromUrl = (): {
  view: ViewType;
  productId?: string;
  orderId?: string;
} => {
  const pathname = window.location.pathname;
  const hash = window.location.hash;
  const search = window.location.search;
  const params = new URLSearchParams(search);

  // 1. Direct path matches
  if (pathname === "/admin" || hash === "#admin") {
    return { view: "admin" };
  }
  if (pathname === "/login" || hash === "#login") {
    return { view: "login" };
  }
  if (pathname === "/cart" || hash === "#cart") {
    return { view: "cart" };
  }
  if (pathname === "/checkout" || hash === "#checkout") {
    return { view: "checkout" };
  }
  if (pathname === "/account" || hash === "#account") {
    return { view: "account" };
  }
  if (pathname === "/terms" || hash === "#terms") {
    return { view: "terms" };
  }
  if (pathname === "/privacy" || hash === "#privacy") {
    return { view: "privacy" };
  }
  if (pathname === "/refund" || hash === "#refund") {
    return { view: "refund" };
  }

  // 2. Order Tracking pattern
  if (pathname === "/tracking" || hash.startsWith("#tracking")) {
    const orderId = params.get("id") || hash.split("?id=")[1] || "";
    return { view: "tracking", orderId };
  }
  if (pathname.startsWith("/tracking/")) {
    const orderId = pathname.substring("/tracking/".length);
    return { view: "tracking", orderId };
  }

  // 3. Product detail pattern
  if (pathname === "/product" || hash.startsWith("#product")) {
    const productId = params.get("id") || hash.split("?id=")[1] || "";
    return { view: "product-detail", productId };
  }
  if (pathname.startsWith("/product/")) {
    const productId = pathname.substring("/product/".length);
    return { view: "product-detail", productId };
  }

  return { view: "home" };
};

export default function App() {
  // Global Shared States initialized to fallbacks, then synced with Firestore in real-time
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);

  const [cart, setCart] = useState<CartItem[]>([]);

  // 1. Validate connection to Firestore on boot
  useEffect(() => {
    async function testConnection() {
      try {
        await getDocFromServer(doc(db, "products", "connection-test"));
      } catch (error) {
        if (error instanceof Error && error.message.includes("the client is offline")) {
          console.error("Please check your Firebase configuration.");
        }
      }
    }
    testConnection();
  }, []);

  // 2. Subscribe to products collection in real-time
  useEffect(() => {
    const productsRef = collection(db, "products");
    const unsubscribe = onSnapshot(
      productsRef,
      async (snapshot) => {
        if (snapshot.empty) {
          console.log("Seeding initial products to Firestore...");
          try {
            const batch = writeBatch(db);
            INITIAL_PRODUCTS.forEach((product) => {
              const productDocRef = doc(db, "products", product.id);
              batch.set(productDocRef, product);
            });
            await batch.commit();
          } catch (error) {
            handleFirestoreError(error, OperationType.WRITE, "products");
          }
        } else {
          const loadedProducts: Product[] = [];
          snapshot.forEach((doc) => {
            loadedProducts.push(doc.data() as Product);
          });
          const initialIds = INITIAL_PRODUCTS.map((p) => p.id);
          loadedProducts.sort((a, b) => {
            const idxA = initialIds.indexOf(a.id);
            const idxB = initialIds.indexOf(b.id);
            if (idxA !== -1 && idxB !== -1) return idxA - idxB;
            if (idxA !== -1) return -1;
            if (idxB !== -1) return 1;
            return a.name.localeCompare(b.name);
          });
          setProducts(loadedProducts);
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, "products");
      }
    );
    return () => unsubscribe();
  }, []);

  // 3. Subscribe to orders collection in real-time
  useEffect(() => {
    const ordersRef = collection(db, "orders");
    const unsubscribe = onSnapshot(
      ordersRef,
      async (snapshot) => {
        if (snapshot.empty) {
          console.log("Seeding initial orders to Firestore...");
          try {
            const batch = writeBatch(db);
            INITIAL_ORDERS.forEach((order) => {
              const orderDocRef = doc(db, "orders", order.id);
              batch.set(orderDocRef, order);
            });
            await batch.commit();
          } catch (error) {
            handleFirestoreError(error, OperationType.WRITE, "orders");
          }
        } else {
          const loadedOrders: Order[] = [];
          snapshot.forEach((doc) => {
            loadedOrders.push(doc.data() as Order);
          });
          loadedOrders.sort((a, b) => {
            const timeA = new Date(a.datePlaced || a.date).getTime();
            const timeB = new Date(b.datePlaced || b.date).getTime();
            return timeB - timeA;
          });
          setOrders(loadedOrders);
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, "orders");
      }
    );
    return () => unsubscribe();
  }, []);

  // Secure User session details State
  const [session, setSession] = useState<UserSession | null>(() => {
    try {
      const saved = localStorage.getItem("ss_kitchen_session");
      if (saved) {
        const parsed = JSON.parse(saved) as UserSession;
        if (parsed.expiresAt > Date.now()) {
          return parsed;
        } else {
          localStorage.removeItem("ss_kitchen_session");
        }
      }
    } catch {}
    return null;
  });

  // Active routing synced with browser URL page paths (HTML5 routing)
  const [activeView, setActiveView] = useState<ViewType>(() => {
    const route = getViewFromUrl().view;
    const publicViews: ViewType[] = ["home", "product-detail", "cart", "login", "terms", "privacy", "refund"];
    if (!session && !publicViews.includes(route)) {
      // Protect non-public screens by default
      return "login";
    }
    return route;
  });

  const [adminTab, setAdminTab] = useState<"dashboard" | "products" | "orders" | "customers" | "coupons">("dashboard");

  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    try {
      const saved = localStorage.getItem("ss_kitchen_coupons");
      return saved ? JSON.parse(saved) : AVAILABLE_COUPONS;
    } catch {
      return AVAILABLE_COUPONS;
    }
  });

  const handleCreateCoupon = (newCoupon: Coupon) => {
    const updated = [...coupons, newCoupon];
    setCoupons(updated);
    try {
      localStorage.setItem("ss_kitchen_coupons", JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteCoupon = (code: string) => {
    const updated = coupons.filter(c => c.code !== code);
    setCoupons(updated);
    try {
      localStorage.setItem("ss_kitchen_coupons", JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const isAdminSubdomain = typeof window !== "undefined" && (
    window.location.hostname.startsWith("admin.") || 
    window.location.hostname.includes("admin-panel")
  );

  const [tempTargetRole, setTempTargetRole] = useState<"user" | "admin">(
    isAdminSubdomain ? "admin" : "user"
  );
  const [redirectAfterLogin, setRedirectAfterLogin] = useState<ViewType | null>(null);

  // Device SMS sliding toast indicator
  const [smsAlert, setSmsAlert] = useState<{ otp: string; phone: string; show: boolean }>({
    otp: "",
    phone: "",
    show: false,
  });
  const [smsCountdown, setSmsCountdown] = useState(5);

  // Auto-dismiss SMS notification after 5 seconds
  useEffect(() => {
    if (smsAlert.show) {
      setSmsCountdown(5);
      const interval = setInterval(() => {
        setSmsCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setSmsAlert((curr) => ({ ...curr, show: false }));
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [smsAlert.show]);

  // Auto-seed database credentials on boot
  useEffect(() => {
    seedUsers();
  }, []);

  // Intercept unauthorized requests and route protect
  useEffect(() => {
    const publicViews: ViewType[] = ["home", "product-detail", "cart", "login", "terms", "privacy", "refund"];
    if (!session) {
      if (!publicViews.includes(activeView)) {
        setTempTargetRole("user");
        if (activeView !== "home") {
          setRedirectAfterLogin(activeView);
        }
        setActiveView("login");
      }
    } else {
      // If logged in but on login view, route away
      if (activeView === "login") {
        if (session.role === "admin") {
          setActiveView("admin");
        } else if (redirectAfterLogin) {
          setActiveView(redirectAfterLogin);
          setRedirectAfterLogin(null);
        } else {
          setActiveView("home");
        }
      }

      // Check admin privileges
      if (activeView === "admin" && session.role !== "admin") {
        setActiveView("home");
      }
    }
  }, [activeView, session, redirectAfterLogin]);

  const handleTriggerSmsNotification = (otp: string, phone: string) => {
    setSmsAlert({ otp, phone, show: true });
  };

  const handleLogout = () => {
    setSession(null);
    localStorage.removeItem("ss_kitchen_session");
    setActiveView("home");
  };

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(() => {
    const route = getViewFromUrl();
    if (route.view === "product-detail" && route.productId) {
      let currentProducts = INITIAL_PRODUCTS;
      try {
        const saved = localStorage.getItem("ss_kitchen_products");
        if (saved) currentProducts = JSON.parse(saved);
      } catch {}
      return currentProducts.find((p) => p.id === route.productId) || null;
    }
    return null;
  });

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<
    "all" | "farsan" | "sweets" | "dryfruits" | "namkeen"
  >("all");

  // Transaction transit references
  const [appliedDiscountPercent, setAppliedDiscountPercent] = useState<number>(0);
  const [appliedCouponCode, setAppliedCouponCode] = useState<string>("");

  const [trackingOrderId, setTrackingOrderId] = useState<string>(() => {
    const route = getViewFromUrl();
    return route.view === "tracking" && route.orderId ? route.orderId : "";
  });

  // Keep browser URL pathname synced to the application's active view
  useEffect(() => {
    let targetPath = "/";
    if (activeView === "admin") {
      targetPath = "/admin";
    } else if (activeView === "login") {
      targetPath = "/login";
    } else if (activeView === "cart") {
      targetPath = "/cart";
    } else if (activeView === "checkout") {
      targetPath = "/checkout";
    } else if (activeView === "account") {
      targetPath = "/account";
    } else if (activeView === "terms") {
      targetPath = "/terms";
    } else if (activeView === "privacy") {
      targetPath = "/privacy";
    } else if (activeView === "refund") {
      targetPath = "/refund";
    } else if (activeView === "product-detail") {
      targetPath = selectedProduct ? `/product/${selectedProduct.id}` : "/product";
    } else if (activeView === "tracking") {
      targetPath = trackingOrderId ? `/tracking/${trackingOrderId}` : "/tracking";
    }

    if (window.location.pathname !== targetPath) {
      window.history.pushState({ view: activeView }, "", targetPath);
    }
  }, [activeView, selectedProduct?.id, trackingOrderId]);

  // Handle browser back and forward navigations (popstate events)
  useEffect(() => {
    const handlePopState = () => {
      const route = getViewFromUrl();
      setActiveView(route.view);
      if (route.view === "product-detail" && route.productId) {
        const prod = products.find((p) => p.id === route.productId);
        if (prod) setSelectedProduct(prod);
      } else if (route.view === "tracking" && route.orderId) {
        setTrackingOrderId(route.orderId);
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [products]);

  // Helpers

  // Adds a pack to the cart
  const handleAddToCart = (product: Product, weight: string, qty: number) => {
    const itemKey = `${product.id}-${weight}`;
    setCart((prev) => {
      const idx = prev.findIndex((c) => c.product.id === product.id && c.selectedWeight === weight);

      // Simple scaling calculator for different weights
      const computePrice = (base: number, w: string, available: string[]) => {
        const baseWeightStr = available[0] || "250 GM";
        if (w === baseWeightStr) return base;

        const parseVal = (str: string) => {
          const val = parseFloat(str);
          return str.toUpperCase().includes("KG") ? val * 1000 : val;
        };

        const baseNum = parseVal(baseWeightStr);
        const targetNum = parseVal(w);
        return Math.round((base / baseNum) * targetNum);
      };

      const selectedPrice = computePrice(product.price, weight, product.availableWeights);

      if (idx > -1) {
        const copy = [...prev];
        copy[idx].quantity += qty;
        return copy;
      } else {
        return [
          ...prev,
          {
            id: itemKey,
            product,
            selectedWeight: weight,
            quantity: qty,
            priceForWeight: selectedPrice,
          },
        ];
      }
    });
  };

  // Stepper increment / decrement
  const handleUpdateCartQty = (productId: string, weight: string, qty: number) => {
    if (qty <= 0) {
      handleRemoveCartItem(productId, weight);
      return;
    }
    setCart((prev) => {
      const idx = prev.findIndex((c) => c.product.id === productId && c.selectedWeight === weight);
      if (idx > -1) {
        const copy = [...prev];
        copy[idx].quantity = qty;
        return copy;
      }
      return prev;
    });
  };

  // Remove item entirely
  const handleRemoveCartItem = (productId: string, weight: string) => {
    setCart((prev) => prev.filter((c) => !(c.product.id === productId && c.selectedWeight === weight)));
  };

  const handleProceedToCheckout = (discountPercent: number, couponCode: string) => {
    setAppliedDiscountPercent(discountPercent);
    setAppliedCouponCode(couponCode);
    setActiveView("checkout");
  };

  // Finalizes the purchase transaction
  const handlePlaceOrder = async (newOrder: Order, _isWalletPayment: boolean, _finalCost: number) => {
    try {
      const orderDocRef = doc(db, "orders", newOrder.id);
      await setDoc(orderDocRef, newOrder);
      setCart([]);
      setTrackingOrderId(newOrder.id);
      setActiveView("tracking");
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `orders/${newOrder.id}`);
    }
  };

  const handleTrackOrderByRef = (order: Order) => {
    setTrackingOrderId(order.id);
    setActiveView("tracking");
  };

  // Admin Actions

  const handleUpdateProductStock = async (productId: string, newStock: number) => {
    try {
      const isLow = newStock <= 15;
      const stockText = isLow ? `${newStock} kg (Low)` : `${newStock} kg`;
      const productDocRef = doc(db, "products", productId);
      await updateDoc(productDocRef, {
        stockLevel: newStock,
        stockText: stockText,
        isLowStock: isLow,
        isOutOfStock: newStock <= 0,
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `products/${productId}`);
    }
  };

  const handleUpdateProductPrice = async (productId: string, newPrice: number) => {
    try {
      const productDocRef = doc(db, "products", productId);
      await updateDoc(productDocRef, { price: newPrice });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `products/${productId}`);
    }
  };

  const handleAddProduct = async (newProduct: Product) => {
    try {
      const productDocRef = doc(db, "products", newProduct.id);
      await setDoc(productDocRef, newProduct);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `products/${newProduct.id}`);
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, newStatus: Order["status"]) => {
    try {
      const orderDocRef = doc(db, "orders", orderId);
      await updateDoc(orderDocRef, { status: newStatus });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `orders/${orderId}`);
    }
  };

  // Discover cart item count helper
  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Focus specific tracking order target
  const focusedTrackingOrder = orders.find((o) => o.id === trackingOrderId) || orders[0];

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col text-slate-800 selection:bg-green-150 font-sans">
      {/* Brand Navbar Header */}
      <Navbar
        activeView={activeView}
        setActiveView={(v) => {
          setActiveView(v);
          setSelectedProduct(null);
        }}
        cartCount={totalCartCount}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        session={session}
        adminTab={adminTab}
        setAdminTab={setAdminTab}
      />

      {/* Main Container Stage */}
      <main className="max-w-[1280px] mx-auto px-4 md:px-10 py-10 flex-1 w-full flex flex-col justify-start">
        {/* State dispatcher toggles */}
        {activeView === "home" && (
          <HomeView
            products={products}
            cart={cart}
            onAddToCart={handleAddToCart}
            onUpdateCartQty={handleUpdateCartQty}
            onSelectProduct={(p) => {
              setSelectedProduct(p);
              setActiveView("product-detail");
            }}
            searchQuery={searchQuery}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />
        )}

        {activeView === "product-detail" && selectedProduct && (
          <ProductDetailView
            product={selectedProduct}
            onBack={() => {
              setSelectedProduct(null);
              setActiveView("home");
            }}
            cart={cart}
            onAddToCart={handleAddToCart}
            onUpdateCartQty={handleUpdateCartQty}
          />
        )}

        {/* Fallback layout if user hits detail without any selection */}
        {activeView === "product-detail" && !selectedProduct && (
          <div className="bg-white rounded-xl p-8 border border-gray-100 text-center shadow-sm">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
            <span className="text-sm font-bold block text-gray-800">No Product Highlight Selected</span>
            <button
              onClick={() => setActiveView("home")}
              className="mt-4 px-4 py-2 bg-green-700 text-white rounded text-xs font-bold"
            >
              Back to Catalog list
            </button>
          </div>
        )}

        {activeView === "cart" && (
          <CartView
            cart={cart}
            onUpdateCartQty={handleUpdateCartQty}
            onRemoveCartItem={handleRemoveCartItem}
            onProceedToCheckout={handleProceedToCheckout}
            onContinueShopping={() => setActiveView("home")}
            coupons={coupons}
          />
        )}

        {activeView === "checkout" && (
          <CheckoutView
            cart={cart}
            appliedDiscountPercent={appliedDiscountPercent}
            couponCode={appliedCouponCode}
            onPlaceOrder={handlePlaceOrder}
            onBackToCart={() => setActiveView("cart")}
            session={session}
          />
        )}

        {activeView === "tracking" && focusedTrackingOrder && (
          <OrderTrackingView
            order={focusedTrackingOrder}
            onContinueShopping={() => {
              setTrackingOrderId("");
              setActiveView("home");
            }}
          />
        )}

        {activeView === "account" && (
          <MyAccountView
            orders={orders}
            session={session}
            onLogout={handleLogout}
          />
        )}

        {activeView === "admin" && (
          <AdminDashboardView
            orders={orders}
            products={products}
            onUpdateProductStock={handleUpdateProductStock}
            onUpdateProductPrice={handleUpdateProductPrice}
            onAddProduct={handleAddProduct}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            session={session}
            onLogout={handleLogout}
            adminTab={adminTab}
            setAdminTab={setAdminTab}
            coupons={coupons}
            onAddCoupon={handleCreateCoupon}
            onDeleteCoupon={handleDeleteCoupon}
          />
        )}

        {activeView === "login" && (
          <AuthView
            targetRole={tempTargetRole}
            isAuthenticated={!!session}
            onBack={() => setActiveView(session ? "home" : "login")}
            onLoginSuccess={(newSession) => {
              setSession(newSession);
              localStorage.setItem("ss_kitchen_session", JSON.stringify(newSession));
              if (newSession.role === "admin") {
                setActiveView("admin");
                setRedirectAfterLogin(null);
              } else if (redirectAfterLogin) {
                setActiveView(redirectAfterLogin);
                setRedirectAfterLogin(null);
              } else {
                setActiveView("account");
              }
            }}
            triggerSmsNotification={handleTriggerSmsNotification}
          />
        )}

        {activeView === "terms" && (
          <TermsView onBack={() => setActiveView(session ? "home" : "login")} />
        )}

        {activeView === "privacy" && (
          <PrivacyView onBack={() => setActiveView(session ? "home" : "login")} />
        )}

        {activeView === "refund" && (
          <RefundView onBack={() => setActiveView(session ? "home" : "login")} />
        )}
      </main>

      {/* Persistent Brand Footer */}
      <Footer 
        setActiveView={setActiveView} 
        setSelectedCategory={setSelectedCategory} 
        onAdminClick={() => {
          setTempTargetRole("admin");
          setActiveView("login");
        }}
      />

      {/* Web Push Notification Simulator for OTP */}
      <AnimatePresence>
        {smsAlert.show && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 max-w-sm w-full bg-slate-900 border border-slate-700 text-white p-4 rounded-2xl shadow-2xl flex items-start gap-3.5 select-none"
            id="sms-notification-hub"
          >
            <div className="bg-emerald-600 p-2.5 rounded-xl text-white shrink-0 shadow-lg mt-0.5">
              <MessageSquareDot className="w-5 h-5 text-white" />
            </div>
            <div className="text-left flex-1 min-w-0">
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-emerald-400 font-extrabold uppercase tracking-widest">VijayRath Security Gateway</span>
                <span className="text-[9px] text-gray-400 font-bold font-mono">SIMULATION</span>
              </div>
              <p className="text-xs font-semibold text-gray-200 mt-1 leading-relaxed">
                OTP verification code is <strong className="text-yellow-400 font-mono text-sm tracking-wider select-all">{smsAlert.otp}</strong>. Use this code to secure your login.
              </p>
              <div className="flex items-center gap-2 mt-2.5">
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(smsAlert.otp);
                  }}
                  className="text-[10px] bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700 font-sans font-bold px-2 py-1 rounded cursor-pointer transition-colors"
                >
                  Copy Code
                </button>
                <button 
                  onClick={() => setSmsAlert(prev => ({ ...prev, show: false }))}
                  className="text-[10px] text-gray-400 hover:text-gray-300 font-semibold px-2 py-1 hover:underline cursor-pointer"
                >
                  Dismiss ({smsCountdown}s)
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
