import { NextResponse } from "next/server";
import { mockStore } from "@/mocks/store";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const size = searchParams.get("size");
    const color = searchParams.get("color");
    const inStock = searchParams.get("inStock");
    const onSale = searchParams.get("onSale");
    const sort = searchParams.get("sort") || "newest";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "20", 10);

    const result = mockStore(request).getProducts({
      category,
      search,
      minPrice,
      maxPrice,
      size,
      color,
      inStock,
      onSale,
      sort,
      page,
      limit,
    });

    return NextResponse.json({
      success: true,
      data: result.products,
      meta: result.meta,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "SERVER_ERROR",
          message: error.message || "Failed to fetch products",
        },
      },
      { status: 500 }
    );
  }
}
