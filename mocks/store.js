import { initialCategories } from "./data/categories";
import { initialProducts } from "./data/products";
import { initialOrders } from "./data/orders";
import { initialUsers } from "./data/users";
import { getSessionIdFromRequest } from "@/lib/session";

// Global map of isolated session stores (sessionId -> store state)
const sessionStores = globalThis.__MOCK_SESSION_STORES__ || new Map();
if (process.env.NODE_ENV !== "production") {
  globalThis.__MOCK_SESSION_STORES__ = sessionStores;
}

function cloneData() {
  const usersClone = JSON.parse(JSON.stringify(initialUsers));
  const sessionsMap = new Map();
  usersClone.forEach((u) => {
    if (u.token) {
      sessionsMap.set(u.token, u);
    }
  });

  return {
    categories: JSON.parse(JSON.stringify(initialCategories)),
    products: JSON.parse(JSON.stringify(initialProducts)),
    cart: [],
    orders: JSON.parse(JSON.stringify(initialOrders)),
    users: usersClone,
    settings: {
      storeName: "Marware Lifestyle & Fashion Storefront",
      currency: "BDT",
      currencySymbol: "৳",
      shippingFeeInsideDhaka: 80,
      shippingFeeOutsideDhaka: 150,
      freeShippingThreshold: 5000,
      taxRate: 5,
      maintenanceMode: false,
      allowGuestCheckout: true,
      orderAutoCancelHours: 24,
      supportEmail: "support@marware.com",
      supportPhone: "+880 9678-000000",
    },
    sessions: sessionsMap,
  };
}

export function getSessionStore(sessionId = "default") {
  const sid = sessionId || "default";
  if (!sessionStores.has(sid)) {
    sessionStores.set(sid, cloneData());
  }
  const store = sessionStores.get(sid);

  // Guarantee seed users always exist in any active session store
  initialUsers.forEach((seedUser) => {
    const exists = store.users.some(
      (u) => u.email.toLowerCase() === seedUser.email.toLowerCase()
    );
    if (!exists) {
      const userCopy = JSON.parse(JSON.stringify(seedUser));
      store.users.unshift(userCopy);
      if (userCopy.token) {
        store.sessions.set(userCopy.token, userCopy);
      }
    }
  });

  // Guarantee settings object exists
  if (!store.settings) {
    store.settings = {
      storeName: "Marware Lifestyle & Fashion Storefront",
      currency: "BDT",
      currencySymbol: "৳",
      shippingFeeInsideDhaka: 80,
      shippingFeeOutsideDhaka: 150,
      freeShippingThreshold: 5000,
      taxRate: 5,
      maintenanceMode: false,
      allowGuestCheckout: true,
      orderAutoCancelHours: 24,
      supportEmail: "support@marware.com",
      supportPhone: "+880 9678-000000",
    };
  } else if (store.settings.storeName?.includes("Ecstasy")) {
    store.settings.storeName = "Marware Lifestyle & Fashion Storefront";
    if (store.settings.supportEmail?.includes("ecstasy")) {
      store.settings.supportEmail = "support@marware.com";
    }
  }

  // Ensure seed products (like tote bag prod-005) have latest color images & variants in existing sessions
  if (store.products) {
    initialProducts.forEach((seedProd) => {
      const idx = store.products.findIndex((p) => p.id === seedProd.id);
      if (idx !== -1) {
        const p = store.products[idx];
        const seedImagesCount = seedProd.images?.length || 0;
        const currentImagesCount = p.images?.length || 0;
        const hasColorOnImages = p.images?.some((img) => !!img.color);
        const hasOldBrokenUrl = p.images?.some((img) => img.url?.includes("photo-1583391733975"));
        if (seedImagesCount > currentImagesCount || !hasColorOnImages || hasOldBrokenUrl) {
          store.products[idx].images = JSON.parse(JSON.stringify(seedProd.images));
          store.products[idx].variants = JSON.parse(JSON.stringify(seedProd.variants));
          store.products[idx].primaryImage = JSON.parse(JSON.stringify(seedProd.primaryImage));
        }
      } else {
        store.products.push(JSON.parse(JSON.stringify(seedProd)));
      }
    });
  }

  return store;
}

export function resetSessionStore(sessionId = "default") {
  const sid = sessionId || "default";
  sessionStores.set(sid, cloneData());
  return true;
}

function createSessionStoreInstance(sessionId) {
  const currentStore = getSessionStore(sessionId);

  const instance = {
    sessionId,

    reset: () => {
      resetSessionStore(sessionId);
      return true;
    },

    // Categories
    getCategories: () => {
      return currentStore.categories.filter((c) => c.isActive);
    },

    getCategoryBySlug: (slug) => {
      return currentStore.categories.find(
        (c) => c.slug.toLowerCase() === slug.toLowerCase()
      );
    },

    // Products
    getProducts: ({
      category,
      search,
      minPrice,
      maxPrice,
      size,
      color,
      inStock,
      onSale,
      sort = "newest",
      page = 1,
      limit = 20,
    } = {}) => {
      let result = [...currentStore.products].filter(
        (p) => p.status === "published"
      );

      // Category filter (handles parent or subcategory)
      if (category) {
        const catLower = category.toLowerCase();
        result = result.filter(
          (p) =>
            p.category?.slug?.toLowerCase() === catLower ||
            p.categoryId === category
        );
      }

      // Search query
      if (search) {
        const q = search.toLowerCase();
        result = result.filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            p.description?.toLowerCase().includes(q) ||
            p.fabric?.toLowerCase().includes(q)
        );
      }

      // Price filters
      if (minPrice) {
        const min = parseFloat(minPrice);
        result = result.filter((p) => parseFloat(p.priceFrom) >= min);
      }
      if (maxPrice) {
        const max = parseFloat(maxPrice);
        result = result.filter((p) => parseFloat(p.priceFrom) <= max);
      }

      // Size filter
      if (size) {
        result = result.filter((p) =>
          p.variants.some((v) => v.size?.toLowerCase() === size.toLowerCase())
        );
      }

      // Color filter
      if (color) {
        result = result.filter((p) =>
          p.variants.some((v) => v.color?.toLowerCase() === color.toLowerCase())
        );
      }

      // In Stock filter
      if (inStock === "true" || inStock === true) {
        result = result.filter((p) => p.inStock);
      }

      // On Sale filter
      if (onSale === "true" || onSale === true) {
        result = result.filter((p) => p.onSale);
      }

      // Sorting
      if (sort === "price_asc") {
        result.sort((a, b) => parseFloat(a.priceFrom) - parseFloat(b.priceFrom));
      } else if (sort === "price_desc") {
        result.sort((a, b) => parseFloat(b.priceFrom) - parseFloat(a.priceFrom));
      } else if (sort === "name_asc") {
        result.sort((a, b) => a.name.localeCompare(b.name));
      } else {
        // Default: newest (reverse order)
        result.sort((a, b) => b.id.localeCompare(a.id));
      }

      const total = result.length;
      const pageNum = parseInt(page, 10) || 1;
      const limitNum = parseInt(limit, 10) || 20;
      const totalPages = Math.ceil(total / limitNum) || 1;
      const start = (pageNum - 1) * limitNum;
      const paginated = result.slice(start, start + limitNum);

      return {
        products: paginated,
        meta: {
          page: pageNum,
          limit: limitNum,
          total,
          totalPages,
        },
      };
    },

    getProductBySlug: (slug) => {
      return currentStore.products.find(
        (p) => p.slug.toLowerCase() === slug.toLowerCase()
      );
    },

    getProductById: (id) => {
      return currentStore.products.find((p) => p.id === id);
    },

    // Cart operations
    getCart: () => {
      let subtotal = 0;
      const items = currentStore.cart.map((cartItem) => {
        const lineTotal = (
          parseFloat(cartItem.variant.price) * cartItem.quantity
        ).toFixed(2);
        subtotal += parseFloat(lineTotal);
        return {
          ...cartItem,
          lineTotal,
        };
      });

      const shippingTotal =
        subtotal > 3000 || subtotal === 0 ? "0.00" : "80.00";
      const grandTotal = (subtotal + parseFloat(shippingTotal)).toFixed(2);

      return {
        items,
        itemCount: items.reduce((acc, i) => acc + i.quantity, 0),
        subtotal: subtotal.toFixed(2),
        shippingTotal,
        grandTotal,
      };
    },

    addToCart: ({ variantId, quantity = 1 }) => {
      let targetProduct = null;
      let targetVariant = null;

      for (const prod of currentStore.products) {
        const v = prod.variants.find((item) => item.id === variantId);
        if (v) {
          targetProduct = prod;
          targetVariant = v;
          break;
        }
      }

      if (!targetVariant) {
        throw new Error("Variant not found");
      }

      if (targetVariant.stockQuantity < quantity) {
        throw new Error("Insufficient stock available");
      }

      const existingIndex = currentStore.cart.findIndex(
        (item) => item.variantId === variantId
      );

      if (existingIndex > -1) {
        const newQty = currentStore.cart[existingIndex].quantity + quantity;
        if (newQty > targetVariant.stockQuantity) {
          throw new Error(
            `Cannot add more. Maximum available stock is ${targetVariant.stockQuantity}`
          );
        }
        currentStore.cart[existingIndex].quantity = newQty;
      } else {
        currentStore.cart.push({
          id: `cart-item-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          productId: targetProduct.id,
          variantId: targetVariant.id,
          product: {
            id: targetProduct.id,
            name: targetProduct.name,
            slug: targetProduct.slug,
            primaryImage: targetProduct.primaryImage,
          },
          variant: targetVariant,
          quantity: quantity,
        });
      }

      return instance.getCart();
    },

    updateCartItem: (itemId, quantity) => {
      const item = currentStore.cart.find((i) => i.id === itemId);
      if (!item) {
        throw new Error("Cart item not found");
      }

      if (quantity <= 0) {
        return instance.removeFromCart(itemId);
      }

      if (quantity > item.variant.stockQuantity) {
        throw new Error(
          `Quantity cannot exceed available stock (${item.variant.stockQuantity})`
        );
      }

      item.quantity = quantity;
      return instance.getCart();
    },

    removeFromCart: (itemId) => {
      currentStore.cart = currentStore.cart.filter((i) => i.id !== itemId);
      return instance.getCart();
    },

    clearCart: () => {
      currentStore.cart = [];
      return instance.getCart();
    },

    // Orders
    createOrder: (orderPayload) => {
      const cart = instance.getCart();
      if (cart.items.length === 0) {
        throw new Error("Cannot place an order with an empty cart");
      }

      const newOrder = {
        id: `ord-${Date.now().toString().slice(-6)}`,
        orderNumber: `ORD-${new Date().getFullYear()}-${Math.floor(
          1000 + Math.random() * 9000
        )}`,
        userId: orderPayload.userId || null,
        customerName: orderPayload.customerName,
        customerEmail: orderPayload.customerEmail || null,
        customerPhone: orderPayload.customerPhone,
        shippingArea: orderPayload.shippingArea || "Dhaka Inside",
        shippingAddress: orderPayload.shippingAddress,
        orderNote: orderPayload.orderNote || null,
        subtotal: cart.subtotal,
        discountTotal: "0.00",
        shippingTotal: cart.shippingTotal,
        grandTotal: cart.grandTotal,
        orderStatus: "confirmed",
        paymentMethod: orderPayload.paymentMethod || "cash_on_delivery",
        paymentStatus:
          orderPayload.paymentMethod === "online_simulation" ? "paid" : "pending",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        items: cart.items.map((ci) => ({
          id: `ord-item-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          productId: ci.productId,
          variantId: ci.variantId,
          productName: ci.product.name,
          sku: ci.variant.sku,
          selectedSize: ci.variant.size,
          selectedColor: ci.variant.color,
          unitPrice: ci.variant.price,
          quantity: ci.quantity,
          lineTotal: ci.lineTotal,
          imageUrl: ci.product.primaryImage?.url,
        })),
      };

      // Decrement stock in store
      cart.items.forEach((ci) => {
        const prod = currentStore.products.find((p) => p.id === ci.productId);
        if (prod) {
          const v = prod.variants.find((v) => v.id === ci.variantId);
          if (v) {
            v.stockQuantity = Math.max(0, v.stockQuantity - ci.quantity);
          }
        }
      });

      // Add to orders and empty cart
      currentStore.orders.unshift(newOrder);
      currentStore.cart = [];

      return newOrder;
    },

    getOrders: (userId = null, role = "customer") => {
      if (role === "admin" || role === "super_admin") {
        return currentStore.orders;
      }
      if (userId) {
        return currentStore.orders.filter((o) => o.userId === userId);
      }
      return [];
    },

    getOrderById: (orderId) => {
      return (
        currentStore.orders.find(
          (o) => o.id === orderId || o.orderNumber === orderId
        ) || null
      );
    },

    updateOrderStatus: (orderId, newStatus) => {
      const order = currentStore.orders.find((o) => o.id === orderId);
      if (!order) {
        throw new Error("Order not found");
      }
      order.orderStatus = newStatus;
      order.updatedAt = new Date().toISOString();
      return order;
    },

    // Auth
    authenticate: (email, password) => {
      const normalizedEmail = (email || "").toLowerCase().trim();
      let user = currentStore.users.find(
        (u) =>
          u.email.toLowerCase() === normalizedEmail ||
          (normalizedEmail === "superadmin@ecstasy.com.bd" && u.email.toLowerCase() === "superadmin@ecstasy.local") ||
          (normalizedEmail === "admin@ecstasy.com.bd" && u.email.toLowerCase() === "admin@ecstasy.local")
      );
      if (!user) {
        const seed = initialUsers.find(
          (u) =>
            u.email.toLowerCase() === normalizedEmail ||
            (normalizedEmail === "superadmin@ecstasy.com.bd" && u.email.toLowerCase() === "superadmin@ecstasy.local") ||
            (normalizedEmail === "admin@ecstasy.com.bd" && u.email.toLowerCase() === "admin@ecstasy.local")
        );
        if (seed) {
          user = JSON.parse(JSON.stringify(seed));
          currentStore.users.unshift(user);
          if (user.token) {
            currentStore.sessions.set(user.token, user);
          }
        }
      }
      if (!user) {
        return null;
      }
      if (!user.isActive) {
        throw new Error("This account is currently suspended or inactive. Please contact a Super Administrator.");
      }

      const isSuperAdminMatch =
        user.role === "super_admin" &&
        (password === "superadmin123" ||
          password === "Admin1234!" ||
          password === "admin123" ||
          password === "password");

      const isAdminMatch =
        user.role === "admin" &&
        (password === "admin123" ||
          password === "Admin1234!" ||
          password === "password");

      const isCustomerMatch =
        user.role === "customer" &&
        (password === "customer123" ||
          password === "Customer1234!" ||
          password === "password");

      if (
        isSuperAdminMatch ||
        isAdminMatch ||
        isCustomerMatch ||
        password === "password" ||
        password === "Admin1234!"
      ) {
        return {
          user: {
            id: user.id,
            fullName: user.fullName,
            email: user.email,
            phone: user.phone,
            role: user.role,
            permissions: user.permissions || [],
          },
          token: user.token,
        };
      }
      return null;
    },

    register: ({ fullName, email, phone, password }) => {
      const existing = currentStore.users.find(
        (u) => u.email.toLowerCase() === email.toLowerCase()
      );
      if (existing) {
        throw new Error("An account with this email already exists");
      }

      const newUser = {
        id: `usr-${Date.now().toString().slice(-6)}`,
        fullName,
        email,
        phone,
        role: "customer",
        isActive: true,
        token: `mock-jwt-token-customer-${Date.now()}`,
      };

      currentStore.users.push(newUser);
      currentStore.sessions.set(newUser.token, newUser);

      return {
        user: {
          id: newUser.id,
          fullName: newUser.fullName,
          email: newUser.email,
          phone: newUser.phone,
          role: newUser.role,
        },
        token: newUser.token,
      };
    },

    getUserByToken: (token) => {
      if (!token) return null;
      const cleanToken = token.replace("Bearer ", "").trim();
      return currentStore.sessions.get(cleanToken) || null;
    },

    // Admin operations
    getDashboardMetrics: () => {
      const totalOrders = currentStore.orders.length;
      const totalRevenue = currentStore.orders.reduce(
        (sum, o) => sum + parseFloat(o.grandTotal || 0),
        0
      );
      const totalProducts = currentStore.products.length;
      const lowStockCount = currentStore.products.filter((p) =>
        p.variants.some((v) => v.stockQuantity <= 5)
      ).length;

      return {
        totalOrders,
        totalRevenue: totalRevenue.toFixed(2),
        totalProducts,
        lowStockCount,
        recentOrders: currentStore.orders.slice(0, 5),
      };
    },

    createProduct: (productData) => {
      const newProduct = {
        id: `prod-${Date.now().toString().slice(-4)}`,
        status: "published",
        inStock: true,
        onSale: false,
        ...productData,
      };
      currentStore.products.unshift(newProduct);
      return newProduct;
    },

    updateProduct: (id, productData) => {
      const index = currentStore.products.findIndex((p) => p.id === id);
      if (index === -1) {
        throw new Error("Product not found");
      }
      currentStore.products[index] = {
        ...currentStore.products[index],
        ...productData,
      };
      return currentStore.products[index];
    },

    deleteProduct: (id) => {
      const index = currentStore.products.findIndex(
        (p) => p.id === id || p.slug === id
      );
      if (index === -1) {
        throw new Error("Product not found");
      }
      const deleted = currentStore.products.splice(index, 1)[0];
      return {
        success: true,
        message: `Product "${deleted.name}" deleted successfully`,
        deletedId: deleted.id,
      };
    },

    // Staff & Team Management (Super Admin & Admin Operations)
    getStaffUsers: () => {
      return currentStore.users
        .filter((u) => u.role === "admin" || u.role === "super_admin")
        .map((u) => ({
          id: u.id,
          fullName: u.fullName,
          email: u.email,
          phone: u.phone,
          role: u.role,
          permissions: u.permissions || [],
          isActive: u.isActive,
          createdAt: u.createdAt || "2026-01-01T00:00:00Z",
        }));
    },

    createStaffUser: ({ fullName, email, phone, role, permissions = [], password }) => {
      const existing = currentStore.users.find(
        (u) => u.email.toLowerCase() === email.toLowerCase()
      );
      if (existing) {
        throw new Error("A user account with this email already exists");
      }

      if (!["admin", "super_admin"].includes(role)) {
        throw new Error("Invalid role specified for staff member. Allowed: admin, super_admin");
      }

      const defaultPermissions =
        role === "super_admin"
          ? ["all", "manage_staff", "manage_catalog", "manage_orders", "manage_settings", "view_reports"]
          : permissions.length > 0
          ? permissions
          : ["manage_catalog", "manage_orders", "view_reports"];

      const newStaff = {
        id: `usr-staff-${Date.now().toString().slice(-6)}`,
        fullName,
        email,
        phone: phone || "+8801700000000",
        role,
        permissions: defaultPermissions,
        isActive: true,
        token: `mock-jwt-token-${role}-${Date.now()}`,
        createdAt: new Date().toISOString(),
      };

      currentStore.users.push(newStaff);
      currentStore.sessions.set(newStaff.token, newStaff);

      return {
        id: newStaff.id,
        fullName: newStaff.fullName,
        email: newStaff.email,
        phone: newStaff.phone,
        role: newStaff.role,
        permissions: newStaff.permissions,
        isActive: newStaff.isActive,
        createdAt: newStaff.createdAt,
      };
    },

    updateStaffUser: (id, updates) => {
      const userIndex = currentStore.users.findIndex((u) => u.id === id);
      if (userIndex === -1) {
        throw new Error("Staff member not found");
      }

      const existingUser = currentStore.users[userIndex];

      // Guard: Cannot demote or deactivate the last remaining Super Admin
      if (
        existingUser.role === "super_admin" &&
        (updates.role === "admin" || updates.isActive === false)
      ) {
        const superAdminsCount = currentStore.users.filter(
          (u) => u.role === "super_admin" && u.isActive
        ).length;
        if (superAdminsCount <= 1) {
          throw new Error("Cannot demote or deactivate the only active Super Administrator.");
        }
      }

      const updated = {
        ...existingUser,
        ...updates,
      };

      currentStore.users[userIndex] = updated;
      if (updated.token) {
        currentStore.sessions.set(updated.token, updated);
      }

      return {
        id: updated.id,
        fullName: updated.fullName,
        email: updated.email,
        phone: updated.phone,
        role: updated.role,
        permissions: updated.permissions || [],
        isActive: updated.isActive,
        createdAt: updated.createdAt,
      };
    },

    deleteStaffUser: (id, requestingUserId) => {
      if (id === requestingUserId) {
        throw new Error("Security Guard: You cannot delete your own active administrator account.");
      }

      const userIndex = currentStore.users.findIndex((u) => u.id === id);
      if (userIndex === -1) {
        throw new Error("Staff member not found");
      }

      const targetUser = currentStore.users[userIndex];
      if (targetUser.role === "super_admin") {
        const superAdminsCount = currentStore.users.filter(
          (u) => u.role === "super_admin"
        ).length;
        if (superAdminsCount <= 1) {
          throw new Error("Cannot delete the only Super Administrator account.");
        }
      }

      if (targetUser.token) {
        currentStore.sessions.delete(targetUser.token);
      }
      currentStore.users.splice(userIndex, 1);
      return { success: true, message: `Staff member ${targetUser.fullName} removed successfully.` };
    },

    // Store Settings
    getStoreSettings: () => {
      return { ...currentStore.settings };
    },

    updateStoreSettings: (newSettings) => {
      currentStore.settings = {
        ...currentStore.settings,
        ...newSettings,
      };
      return { ...currentStore.settings };
    },

    // Roles and Permissions Blueprint Matrix
    getRolePermissionsMatrix: () => {
      return {
        roles: [
          {
            key: "super_admin",
            name: "Super Administrator",
            badge: "Executive Root",
            description:
              "Complete master access across all platform resources: Catalog, Order Fulfillment, Staff & Role Governance, and Global Store Settings.",
            hierarchyLevel: 1,
            capabilities: [
              "Create & manage both Admins and other Super Admins",
              "Assign and modify granular staff permission sets",
              "Suspend, activate, or remove administrator accounts",
              "Configure store currencies, delivery rates, and checkout settings",
              "Manage entire catalog (products, pricing, inventory, categories)",
              "Fulfill orders and process cancellations or status changes",
              "Access revenue analytics and audit reports",
            ],
          },
          {
            key: "admin",
            name: "Store Administrator",
            badge: "Operations Staff",
            description:
              "Day-to-day storefront operations: Product catalog curation, inventory adjustments, and order processing.",
            hierarchyLevel: 2,
            capabilities: [
              "View staff directory in Read-Only mode",
              "Create, edit, and publish catalog products",
              "Monitor stock levels and manage variant inventories",
              "Process customer orders and transition fulfillment status",
              "View store performance and sales overview",
              "Cannot create, edit, or delete staff accounts",
              "Cannot modify core financial or store settings",
            ],
          },
          {
            key: "customer",
            name: "Registered Customer",
            badge: "Shopper",
            description:
              "Authenticated shopper on the public storefront.",
            hierarchyLevel: 3,
            capabilities: [
              "Browse catalog, search, and filter products",
              "Add items to personal cart and place orders",
              "View personal order history and delivery tracking",
              "Update personal delivery address and profile",
              "Zero access to admin dashboard or staff management",
            ],
          },
          {
            key: "guest",
            name: "Guest Visitor",
            badge: "Anonymous",
            description: "Unauthenticated visitor exploring public store collections.",
            hierarchyLevel: 4,
            capabilities: [
              "Browse published collections and product detail pages",
              "Add items to temporary guest cart",
              "Complete guest checkout if enabled",
              "Register new customer account",
            ],
          },
        ],
        permissionModules: [
          {
            category: "Catalog & Inventory",
            items: [
              { name: "Browse Products & Categories", guest: true, customer: true, admin: true, super_admin: true },
              { name: "Create & Edit Products", guest: false, customer: false, admin: true, super_admin: true },
              { name: "Manage Inventory & Stock", guest: false, customer: false, admin: true, super_admin: true },
              { name: "Archive / Delete Products", guest: false, customer: false, admin: true, super_admin: true },
            ],
          },
          {
            category: "Orders & Fulfillment",
            items: [
              { name: "Place Orders (Checkout)", guest: true, customer: true, admin: false, super_admin: false },
              { name: "View Own Order History", guest: false, customer: true, admin: true, super_admin: true },
              { name: "View All Customer Orders", guest: false, customer: false, admin: true, super_admin: true },
              { name: "Change Order Status (Shipped/Delivered)", guest: false, customer: false, admin: true, super_admin: true },
            ],
          },
          {
            category: "Staff & User Governance",
            items: [
              { name: "View Staff Directory", guest: false, customer: false, admin: true, super_admin: true },
              { name: "Create New Admin", guest: false, customer: false, admin: false, super_admin: true },
              { name: "Create New Super Admin", guest: false, customer: false, admin: false, super_admin: true },
              { name: "Edit Staff Role & Permissions", guest: false, customer: false, admin: false, super_admin: true },
              { name: "Delete / Suspend Admin Account", guest: false, customer: false, admin: false, super_admin: true },
            ],
          },
          {
            category: "System & Global Settings",
            items: [
              { name: "View Sales & Revenue Analytics", guest: false, customer: false, admin: true, super_admin: true },
              { name: "Configure Delivery Fees & Tiers", guest: false, customer: false, admin: false, super_admin: true },
              { name: "Change Currency & Tax Rates", guest: false, customer: false, admin: false, super_admin: true },
              { name: "Toggle Store Maintenance Mode", guest: false, customer: false, admin: false, super_admin: true },
            ],
          },
        ],
      };
    },
  };

  return instance;
}

export function getMockStore(requestOrSessionId) {
  let sessionId = "default";
  if (typeof requestOrSessionId === "string") {
    sessionId = requestOrSessionId;
  } else if (requestOrSessionId && typeof requestOrSessionId === "object") {
    sessionId = getSessionIdFromRequest(requestOrSessionId);
  }
  return createSessionStoreInstance(sessionId);
}

/**
 * Universal mockStore interface:
 * Callable as mockStore(request) to get a session-scoped store,
 * or accessed directly (mockStore.getProducts) for default session.
 */
export const mockStore = (requestOrSessionId) =>
  getMockStore(requestOrSessionId);

// Bind default methods for direct calls
Object.assign(mockStore, getMockStore("default"));
