import { useState, useMemo, useEffect, FormEvent, useRef } from "react";
import { Order, Product, Coupon } from "../types";
import { TrendingUp, Package, Shield, Layers, PlusCircle, RotateCcw, Edit, Activity, ShoppingCart, RefreshCw, Star, Trash2, LogOut, Users, Gift, Bell, BellOff, Volume2, VolumeX, X } from "lucide-react";
import { UserSession } from "../lib/authUtils";

interface ProductRowProps {
  product: Product;
  onUpdateProductStock: (productId: string, newStock: number) => void;
  onUpdateProductPrice: (productId: string, newPrice: number) => void;
  key?: string | number;
}

function ProductRow({ product, onUpdateProductPrice }: ProductRowProps) {
  const [priceVal, setPriceVal] = useState<string>(product.price.toString());

  // Keep local state in sync if prop changes from outside
  useEffect(() => {
    setPriceVal(product.price.toString());
  }, [product.price]);

  return (
    <tr className="hover:bg-slate-50/50 transition-colors">
      <td className="py-3 font-semibold text-slate-900">
        <div className="flex items-center gap-2.5 text-left">
          <img src={product.imageUrl} alt="" referrerPolicy="no-referrer" className="w-8 h-8 rounded object-cover border border-gray-100" />
          <div>
            <span className="font-bold">{product.name}</span>
            {product.gujaratiName && (
              <span className="text-[10px] text-gray-400 block mt-[-2px]">{product.gujaratiName}</span>
            )}
          </div>
        </div>
      </td>
      <td className="py-3 text-center capitalize font-semibold text-gray-500">{product.category}</td>
      <td className="py-3 text-center">
        <div className="flex items-center justify-center gap-1.5">
          <span className="text-gray-400 font-extrabold text-xs">₹</span>
          <input
            type="number"
            className="w-16 px-1.5 py-1 text-center font-bold text-slate-800 bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:border-green-700 focus:bg-white text-xs no-spinners"
            value={priceVal}
            onChange={(e) => {
              setPriceVal(e.target.value);
              const parsed = parseInt(e.target.value);
              if (!isNaN(parsed) && parsed > 0) {
                onUpdateProductPrice(product.id, parsed);
              }
            }}
          />
        </div>
      </td>
    </tr>
  );
}

function playContinuousRingingBell(durationMs = 5000) {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return null;
    const ctx = new AudioContext();

    const playStrike = () => {
      const now = ctx.currentTime;
      // High-quality bright, physical bell harmonic chords
      const frequencies = [587.33, 783.99, 880.00, 1174.66, 1318.51];
      const gains = [0.25, 0.18, 0.12, 0.08, 0.04];
      const decays = [2.0, 1.5, 1.2, 0.8, 0.5];

      frequencies.forEach((f, i) => {
        const osc = ctx.createOscillator();
        const gNode = ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(f, now);

        gNode.gain.setValueAtTime(0, now);
        gNode.gain.linearRampToValueAtTime(gains[i], now + 0.01);
        gNode.gain.exponentialRampToValueAtTime(0.001, now + decays[i]);

        osc.connect(gNode);
        gNode.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + decays[i] + 0.1);
      });
    };

    // Play initial strike immediately
    playStrike();

    // Loop strikes every 1.1 seconds for real-time continuous bell sound
    const intervalId = setInterval(() => {
      playStrike();
    }, 1100);

    const timeoutId = setTimeout(() => {
      clearInterval(intervalId);
      try {
        ctx.close();
      } catch {}
    }, durationMs);

    return {
      stop: () => {
        clearInterval(intervalId);
        clearTimeout(timeoutId);
        try {
          ctx.close();
        } catch {}
      }
    };
  } catch (e) {
    console.error("Synthesized bell sound failed to initialize:", e);
    return null;
  }
}

interface AdminDashboardViewProps {
  orders: Order[];
  products: Product[];
  onUpdateProductStock: (productId: string, newStock: number) => void;
  onUpdateProductPrice: (productId: string, newPrice: number) => void;
  onAddProduct: (newProduct: Product) => void;
  onUpdateOrderStatus: (orderId: string, newStatus: Order["status"]) => void;
  session: UserSession | null;
  onLogout: () => void;
  adminTab: "dashboard" | "products" | "orders" | "customers" | "coupons";
  setAdminTab: (tab: "dashboard" | "products" | "orders" | "customers" | "coupons") => void;
  coupons: Coupon[];
  onAddCoupon: (newCoupon: Coupon) => void;
  onDeleteCoupon: (code: string) => void;
}

export default function AdminDashboardView({
  orders,
  products,
  onUpdateProductStock,
  onUpdateProductPrice,
  onAddProduct,
  onUpdateOrderStatus,
  session,
  onLogout,
  adminTab,
  setAdminTab,
  coupons,
  onAddCoupon,
  onDeleteCoupon,
}: AdminDashboardViewProps) {
  // Real-time Order Notification System state & refs
  const seenOrderIdsRef = useRef<Set<string>>(new Set());
  const [activeNotification, setActiveNotification] = useState<Order | null>(null);
  const [isMuted, setIsMuted] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem("ss_kitchen_admin_muted");
      return saved === "true";
    } catch {
      return false;
    }
  });
  const audioInstanceRef = useRef<{ stop: () => void } | null>(null);
  const isMutedRef = useRef<boolean>(isMuted);

  useEffect(() => {
    isMutedRef.current = isMuted;
    try {
      localStorage.setItem("ss_kitchen_admin_muted", isMuted ? "true" : "false");
    } catch {}
  }, [isMuted]);

  useEffect(() => {
    return () => {
      if (audioInstanceRef.current) {
        audioInstanceRef.current.stop();
      }
    };
  }, []);

  const handleDismissNotification = () => {
    setActiveNotification(null);
    if (audioInstanceRef.current) {
      audioInstanceRef.current.stop();
      audioInstanceRef.current = null;
    }
  };

  const handleToggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    if (nextMuted && audioInstanceRef.current) {
      audioInstanceRef.current.stop();
      audioInstanceRef.current = null;
    }
  };

  const triggerNotification = (newOrder: Order) => {
    setActiveNotification(newOrder);
    if (!isMutedRef.current) {
      if (audioInstanceRef.current) {
        audioInstanceRef.current.stop();
      }
      const instance = playContinuousRingingBell(5000);
      if (instance) {
        audioInstanceRef.current = instance;
      }
    }
  };

  useEffect(() => {
    if (!orders || orders.length === 0) return;

    // First mount, initialize with all pre-existing order IDs so they don't fire notifications
    if (seenOrderIdsRef.current.size === 0) {
      orders.forEach((o) => {
        seenOrderIdsRef.current.add(o.id);
      });
      return;
    }

    // Filter for any incoming orders whose IDs have not been cached in seenOrderIdsRef
    const newOrders = orders.filter((o) => !seenOrderIdsRef.current.has(o.id));

    if (newOrders.length > 0) {
      // Cache the new IDs
      newOrders.forEach((o) => {
        seenOrderIdsRef.current.add(o.id);
      });

      // Fire the alert system with the latest new order
      triggerNotification(newOrders[0]);
    }
  }, [orders]);

  // Add Product Form states
  const [addName, setAddName] = useState<string>("");
  const [addGujarati, setAddGujarati] = useState<string>("");
  const [addCategory, setAddCategory] = useState<"farsan" | "sweets" | "dryfruits" | "vegetables" | "namkeen">("farsan");
  const [addBasePrice, setAddBasePrice] = useState<string>("");
  const [addWeights, setAddWeights] = useState<string>("250 GM, 500 GM, 1 KG");
  const [addImageUrl, setAddImageUrl] = useState<string>("");
  const [addDesc, setAddDesc] = useState<string>("");

  const [notifMsg, setNotifMsg] = useState<string>("");

  // Create Coupon Form states
  const [newCouponCode, setNewCouponCode] = useState<string>("");
  const [newCouponDiscount, setNewCouponDiscount] = useState<string>("");
  const [newCouponDesc, setNewCouponDesc] = useState<string>("");
  const [highlightedOrderId, setHighlightedOrderId] = useState<string>("");
  const [orderFilter, setOrderFilter] = useState<"all" | "pending" | "completed">("all");

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      if (orderFilter === "pending") {
        return o.status !== "Delivered";
      }
      if (orderFilter === "completed") {
        return o.status === "Delivered";
      }
      return true;
    });
  }, [orders, orderFilter]);

  const handleStatusChange = (orderId: string, newStatus: Order["status"]) => {
    onUpdateOrderStatus(orderId, newStatus);
    setNotifMsg(`Order #${orderId} status updated to "${newStatus}"!`);
    setHighlightedOrderId(orderId);
    
    // Clear notifications and highlights after a brief period
    setTimeout(() => {
      setNotifMsg("");
      setHighlightedOrderId("");
    }, 4500);
  };

  // Statistics summaries
  const totalRevenue = useMemo(() => {
    return orders.reduce((sum, o) => sum + o.totalPrice, 0);
  }, [orders]);

  const activeOrdersCount = useMemo(() => {
    return orders.filter((o) => o.status !== "Delivered").length;
  }, [orders]);

  const lowStockProductsCount = useMemo(() => {
    return products.filter((p) => p.stockLevel <= 15).length;
  }, [products]);

  // Derived Customers list based on real client orders
  const customers = useMemo(() => {
    const map = new Map<string, {
      name: string;
      phone: string;
      address: string;
      orderCount: number;
      totalSpend: number;
      lastOrderDate: string;
    }>();

    orders.forEach(o => {
      const phone = o.deliveryAddress.phone || "N/A";
      const name = o.deliveryAddress.name || "Anonymous";
      const existing = map.get(phone);
      if (existing) {
        existing.orderCount += 1;
        existing.totalSpend += o.totalPrice;
        if (o.datePlaced > existing.lastOrderDate) {
          existing.lastOrderDate = o.datePlaced;
        }
      } else {
        map.set(phone, {
          name,
          phone,
          address: o.deliveryAddress.details || "N/A",
          orderCount: 1,
          totalSpend: o.totalPrice,
          lastOrderDate: o.datePlaced,
        });
      }
    });

    return Array.from(map.values());
  }, [orders]);

  const handleCreateCouponSubmit = (e: FormEvent) => {
    e.preventDefault();
    const code = newCouponCode.trim().toUpperCase();
    const discount = parseInt(newCouponDiscount, 10);
    const desc = newCouponDesc.trim();

    if (!code || isNaN(discount) || discount <= 0 || discount > 100 || !desc) {
      setNotifMsg("Please enter valid coupon details (discount between 1% and 100%)");
      setTimeout(() => setNotifMsg(""), 4000);
      return;
    }

    if (coupons.some(c => c.code === code)) {
      setNotifMsg(`Coupon with code "${code}" already exists!`);
      setTimeout(() => setNotifMsg(""), 4000);
      return;
    }

    onAddCoupon({
      code,
      discountPercent: discount,
      description: desc
    });

    setNotifMsg(`Successfully created Coupon Code: ${code}!`);
    setNewCouponCode("");
    setNewCouponDiscount("");
    setNewCouponDesc("");

    setTimeout(() => setNotifMsg(""), 4000);
  };

  const handleAddProductSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!addName.trim() || !addBasePrice.trim()) return;

    const basePrice = parseInt(addBasePrice);
    const stockLevel = 1000;
    const splitWeights = addWeights.split(",").map((w) => w.trim()).filter(Boolean);

    const defaultImg = addImageUrl.trim() || "https://lh3.googleusercontent.com/aida-public/AB6AXuDbhei94wbWFKxSy8Vpc-K5T77dMbLj3WMOWbrZeknLYevLPrqQ1_42ZC0tBTq27_JQRedGnDqdx9qJxzDb97nKAoq4eQR3v7qY3N61634Y17maI-5GY-qme9pYLjXuxDW50QKXJwLr4CsGrpW4-BVDk2IDGq9U22DUZfo1vq0sJZPlvKb9xAB12OfVEpEMioBno7EtCCU4jcqV7EDkiNRRMOfoZjExgPV0ETpC5EdtSQTcnyYwu2Qc86aSPSR025C9q7jg4PnzXfE";

    const freshProd: Product = {
      id: addName.trim().toLowerCase().replace(/\s+/g, "-"),
      name: addName,
      category: addCategory,
      price: basePrice,
      unit: splitWeights[0] || "250 GM",
      availableWeights: splitWeights.length > 0 ? splitWeights : ["250 GM", "1 KG"],
      imageUrl: defaultImg,
      description: addDesc.trim() || "Authentic culinary treat prepared freshly with pure, safe ingredients and spices.",
      rating: 5.0,
      reviewCount: 1,
      stockText: "In Stock",
      stockLevel: stockLevel,
      isFresh: true,
      isLowStock: false,
      ...(addGujarati.trim() ? { gujaratiName: addGujarati.trim() } : {}),
    };

    onAddProduct(freshProd);
    setNotifMsg(`"${addName}" successfully injected into the master food catalog!`);

    // Reset fields
    setAddName("");
    setAddGujarati("");
    setAddBasePrice("");
    setAddWeights("250 GM, 500 GM, 1 KG");
    setAddImageUrl("");
    setAddDesc("");

    setTimeout(() => setNotifMsg(""), 4500);
  };

  // Helper status cycler
  const handleNextStatus = (orderId: string, current: Order["status"]) => {
    let next: Order["status"] = "Order Confirmed";
    if (current === "Order Confirmed") next = "Order Processed";
    else if (current === "Order Processed") next = "Out for Delivery";
    else if (current === "Out for Delivery") next = "Delivered";
    else if (current === "Delivered") return; // Stays at Delivered

    handleStatusChange(orderId, next);
  };

  return (
    <div className="flex flex-col gap-8 font-sans pb-10 text-left">
      {/* Title Header */}
      <div className="border-b border-gray-150 pb-5 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="text-left flex-1">
          <h1 className="text-2xl font-display font-black text-slate-900 flex items-center gap-2">
            <Shield className="w-6 h-6 text-green-700 shrink-0" />
            Kitchen Administrator Console
          </h1>
          <p className="text-xs text-gray-500 mt-1 font-semibold uppercase tracking-wider">
            Real-time live synchronization. Any changes updated here reflect instantly on user storefronts.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {notifMsg && (
            <div className="bg-green-100 border border-green-300 text-green-800 px-3.5 py-1.5 rounded-lg text-xs font-bold animate-pulse">
              {notifMsg}
            </div>
          )}

          {/* Connected Admin Session Profile Badge */}
          <div className="bg-white border border-gray-150 p-2 pl-3 pr-4 rounded-xl flex items-center gap-3 shadow-2xs">
            <div className="w-9 h-9 rounded-full bg-purple-50 text-purple-700 font-extrabold text-xs flex items-center justify-center border border-purple-200">
              {session?.name ? session.name.split(" ").map(n => n[0]).join("").toUpperCase().substring(0, 2) : "AV"}
            </div>
            <div className="text-left">
              <span className="text-[10px] uppercase font-black text-purple-700 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block animate-ping"></span>
                Active Admin
              </span>
              <h4 className="text-xs font-extrabold text-slate-800 leading-none mt-0.5">
                {session?.name || "Admin Vikram"}
              </h4>
            </div>

            {/* Logout button */}
            <button
              onClick={onLogout}
              className="ml-2 p-1.5 bg-red-50 hover:bg-red-100 text-red-650 rounded-lg border border-red-150 transition-colors cursor-pointer"
              title="Secure Logout from Console"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Grid Stats Bar */}
      {adminTab === "dashboard" && (
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 select-none">
          {/* Gross revenue card */}
          <div className="bg-white border border-gray-100 p-4.5 rounded-xl flex items-center gap-4 shadow-sm text-left">
            <div className="p-3 bg-green-50 text-green-700 rounded-lg shrink-0">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Gross Sales Revenue</span>
              <h3 className="text-xl font-display font-black text-slate-900 mt-0.5">₹{totalRevenue.toLocaleString()}</h3>
            </div>
          </div>

          {/* Live Orders count */}
          <div className="bg-white border border-gray-100 p-4.5 rounded-xl flex items-center gap-4 shadow-sm text-left">
            <div className="p-3 bg-amber-50 text-amber-700 rounded-lg shrink-0">
              <ShoppingCart className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Live Active Orders</span>
              <h3 className="text-xl font-display font-black text-slate-900 mt-0.5">{activeOrdersCount}</h3>
            </div>
          </div>

          {/* Catalog items */}
          <div className="bg-white border border-gray-100 p-4.5 rounded-xl flex items-center gap-4 shadow-sm text-left">
            <div className="p-3 bg-purple-50 text-purple-700 rounded-lg shrink-0">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Catalog Inventory</span>
              <h3 className="text-xl font-display font-black text-slate-900 mt-0.5">{products.length} Products</h3>
            </div>
          </div>

          {/* Low Stock Alerts */}
          <div className="bg-white border border-gray-100 p-4.5 rounded-xl flex items-center gap-4 shadow-sm text-left">
            <div className="p-3 bg-red-50 text-red-700 rounded-lg shrink-0">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Low Stock Alerts</span>
              <h3 className="text-xl font-display font-black text-slate-900 mt-0.5">
                {lowStockProductsCount} Items
              </h3>
            </div>
          </div>
        </section>
      )}

      {adminTab === "dashboard" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* Recent/Active Orders Summary */}
          <div className="bg-white border border-slate-150 rounded-xl p-5 shadow-xs text-left">
            <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Activity className="w-4 h-4 text-green-700 animate-pulse" />
              Active Dispatch Pipeline ({orders.filter(o => o.status !== "Delivered").length})
            </h2>
            {orders.filter(o => o.status !== "Delivered").length === 0 ? (
              <div className="p-6 bg-emerald-50/50 border border-emerald-100 rounded-lg text-xs font-semibold text-emerald-800">
                All client orders successfully packed and dispatched! ✓
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {orders.filter(o => o.status !== "Delivered").slice(0, 4).map(o => (
                  <div key={o.id} className="p-3 bg-slate-50 border border-slate-100 rounded-lg flex justify-between items-center text-xs">
                    <div>
                      <p className="font-bold text-slate-900">{o.id} - {o.deliveryAddress.name}</p>
                      <p className="text-gray-500 mt-0.5">{o.items.map(i => `${i.name} (${i.weight})`).join(", ")}</p>
                    </div>
                    <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-extrabold text-[10px] uppercase">
                      {o.status.replace("Order ", "")}
                    </span>
                  </div>
                ))}
              </div>
            )}
            <button
              onClick={() => setAdminTab("orders")}
              className="mt-4 text-xs text-green-700 hover:text-green-800 font-bold flex items-center gap-1 cursor-pointer transition-colors"
            >
              Open Active Orders Queue ({orders.length}) →
            </button>
          </div>

          {/* Low Stock Alerts & Quick Restock */}
          <div className="bg-white border border-slate-150 rounded-xl p-5 shadow-xs text-left">
            <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Package className="w-4 h-4 text-red-600" />
              Critical Stock Alerts ({lowStockProductsCount})
            </h2>
            {products.filter(p => p.stockLevel <= 15).length === 0 ? (
              <div className="p-6 bg-emerald-50/50 border border-emerald-100 rounded-lg text-xs font-semibold text-emerald-800">
                Excellent! All items are fully stocked. ✓
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {products.filter(p => p.stockLevel <= 15).slice(0, 4).map(p => (
                  <div key={p.id} className="p-3 bg-red-50/40 border border-red-100 rounded-lg flex justify-between items-center text-xs">
                    <div className="flex items-center gap-2.5">
                      <img src={p.imageUrl} alt="" referrerPolicy="no-referrer" className="w-8 h-8 rounded object-cover border border-slate-150" />
                      <div>
                        <p className="font-bold text-slate-900">{p.name}</p>
                        <p className="text-red-650 font-bold mt-0.5">{p.stockLevel} kg remaining</p>
                      </div>
                    </div>
                    <button
                      onClick={() => onUpdateProductStock(p.id, p.stockLevel + 50)}
                      className="bg-red-100 hover:bg-red-200 text-red-800 font-bold px-2 py-1 rounded cursor-pointer transition-colors"
                    >
                      +50 Kg Restock
                    </button>
                  </div>
                ))}
              </div>
            )}
            <button
              onClick={() => setAdminTab("products")}
              className="mt-4 text-xs text-green-700 hover:text-green-800 font-bold flex items-center gap-1 cursor-pointer transition-colors"
            >
              Open Inventory Catalog Manager →
            </button>
          </div>

          {/* Category Summary metrics & General tips */}
          <div className="bg-white border border-slate-150 rounded-xl p-5 shadow-xs text-left lg:col-span-2">
            <h2 className="text-sm font-bold text-gray-850 uppercase tracking-wider mb-4">
              Category Distribution Overview
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
              {["farsan", "sweets", "namkeen", "vegetables", "dryfruits"].map(cat => {
                const count = products.filter(p => p.category === cat).length;
                return (
                  <div key={cat} className="p-3.5 bg-slate-50 border border-slate-100 rounded-xl text-center">
                    <span className="text-[10px] text-gray-400 uppercase font-black tracking-wider">{cat === "vegetables" ? "Fresh Veggies" : cat}</span>
                    <p className="text-lg font-black text-slate-800 mt-1">{count} items</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {adminTab === "products" && (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
          {/* Master Inventory Stock Levels */}
          <div className="xl:col-span-8 flex flex-col gap-6">
            <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
              <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-4 flex items-center gap-1.5">
                <Package className="w-5 h-5 text-gray-500" />
                Culinary Stock & Price Manager Matrix
              </h2>

              <div className="overflow-x-auto select-none">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase tracking-wider">
                      <th className="py-2.5">Snack / Product Name</th>
                      <th className="py-2.5 text-center">Category</th>
                      <th className="py-2.5 text-center">Base Price</th>
                      <th className="py-2.5 text-center">Stock Weight Level</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {products.map((p) => (
                      <ProductRow
                        key={p.id}
                        product={p}
                        onUpdateProductStock={onUpdateProductStock}
                        onUpdateProductPrice={onUpdateProductPrice}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Inject New Culinary Item Form */}
          <div className="xl:col-span-4 flex flex-col gap-4">
            <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm text-left">
              <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-4 flex items-center gap-1.5">
                <PlusCircle className="w-4.5 h-4.5 text-green-700" />
                Inject New Culinary Item
              </h2>

              <form onSubmit={handleAddProductSubmit} className="flex flex-col gap-3.5">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-gray-400 font-bold uppercase">Product Title</label>
                  <input
                    type="text"
                    required
                    value={addName}
                    onChange={(e) => setAddName(e.target.value)}
                    placeholder="e.g. Khandvi Special"
                    className="bg-slate-50 border border-slate-150 focus:bg-white rounded-lg py-2 px-3 text-xs text-gray-800 focus:outline-none focus:border-green-700"
                    id="add-p-title"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-gray-400 font-bold uppercase">Gujarati Translation Name</label>
                  <input
                    type="text"
                    value={addGujarati}
                    onChange={(e) => setAddGujarati(e.target.value)}
                    placeholder="e.g. ખાંડવી સ્પેશ્યલ"
                    className="bg-slate-50 border border-slate-150 focus:bg-white rounded-lg py-2 px-3 text-xs text-gray-800 focus:outline-none focus:border-green-700"
                    id="add-p-gujarati"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-gray-400 font-bold uppercase">Category</label>
                    <select
                      value={addCategory}
                      onChange={(e) => setAddCategory(e.target.value as any)}
                      className="bg-slate-50 border border-slate-150 focus:bg-white rounded-lg py-2 px-1 text-xs text-slate-800 focus:outline-none focus:border-green-700"
                    >
                      <option value="farsan">Farsan</option>
                      <option value="sweets">Sweets</option>
                      <option value="namkeen">Namkeen</option>
                      <option value="vegetables">Fresh Veggie</option>
                      <option value="dryfruits">Dryfruite</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-gray-400 font-bold uppercase">Base Price (₹)</label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={addBasePrice}
                      onChange={(e) => setAddBasePrice(e.target.value)}
                      placeholder="e.g. 60"
                      className="bg-slate-50 border border-slate-150 focus:bg-white rounded-lg py-2 px-3 text-xs text-gray-800 focus:outline-none focus:border-green-700 font-bold no-spinners"
                      id="add-p-price"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-gray-400 font-bold uppercase">Available Pack Sizes</label>
                  <input
                    type="text"
                    required
                    value={addWeights}
                    onChange={(e) => setAddWeights(e.target.value)}
                    placeholder="250 GM, 500 GM, 1 KG"
                    className="bg-slate-50 border border-slate-150 focus:bg-white rounded-lg py-2 px-3 text-xs text-gray-800 focus:outline-none"
                    id="add-p-weights"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-gray-400 font-bold uppercase">Custom Image Address</label>
                  <input
                    type="url"
                    value={addImageUrl}
                    onChange={(e) => setAddImageUrl(e.target.value)}
                    placeholder="Place hotlink target here"
                    className="bg-slate-50 border border-slate-150 focus:bg-white rounded-lg py-2 px-3 text-xs text-gray-800 focus:text-gray-950 focus:outline-none"
                    id="add-p-photo"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-gray-400 font-bold uppercase">Culinary Description</label>
                  <textarea
                    rows={2}
                    value={addDesc}
                    onChange={(e) => setAddDesc(e.target.value)}
                    placeholder="Recipe ingredients, frying specs, and crispness parameters..."
                    className="bg-slate-50 border border-slate-150 focus:bg-white rounded-lg py-2 px-3 text-xs text-gray-800 focus:outline-none"
                    id="add-p-desc"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-green-700 hover:bg-green-800 text-white font-sans text-xs font-bold py-3 rounded-lg cursor-pointer transition-colors"
                >
                  Assemble & Publish Item
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {adminTab === "orders" && (
        <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm text-left">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-5 border-b border-gray-150 pb-4">
            <div>
              <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wider flex items-center gap-2">
                <Activity className="w-4 h-4 text-green-700 animate-pulse" />
                Live Incoming Client Orders Dispatch Queue
              </h2>
              <p className="text-[11px] text-gray-400 mt-1 font-semibold uppercase tracking-wider">
                Manage status updates and cycle dispatch stages for customer orders.
              </p>
            </div>

            {/* Filter Controls for Order Status */}
            <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 gap-1 self-stretch md:self-auto shrink-0">
              <button
                type="button"
                onClick={() => setOrderFilter("all")}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  orderFilter === "all"
                    ? "bg-white text-slate-950 shadow-xs"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                All ({orders.length})
              </button>
              <button
                type="button"
                onClick={() => setOrderFilter("pending")}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  orderFilter === "pending"
                    ? "bg-amber-100 text-amber-800 shadow-xs"
                    : "text-slate-500 hover:text-slate-850"
                }`}
              >
                Order Pending ({orders.filter(o => o.status !== "Delivered").length})
              </button>
              <button
                type="button"
                onClick={() => setOrderFilter("completed")}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  orderFilter === "completed"
                    ? "bg-emerald-100 text-emerald-800 shadow-xs"
                    : "text-slate-500 hover:text-slate-850"
                }`}
              >
                Order Completed ({orders.filter(o => o.status === "Delivered").length})
              </button>
            </div>
          </div>

          {orders.length === 0 ? (
            <div className="py-8 text-center text-gray-450 text-xs">
              No client orders loaded yet.
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="py-8 text-center text-gray-450 text-xs">
              No orders found matching the filter "{orderFilter === "pending" ? "Order Pending" : orderFilter === "completed" ? "Order Completed" : "All"}".
            </div>
          ) : (
            <div className="flex flex-col gap-3.5 max-h-[550px] overflow-y-auto pr-1">
              {filteredOrders.map((ord) => (
                <div
                  key={ord.id}
                  className={`p-4 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-xs transition-all duration-500 ${
                    ord.id === highlightedOrderId
                      ? "bg-green-50/80 border-2 border-green-600 ring-4 ring-green-100 shadow-sm scale-[1.005]"
                      : "bg-slate-50 border border-slate-150"
                  }`}
                >
                  <div className="text-left flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <strong className="text-slate-900 font-bold font-sans">ID: {ord.id}</strong>
                      <span className="text-gray-400 font-semibold">{ord.datePlaced}</span>
                      <span className="bg-slate-200 font-bold px-2 py-0.5 rounded text-[10px] text-zinc-700">
                        {ord.paymentMethod}
                      </span>
                    </div>
                    <p className="text-slate-600 mt-1 font-medium leading-normal">
                      To: <strong className="text-slate-800">{ord.deliveryAddress.name}</strong> &bull; Location: {ord.deliveryAddress.details}
                    </p>
                    <p className="text-slate-500 font-semibold mt-1">
                      Items: {ord.items.map((it) => `${it.name} (${it.weight}) x${it.quantity}`).join(", ")}
                    </p>
                  </div>

                  <div className="flex items-center gap-3.5 self-stretch md:self-auto justify-between md:justify-end border-t md:border-t-0 border-gray-100 pt-2 md:pt-0 flex-wrap">
                    <div className="flex flex-col text-left md:text-right font-sans">
                      <span className="text-slate-400 text-[10px] font-bold">ORDER STATUS STEP</span>
                      <select
                        value={ord.status}
                        onChange={(e) => handleStatusChange(ord.id, e.target.value as Order["status"])}
                        className="font-bold text-xs text-green-700 bg-white border border-gray-250 py-1.5 px-2.5 rounded-lg focus:outline-none focus:border-green-700 cursor-pointer shadow-2xs mt-0.5"
                      >
                        <option value="Order Confirmed">Step 1: Order Confirmed</option>
                        <option value="Order Processed">Step 2: Order Processed</option>
                        <option value="Out for Delivery">Step 3: Out for Delivery</option>
                        <option value="Delivered">Step 4: Delivered</option>
                      </select>
                    </div>

                    {ord.status !== "Delivered" ? (
                      <button
                        onClick={() => handleNextStatus(ord.id, ord.status)}
                        className="bg-green-700 hover:bg-green-800 text-white font-bold py-1.5 px-3.5 rounded-lg cursor-pointer flex items-center gap-1 shrink-0 h-[34px] mt-4 md:mt-0 transition-all active:scale-95"
                      >
                        <RefreshCw className="w-3.5 h-3.5 hover:rotate-180 transition-transform" />
                        <span>Advance Step</span>
                      </button>
                    ) : (
                      <span className="bg-emerald-100 text-emerald-800 font-bold px-3 py-1.5 rounded-lg text-[10px] uppercase shrink-0 h-[34px] flex items-center mt-4 md:mt-0">
                        Completed ✓
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {adminTab === "customers" && (
        <div className="bg-white border border-slate-150 rounded-xl p-5 shadow-sm text-left">
          <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Users className="w-4.5 h-4.5 text-green-700" />
            Registered Customer Directory & Lifetime Spend
          </h2>
          {customers.length === 0 ? (
            <div className="py-8 text-center text-gray-450 text-xs">
              No customer records found yet. All client records load dynamically here once orders are placed.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase tracking-wider">
                    <th className="py-2.5">Customer Name</th>
                    <th className="py-2.5">Contact Number</th>
                    <th className="py-2.5">Default Delivery Address</th>
                    <th className="py-2.5 text-center">Orders Placed</th>
                    <th className="py-2.5 text-right">Lifetime Value</th>
                    <th className="py-2.5 text-right">Last Purchase</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {customers.map((cust) => (
                    <tr key={cust.phone} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3 font-bold text-slate-900">{cust.name}</td>
                      <td className="py-3 font-semibold text-slate-600">{cust.phone}</td>
                      <td className="py-3 text-slate-500 max-w-[250px] truncate" title={cust.address}>
                        {cust.address}
                      </td>
                      <td className="py-3 text-center font-bold text-slate-850">{cust.orderCount}</td>
                      <td className="py-3 text-right font-black text-green-700">₹{cust.totalSpend.toLocaleString()}</td>
                      <td className="py-3 text-right text-gray-400 font-semibold">{cust.lastOrderDate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {adminTab === "coupons" && (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
          {/* Active Promo Coupons Directory */}
          <div className="xl:col-span-8 flex flex-col gap-6">
            <div className="bg-white border border-slate-150 rounded-xl p-5 shadow-sm text-left">
              <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Gift className="w-4.5 h-4.5 text-green-700" />
                Active Promo Coupons Directory
              </h2>
              {coupons.length === 0 ? (
                <div className="py-8 text-center text-gray-450 text-xs">
                  No active coupon records found. Create some coupons using the right panel form to offer customer discounts!
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase tracking-wider">
                        <th className="py-2.5">Promo Code</th>
                        <th className="py-2.5">Discount Value</th>
                        <th className="py-2.5">Description</th>
                        <th className="py-2.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {coupons.map((c) => (
                        <tr key={c.code} className="hover:bg-slate-50/50 transition-colors">
                          <td className="py-3 font-extrabold text-green-700 text-sm tracking-wider">
                            <span className="bg-green-50 border border-green-200 px-2 py-1 rounded">
                              {c.code}
                            </span>
                          </td>
                          <td className="py-3 font-bold text-slate-900 text-sm">{c.discountPercent}% OFF</td>
                          <td className="py-3 text-slate-500 max-w-[280px] font-medium" title={c.description}>
                            {c.description}
                          </td>
                          <td className="py-3 text-right">
                            <button
                              onClick={() => {
                                if (window.confirm(`Are you sure you want to delete coupon "${c.code}"?`)) {
                                  onDeleteCoupon(c.code);
                                  setNotifMsg(`Deleted Coupon: ${c.code}`);
                                  setTimeout(() => setNotifMsg(""), 3500);
                                }
                              }}
                              className="p-1.5 bg-red-50 hover:bg-red-100 text-red-650 rounded border border-red-150 transition-colors cursor-pointer"
                              title="Delete Coupon"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Create Coupon Form Panel */}
          <div className="xl:col-span-4 flex flex-col gap-4">
            <div className="bg-white border border-slate-150 rounded-xl p-5 shadow-sm text-left">
              <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-4 flex items-center gap-1.5">
                <PlusCircle className="w-4.5 h-4.5 text-green-700" />
                Create Customer Coupon
              </h2>

              <form onSubmit={handleCreateCouponSubmit} className="flex flex-col gap-3.5">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-gray-400 font-bold uppercase">Coupon Code</label>
                  <input
                    type="text"
                    required
                    value={newCouponCode}
                    onChange={(e) => setNewCouponCode(e.target.value)}
                    placeholder="e.g. FESTIVE50"
                    className="bg-slate-50 border border-slate-150 focus:bg-white rounded-lg py-2 px-3 text-xs text-gray-800 focus:outline-none focus:border-green-700 font-bold uppercase tracking-wider"
                    id="add-coupon-code"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-gray-400 font-bold uppercase">Discount Percentage (1 - 100%)</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    required
                    value={newCouponDiscount}
                    onChange={(e) => setNewCouponDiscount(e.target.value)}
                    placeholder="e.g. 25"
                    className="bg-slate-50 border border-slate-150 focus:bg-white rounded-lg py-2 px-3 text-xs text-gray-800 focus:outline-none focus:border-green-700 font-semibold"
                    id="add-coupon-discount"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-gray-400 font-bold uppercase">Coupon Description</label>
                  <textarea
                    required
                    value={newCouponDesc}
                    onChange={(e) => setNewCouponDesc(e.target.value)}
                    placeholder="e.g. Enjoy 25% off during this Diwali Festive week"
                    rows={3}
                    className="bg-slate-50 border border-slate-150 focus:bg-white rounded-lg py-2 px-3 text-xs text-gray-800 focus:outline-none focus:border-green-700 resize-none font-medium"
                    id="add-coupon-desc"
                  />
                </div>

                <button
                  type="submit"
                  className="bg-green-700 hover:bg-green-800 text-white font-bold py-2.5 px-4 rounded-lg cursor-pointer text-xs uppercase tracking-wider transition-all duration-300 shadow-sm hover:shadow-md hover:scale-[1.01] active:scale-95 text-center mt-2 flex items-center justify-center gap-1.5"
                >
                  <Gift className="w-4 h-4" />
                  Generate Coupon Code
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
      {/* Real-time Order Notification System Overlay */}
      {activeNotification && (
        <div className="fixed bottom-6 right-6 md:top-6 md:bottom-auto md:right-6 z-50 animate-slide-in max-w-sm w-full bg-white/95 backdrop-blur-md border border-green-200 shadow-2xl rounded-2xl p-4 flex flex-col gap-3.5 text-left select-none ring-1 ring-black/5">
          <style>{`
            @keyframes shake {
              0%, 100% { transform: rotate(0deg); }
              15% { transform: rotate(12deg); }
              30% { transform: rotate(-12deg); }
              45% { transform: rotate(8deg); }
              60% { transform: rotate(-8deg); }
              75% { transform: rotate(4deg); }
              90% { transform: rotate(-4deg); }
            }
            .bell-shake {
              animation: shake 1s infinite;
            }
            @keyframes slideIn {
              from { transform: translateY(1.5rem); opacity: 0; }
              to { transform: translateY(0); opacity: 1; }
            }
            @media (min-width: 768px) {
              @keyframes slideIn {
                from { transform: translateX(1.5rem); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
              }
            }
            .animate-slide-in {
              animation: slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            }
          `}</style>

          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="bg-green-50 p-2.5 rounded-xl border border-green-150 flex items-center justify-center text-green-700 shrink-0">
                <Bell className="w-5 h-5 bell-shake" />
              </div>
              <div>
                <span className="text-[10px] text-green-700 font-extrabold uppercase tracking-widest block">
                  New Order Received!
                </span>
                <h3 className="font-display font-black text-slate-900 text-sm tracking-tight mt-0.5">
                  {activeNotification.id}
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={handleToggleMute}
                className="p-1.5 bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-700 rounded-lg border border-slate-150 transition-colors cursor-pointer flex items-center justify-center"
                title={isMuted ? "Unmute Notifications" : "Mute Notifications"}
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <button
                onClick={handleDismissNotification}
                className="p-1.5 bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-700 rounded-lg border border-slate-150 transition-colors cursor-pointer flex items-center justify-center"
                title="Dismiss Notification"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-2.5 flex flex-col gap-1 text-xs">
            <div className="flex justify-between items-center py-0.5">
              <span className="text-gray-400 font-bold uppercase text-[9px] tracking-wider font-mono">Customer</span>
              <span className="font-bold text-slate-800">{activeNotification.deliveryAddress?.name || "Guest Customer"}</span>
            </div>
            <div className="flex justify-between items-center py-0.5">
              <span className="text-gray-400 font-bold uppercase text-[9px] tracking-wider font-mono">Phone</span>
              <span className="font-semibold text-slate-600">{activeNotification.deliveryAddress?.phone || "N/A"}</span>
            </div>
            <div className="flex justify-between items-center py-0.5">
              <span className="text-gray-400 font-bold uppercase text-[9px] tracking-wider font-mono">Total Price</span>
              <span className="font-extrabold text-green-700 text-sm">₹{activeNotification.totalPrice}</span>
            </div>
          </div>

          <button
            onClick={() => {
              setAdminTab("orders");
              handleDismissNotification();
            }}
            className="w-full bg-green-700 hover:bg-green-800 text-white font-bold py-2 px-4 rounded-xl cursor-pointer text-xs uppercase tracking-wider transition-all duration-300 shadow-xs hover:shadow-md text-center mt-1"
          >
            Review Order Details
          </button>
        </div>
      )}
    </div>
  );
}
