import { NextResponse } from "next/server";
import { mockStore } from "@/mocks/store";

export async function GET(request, { params }) {
  try {
    const { slug } = await params;
    const product = mockStore(request).getProductBySlug(slug);

    if (!product) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "NOT_FOUND",
            message: `Product with slug '${slug}' not found`,
          },
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: product,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "SERVER_ERROR",
          message: error.message || "Failed to fetch product",
        },
      },
      { status: 500 }
    );
  }
}
