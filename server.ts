import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini AI Client
const geminiApiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;

if (geminiApiKey) {
  aiClient = new GoogleGenAI({
    apiKey: geminiApiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// 1. AI Recommendation Endpoint
app.post("/api/ai/recommend", async (req, res) => {
  try {
    const { recipient, occasion, interests, budget } = req.body;

    if (!aiClient) {
      return res.status(503).json({
        error: "AI recommendation service is currently unavailable. Please verify GEMINI_API_KEY is configured in Secrets.",
      });
    }

    const prompt = `Suggest exactly 4 gift ideas for a recipient who is a "${recipient}", for the occasion "${occasion}".
Their interests include "${interests}" and the budget tier is "${budget}".
Provide detailed names, persuasive and specific reasons for each, a price estimate in USD, and a recommended product category.`;

    const response = await aiClient.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        systemInstruction: "You are an elite gift advisor. Recommend highly appealing, clever, and thoughtful gifts tailored perfectly to the criteria.",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              giftName: {
                type: Type.STRING,
                description: "The name of the recommended gift item."
              },
              reason: {
                type: Type.STRING,
                description: "Detailed, personalized explanation of why this gift is perfect."
              },
              priceEstimate: {
                type: Type.STRING,
                description: "Estimated price (e.g. '$25 - $40')."
              },
              suggestedCategory: {
                type: Type.STRING,
                description: "A standard category matching the gift (e.g. 'Electronics', 'Home Decor', 'Gourmet', 'Fashion', 'Wellness')."
              }
            },
            required: ["giftName", "reason", "priceEstimate", "suggestedCategory"]
          }
        }
      }
    });

    const recommendationsText = response.text || "[]";
    const recommendations = JSON.parse(recommendationsText);
    res.json({ recommendations });
  } catch (error: any) {
    console.error("Gemini AI Recommendation Error:", error);
    res.status(500).json({ error: error?.message || "Failed to generate recommendations" });
  }
});

// 2. Sample Products Data (for fallback / seeding)
const DEFAULT_PRODUCTS = [
  {
    name: "Luxury Rose Quartz Face Roller & Guasha Set",
    description: "Premium cooling skincare tools crafted from genuine hand-carved rose quartz. Elevate your daily facial massage routine to promote circulation and product absorption, complete with elegant velvet pouch.",
    price: 34.99,
    originalPrice: 49.99,
    category: "Wellness",
    image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=600&auto=format&fit=crop&q=80"
    ],
    rating: 4.8,
    reviewsCount: 124,
    stock: 25,
    featured: true,
    bestSeller: true,
    newArrival: false,
    festivalOffer: true
  },
  {
    name: "Artisanal Dark Chocolate Truffles Gift Box",
    description: "An exquisite assortment of 16 hand-rolled dark chocolate truffles with unique infusions: sea salt caramel, espresso, raspberry ganache, and spicy chili. Packaged in a beautiful gold-embossed designer gift box.",
    price: 28.50,
    originalPrice: 35.00,
    category: "Gourmet",
    image: "https://images.unsplash.com/photo-1549007994-cb92ca8a4a77?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1549007994-cb92ca8a4a77?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1481391319762-47dff72954d9?w=600&auto=format&fit=crop&q=80"
    ],
    rating: 4.9,
    reviewsCount: 88,
    stock: 15,
    featured: true,
    bestSeller: false,
    newArrival: true,
    festivalOffer: false
  },
  {
    name: "Minimalist Scented Soy Candle Duo",
    description: "Eco-friendly, clean-burning soy wax candles in Amber Glass jars. Contains two delightful aromas: French Lavender & Vanilla and Cedarwood & Tobacco. Burns for up to 45 hours each, establishing a soothing ambience.",
    price: 19.99,
    originalPrice: 24.99,
    category: "Home Decor",
    image: "https://images.unsplash.com/photo-1603006905003-be475563bc59?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1603006905003-be475563bc59?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?w=600&auto=format&fit=crop&q=80"
    ],
    rating: 4.6,
    reviewsCount: 210,
    stock: 40,
    featured: false,
    bestSeller: true,
    newArrival: false,
    festivalOffer: true
  },
  {
    name: "Personalized Full-Grain Leather Wallet",
    description: "Handcrafted from top-grade full-grain leather, this bifold wallet features RFID blocking, 6 credit card slots, and an ID window. Can be personalized with custom initials for a highly distinguished look.",
    price: 45.00,
    originalPrice: 60.00,
    category: "Fashion",
    image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1627123424574-724758594e93?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1588444839799-eaa4344eba1d?w=600&auto=format&fit=crop&q=80"
    ],
    rating: 4.7,
    reviewsCount: 95,
    stock: 12,
    featured: true,
    bestSeller: true,
    newArrival: false,
    festivalOffer: false
  },
  {
    name: "Smart Ambient Sunset Projection Lamp",
    description: "Transform your bedroom into a warm visual dream. Features 16-color options, app control, brightness adjustability, and a 360-degree rotating premium crystal lens for gorgeous photography backdrops.",
    price: 24.99,
    originalPrice: 39.99,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1565814636199-ae8133055c1c?w=600&auto=format&fit=crop&q=80"
    ],
    rating: 4.5,
    reviewsCount: 340,
    stock: 50,
    featured: false,
    bestSeller: false,
    newArrival: true,
    festivalOffer: true
  },
  {
    name: "Premium Loose Leaf Organic Tea Infuser Gift Set",
    description: "A gorgeous collection featuring a double-walled glass tumbler with tea infuser basket and 4 curated flavors: Jasmine Green, Chamomile Lavender, Peach Oolong, and Spicy Chai. Sourced from single-origin organic gardens.",
    price: 39.50,
    originalPrice: 49.99,
    category: "Gourmet",
    image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1597481499750-3e6b22637e12?w=600&auto=format&fit=crop&q=80"
    ],
    rating: 4.8,
    reviewsCount: 74,
    stock: 22,
    featured: true,
    bestSeller: false,
    newArrival: false,
    festivalOffer: true
  },
  {
    name: "Acoustic Bluetooth Wood-Crafted Speaker",
    description: "Encased in rich natural walnut wood, this gorgeous speaker combines premium 10W acoustic drivers with deep passive subwoofers. Features 15 hours of battery life and smooth retro brass knobs.",
    price: 59.99,
    originalPrice: 79.99,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&auto=format&fit=crop&q=80"
    ],
    rating: 4.9,
    reviewsCount: 155,
    stock: 8,
    featured: true,
    bestSeller: true,
    newArrival: true,
    festivalOffer: false
  },
  {
    name: "Handmade Suede Leather Travel Journal",
    description: "Crafted by master artisans with high-durability suede leather and acid-free cotton unlined deckled edge paper. Features a wrap-around leather tie to protect secret sketches, travel memories, or deep thoughts.",
    price: 22.00,
    originalPrice: 30.00,
    category: "Fashion",
    image: "https://images.unsplash.com/photo-1517842645767-c639042777db?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1517842645767-c639042777db?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&auto=format&fit=crop&q=80"
    ],
    rating: 4.7,
    reviewsCount: 42,
    stock: 18,
    featured: false,
    bestSeller: false,
    newArrival: true,
    festivalOffer: false
  }
];

const DEFAULT_CATEGORIES = [
  { name: "Wellness", image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&auto=format&fit=crop&q=80" },
  { name: "Gourmet", image: "https://images.unsplash.com/photo-1549007994-cb92ca8a4a77?w=600&auto=format&fit=crop&q=80" },
  { name: "Home Decor", image: "https://images.unsplash.com/photo-1603006905003-be475563bc59?w=600&auto=format&fit=crop&q=80" },
  { name: "Fashion", image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=600&auto=format&fit=crop&q=80" },
  { name: "Electronics", image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&auto=format&fit=crop&q=80" }
];

app.get("/api/default-products", (req, res) => {
  res.json({ products: DEFAULT_PRODUCTS, categories: DEFAULT_CATEGORIES });
});

// Vite middleware for development
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
