export const initialCategories = [
  {
    id: "cat-men-001",
    parentId: null,
    name: "Men",
    slug: "men",
    description: "Tailored shirts, casual polos, luxury Panjabis, and denim crafted for modern gentlemen.",
    imageUrl: "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?q=80&w=1000&auto=format&fit=crop",
    sortOrder: 1,
    isActive: true,
    children: [
      { id: "cat-men-shirts", parentId: "cat-men-001", name: "Shirts", slug: "men-shirts" },
      { id: "cat-men-polos", parentId: "cat-men-001", name: "Polo Shirts", slug: "men-polos" },
      { id: "cat-men-panjabi", parentId: "cat-men-001", name: "Panjabi", slug: "men-panjabi" },
      { id: "cat-men-trousers", parentId: "cat-men-001", name: "Trousers & Chinos", slug: "men-trousers" },
    ]
  },
  {
    id: "cat-women-002",
    parentId: null,
    name: "Women",
    slug: "women",
    description: "Contemporary dresses, elegant tops, Kurti sets, and relaxed silhouettes.",
    imageUrl: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1000&auto=format&fit=crop",
    sortOrder: 2,
    isActive: true,
    children: [
      { id: "cat-women-dresses", parentId: "cat-women-002", name: "Dresses", slug: "women-dresses" },
      { id: "cat-women-tops", parentId: "cat-women-002", name: "Tops & Shirts", slug: "women-tops" },
      { id: "cat-women-kurtis", parentId: "cat-women-002", name: "Kurtis & Kameez", slug: "women-kurtis" },
      { id: "cat-women-pants", parentId: "cat-women-002", name: "Trousers & Skirts", slug: "women-trousers" },
    ]
  },
  {
    id: "cat-lifestyle-003",
    parentId: null,
    name: "Lifestyle",
    slug: "lifestyle",
    description: "Curated leather goods, bespoke accessories, and handcrafted lifestyle essentials.",
    imageUrl: "https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=1000&auto=format&fit=crop",
    sortOrder: 3,
    isActive: true,
    children: [
      { id: "cat-life-bags", parentId: "cat-lifestyle-003", name: "Leather Bags", slug: "lifestyle-bags" },
      { id: "cat-life-sunglasses", parentId: "cat-lifestyle-003", name: "Sunglasses", slug: "lifestyle-sunglasses" },
      { id: "cat-life-perfumes", parentId: "cat-lifestyle-003", name: "Fragrances", slug: "lifestyle-fragrances" },
    ]
  },
  {
    id: "cat-new-004",
    parentId: null,
    name: "New Arrivals",
    slug: "new-arrivals",
    description: "Freshly dropped season capsules and limited-run editorial essentials.",
    imageUrl: "https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=1000&auto=format&fit=crop",
    sortOrder: 4,
    isActive: true,
    children: []
  },
  {
    id: "cat-sale-005",
    parentId: null,
    name: "Sale",
    slug: "sale",
    description: "Seasonal archives and special promotional pricing up to 40% off.",
    imageUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1000&auto=format&fit=crop",
    sortOrder: 5,
    isActive: true,
    children: []
  }
];
