export const initialProducts = [
  {
    id: "prod-001",
    name: "Tailored Oxford Cotton Shirt",
    slug: "tailored-oxford-cotton-shirt",
    categoryId: "cat-men-001",
    category: { id: "cat-men-001", name: "Men", slug: "men" },
    description: "Crafted from 100% two-ply Egyptian cotton with a crisp button-down collar and mother-of-pearl buttons. Features a gently tailored silhouette that effortlessly transitions from boardroom tailoring to relaxed weekend wear.",
    fabric: "100% Long-Staple Egyptian Cotton",
    fit: "Tailored Slim Fit",
    careInstructions: "Machine wash cold with like colors. Warm iron while slightly damp. Do not bleach.",
    status: "published",
    seoTitle: "Tailored Oxford Cotton Shirt | Premium Men's Shirts",
    seoDescription: "Shop our premium tailored Oxford cotton shirt for men. Crafted from 100% Egyptian cotton in classic crisp white and midnight navy.",
    primaryImage: {
      url: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?q=80&w=1000&auto=format&fit=crop",
      alt: "Tailored Oxford Cotton Shirt in Classic White"
    },
    images: [
      { id: "img-001-wht-1", url: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?q=80&w=1000&auto=format&fit=crop", alt: "Classic White - Front View", color: "Classic White", isPrimary: true },
      { id: "img-001-wht-2", url: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=1000&auto=format&fit=crop", alt: "Classic White - Collar Detail", color: "Classic White", isPrimary: false },
      { id: "img-001-wht-3", url: "https://images.unsplash.com/photo-1603252109303-2751441dd157?q=80&w=1000&auto=format&fit=crop", alt: "Classic White - Profile View", color: "Classic White", isPrimary: false },
      { id: "img-001-nvy-1", url: "https://images.unsplash.com/photo-1602810316693-3667c854239a?q=80&w=1000&auto=format&fit=crop", alt: "Midnight Navy - Front View", color: "Midnight Navy", isPrimary: false },
      { id: "img-001-nvy-2", url: "https://images.unsplash.com/photo-1598032895397-b9472444bf93?q=80&w=1000&auto=format&fit=crop", alt: "Midnight Navy - Fabric Texture", color: "Midnight Navy", isPrimary: false }
    ],
    priceFrom: "2450.00",
    priceTo: "2450.00",
    compareAtPriceFrom: null,
    inStock: true,
    onSale: false,
    variants: [
      { id: "var-001-wht-s", sku: "MSH-001-WHT-S", size: "S", color: "Classic White", price: "2450.00", compareAtPrice: null, stockQuantity: 12, isActive: true, image: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?q=80&w=1000&auto=format&fit=crop" },
      { id: "var-001-wht-m", sku: "MSH-001-WHT-M", size: "M", color: "Classic White", price: "2450.00", compareAtPrice: null, stockQuantity: 24, isActive: true, image: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?q=80&w=1000&auto=format&fit=crop" },
      { id: "var-001-wht-l", sku: "MSH-001-WHT-L", size: "L", color: "Classic White", price: "2450.00", compareAtPrice: null, stockQuantity: 8, isActive: true, image: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?q=80&w=1000&auto=format&fit=crop" },
      { id: "var-001-wht-xl", sku: "MSH-001-WHT-XL", size: "XL", color: "Classic White", price: "2450.00", compareAtPrice: null, stockQuantity: 0, isActive: true, image: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?q=80&w=1000&auto=format&fit=crop" },
      { id: "var-001-nvy-m", sku: "MSH-001-NVY-M", size: "M", color: "Midnight Navy", price: "2450.00", compareAtPrice: null, stockQuantity: 16, isActive: true, image: "https://images.unsplash.com/photo-1602810316693-3667c854239a?q=80&w=1000&auto=format&fit=crop" },
      { id: "var-001-nvy-l", sku: "MSH-001-NVY-L", size: "L", color: "Midnight Navy", price: "2450.00", compareAtPrice: null, stockQuantity: 14, isActive: true, image: "https://images.unsplash.com/photo-1602810316693-3667c854239a?q=80&w=1000&auto=format&fit=crop" }
    ]
  },
  {
    id: "prod-002",
    name: "Raw Silk Heritage Panjabi",
    slug: "raw-silk-heritage-panjabi",
    categoryId: "cat-men-001",
    category: { id: "cat-men-001", name: "Men", slug: "men" },
    description: "An authentic Bangladeshi artisanal Panjabi woven with premium handloom raw silk. Minimalist mandarin collar adorned with delicate tonal embroidery, providing unmatched poise for festive celebrations.",
    fabric: "Pure Handloom Raw Silk & Fine Cotton Blend",
    fit: "Regular Heritage Fit",
    careInstructions: "Dry clean only to preserve raw silk luster.",
    status: "published",
    seoTitle: "Raw Silk Heritage Panjabi | Luxury Festive Men's Wear",
    seoDescription: "Exquisite raw silk Panjabi for men. Handloom fabric with tonal embroidery on collar and placket. Available in Sandstone Ivory and Royal Indigo.",
    primaryImage: {
      url: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1000&auto=format&fit=crop",
      alt: "Heritage Panjabi in Sandstone Ivory"
    },
    images: [
      { id: "img-002-ivr-1", url: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1000&auto=format&fit=crop", alt: "Sandstone Ivory - Panjabi Front", color: "Sandstone Ivory", isPrimary: true },
      { id: "img-002-ivr-2", url: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=1000&auto=format&fit=crop", alt: "Sandstone Ivory - Embroidery Detail", color: "Sandstone Ivory", isPrimary: false },
      { id: "img-002-ind-1", url: "https://images.unsplash.com/photo-1598532163257-ae3c6b2524b6?q=80&w=1000&auto=format&fit=crop", alt: "Royal Indigo - Festive Silhouette", color: "Royal Indigo", isPrimary: false }
    ],
    priceFrom: "4850.00",
    priceTo: "5200.00",
    compareAtPriceFrom: "5800.00",
    inStock: true,
    onSale: true,
    variants: [
      { id: "var-002-ivr-m", sku: "MPJ-002-IVR-M", size: "M", color: "Sandstone Ivory", price: "4850.00", compareAtPrice: "5800.00", stockQuantity: 9, isActive: true, image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1000&auto=format&fit=crop" },
      { id: "var-002-ivr-l", sku: "MPJ-002-IVR-L", size: "L", color: "Sandstone Ivory", price: "4850.00", compareAtPrice: "5800.00", stockQuantity: 15, isActive: true, image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1000&auto=format&fit=crop" },
      { id: "var-002-ivr-xl", sku: "MPJ-002-IVR-XL", size: "XL", color: "Sandstone Ivory", price: "4850.00", compareAtPrice: "5800.00", stockQuantity: 5, isActive: true, image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1000&auto=format&fit=crop" },
      { id: "var-002-ind-l", sku: "MPJ-002-IND-L", size: "L", color: "Royal Indigo", price: "5200.00", compareAtPrice: "6200.00", stockQuantity: 7, isActive: true, image: "https://images.unsplash.com/photo-1598532163257-ae3c6b2524b6?q=80&w=1000&auto=format&fit=crop" }
    ]
  },
  {
    id: "prod-003",
    name: "Minimalist Linen Wrap Dress",
    slug: "minimalist-linen-wrap-dress",
    categoryId: "cat-women-002",
    category: { id: "cat-women-002", name: "Women", slug: "women" },
    description: "Flowing midi-length wrap dress spun from European flax linen. Tailored with a deep V-neckline, self-tie sash at the waist, and subtle side-seam pockets. Effortless day-to-evening aesthetic.",
    fabric: "100% European Flax Washed Linen",
    fit: "Adjustable Wrap Silhouette",
    careInstructions: "Gentle machine wash cold. Hang dry in shade. Warm steam iron.",
    status: "published",
    seoTitle: "Minimalist Linen Wrap Dress | Contemporary Women's Fashion",
    seoDescription: "Shop our European flax linen wrap dress. Breathable, elegant, and versatile midi length with self-tie sash in Terracotta and Olive.",
    primaryImage: {
      url: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=1000&auto=format&fit=crop",
      alt: "Linen Wrap Dress in Terracotta"
    },
    images: [
      { id: "img-003-ter-1", url: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=1000&auto=format&fit=crop", alt: "Terracotta - Wrap Dress Full View", color: "Terracotta", isPrimary: true },
      { id: "img-003-olv-1", url: "https://images.unsplash.com/photo-1574015974293-817f0ebebb74?q=80&w=1000&auto=format&fit=crop", alt: "Sage Olive - Flowing Silhouette", color: "Sage Olive", isPrimary: false },
      { id: "img-003-olv-2", url: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?q=80&w=1000&auto=format&fit=crop", alt: "Sage Olive - Fabric Texture & Ties", color: "Sage Olive", isPrimary: false }
    ],
    priceFrom: "3850.00",
    priceTo: "3850.00",
    compareAtPriceFrom: null,
    inStock: true,
    onSale: false,
    variants: [
      { id: "var-003-ter-xs", sku: "WDR-003-TER-XS", size: "XS", color: "Terracotta", price: "3850.00", compareAtPrice: null, stockQuantity: 6, isActive: true, image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=1000&auto=format&fit=crop" },
      { id: "var-003-ter-s", sku: "WDR-003-TER-S", size: "S", color: "Terracotta", price: "3850.00", compareAtPrice: null, stockQuantity: 18, isActive: true, image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=1000&auto=format&fit=crop" },
      { id: "var-003-ter-m", sku: "WDR-003-TER-M", size: "M", color: "Terracotta", price: "3850.00", compareAtPrice: null, stockQuantity: 14, isActive: true, image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=1000&auto=format&fit=crop" },
      { id: "var-003-olv-s", sku: "WDR-003-OLV-S", size: "S", color: "Sage Olive", price: "3850.00", compareAtPrice: null, stockQuantity: 10, isActive: true, image: "https://images.unsplash.com/photo-1574015974293-817f0ebebb74?q=80&w=1000&auto=format&fit=crop" },
      { id: "var-003-olv-m", sku: "WDR-003-OLV-M", size: "M", color: "Sage Olive", price: "3850.00", compareAtPrice: null, stockQuantity: 0, isActive: true, image: "https://images.unsplash.com/photo-1574015974293-817f0ebebb74?q=80&w=1000&auto=format&fit=crop" }
    ]
  },
  {
    id: "prod-004",
    name: "Pleated Tencel Kurti Set",
    slug: "pleated-tencel-kurti-set",
    categoryId: "cat-women-002",
    category: { id: "cat-women-002", name: "Women", slug: "women" },
    description: "Two-piece Kurti and cigarette trouser set made from eco-certified Tencel Lyocell. Features delicate knife pleats along the front yoke and refined horn buttons.",
    fabric: "100% Sustainable Tencel Lyocell",
    fit: "Relaxed Straight Cut",
    careInstructions: "Hand wash cold or dry clean. Low iron.",
    status: "published",
    seoTitle: "Pleated Tencel Kurti Set | Women's Contemporary Ethnic Wear",
    seoDescription: "Two-piece Kurti and cigarette pants set in eco-conscious Tencel. Subtle front pleats with horn buttons. In Botanical Teal and Warm Cream.",
    primaryImage: {
      url: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=1000&auto=format&fit=crop",
      alt: "Pleated Tencel Kurti Set in Botanical Teal"
    },
    images: [
      { id: "img-004-tel-1", url: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=1000&auto=format&fit=crop", alt: "Botanical Teal - Full Kurti Set", color: "Botanical Teal", isPrimary: true },
      { id: "img-004-tel-2", url: "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1000&auto=format&fit=crop", alt: "Botanical Teal - Editorial Model Angle", color: "Botanical Teal", isPrimary: false }
    ],
    priceFrom: "4200.00",
    priceTo: "4200.00",
    compareAtPriceFrom: "4950.00",
    inStock: true,
    onSale: true,
    variants: [
      { id: "var-004-tel-s", sku: "WKT-004-TEL-S", size: "S", color: "Botanical Teal", price: "4200.00", compareAtPrice: "4950.00", stockQuantity: 11, isActive: true, image: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=1000&auto=format&fit=crop" },
      { id: "var-004-tel-m", sku: "WKT-004-TEL-M", size: "M", color: "Botanical Teal", price: "4200.00", compareAtPrice: "4950.00", stockQuantity: 20, isActive: true, image: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=1000&auto=format&fit=crop" },
      { id: "var-004-tel-l", sku: "WKT-004-TEL-L", size: "L", color: "Botanical Teal", price: "4200.00", compareAtPrice: "4950.00", stockQuantity: 8, isActive: true, image: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=1000&auto=format&fit=crop" }
    ]
  },
  {
    id: "prod-005",
    name: "Architectural Leather Tote",
    slug: "architectural-leather-tote",
    categoryId: "cat-lifestyle-003",
    category: { id: "cat-lifestyle-003", name: "Lifestyle", slug: "lifestyle" },
    description: "Handcrafted from full-grain vegetable-tanned leather. Features rectilinear geometric lines, unlined raw suede interior, magnetic snap enclosure, and reinforced shoulder straps capable of holding a 15-inch laptop.",
    fabric: "100% Full-Grain Vegetable Tanned Leather",
    fit: "Structured One Size (38cm x 30cm x 12cm)",
    careInstructions: "Condition with specialized leather balm every 6 months. Keep away from prolonged water contact.",
    status: "published",
    seoTitle: "Architectural Leather Tote | Handcrafted Lifestyle Goods",
    seoDescription: "Full-grain vegetable-tanned leather tote bag. Minimalist structure, unlined interior, fits laptops up to 15 inches. Available in Espresso Brown and Onyx Black.",
    primaryImage: {
      url: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=1000&auto=format&fit=crop",
      alt: "Architectural Leather Tote in Espresso Brown"
    },
    images: [
      {
        id: "img-005-esp-1",
        url: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=1000&auto=format&fit=crop",
        alt: "Espresso Brown - Architectural Leather Tote Front View",
        color: "Espresso Brown",
        isPrimary: true
      },
      {
        id: "img-005-esp-2",
        url: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=1000&auto=format&fit=crop",
        alt: "Espresso Brown - Straps, Hardware & Side Profile",
        color: "Espresso Brown",
        isPrimary: false
      },
      {
        id: "img-005-blk-1",
        url: "https://images.unsplash.com/photo-1591561954557-26941169b49e?q=80&w=1000&auto=format&fit=crop",
        alt: "Onyx Black - Architectural Leather Tote Front View",
        color: "Onyx Black",
        isPrimary: false
      },
      {
        id: "img-005-blk-2",
        url: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=1000&auto=format&fit=crop",
        alt: "Onyx Black - Full-Grain Leather Texture & Side Profile",
        color: "Onyx Black",
        isPrimary: false
      }
    ],
    priceFrom: "6950.00",
    priceTo: "6950.00",
    compareAtPriceFrom: null,
    inStock: true,
    onSale: false,
    variants: [
      {
        id: "var-005-esp-os",
        sku: "BAG-005-ESP-OS",
        size: "One Size",
        color: "Espresso Brown",
        price: "6950.00",
        compareAtPrice: null,
        stockQuantity: 7,
        isActive: true,
        image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=1000&auto=format&fit=crop"
      },
      {
        id: "var-005-blk-os",
        sku: "BAG-005-BLK-OS",
        size: "One Size",
        color: "Onyx Black",
        price: "6950.00",
        compareAtPrice: null,
        stockQuantity: 12,
        isActive: true,
        image: "https://images.unsplash.com/photo-1591561954557-26941169b49e?q=80&w=1000&auto=format&fit=crop"
      }
    ]
  },
  {
    id: "prod-006",
    name: "Mercerized Pique Polo",
    slug: "mercerized-pique-polo",
    categoryId: "cat-men-001",
    category: { id: "cat-men-001", name: "Men", slug: "men" },
    description: "Double-mercerized Egyptian cotton gives this polo shirt an exceptionally smooth handfeel and subtle silk-like sheen. Finished with a clean flat-knit collar and seamless three-button placket.",
    fabric: "100% Mercerized Cotton Pique",
    fit: "Athletic Tailored",
    careInstructions: "Machine wash cold inside out. Flat dry. Low iron.",
    status: "published",
    seoTitle: "Mercerized Pique Polo | Luxury Men's Polo Shirts",
    seoDescription: "Premium double-mercerized cotton polo shirt. Subtle luster, breathable knit, refined flat collar. Available in Deep Forest and Midnight Black.",
    primaryImage: {
      url: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?q=80&w=1000&auto=format&fit=crop",
      alt: "Polo Shirt in Deep Forest"
    },
    images: [
      { id: "img-006-fst-1", url: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?q=80&w=1000&auto=format&fit=crop", alt: "Deep Forest - Front View", color: "Deep Forest", isPrimary: true },
      { id: "img-006-blk-1", url: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=1000&auto=format&fit=crop", alt: "Midnight Black - Front View", color: "Midnight Black", isPrimary: false }
    ],
    priceFrom: "1850.00",
    priceTo: "1850.00",
    compareAtPriceFrom: "2200.00",
    inStock: true,
    onSale: true,
    variants: [
      { id: "var-006-fst-m", sku: "MPL-006-FST-M", size: "M", color: "Deep Forest", price: "1850.00", compareAtPrice: "2200.00", stockQuantity: 14, isActive: true, image: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?q=80&w=1000&auto=format&fit=crop" },
      { id: "var-006-fst-l", sku: "MPL-006-FST-L", size: "L", color: "Deep Forest", price: "1850.00", compareAtPrice: "2200.00", stockQuantity: 19, isActive: true, image: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?q=80&w=1000&auto=format&fit=crop" },
      { id: "var-006-blk-m", sku: "MPL-006-BLK-M", size: "M", color: "Midnight Black", price: "1850.00", compareAtPrice: "2200.00", stockQuantity: 8, isActive: true, image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=1000&auto=format&fit=crop" }
    ]
  },
  {
    id: "prod-007",
    name: "Pleated Wide-Leg Chino",
    slug: "pleated-wide-leg-chino",
    categoryId: "cat-men-001",
    category: { id: "cat-men-001", name: "Men", slug: "men" },
    description: "High-density Japanese cotton twill with single forward pleats and clean uncuffed hems. Features a high-rise waist with adjustable side tabs, channeling vintage Parisian tailoring.",
    fabric: "100% Cotton High-Density Twill",
    fit: "High-Rise Relaxed Wide Leg",
    careInstructions: "Machine wash cold. Line dry. Medium iron.",
    status: "published",
    seoTitle: "Pleated Wide-Leg Chino | Modern Tailored Trousers",
    seoDescription: "Relaxed wide-leg cotton chinos with single pleats and adjustable side waist tabs. Available in Sand Khaki.",
    primaryImage: {
      url: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=1000&auto=format&fit=crop",
      alt: "Wide-Leg Chino in Sand Khaki"
    },
    images: [
      { id: "img-007-1", url: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=1000&auto=format&fit=crop", alt: "Sand Khaki - Chino Full View", color: "Sand Khaki", isPrimary: true }
    ],
    priceFrom: "3200.00",
    priceTo: "3200.00",
    compareAtPriceFrom: null,
    inStock: true,
    onSale: false,
    variants: [
      { id: "var-007-khk-30", sku: "MCH-007-KHK-30", size: "30", color: "Sand Khaki", price: "3200.00", compareAtPrice: null, stockQuantity: 10, isActive: true, image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=1000&auto=format&fit=crop" },
      { id: "var-007-khk-32", sku: "MCH-007-KHK-32", size: "32", color: "Sand Khaki", price: "3200.00", compareAtPrice: null, stockQuantity: 15, isActive: true, image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=1000&auto=format&fit=crop" },
      { id: "var-007-khk-34", sku: "MCH-007-KHK-34", size: "34", color: "Sand Khaki", price: "3200.00", compareAtPrice: null, stockQuantity: 8, isActive: true, image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=1000&auto=format&fit=crop" }
    ]
  },
  {
    id: "prod-008",
    name: "Silk-Blend Ribbed Knit Top",
    slug: "silk-blend-ribbed-knit-top",
    categoryId: "cat-women-002",
    category: { id: "cat-women-002", name: "Women", slug: "women" },
    description: "Delicate micro-ribbed knit top woven with mulberry silk and organic cotton. Designed with a clean boatneck collar and elbow-length sleeves for a minimalist French silhouette.",
    fabric: "70% Organic Cotton, 30% Mulberry Silk",
    fit: "Fitted Stretch Silhouette",
    careInstructions: "Hand wash cold. Lay flat to dry.",
    status: "published",
    seoTitle: "Silk-Blend Ribbed Knit Top | Women's Essentials",
    seoDescription: "Ribbed knit top spun from silk and organic cotton. Boatneck neckline with elbow sleeves. Available in Warm Alabaster.",
    primaryImage: {
      url: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=1000&auto=format&fit=crop",
      alt: "Ribbed Knit Top in Warm Alabaster"
    },
    images: [
      { id: "img-008-1", url: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=1000&auto=format&fit=crop", alt: "Warm Alabaster - Top Front", color: "Warm Alabaster", isPrimary: true }
    ],
    priceFrom: "2150.00",
    priceTo: "2150.00",
    compareAtPriceFrom: null,
    inStock: true,
    onSale: false,
    variants: [
      { id: "var-008-alb-s", sku: "WKN-008-ALB-S", size: "S", color: "Warm Alabaster", price: "2150.00", compareAtPrice: null, stockQuantity: 14, isActive: true, image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=1000&auto=format&fit=crop" },
      { id: "var-008-alb-m", sku: "WKN-008-ALB-M", size: "M", color: "Warm Alabaster", price: "2150.00", compareAtPrice: null, stockQuantity: 18, isActive: true, image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=1000&auto=format&fit=crop" }
    ]
  }
];
