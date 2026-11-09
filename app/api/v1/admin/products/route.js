import { NextResponse } from "next/server";
import { mockStore } from "@/mocks/store";
import { addPersistentProduct } from "@/lib/catalog-storage";

export async function POST(request) {
  try {
    const store = mockStore(request);
    const authHeader = request.headers.get("authorization");
    const user = store.getUserByToken(authHeader);

    if (!user || (user.role !== "admin" && user.role !== "super_admin")) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "FORBIDDEN",
            message: "Administrator privilege required",
          },
        },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { name, categoryId, priceFrom, description } = body;

    if (!name || !categoryId || !priceFrom) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Product name, categoryId, and base price are required",
          },
        },
        { status: 400 }
      );
    }

    const category = store.getCategories().find((c) => c.id === categoryId);
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

    const newProduct = store.createProduct({
      name,
      slug,
      categoryId,
      category: category ? { id: category.id, name: category.name, slug: category.slug } : null,
      description: description || "",
      priceFrom: parseFloat(priceFrom).toFixed(2),
      priceTo: parseFloat(priceFrom).toFixed(2),
      compareAtPriceFrom: null,
      primaryImage: body.primaryImage || (body.images?.[0] ? { url: body.images[0].url, alt: name } : { url: "", alt: name }),
      images: body.images || [],
      variants: body.variants || [
        {
          id: `var-${Date.now()}-std`,
          sku: `${slug.slice(0, 3).toUpperCase()}-${Date.now().toString().slice(-4)}`,
          size: "Regular",
          color: "Standard",
          price: parseFloat(priceFrom).toFixed(2),
          compareAtPrice: null,
          stockQuantity: 20,
          isActive: true,
        },
      ],
    });

    await addPersistentProduct(newProduct);

    return NextResponse.json(
      {
        success: true,
        data: newProduct,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: { code: "CREATE_PRODUCT_FAILED", message: error.message },
      },
      { status: 400 }
    );
  }
}
