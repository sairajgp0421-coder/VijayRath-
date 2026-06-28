import { useState, useMemo, FormEvent } from "react";
import { Product, Review, CartItem } from "../types";
import { Star, Shield, ThumbsUp, Calendar, ArrowLeft, Sparkles } from "lucide-react";

interface ProductDetailViewProps {
  product: Product;
  onBack: () => void;
  cart: Array<CartItem>;
  onAddToCart: (product: Product, weight: string, quantity: number) => void;
  onUpdateCartQty: (productId: string, weight: string, quantity: number) => void;
}

export default function ProductDetailView({
  product,
  onBack,
  cart,
  onAddToCart,
  onUpdateCartQty,
}: ProductDetailViewProps) {
  const [selectedWeight, setSelectedWeight] = useState<string>(product.availableWeights[0] || "250 GM");
  const [qty, setQty] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<"about" | "reviews">("about");

  // User Review Fields State
  const [newReviewerName, setNewReviewerName] = useState<string>("");
  const [newReviewComment, setNewReviewComment] = useState<string>("");
  const [newReviewRating, setNewReviewRating] = useState<number>(5);

  // Fake thumbnails list for Nylon Khaman or fallbacks
  const productThumbnails = useMemo(() => {
    if (product.id === "nylon-khaman") {
      return [
        product.imageUrl,
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCqNGTAG-Oq-bh7_WcLh10RklPZfAxEduGHWAghSb3511M7njbxk1HcQS0GGpsRl1riI6K4fK0XG7o1QeKIpYcgN0ey7_61Z4yyJYa1CgTwT4yDWTWLtHQHRtwBHTCiMTH15NVAp1g4yFtVnlAQYwQQxJyGyIwqQgdIE5fDcEgi8q9vQuH_yxYvP0UKFT-cwN0SC2QSzp-yR4E2G9cnzqO5hn2AXg24pR1H6VgcqKO0yvmfeiDuwVMM1WNvZmcKdN1Z4mUIPmBvXRQ",
        "https://lh3.googleusercontent.com/aida-public/AB6AXuA1VePx94BV7t6QV9RinaUXBhtj2fVFWsbmB9ZhVkdVeNfcaz6T2gaT3RHmI7iQ4_tKNea_EsIcM4izX0oaBPkD3GaOqXJXednRk9PoE3Tt9WQCqDNdcNiH6R1g8y4nNi1jFxJXrxy0eyHzCXf70co-lzTHQEONB_rFkdOWAFlgs5PD9ZkH9Bc0ZlDhsHJYIMV5_y9PQSJDMWSVyJH_rAW4wcH0-IcZ72oUqavegAnUv9-sK5P0KU2byP0ounoZPyy1uVGhBo-XzOM",
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAUABAePeVyre8_KXrB-i5YequyK4zXpRBErShvUtLFF0uOoahEBDjkLhuzZeE-Wj1kqVjrJeALIL5y_wVs3jd6z1nxValCgvoq39qzwFgpQpWcNdXiNguApKqzTGyYQVD2Lz3tzh8ghGO7R7tBY2BwT1KDMU_hZwvVgpanzCz3IPZcuVbqGPH8Lw39myNacctupGQxvekZU7f0iyww-0KhNRoBvCgUM0wSx3nnFg_rU7V5MlNfJJjqRIzkbcgj-Eix2FqEL_OV3Jk",
      ];
    }
    return [product.imageUrl];
  }, [product]);

  const [activeImage, setActiveImage] = useState<string>(productThumbnails[0]);

  // Compute live price based on package selected
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

  const currentPrice = useMemo(() => {
    return computePrice(product.price, selectedWeight, product.availableWeights);
  }, [product, selectedWeight]);

  // Check if this particular weight is currently inside the cart
  const cartItem = useMemo(() => {
    return cart.find((c) => c.product.id === product.id && c.selectedWeight === selectedWeight);
  }, [cart, product.id, selectedWeight]);

  // Manage custom dynamic list of reviews inside product
  const [localReviews, setLocalReviews] = useState<Review[]>([
    {
      id: "rev-1",
      userName: "Nikunj Parikh",
      userInitials: "NP",
      rating: 5,
      timeAgo: "Just now",
      comment: "Superb flavor, properly roasted. Reached warm and perfectly packed."
    },
    {
      id: "rev-2",
      userName: "Shraddha Shah",
      userInitials: "SS",
      rating: 4.8,
      timeAgo: "2 days ago",
      comment: "Highly fragrant and pure ingredients. Exceedingly fresh. Our full family really loved it!"
    },
  ]);

  const handleAddReview = (e: FormEvent) => {
    e.preventDefault();
    if (!newReviewerName.trim() || !newReviewComment.trim()) return;

    const initials = newReviewerName
      .trim()
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);

    const freshRev: Review = {
      id: `rev-${Date.now()}`,
      userName: newReviewerName,
      userInitials: initials || "UN",
      rating: newReviewRating,
      timeAgo: "Just now",
      comment: newReviewComment,
    };

    setLocalReviews((prev) => [freshRev, ...prev]);

    // Update global rating state
    product.reviewCount += 1;
    product.rating = parseFloat(
      ((product.rating * (product.reviewCount - 1) + newReviewRating) / product.reviewCount).toFixed(1)
    );

    // Reset input fields
    setNewReviewerName("");
    setNewReviewComment("");
    setNewReviewRating(5);
  };

  return (
    <div className="flex flex-col gap-8 font-sans pb-10 text-left">
      {/* Navigation Breadcrumb */}
      <div className="flex items-center gap-2">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-green-700 transition-colors font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to products</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
        {/* Left Column Image Showcase */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="aspect-square bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden relative flex items-center justify-center p-3 shadow-inner">
            <img
              src={activeImage}
              alt={product.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center rounded-xl"
            />
          </div>

          {/* Thumbnails list */}
          {productThumbnails.length > 1 && (
            <div className="grid grid-cols-4 gap-3">
              {productThumbnails.map((t, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(t)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 bg-gray-50 p-1 flex items-center justify-center transition-all ${
                    activeImage === t ? "border-green-600 shadow-sm" : "border-gray-200 hover:border-gray-400"
                  }`}
                >
                  <img src={t} alt="" className="w-full h-full object-cover rounded" />
                </button>
              ))}
            </div>
          )}

          {/* Bullet proofs trust elements */}
          <div className="bg-gray-50 rounded-xl p-4 flex flex-col gap-3.5 border border-gray-150">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-green-700 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-gray-800">FSSAI Standards Compliant</h4>
                <p className="text-[11px] text-gray-500 leading-normal">
                  Sourced and packaged daily in clean certified kitchens under systematic heat control.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <ThumbsUp className="w-5 h-5 text-green-700 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-gray-800">Genuine High-Quality Ingredients</h4>
                <p className="text-[11px] text-gray-500 leading-normal">
                  Pure gram flour, double-refined cold-pressed oil, unadulterated pure cow ghee.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column details selector */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-start gap-4">
              <h1 className="text-3xl font-display font-bold text-gray-900 leading-tight">
                {product.name}
              </h1>
              <div className="flex items-center gap-1 bg-yellow-50 text-yellow-800 font-bold text-xs px-2.5 py-1 rounded-full shrink-0 border border-yellow-100">
                <Star className="w-4 h-4 fill-yellow-600 text-yellow-600" />
                <span>{product.rating}</span>
                <span className="text-gray-400 text-[10px] font-normal">
                  ({product.reviewCount} reviews)
                </span>
              </div>
            </div>

            {product.gujaratiName && (
              <span className="text-md text-green-700 font-bold font-sans">
                {product.gujaratiName}
              </span>
            )}
          </div>

          <p className="text-sm text-gray-600 leading-relaxed font-sans font-medium">
            {product.description}
          </p>

          <div className="border-t border-b border-gray-100 py-5 flex flex-col gap-4">
            {/* Weight Package selection */}
            <div className="flex flex-col gap-2">
              <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">
                Select pack / weights
              </span>
              <div className="flex flex-wrap gap-2">
                {product.availableWeights.map((w) => (
                  <button
                    key={w}
                    onClick={() => {
                      setSelectedWeight(w);
                      setQty(1);
                    }}
                    className={`px-4 py-2 rounded-xl text-xs font-bold font-sans transition-all border ${
                      selectedWeight === w
                        ? "bg-green-700 text-white border-green-700 shadow-sm"
                        : "bg-white text-gray-700 border-gray-200 hover:border-green-600"
                    }`}
                  >
                    {w}
                  </button>
                ))}
              </div>
            </div>

            {/* Direct stock/price display */}
            <div className="flex items-center justify-between bg-green-50/50 rounded-xl p-4 border border-green-100">
              <div className="flex flex-col">
                <span className="text-xs text-green-700 font-bold uppercase">Price for {selectedWeight}</span>
                <span className="text-2xl font-display font-bold text-green-900">₹{currentPrice}</span>
              </div>

              <div className="text-right">
                <div className="text-xs font-sans text-gray-500 font-bold">STOCK METRIC</div>
                <div
                  className={`text-sm font-bold ${product.isLowStock ? "text-red-600 animate-pulse" : "text-green-700"}`}
                >
                  {product.stockText} available
                </div>
              </div>
            </div>
          </div>

          {/* Stepper with checkout linking */}
          <div className="flex items-center gap-4">
            {cartItem ? (
              <div className="flex items-center gap-4 flex-1">
                <div className="flex items-center rounded-xl border border-green-200 bg-white overflow-hidden shadow-sm h-12">
                  <button
                    onClick={() => onUpdateCartQty(product.id, selectedWeight, cartItem.quantity - 1)}
                    className="px-4 text-gray-600 hover:bg-gray-100 font-bold font-sans text-lg focus:outline-none h-full"
                  >
                    -
                  </button>
                  <span className="px-5 bg-green-50 text-green-800 font-sans text-base font-bold min-w-[40px] text-center">
                    {cartItem.quantity}
                  </span>
                  <button
                    onClick={() => onUpdateCartQty(product.id, selectedWeight, cartItem.quantity + 1)}
                    className="px-4 text-green-700 hover:bg-gray-100 font-bold font-sans text-lg focus:outline-none h-full"
                  >
                    +
                  </button>
                </div>
                <div className="text-xs text-green-700 font-semibold flex items-center gap-1">
                  <Sparkles className="w-4 h-4" />
                  <span>Item variant is added in cart!</span>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3 flex-1">
                {/* Quantity modifier prior to adding */}
                <div className="flex items-center rounded-xl border border-gray-200 bg-white overflow-hidden h-12">
                  <button
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    className="px-3.5 text-gray-500 hover:bg-gray-100 font-bold font-sans focus:outline-none h-full text-base"
                  >
                    -
                  </button>
                  <span className="px-4 text-gray-800 font-sans text-sm font-bold min-w-[32px] text-center">
                    {qty}
                  </span>
                  <button
                    onClick={() => setQty(qty + 1)}
                    className="px-3.5 text-gray-500 hover:bg-gray-100 font-bold font-sans focus:outline-none h-full text-base"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={() => onAddToCart(product, selectedWeight, qty)}
                  className="flex-1 bg-green-700 hover:bg-green-800 text-white font-sans text-sm font-bold py-3.5 rounded-xl transition-all shadow-md hover:shadow-lg cursor-pointer flex items-center justify-center gap-2"
                >
                  Add Pack to Cart &bull; ₹{currentPrice * qty}
                </button>
              </div>
            )}
          </div>

          {/* Segmented Specification Tabs */}
          <div className="mt-4">
            <div className="flex border-b border-gray-100">
              <button
                onClick={() => setActiveTab("about")}
                className={`py-3 px-6 -mb-px text-sm font-bold transition-all border-b-2 ${
                  activeTab === "about"
                    ? "border-green-700 text-green-700"
                    : "border-transparent text-gray-500 hover:text-gray-800"
                }`}
              >
                About & Process
              </button>
              <button
                onClick={() => setActiveTab("reviews")}
                className={`py-3 px-6 -mb-px text-sm font-bold transition-all border-b-2 ${
                  activeTab === "reviews"
                    ? "border-green-700 text-green-700"
                    : "border-transparent text-gray-500 hover:text-gray-800"
                }`}
              >
                Reviews & Ratings ({product.reviewCount})
              </button>
            </div>

            <div className="py-5 font-sans">
              {activeTab === "about" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-gray-600 leading-relaxed font-sans font-medium">
                  <div className="flex flex-col gap-2 p-3 bg-gray-50 rounded-lg">
                    <span className="font-bold text-gray-800 uppercase tracking-wide">Storage instructions</span>
                    <span>Store inside a dry airtight container. Best before 15 days of packaging date for dry farsans. Jalebi and Khandvi are best consumed fresh.</span>
                  </div>
                  <div className="flex flex-col gap-2 p-3 bg-gray-50 rounded-lg">
                    <span className="font-bold text-gray-800 uppercase tracking-wide">Safe Packaging</span>
                    <span>Hygienically handled under safe air vacuum-tight conditions to avoid grease issues, maintaining flavor crispiness levels perfectly.</span>
                  </div>
                </div>
              )}

              {activeTab === "reviews" && (
                <div className="flex flex-col gap-6">
                  {/* Submission form */}
                  <form onSubmit={handleAddReview} className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex flex-col gap-4">
                    <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                      Write your fresh review
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                      <div className="flex flex-col gap-1">
                        <label className="text-[11px] text-gray-500 font-bold font-sans">Your Name</label>
                        <input
                          type="text"
                          required
                          value={newReviewerName}
                          onChange={(e) => setNewReviewerName(e.target.value)}
                          placeholder="e.g. Amish Parikh"
                          className="bg-white border border-gray-200 rounded-lg py-2 px-3 text-xs text-gray-800 focus:outline-none focus:border-green-700 focus:ring-1 focus:ring-green-700"
                          id="reviewer-name-field"
                        />
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="text-[11px] text-gray-500 font-bold font-sans">Rating Score</label>
                        <select
                          value={newReviewRating}
                          onChange={(e) => setNewReviewRating(parseInt(e.target.value))}
                          className="bg-white border border-gray-200 rounded-lg py-2 px-3 text-xs text-gray-800 focus:outline-none focus:border-green-700"
                        >
                          <option value="5">⭐⭐⭐⭐⭐ 5 Stars</option>
                          <option value="4">⭐⭐⭐⭐ 4 Stars</option>
                          <option value="3">⭐⭐⭐ 3 Stars</option>
                          <option value="2">⭐⭐ 2 Stars</option>
                          <option value="1">⭐ 1 Star</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[11px] text-gray-500 font-bold font-sans">Comment</label>
                      <textarea
                        required
                        rows={2}
                        value={newReviewComment}
                        onChange={(e) => setNewReviewComment(e.target.value)}
                        placeholder="Write down details regarding flavor balance, packing, and overall satisfaction..."
                        className="bg-white border border-gray-200 rounded-lg py-2 px-3 text-xs text-gray-800 focus:outline-none focus:border-green-700 focus:ring-1 focus:ring-green-700"
                        id="review-comment-field"
                      />
                    </div>

                    <button
                      type="submit"
                      className="bg-green-700 hover:bg-green-800 text-white font-sans text-xs font-bold py-2 px-4 rounded-lg self-start cursor-pointer transition-colors"
                    >
                      Submit Review
                    </button>
                  </form>

                  {/* Reviews List */}
                  <div className="flex flex-col gap-3.5">
                    {localReviews.map((rev) => (
                      <div key={rev.id} className="p-4 bg-white border border-gray-100 rounded-xl flex gap-3.5">
                        <div className="w-9 h-9 rounded-full bg-green-50 text-green-700 font-bold text-xs flex items-center justify-center shrink-0 border border-green-100">
                          {rev.userInitials}
                        </div>
                        <div className="flex-1 flex flex-col gap-1 text-left">
                          <div className="flex items-center justify-between">
                            <h4 className="text-xs font-bold text-gray-800">{rev.userName}</h4>
                            <span className="text-[10px] text-gray-400 font-semibold">{rev.timeAgo}</span>
                          </div>

                          <div className="flex items-center gap-0.5 mt-[-1px]">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3.5 h-3.5 ${
                                  i < Math.floor(rev.rating)
                                    ? "fill-yellow-500 text-yellow-500"
                                    : "text-gray-200"
                                }`}
                              />
                            ))}
                          </div>

                          <p className="text-xs text-gray-600 mt-1 leading-normal font-medium">
                            {rev.comment}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
