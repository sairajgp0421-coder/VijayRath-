import { Product, Review, Order, Coupon } from "./types";

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: "nylon-khaman",
    name: "Nylon Khaman",
    gujaratiName: "નાયલોન ખમણ",
    category: "farsan",
    price: 50, // Base price for 250g
    unit: "250 GM",
    availableWeights: ["250 GM", "500 GM", "1 KG"],
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDbhei94wbWFKxSy8Vpc-K5T77dMbLj3WMOWbrZeknLYevLPrqQ1_42ZC0tBTq27_JQRedGnDqdx9qJxzDb97nKAoq4eQR3v7qY3N61634Y17maI-5GY-qme9pYLjXuxDW50QKXJwLr4CsGrpW4-BVDk2IDGq9U22DUZfo1vq0sJZPlvKb9xAB12OfVEpEMioBno7EtCCU4jcqV7EDkiNRRMOfoZjExgPV0ETpC5EdtSQTcnyYwu2Qc86aSPSR025C9q7jg4PnzXfE",
    description: "Freshly prepared soft Nylon Khaman. Made from premium gram flour, offering a perfectly soft and spongy texture. Experience the authentic Gujarati taste, mildly sweet and savory, garnished with mustard seeds and fresh coriander.",
    rating: 4.8,
    reviewCount: 124,
    stockText: "150 kg",
    stockLevel: 150,
    isFresh: true
  },
  {
    id: "bhavnagari-gathiya",
    name: "Bhavnagari Gathiya",
    gujaratiName: "ભાવનગરી ગાંઠિયા",
    category: "namkeen",
    price: 60, // Base price for 250g
    unit: "250 GM",
    availableWeights: ["250 GM", "500 GM", "1 KG"],
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDK9z-IYEytGxvtXv_ne5isS47fnB_AjOOYoi7l3pm2bfUxmPPdgj7PdCkK54bvweg8VhIEDfVpwpvPEGIjtJi-JjPqE6BlBsbKhi4HdaMQbqJKBV0cPj2zxk76HZfiH9eMAQA2VXkOG-sMbHtgAYCfJw2IWHQOQY3-v7de-csJWEAJoPsmwr-5bKiM9yv1y1c469lIDMPHO1qS_zEB4Md5ybWyW_kIqUV5iuJOYJsAZr3FrjJGFpI8ioNzM2aWXn5xb_ncUzytPps",
    description: "Crispy and spiced authentic Bhavnagari Gathiya, cooked in premium double-refined oil. Highly aromatic with strong hints of carom seeds (ajwain) and black pepper, perfect as a morning or evening tea snack.",
    rating: 4.7,
    reviewCount: 98,
    stockText: "80 kg",
    stockLevel: 80,
    isFresh: true
  },
  {
    id: "premium-khatta-meetha",
    name: "Premium Khatta Meetha Mix",
    gujaratiName: "ખાટા મીઠા મિશ્રણ",
    category: "namkeen",
    price: 45, // Base price for 250g
    unit: "250 GM",
    availableWeights: ["250 GM", "500 GM", "1 KG"],
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCQTRPZu1XQ6hR8epH4QqGgkFSRDUWdUBTmkJJqqhHp4Kb0kfDTVrgJ4cizW7Kgu2TyWUS13P51aMB-8rluY38t5Wv1UZz2gcqn307o6xI_apI1A4TAwtDKEUXMwLNVeU7d9_Tavc2EfnDtNjQm1tCVaStil9Izy4RrmMDJLmRVvImYuXCWhkCRP2OBqaynxlIrQwGYId8RytF2l0qsU84W8iYG8IS760WL_C1kC1-W199AOo5vF4dE5oeM2Nlw9WGF00fbtFIo3f8",
    description: "A wonderful blend of sweet and sour crispy treats. Combined carefully with thin sev, fried lentils, peanuts, and flavorful spices. A staple snack that is highly appetizing and stays fresh for weeks.",
    rating: 4.6,
    reviewCount: 76,
    stockText: "210 kg",
    stockLevel: 210
  },
  {
    id: "mini-samosa",
    name: "Mini Samosa",
    gujaratiName: "મિનિ સમોસા",
    category: "farsan",
    price: 80, // Base price for 250g
    unit: "250 GM",
    availableWeights: ["250 GM", "500 GM", "1 KG"],
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDTye-l__V8QZvkkLA8O_yZj8Lnh4AgJVYjYW7bvLGqPQtthHWnXUawcy3g1AQGY0kWrCYx_7YYirYVLccEZHoge8yMPUSRDrHyR-3ph6koMmuTLDhX2OTJjVUAhVR4-fSzk54Rab2TRpMN1TkfFMO1mSUvcs_G8yVpSNrJ71yWEGKpovAfw4ufq3vKuCAamGgwAD4vZwUHLvSHRLJzGSQVnosK_F5ukyqHKNE825OTA6kA9fqbnRq-f4F5_ABQXP6Aa7lGOswK5Pk",
    description: "Golden crispy bite-sized samosas loaded with seasoned spices and crunch. These have a superb flakey outer shell and a savory sweet-sour masala filling of green peas, cashews, and raisins.",
    rating: 4.9,
    reviewCount: 165,
    stockText: "15 kg (Low)",
    stockLevel: 15,
    isLowStock: true,
    isFresh: true
  },
  {
    id: "desi-ghee-jalebi",
    name: "Desi Ghee Jalebi",
    gujaratiName: "શુદ્ધ ઘી ની જલેબી",
    category: "sweets",
    price: 110, // Base price for 250g
    unit: "250 GM",
    availableWeights: ["250 GM", "500 GM", "1 KG"],
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBDU-Bv-hsfMEc0X7T7ON-OjkuM3DqwUSfF6xQxeOKQp7qENgLHzJTS7b0W4m3VBh8rzBMzffchuBB-dWEbcQFJDtukytiVePm__XiXSYOdTMvO4VE-rhmP5jOdYFXAHo6AIZW4jqkSRMVOmFLulpwBqCz17FTh9OzbX6Yja-XkiQrTxE-HXVGfLu8HyaQ4_R-bdPXtnMcTCFW0wOjOfFpX_f2qAlgo7jTN2KoB8CEEBU9czxyvrwpvXrW1HXyXxW0hFaJLbR5oXtw",
    description: "Unbelievably hot, sweet, and sticky coiled jalebis prepared freshly in pure Desi Ghee. The batter is fermented to perfection over 12 hours so the jalebis are tangy, spongy inside, and incredibly crispy outside.",
    rating: 4.9,
    reviewCount: 212,
    stockText: "40 kg",
    stockLevel: 40,
    isFresh: true
  },
  {
    id: "besan-ladoo",
    name: "Pure Ghee Besan Ladoo",
    gujaratiName: "શુદ્ધ ઘી ના બેસન લાડુ",
    category: "sweets",
    price: 85, // Base price for 250g
    unit: "250 GM",
    availableWeights: ["250 GM", "500 GM", "1 KG"],
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDhPcJtJtHZGFKvEAh93PRgfj0KQGoymLUizFsVTKquGpRejUZwCvAK4A6pQvyFDfTIoBgRAT8MoJzES_fb7TLgCVTG4LMQWyEBoMqU7-6PwfxMWJo8q5VMNa9uRba7qfMZvPEkk05Ya5ov3C8afLJwgM_lTaUsH9JgvnFojx5gy-Xdx1gsK5Koj4QkOHJa4EzYX8tus7UwUZXiRK-_heATCKp_un2CXM-Ths40XXtyDNFmO6iI6FWGY_Z3utBoMKdIYSFTzoCe23E",
    description: "Traditional sweet spheres made by slow roasting premium gram flour with pure Desi Ghee until thoroughly aromatic, studded with pistachio flakes, green cardamom powder, and sweet almonds.",
    rating: 4.8,
    reviewCount: 140,
    stockText: "5 kg (Low)",
    stockLevel: 5,
    isLowStock: true
  },
  {
    id: "khandvi",
    name: "Khandvi",
    gujaratiName: "ખાંડવી",
    category: "farsan",
    price: 60, // Base price for 250g
    unit: "250 GM",
    availableWeights: ["250 GM", "500 GM", "1 KG"],
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDGV2DPP29taW7GAPr3E54sETH7tVDfCAeKHiWFHWznXfLlM3ekVSDAWKuwb-zYee99SqI-h6MNTrVjckp17ktRhHbK3CDNu0PTKoQLF-QD-XUKXgIuIwK3-53nn4-s8wgiwtLyCkYpldOxwBjnqOFJGqHar0kfVO3V0R1uhuCfoRStUbpQqUHHxwpWDb8hznHQxmY3jZ_2dY3RUVxwTAavnfTW0gBOyMA9ihz73h9ZnIpX7UzorJaFrrktFtc_voy_QXFPc3syRJg", // falling back safely
    description: "Velvety soft, seasoned rolls made from gram flour and yogurt batter, perfectly spiced, tempered with sesame seeds and mustard, then garnished delicately with freshly grated coconut and green coriander.",
    rating: 4.7,
    reviewCount: 89,
    stockText: "35 kg",
    stockLevel: 35,
    isFresh: true
  },
  {
    id: "ratlami-sev",
    name: "Spicy Ratlami Sev",
    gujaratiName: "રતલામી સેવ",
    category: "namkeen",
    price: 55, // Base price for 250g
    unit: "250 GM",
    availableWeights: ["250 GM", "500 GM", "1 KG"],
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDTye-l__V8QZvkkLA8O_yZj8Lnh4AgJVYjYW7bvLGqPQtthHWnXUawcy3g1AQGY0kWrCYx_7YYirYVLccEZHoge8yMPUSRDrHyR-3ph6koMmuTLDhX2OTJjVUAhVR4-fSzk54Rab2TRpMN1TkfFMO1mSUvcs_G8yVpSNrJ71yWEGKpovAfw4ufq3vKuCAamGgwAD4vZwUHLvSHRLJzGSQVnosK_F5ukyqHKNE825OTA6kA9fqbnRq-f4F5_ABQXP6Aa7lGOswK5Pk",
    description: "A dynamic, spicy deep-fried chickpea flour noodle spiced with pepper, cloves, and dry ginger. Highly addictive traditional taste that pairs uniquely well with warm tea.",
    rating: 4.8,
    reviewCount: 110,
    stockText: "125 kg",
    stockLevel: 125
  },
  {
    id: "crispy-bhakharwadi",
    name: "Crispy Bhakharwadi",
    gujaratiName: "ભાખરવડી",
    category: "namkeen",
    price: 65, // Base price for 250g
    unit: "250 GM",
    availableWeights: ["250 GM", "500 GM", "1 KG"],
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCQTRPZu1XQ6hR8epH4QqGgkFSRDUWdUBTmkJJqqhHp4Kb0kfDTVrgJ4cizW7Kgu2TyWUS13P51aMB-8rluY38t5Wv1UZz2gcqn307o6xI_apI1A4TAwtDKEUXMwLNVeU7d9_Tavc2EfnDtNjQm1tCVaStil9Izy4RrmMDJLmRVvImYuXCWhkCRP2OBqaynxlIrQwGYId8RytF2l0qsU84W8iYG8IS760WL_C1kC1-W199AOo5vF4dE5oeM2Nlw9WGF00fbtFIo3f8",
    description: "Delectable spicy-sweet bite-sized rolled pinwheels. Filled with a delicious blend of poppy seeds, coconut flakes, and signature aromatic dry spices.",
    rating: 4.9,
    reviewCount: 132,
    stockText: "95 kg",
    stockLevel: 95
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: "rev-1",
    userName: "Amit Kumar",
    userInitials: "AK",
    rating: 5,
    timeAgo: "2 days ago",
    comment: "Absolutely delicious! The khaman is so soft and melts in the mouth. The balance of sweetness and tanginess is just perfect. Will definitely order again."
  },
  {
    id: "rev-2",
    userName: "Sneha Patel",
    userInitials: "SP",
    rating: 5,
    timeAgo: "1 week ago",
    comment: "Very authentic taste, reminds me of home. The packaging was neat and it arrived fresh. Highly recommend for evening snacks."
  },
  {
    id: "rev-3",
    userName: "Jignesh Shah",
    userInitials: "JS",
    rating: 4,
    timeAgo: "3 days ago",
    comment: "Jalebi is extremely crispy and fully saturated in Desi Ghee. Nylon Khaman has perfect airy pocket structure. Highly content with the quality!"
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: "ORD-9081",
    date: "May 29, 2026",
    items: [
      { name: "Nylon Khaman", weight: "250 GM", quantity: 2, price: 100 },
      { name: "Desi Ghee Jalebi", weight: "250 GM", quantity: 4, price: 440 }
    ],
    totalPrice: 540,
    status: "Order Confirmed",
    deliveryAddress: {
      name: "Rahul Sharma",
      phone: "+91 98765 43210",
      details: "Ahmedabad Main Outlet (Requesting extra chutney bags)"
    },
    paymentMethod: "UPI (Google Pay)",
    datePlaced: "May 29, 2026, 18:30"
  },
  {
    id: "ORD-9080",
    date: "May 28, 2026",
    items: [
      { name: "Bhavnagari Gathiya", weight: "500 GM", quantity: 2, price: 240 },
      { name: "Pure Ghee Besan Ladoo", weight: "1 KG", quantity: 3, price: 1010 }
    ],
    totalPrice: 1250,
    status: "Order Processed",
    deliveryAddress: {
      name: "Priya Sharma",
      phone: "+91 98888 77777",
      details: "Ahmedabad Satellite Branch (Pickup expected at 5:00 PM)"
    },
    paymentMethod: "Credit Card",
    datePlaced: "May 28, 2026, 12:15"
  },
  {
    id: "ORD-9078",
    date: "May 27, 2026",
    items: [
      { name: "Premium Khatta Meetha Mix", weight: "500 GM", quantity: 1, price: 90 },
      { name: "Khandvi", weight: "500 GM", quantity: 2, price: 230 }
    ],
    totalPrice: 320,
    status: "Out for Delivery",
    deliveryAddress: {
      name: "Amit Patel",
      phone: "+91 97777 66666",
      details: "Ahmedabad Main Outlet (Normal spice options)"
    },
    paymentMethod: "Net Banking",
    datePlaced: "May 27, 2026, 11:00"
  },
  {
    id: "ORD-8923",
    date: "Oct 24, 2023",
    items: [
      { name: "Nylon Khaman", weight: "500 GM", quantity: 1, price: 100 },
      { name: "Bhavnagari Gathiya", weight: "250 GM", quantity: 1, price: 60 },
      { name: "Desi Ghee Jalebi", weight: "500 GM", quantity: 1, price: 290 }
    ],
    totalPrice: 450,
    status: "Delivered",
    deliveryAddress: {
      name: "Rahul Sharma",
      phone: "+91 98765 43210",
      details: "Ahmedabad Main Outlet (Store pickup completed)"
    },
    paymentMethod: "UPI",
    datePlaced: "Oct 24, 2023, 14:30"
  },
  {
    id: "ORD-8810",
    date: "Oct 12, 2023",
    items: [
      { name: "Pure Ghee Besan Ladoo", weight: "500 GM", quantity: 2, price: 340 },
      { name: "Premium Khatta Meetha Mix", weight: "1 KG", quantity: 3, price: 480 }
    ],
    totalPrice: 820,
    status: "Delivered",
    deliveryAddress: {
      name: "Rahul Sharma",
      phone: "+91 98765 43210",
      details: "Ahmedabad Main Outlet (Store pickup completed)"
    },
    paymentMethod: "Cash on Delivery",
    datePlaced: "Oct 12, 2023, 15:45"
  }
];

export const AVAILABLE_COUPONS: Coupon[] = [
  { code: "FARSAN20", discountPercent: 20, description: "Get 20% off on all Farsan snacks" },
  { code: "SWEETS10", discountPercent: 10, description: "Enjoy 10% off on our Pure Desi Ghee sweets" },
  { code: "FESTIVE", discountPercent: 15, description: "Enjoy 15% off during current festive weeks" }
];
