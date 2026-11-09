// Persistent Catalog Storage for Netlify Blobs & Local Fallback
import { initialProducts } from "@/mocks/data/products";

function getNodeFs() {
  if (typeof window !== "undefined") return null;
  try {
    const req =
      typeof __non_webpack_require__ !== "undefined"
        ? __non_webpack_require__
        : eval("require");
    return {
      fs: req("fs"),
      path: req("path"),
      os: req("os"),
    };
  } catch {}
  return null;
}

function getLocalProductsFile() {
  const node = getNodeFs();
  if (!node) return null;
  try {
    const dir = node.path.join(process.cwd(), ".data");
    if (!node.fs.existsSync(dir)) {
      node.fs.mkdirSync(dir, { recursive: true });
    }
    return node.path.join(dir, "products.json");
  } catch {
    return null;
  }
}

function readLocalProducts() {
  const file = getLocalProductsFile();
  if (!file) return null;
  const node = getNodeFs();
  try {
    if (node.fs.existsSync(file)) {
      const data = node.fs.readFileSync(file, "utf8");
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {}
  return null;
}

function writeLocalProducts(products) {
  const file = getLocalProductsFile();
  if (!file) return false;
  const node = getNodeFs();
  try {
    node.fs.writeFileSync(file, JSON.stringify(products, null, 2), "utf8");
    return true;
  } catch {
    return false;
  }
}

// In-memory cache per lambda container
let memoryProducts = null;

export async function getPersistentProducts() {
  if (typeof window !== "undefined") return [];

  // 1. Try Netlify Blobs (Production Netlify)
  try {
    const { getStore } = await import("@netlify/blobs");
    const store = getStore("marware-catalog");
    const blobProducts = await store.get("products", { type: "json" });
    if (Array.isArray(blobProducts)) {
      memoryProducts = blobProducts;
      return blobProducts;
    }
  } catch (err) {
    // Netlify Blobs not available in local environment or before first set
  }

  // 2. Try Local Disk File (.data/products.json)
  const local = readLocalProducts();
  if (Array.isArray(local)) {
    memoryProducts = local;
    return local;
  }

  // 3. Fallback to memory or initialProducts
  if (Array.isArray(memoryProducts)) {
    return memoryProducts;
  }

  return Array.isArray(initialProducts) ? initialProducts : [];
}

export async function savePersistentProducts(products) {
  if (typeof window !== "undefined") return false;
  const list = Array.isArray(products) ? products : [];
  memoryProducts = list;

  // 1. Save to Netlify Blobs (Production Netlify)
  let blobSaved = false;
  try {
    const { getStore } = await import("@netlify/blobs");
    const store = getStore("marware-catalog");
    await store.setJSON("products", list);
    blobSaved = true;
  } catch (err) {
    console.warn("Netlify Blobs save warning:", err.message);
  }

  // 2. Save to local disk
  const fileSaved = writeLocalProducts(list);

  return blobSaved || fileSaved;
}

export async function addPersistentProduct(newProduct) {
  const current = await getPersistentProducts();
  const filtered = current.filter((p) => p.id !== newProduct.id && p.slug !== newProduct.slug);
  const updated = [newProduct, ...filtered];
  await savePersistentProducts(updated);
  return updated;
}

export async function removePersistentProduct(idOrSlug) {
  const current = await getPersistentProducts();
  const updated = current.filter((p) => p.id !== idOrSlug && p.slug !== idOrSlug);
  await savePersistentProducts(updated);
  return updated;
}

export async function updatePersistentProduct(id, updates) {
  const current = await getPersistentProducts();
  const index = current.findIndex((p) => p.id === id);
  if (index === -1) return current;
  current[index] = { ...current[index], ...updates };
  await savePersistentProducts(current);
  return current;
}
