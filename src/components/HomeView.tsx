import { useState, useMemo } from "react";
import { Product, CartItem } from "../types";
import { Star, Flame, Sparkles, Filter, Coffee, Cookie } from "lucide-react";

interface HomeViewProps {
  products: Product[];
  cart: CartItem[];
  onAddToCart: (product: Product, weight: string, qty: number) => void;
  onUpdateCartQty: (productId: string, weight: string, quantity: number) => void;
  onSelectProduct: (product: Product) => void;
  searchQuery: string;
  selectedCategory: "all" | "farsan" | "sweets" | "dryfruits" | "namkeen";
  setSelectedCategory: (category: "all" | "farsan" | "sweets" | "dryfruits" | "namkeen") => void;
}

export default function HomeView({
  products,
  cart,
  onAddToCart,
  onUpdateCartQty,
  onSelectProduct,
  searchQuery,
  selectedCategory,
  setSelectedCategory,
}: HomeViewProps) {

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const categoryLabels: Record<string, string> = {
    all: "All",
    farsan: "Farsan",
    namkeen: "Namkeen",
    sweets: "Sweets",
    dryfruits: "Dryfruite",
  };

  const [weightSelections, setWeightSelections] = useState<{ [productId: string]: string }>({});

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchCat = selectedCategory === "all" || p.category === selectedCategory;
      const matchQuery =
        !searchQuery ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.gujaratiName && p.gujaratiName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchQuery;
    });
  }, [products, selectedCategory, searchQuery]);

  // Helper to discover if a specific weight exists in cart and get quantity
  const getProductCartInfo = (productId: string, weight: string) => {
    const item = cart.find((c) => c.product.id === productId && c.selectedWeight === weight);
    return item ? item.quantity : 0;
  };

  const handleWeightChange = (productId: string, weight: string) => {
    setWeightSelections((prev) => ({ ...prev, [productId]: weight }));
  };

  return (
    <div className="flex flex-col gap-6 sm:gap-10 font-sans pb-10">
      {/* Explore Categories bar */}
      <section className="flex flex-col gap-2.5 sm:gap-4 text-left">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-100 pb-2.5 sm:pb-3.5 gap-2 sm:gap-3">
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <h2 className="text-sm sm:text-lg md:text-xl font-display font-bold text-gray-900 flex items-center gap-1.5 sm:gap-2 shrink-0">
              <Filter className="w-4 h-4 sm:w-5 sm:h-5 text-green-700 hover:rotate-18 hover:scale-110 transition-transform" />
              Explore Categories
            </h2>

            {/* All Categories Dropdown matching screenshot */}
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-1.5 sm:gap-2 bg-gray-50 hover:bg-gray-100/90 text-slate-800 border border-gray-300 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[10px] sm:text-xs font-semibold transition-all cursor-pointer shadow-xs"
                id="all-categories-dropdown-btn"
                type="button"
              >
                <span className="font-sans text-slate-800">{categoryLabels[selectedCategory]}</span>
                <span className="text-[7px] sm:text-[8px] text-gray-600 font-bold">▼</span>
              </button>

              {isDropdownOpen && (
                <>
                  {/* Backdrop path detector */}
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsDropdownOpen(false)}
                  />
                  <div className="absolute left-0 mt-1.5 w-48 bg-white border border-gray-200 rounded-xl shadow-lg py-1 z-50 animate-in fade-in slide-in-from-top-1 duration-100">
                    {/* Item elements */}
                    {Object.keys(categoryLabels).map((key) => {
                      const isActive = selectedCategory === key;
                      return (
                        <button
                          key={key}
                          onClick={() => {
                            setSelectedCategory(key as any);
                            setIsDropdownOpen(false);
                          }}
                          className={`w-full text-left px-4 py-2 text-xs font-bold transition-colors flex items-center justify-between cursor-pointer ${
                            isActive
                              ? "bg-green-50 text-green-800"
                              : "text-gray-700 hover:bg-gray-100/60 hover:text-green-700"
                          }`}
                          type="button"
                        >
                          <span>{categoryLabels[key]}</span>
                          {isActive && <span className="text-green-700 font-black">✓</span>}
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          </div>
          {searchQuery && (
            <span className="text-[10px] sm:text-xs text-gray-500 font-medium font-sans">
              Showing search results matching <strong className="text-green-700">"{searchQuery}"</strong>
            </span>
          )}
        </div>


      </section>

      {/* Freshly Prepared Section / Catalog */}
      <section className="flex flex-col gap-4 sm:gap-6 text-left">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-sm sm:text-xl md:text-2xl font-display font-bold text-gray-900 flex items-center gap-1.5 sm:gap-2">
            <Flame className="w-4.5 h-4.5 sm:w-6 sm:h-6 text-orange-500 fill-orange-500 shrink-0" />
            "Authentic Delicacies Cooked Today"
          </h2>
          <span className="text-[10px] sm:text-xs bg-green-50 text-green-700 font-bold px-2 sm:px-3 py-1 sm:py-1.5 rounded-full border border-green-100 shrink-0">
            {filteredProducts.length} Available
          </span>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="bg-white border border-gray-100 rounded-xl py-12 px-6 text-center shadow-sm">
            <Sparkles className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-base font-semibold text-gray-700 mb-1">No products match your search</h3>
            <p className="text-xs text-gray-500 max-w-md mx-auto">
              Please check spelling, clear search queries, or switch your category filters above to preview other delicious selections.
            </p>
            <button
              onClick={() => {
                setSelectedCategory("all");
              }}
              className="mt-4 px-4 py-2 bg-green-700 text-white text-xs font-semibold rounded-lg hover:bg-green-800 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
            {filteredProducts.map((p) => {
              // Get current variant selection
              const selectedWeight = weightSelections[p.id] || p.availableWeights[0] || "250 GM";
              const inCartQty = getProductCartInfo(p.id, selectedWeight);

              // Scale price proportionally based on weight selection (base price covers availableWeights[0])
              // Typical scaling: 250 GM value, 500 GM is double base price, 1 KG is quadruple base price, 5 KG is 20x base price.
              const computePrice = (base: number, w: string, available: string[]) => {
                const baseWeightStr = available[0] || "250 GM";
                if (w === baseWeightStr) return base;

                // Simple scaling parser
                const parseVal = (str: string) => {
                  const val = parseFloat(str);
                  return str.toUpperCase().includes("KG") ? val * 1000 : val;
                };

                const baseNum = parseVal(baseWeightStr);
                const targetNum = parseVal(w);
                return Math.round((base / baseNum) * targetNum);
              };

              const currentPrice = computePrice(p.price, selectedWeight, p.availableWeights);

              return (
                <div
                  key={p.id}
                  className="bg-white rounded-xl sm:rounded-2xl border border-gray-100 hover:border-green-150 p-2.5 sm:p-4 flex flex-col gap-2 sm:gap-3.5 hover:shadow-xl transition-all duration-300 relative group h-full"
                >
                  {/* Rating Badge - Absolute Positioned to top-right of card for a clean desktop and mobile experience */}
                  {p.rating && (
                    <div className="absolute top-2.5 right-2.5 z-10 flex items-center gap-0.5 bg-yellow-50/95 backdrop-blur-xs text-yellow-800 px-1.5 py-0.5 rounded shadow-xs text-[9px] sm:text-[10px] font-bold">
                      <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-yellow-600 text-yellow-600" />
                      {p.rating}
                    </div>
                  )}

                  {/* Product Clickable Image Area */}
                  <div
                    onClick={() => onSelectProduct(p)}
                    className="aspect-square bg-gray-50 rounded-lg sm:rounded-xl overflow-hidden relative cursor-pointer group-hover:opacity-95 transition-all border border-gray-50 flex items-center justify-center p-1 sm:p-2"
                  >
                    <img
                      src={p.imageUrl}
                      alt={p.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-center rounded-md sm:rounded-lg transition-transform duration-500 group-hover:scale-106"
                    />
                    {/* Hover text indicator */}
                    <div className="absolute inset-0 bg-black/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-md sm:rounded-lg">
                      <span className="bg-white/94 backdrop-blur-sm text-gray-800 text-[10px] sm:text-xs font-bold px-2 sm:px-3 py-1 sm:py-1.5 rounded-full shadow-md">
                        View Details
                      </span>
                    </div>
                  </div>

                  {/* Title & info mapping */}
                  <div className="flex flex-col gap-0.5 sm:gap-1 text-left min-h-[44px] sm:min-h-[58px]">
                    <h3
                      onClick={() => onSelectProduct(p)}
                      className="font-display font-bold text-gray-900 group-hover:text-green-700 transition-colors text-xs sm:text-sm md:text-base line-clamp-2 cursor-pointer leading-tight"
                    >
                      {p.name}
                    </h3>
                    {p.gujaratiName && (
                      <span className="text-[10px] sm:text-xs text-gray-400 font-medium font-sans leading-none mt-0.5">
                        {p.gujaratiName}
                      </span>
                    )}
                  </div>

                  {/* Variant Selection weight dropdown (within card) */}
                  <div className="flex items-center justify-between text-[10px] sm:text-xs bg-gray-50/70 px-1.5 sm:px-2 py-1 sm:py-1.5 rounded-lg border border-gray-100/80 gap-1 mt-auto">
                    <span className="text-gray-400 font-sans font-medium">Pack:</span>
                    <select
                      value={selectedWeight}
                      onChange={(e) => handleWeightChange(p.id, e.target.value)}
                      className="bg-transparent text-gray-800 font-bold border-0 focus:ring-0 p-0 pr-4 sm:pr-6 text-right whitespace-nowrap cursor-pointer hover:text-green-700 text-[10px] sm:text-xs focus:outline-none"
                    >
                      {p.availableWeights.map((w) => (
                        <option value={w} key={w}>
                          {w}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Card Actions Footer: Pricing & Add triggers */}
                  <div className="flex items-center justify-between pt-1 gap-1">
                    <div className="flex flex-col text-left min-w-0">
                      <span className="text-sm sm:text-base md:text-lg font-display font-bold text-green-700 leading-none">
                        ₹{currentPrice}
                      </span>
                      {p.isLowStock ? (
                        <span className="text-[8px] sm:text-[10px] text-red-600 font-semibold uppercase font-sans tracking-wide mt-0.5 truncate">
                          {p.stockText}
                        </span>
                      ) : (
                        <span className="text-[8px] sm:text-[10px] text-gray-400 font-sans uppercase font-semibold mt-0.5 truncate">
                          Stock: {p.stockText}
                        </span>
                      )}
                    </div>

                    {/* Stepper or dynamic button */}
                    {inCartQty > 0 ? (
                      <div className="flex items-center rounded-lg border border-green-200 bg-white overflow-hidden shadow-sm h-7 sm:h-9">
                        <button
                          onClick={() => onUpdateCartQty(p.id, selectedWeight, inCartQty - 1)}
                          className="px-1.5 sm:px-2.5 py-0.5 text-gray-600 hover:bg-gray-100 font-bold font-sans text-xs sm:text-sm focus:outline-none transition-colors"
                        >
                          -
                        </button>
                        <span className="px-1.5 sm:px-3 bg-green-50/50 text-green-700 font-sans text-[10px] sm:text-xs font-semibold h-full flex items-center justify-center min-w-[18px] sm:min-w-[28px]">
                          {inCartQty}
                        </span>
                        <button
                          onClick={() => onUpdateCartQty(p.id, selectedWeight, inCartQty + 1)}
                          className="px-1.5 sm:px-2.5 py-0.5 text-green-700 hover:bg-gray-100 font-bold font-sans text-xs sm:text-sm focus:outline-none transition-colors"
                        >
                          +
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => onAddToCart(p, selectedWeight, 1)}
                        className="bg-green-700 hover:bg-green-800 text-white font-sans text-[10px] sm:text-xs font-bold px-2 sm:px-4 py-1 sm:py-2 rounded-lg transition-transform hover:scale-104 shadow hover:shadow-md cursor-pointer h-7 sm:h-9 flex items-center justify-center gap-0.5 sm:gap-1 shrink-0"
                      >
                        <span className="sm:hidden">Add</span>
                        <span className="hidden sm:inline">Add to Cart</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
