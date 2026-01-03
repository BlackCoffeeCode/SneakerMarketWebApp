import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Sneaker from './models/Sneaker.js';
import connectDB from './config/db.js';

dotenv.config();

const seedData = [
    // --- NIKE (4) ---
    {
        name: "Nike Air Zoom GT Cut 2",
        brand: "Nike",
        price: 14995,
        sizes: [7, 8, 9, 10, 11, 12],
        images: ["/images/products/nike_gt_cut_2.png"],
        description: "Designed for the space makers on the floor, the Nike Air Zoom G.T. Cut 2 helps you stop on a dime and accelerate back into the open lane.",
        stock: 50,
        category: ["nike", "basketball", "new", "performance", "men"],
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        name: "Nike Pegasus 40",
        brand: "Nike",
        price: 11895,
        sizes: [6, 7, 8, 9, 10],
        images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1000"],
        description: "A springy ride for every run, the Peg's familiar, just-for-you feel returns to help you accomplish your goals.",
        stock: 120,
        category: ["nike", "running", "casual", "sale", "men"],
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        name: "Nike Dunk Low Retro",
        brand: "Nike",
        price: 8695,
        sizes: [8, 9, 10, 11],
        images: ["https://images.unsplash.com/photo-1543508282-6319a3e2621f?q=80&w=1000"],
        description: "Created for the hardwood but taken to the streets, the '80s b-ball icon returns with perfectly sheened overlays and original university colors.",
        stock: 25,
        category: ["nike", "streetwear", "limited", "trending", "men"],
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        name: "Nike Air Max 270",
        brand: "Nike",
        price: 13995,
        sizes: [7, 8, 9, 10, 11],
        images: ["https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?q=80&w=1000"],
        description: "Nike's first lifestyle Air Max brings you style, comfort and big attitude in the Nike Air Max 270.",
        stock: 80,
        category: ["nike", "casual", "streetwear", "men"],
        createdAt: new Date(),
        updatedAt: new Date()
    },

    // --- ADIDAS (4) ---
    {
        name: "Adidas Ultraboost Light",
        brand: "Adidas",
        price: 17999,
        sizes: [7, 8, 9, 10, 11, 12],
        images: ["https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?q=80&w=1000"],
        description: "Experience epic energy with the new Ultraboost Light, our lightest Ultraboost ever.",
        stock: 60,
        category: ["adidas", "running", "performance", "new", "men"],
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        name: "Adidas Forum Low CL",
        brand: "Adidas",
        price: 9999,
        sizes: [6, 7, 8, 9, 10],
        images: ["https://images.unsplash.com/photo-1582588678413-dbf45f4823e9?q=80&w=1000"],
        description: "More than just a shoe, it's a statement. The adidas Forum hit the scene in '84 and gained major love on both the hardwood and in the music biz.",
        stock: 45,
        category: ["adidas", "streetwear", "casual", "trending", "men"],
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        name: "Adidas NMD_R1",
        brand: "Adidas",
        price: 14999,
        sizes: [7, 8, 9, 10],
        images: ["/images/products/adidas_nmd_r1.png"],
        description: "Pack your bag, lace up and get going. City adventures beckon in these NMD_R1 shoes. An update to an acclaimed '80s runner.",
        stock: 75,
        category: ["adidas", "casual", "running", "sale", "men"],
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        name: "Adidas Trae Young 3",
        brand: "Adidas",
        price: 13999,
        sizes: [8, 9, 10, 11, 12],
        images: ["/images/products/adidas_trae_young_3.png"],
        description: "Trae Young's game is smooth. It's fluid. It's effortless. These signature shoes from adidas Basketball embody that style.",
        stock: 30,
        category: ["adidas", "basketball", "launch", "men"],
        createdAt: new Date(),
        updatedAt: new Date()
    },

    // --- JORDAN (4) ---
    {
        name: "Air Jordan 1 Mid",
        brand: "Jordan",
        price: 11495,
        sizes: [7, 8, 9, 10, 11],
        images: ["/images/products/air_jordan_1_mid.png"],
        description: "Inspired by the original AJ1, the Air Jordan 1 Mid offers fans a chance to follow in MJ's footsteps.",
        stock: 40,
        category: ["jordan", "streetwear", "limited", "trending", "men"],
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        name: "Air Jordan XXXVIII Low",
        brand: "Jordan",
        price: 18395,
        sizes: [8, 9, 10, 11, 12, 13],
        images: ["/images/products/air_jordan_xxxviii_low.png"],
        description: "Get grounded, stay grounded. The AJ XXXVIII is all about groundwork—we're talking about your running, your cutting, your turn-around jumpers.",
        stock: 20,
        category: ["jordan", "basketball", "performance", "new", "men"],
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        name: "Jordan Stay Loyal 3",
        brand: "Jordan",
        price: 10295,
        sizes: [7, 8, 9, 10],
        images: ["https://images.unsplash.com/photo-1595341888016-a392ef81b7de?q=80&w=1000"],
        description: "You know where you're going—but it's your roots that keep you grounded. With design elements from the AJ4, these kicks are all about legacy.",
        stock: 65,
        category: ["jordan", "casual", "streetwear", "sale", "men"],
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        name: "Jordan Luka 2",
        brand: "Jordan",
        price: 11895,
        sizes: [8, 9, 10, 11, 12],
        images: ["https://images.unsplash.com/photo-1579338908476-3a3a1d71a706?q=80&w=1000"],
        description: "You bring the speed. We'll bring the stability. The Luka 2 is built to support your skills, with an emphasis on step-backs.",
        stock: 35,
        category: ["jordan", "basketball", "launch", "men"],
        createdAt: new Date(),
        updatedAt: new Date()
    },

    // --- NEW BALANCE (4) ---
    {
        name: "New Balance 550",
        brand: "New Balance",
        price: 11999,
        sizes: [7, 8, 9, 10, 11],
        images: ["https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?q=80&w=1000"],
        description: "The original 550 debuted in 1989 and made its mark on basketball courts from coast to coast. After its initial run, the 550 was filed away in the archives.",
        stock: 25,
        category: ["newbalance", "streetwear", "limited", "trending", "men"],
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        name: "New Balance Fresh Foam X 1080v13",
        brand: "New Balance",
        price: 16999,
        sizes: [7, 8, 9, 10, 11],
        images: ["https://images.unsplash.com/photo-1539185441755-769473a23570?q=80&w=1000"],
        description: "The Fresh Foam X 1080v13 is the consistent expression of New Balance's signature running qualities.",
        stock: 90,
        category: ["newbalance", "running", "performance", "men"],
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        name: "New Balance 9060",
        brand: "New Balance",
        price: 14999,
        sizes: [6, 7, 8, 9, 10],
        images: ["https://images.unsplash.com/photo-1617606002779-51d866bdd1d1?q=80&w=1000"],
        description: "The 9060 is a new expression of the refined style and innovation-led design that have made the 99X series home to some of the most iconic models.",
        stock: 40,
        category: ["newbalance", "streetwear", "casual", "new", "men"],
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        name: "New Balance 574 Core",
        brand: "New Balance",
        price: 8999,
        sizes: [7, 8, 9, 10, 11, 12],
        images: ["https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=1000"],
        description: "The most New Balance shoe ever says it all, right? No, actually. The 574 might be our unlikeliest icon.",
        stock: 150,
        category: ["newbalance", "casual", "sale", "men", "women"],
        createdAt: new Date(),
        updatedAt: new Date()
    },
    // --- WALKING (4) ---
    {
        name: "CloudWalk Pro Comfort",
        brand: "StepSoft",
        price: 8999,
        sizes: [7, 8, 9, 10, 11],
        images: ["/images/products/walking/1.png"],
        description: "The ultimate in comfort engineering. Features our thickest foam sole yet, wrapped in a breathable beige knit. Perfect for long walks.",
        stock: 25,
        category: ["men", "walking", "comfort"],
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        name: "Urban Ease Slip-On",
        brand: "Skechers",
        price: 6499,
        sizes: [5, 6, 7, 8, 9],
        images: ["/images/products/walking/2.png"],
        description: "Effortless style meets modern ergonomics. This grey slip-on features a sock-like fit and a clean, minimal design for city living.",
        stock: 30,
        category: ["women", "walking", "casual"],
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        name: "TerraTrek Support",
        brand: "New Balance",
        price: 11200,
        sizes: [8, 9, 10, 11, 12],
        images: ["/images/products/walking/3.png"],
        description: "Built for stability on any terrain. Navy blue durable mesh with reinforced leather accents ensures your feet stay supported mile after mile.",
        stock: 15,
        category: ["men", "walking", "outdoor"],
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        name: "Morning Mist Lites",
        brand: "Nike",
        price: 7800,
        sizes: [6, 7, 8],
        images: ["/images/products/walking/4.png"],
        description: "Start your day right with these ultra-lightweight walking shoes. Pastel green accents on white mesh create a fresh, energetic look.",
        stock: 40,
        category: ["women", "walking", "sport"],
        createdAt: new Date(),
        updatedAt: new Date()
    },

    // --- COLLEGE (4) ---
    {
        name: "Varsity High '84",
        brand: "Nike",
        price: 14500,
        sizes: [8, 9, 10, 11],
        images: ["/images/products/college/1.png"],
        description: "Straight from the archives. These retro high-tops channel 80s basketball heritage with authentic leather and vintage details.",
        stock: 10,
        category: ["men", "college", "vintage"],
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        name: "Campus Dad Chunky",
        brand: "New Balance",
        price: 9999,
        sizes: [7, 8, 9, 10],
        images: ["/images/products/college/2.png"],
        description: "The definitive 90s aesthetic. Chunky, comfortable, and undeniably trendy. The perfect statement piece for your campus rotation.",
        stock: 20,
        category: ["unisex", "college", "streetwear"],
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        name: "Skate Low Classic",
        brand: "Vans",
        price: 5500,
        sizes: [7, 8, 9, 10, 11],
        images: ["/images/products/college/3.png"],
        description: "Timeless skate style. Durable black suede, sticky gum sole, and iconic white stripe. Built to shred or just hang out.",
        stock: 50,
        category: ["men", "college", "skate"],
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        name: "ArtHop Abstract",
        brand: "Adidas",
        price: 13200,
        sizes: [6, 7, 8, 9, 10],
        images: ["/images/products/college/4.png"],
        description: "Stand out in the lecture hall. Bold yellow and blue color blocking on a modern silhouette for the creative soul.",
        stock: 12,
        category: ["unisex", "college", "trendy"],
        createdAt: new Date(),
        updatedAt: new Date()
    },

    // --- GYM (4) ---
    {
        name: "TitanStable X",
        brand: "Reebok",
        price: 10500,
        sizes: [9, 10, 11, 12],
        images: ["/images/products/gym/1.png"],
        description: "Ground yourself. A flat, wide gum sole provides the ultimate base for heavy squats and deadlifts. Stability is key.",
        stock: 18,
        category: ["men", "gym", "training"],
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        name: "NeonVelocity Knit",
        brand: "Under Armour",
        price: 9200,
        sizes: [8, 9, 10, 11],
        images: ["/images/products/gym/2.png"],
        description: "Be seen. Electric neon green breathable knit keeps you cool during high-intensity interval training. Responsive cushioning.",
        stock: 22,
        category: ["men", "gym", "cardio"],
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        name: "IronStrong Lifter",
        brand: "Adidas",
        price: 15999,
        sizes: [9, 10, 11],
        images: ["/images/products/gym/3.png"],
        description: "Professional grade. Features a raised heel and midfoot strap for maximum lock-down during Olympic lifts.",
        stock: 8,
        category: ["men", "gym", "powerlifting"],
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        name: "Agility Redline",
        brand: "Nike",
        price: 11800,
        sizes: [6, 7, 8, 9],
        images: ["/images/products/gym/4.png"],
        description: "Cut faster. Flexible sole grooves and aggressive traction allow for explosive multi-directional movement.",
        stock: 20,
        category: ["gym", "agility", "training"],
        createdAt: new Date(),
        updatedAt: new Date()
    },

    // --- WOMEN'S EXCLUSIVE COLLECTION (6) ---
    {
        name: "Blossom Knit Runner",
        brand: "Adidas",
        price: 8499,
        sizes: [5, 6, 7, 8],
        images: ["/images/products/women/1.png"],
        description: "Soft pastel pink meets performance engineering. This breathable knit runner is designed specifically for the female foot shape.",
        stock: 35,
        category: ["women", "running", "casual"],
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        name: "City Chic Platform",
        brand: "Puma",
        price: 7200,
        sizes: [5, 6, 7, 8, 9],
        images: ["/images/products/women/2.png"],
        description: "Elevate your street style. Chunky beige platform sole with subtle gold accents makes this the perfect everyday fashion statement.",
        stock: 28,
        category: ["women", "casual", "streetwear"],
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        name: "Lavender Flow Trainer",
        brand: "Reebok",
        price: 6800,
        sizes: [5, 6, 7, 8],
        images: ["/images/products/women/3.png"],
        description: "Find your flow. Lightweight, flexible, and supportive. Ideal for yoga, pilates, or light gym sessions.",
        stock: 40,
        category: ["women", "gym", "training"],
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        name: "Rose Gold Court Low",
        brand: "Adidas",
        price: 5999,
        sizes: [5, 6, 7, 8],
        images: ["/images/products/women/4.png"],
        description: "Timeless elegance. Minimalist white leather upper with premium rose gold eyelets and branding.",
        stock: 50,
        category: ["women", "casual", "classic"],
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        name: "Coral Sprint Elite",
        brand: "New Balance",
        price: 10500,
        sizes: [6, 7, 8, 9],
        images: ["/images/products/women/5.png"],
        description: "Energy in every step. Vibrant teal and coral colorway on a high-responsive foam midsole for your fastest runs yet.",
        stock: 22,
        category: ["women", "running", "sport"],
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        name: "Silver Lining Future",
        brand: "Nike",
        price: 13200,
        sizes: [6, 7, 8, 9],
        images: ["/images/products/walking/4.png"], // Reusing widely liked pastel/light model
        description: "Step into the future. Metallic silver accents on a cloud-like sole. Fashion meets function in this bold new silhouette.",
        stock: 15,
        category: ["women", "streetwear", "fashion"],
        createdAt: new Date(),
        updatedAt: new Date()
    }
];

// Helper to generate random SKUs
const generateSKU = (brand, name) => {
    const brandCode = brand.substring(0, 3).toUpperCase();
    const nameCode = name.replace(/[^a-zA-Z]/g, '').substring(0, 3).toUpperCase();
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    return `${brandCode}-${nameCode}-${randomNum}`;
};

// Helper for Sustainability Stats
const generateSustainability = () => ({
    carbonFootprint: Math.floor(Math.random() * (15 - 5) + 5), // 5-15 kg CO2e
    recycledMaterial: Math.floor(Math.random() * (100 - 20) + 20), // 20-100%
    repairable: Math.random() > 0.5,
    wears: Math.floor(Math.random() * (800 - 300) + 300) // 300-800 wears
});

const enrichedSeedData = seedData.map(item => ({
    ...item,
    sku: generateSKU(item.brand, item.name),
    sustainability: generateSustainability()
}));

const importData = async () => {
    try {
        await connectDB();

        console.log('Inserting 16 new sneakers...');

        await Sneaker.deleteMany({}); // Clear existing data
        console.log('Cleared existing sneakers.');

        // Using collection.insertMany to bypass Strict Mode for 'category' field
        await Sneaker.collection.insertMany(enrichedSeedData);

        console.log('✅ Data Imported Successfully!');
        process.exit();
    } catch (error) {
        console.error(`❌ Error with data import: ${error.message}`);
        process.exit(1);
    }
};

importData();
