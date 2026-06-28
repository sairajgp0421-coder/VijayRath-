import { ArrowLeft, Shield, Phone, MapPin, Eye, Lock, FileText } from "lucide-react";

interface PrivacyViewProps {
  onBack: () => void;
}

export default function PrivacyView({ onBack }: PrivacyViewProps) {
  return (
    <div className="flex flex-col gap-8 max-w-4xl mx-auto w-full pb-10 font-sans animate-fade-in text-left">
      {/* Header back button area */}
      <div className="flex items-center justify-between border-b border-gray-150 pb-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-500 hover:text-green-700 transition-colors font-medium text-sm border border-gray-200 hover:border-green-600 rounded-lg px-3.5 py-2 bg-white cursor-pointer shadow-2xs"
          id="privacy-back-btn"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Shop
        </button>
        <span className="text-xs text-gray-400 font-mono">Last Updated: June 2026</span>
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-10 shadow-sm flex flex-col gap-8">
        <div className="flex items-center gap-3.5 border-b border-gray-50 pb-5">
          <div className="bg-green-50 p-2.5 rounded-xl">
            <Shield className="w-6 h-6 text-green-700" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-display font-black text-gray-950 tracking-tight">
              Privacy Policy
            </h1>
            <p className="text-sm text-gray-500 font-sans mt-0.5">VijayRath Namkeen & Bakery</p>
          </div>
        </div>

        {/* Welcome message */}
        <div className="bg-green-50/55 border border-green-100 p-5 rounded-xl text-green-900 text-sm leading-relaxed font-medium">
          Welcome to VijayRath Namkeen & Bakery. We respect your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, and safeguard your data when you visit our website or place an order.
        </div>

        {/* Sections */}
        <div className="flex flex-col gap-8">
          
          {/* Section 1 */}
          <div className="flex flex-col gap-3">
            <h2 className="text-base font-bold text-gray-950 font-display flex items-center gap-2">
              <span className="text-xs bg-gray-100 text-gray-700 w-5 h-5 flex items-center justify-center rounded-full font-mono">1</span>
              Information We Collect
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed pl-7">
              We may collect and process the following information when you interact with our platform:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-7">
              {[
                { label: "Full Name", desc: "For order personalization and identification" },
                { label: "Mobile Number", desc: "For delivery updates and order verification" },
                { label: "Email Address", desc: "For receipts, billing, and communication" },
                { label: "Delivery Address", desc: "To safely transport fresh culinary packages" },
                { label: "Billing Information", desc: "For tax compliance and recordkeeping" },
                { label: "Order History", desc: "To assist you with repeat loyalty orders" },
                { label: "Payment Details", desc: "Processed securely via state-of-the-art payment gateways" },
                { label: "Device and Browser Details", desc: "To optimize load speed and interface rendering" }
              ].map((item, idx) => (
                <div key={idx} className="p-3 bg-gray-50 border border-gray-100 rounded-xl flex flex-col gap-0.5">
                  <span className="text-sm font-semibold text-gray-900">{item.label}</span>
                  <span className="text-xs text-gray-500">{item.desc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2 */}
          <div className="flex flex-col gap-3">
            <h2 className="text-base font-bold text-gray-950 font-display flex items-center gap-2">
              <span className="text-xs bg-gray-100 text-gray-700 w-5 h-5 flex items-center justify-center rounded-full font-mono">2</span>
              How We Use Your Information
            </h2>
            <div className="text-sm text-gray-600 leading-relaxed pl-7 flex flex-col gap-2">
              <p>We leverage gathered information for strict professional operations:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 mt-1.5">
                {[
                  "Process and deliver your delicious, fresh orders swiftly.",
                  "Provide warm, dedicated customer support services.",
                  "Send instantaneous automated order confirmations and updates.",
                  "Improve our digital website design, loading speeds, and overall services.",
                  "Analyze usage patterns to prevent fraud and unauthorized security activities.",
                  "Comply fully with regional food safety and Indian legal obligations."
                ].map((text, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="text-green-600 font-bold shrink-0 mt-0.5">✓</span>
                    <span>{text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Section 3 */}
          <div className="flex flex-col gap-3">
            <h2 className="text-base font-bold text-gray-950 font-display flex items-center gap-2">
              <span className="text-xs bg-gray-100 text-gray-700 w-5 h-5 flex items-center justify-center rounded-full font-mono">3</span>
              Payment Security
            </h2>
            <div className="pl-7 flex flex-col gap-3">
              <div className="bg-blue-50/55 border border-blue-100 p-4 rounded-xl flex items-start gap-3">
                <Lock className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
                <div className="text-sm text-blue-900 leading-relaxed">
                  <p className="font-semibold">Industry-Standard Encryption Protection</p>
                  <p className="text-xs text-blue-800 mt-1">
                    All online payments are processed through secure and highly trusted third-party payment gateways. <strong>We do not save or store</strong> complete debit card, credit card, CVV integers, or internet banking login details on our servers under any circumstances.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Section 4 */}
          <div className="flex flex-col gap-3">
            <h2 className="text-base font-bold text-gray-950 font-display flex items-center gap-2">
              <span className="text-xs bg-gray-100 text-gray-700 w-5 h-5 flex items-center justify-center rounded-full font-mono">4</span>
              Sharing of Information
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed pl-7">
              We treat your trust as highly valuable. <strong>We do not sell, rent, lease, or trade</strong> your personal information. Information may be shared strictly with:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pl-7 mt-1">
              <div className="border border-gray-100 rounded-xl p-3 bg-gray-50 text-left">
                <span className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">01. Logistics</span>
                <p className="text-sm font-semibold text-gray-800">Delivery partners</p>
                <p className="text-xs text-gray-500 mt-0.5">To accurately route packages to your doorstep.</p>
              </div>
              <div className="border border-gray-100 rounded-xl p-3 bg-gray-50 text-left">
                <span className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">02. Transactions</span>
                <p className="text-sm font-semibold text-gray-800">Payment processors</p>
                <p className="text-xs text-gray-500 mt-0.5">To facilitate secure credit, debit, or UPI transactions safely.</p>
              </div>
              <div className="border border-gray-100 rounded-xl p-3 bg-gray-50 text-left">
                <span className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">03. Legal</span>
                <p className="text-sm font-semibold text-gray-800">Legal authorities</p>
                <p className="text-xs text-gray-500 mt-0.5">Only when strictly mandated by governing Indian law.</p>
              </div>
            </div>
          </div>

          {/* Section 5 */}
          <div className="flex flex-col gap-3">
            <h2 className="text-base font-bold text-gray-950 font-display flex items-center gap-2">
              <span className="text-xs bg-gray-100 text-gray-700 w-5 h-5 flex items-center justify-center rounded-full font-mono">5</span>
              Cookies
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed pl-7">
              Our website may use standard cookies to remember your visual preferences, store your cart contents between sessions, and evaluate traffic patterns using web analytics to render high-contrast responsive layouts efficiently.
            </p>
          </div>

          {/* Section 6 */}
          <div className="flex flex-col gap-3">
            <h2 className="text-base font-bold text-gray-950 font-display flex items-center gap-2">
              <span className="text-xs bg-gray-100 text-gray-700 w-5 h-5 flex items-center justify-center rounded-full font-mono">6</span>
              Data Security
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed pl-7">
              We implement reasonable security measures, server firewalls, and cryptographic protocols to protect your personal information from unauthorized access, misuse, modification, or exposure.
            </p>
          </div>

          {/* Section 7 */}
          <div className="flex flex-col gap-3">
            <h2 className="text-base font-bold text-gray-950 font-display flex items-center gap-2">
              <span className="text-xs bg-gray-100 text-gray-700 w-5 h-5 flex items-center justify-center rounded-full font-mono">7</span>
              Third-Party Links
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed pl-7">
              Our website might contain links to third-party portals or digital integrations. Please note that we are not responsible for their independent privacy practices, software cookies, or layout contents.
            </p>
          </div>

          {/* Section 8 */}
          <div className="flex flex-col gap-3">
            <h2 className="text-base font-bold text-gray-950 font-display flex items-center gap-2">
              <span className="text-xs bg-gray-100 text-gray-700 w-5 h-5 flex items-center justify-center rounded-full font-mono">8</span>
              Your Rights
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed pl-7">
              You are the absolute owner of your data. You may request access, corrections, review checkpoints, or full deletion of your compiled personal credentials by reaching out to our core support line.
            </p>
          </div>

          {/* Section 9 */}
          <div className="flex flex-col gap-3">
            <h2 className="text-base font-bold text-gray-950 font-display flex items-center gap-2">
              <span className="text-xs bg-gray-100 text-gray-700 w-5 h-5 flex items-center justify-center rounded-full font-mono">9</span>
              Changes to This Policy
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed pl-7">
              We reserve the right to refine or update this Privacy Policy at any moment to conform with evolving security environments. Major updates will be made visible clearly on this page.
            </p>
          </div>

          {/* Contact details */}
          <div className="flex flex-col gap-2 border-t border-gray-100 pt-5 mt-3 pl-7">
            <p className="font-bold text-gray-950">VijayRath Namkeen & Bakery</p>
            <div className="flex items-start gap-2.5 mt-1.5 text-sm text-gray-600">
              <MapPin className="w-4 h-4 text-green-700 shrink-0 mt-0.5" />
              <span>
                Shop No. 1, Vaishnovi Garden View,<br />
                Opp. Shaligram Lake View, Khoraj, Gandhinagar, Gujarat, India.
              </span>
            </div>
            <div className="flex items-center gap-2.5 text-sm text-gray-600">
              <Phone className="w-4 h-4 text-green-700 shrink-0" />
              <span>Mobile: +91 6355141378</span>
            </div>
          </div>

        </div>
      </div>

      {/* Footer Return Action */}
      <div className="flex justify-center pt-2">
        <button
          onClick={onBack}
          className="px-6 py-2.5 bg-green-700 hover:bg-green-800 text-white rounded-xl text-sm font-bold shadow-md transition-all cursor-pointer flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Return to Shopping
        </button>
      </div>
    </div>
  );
}
