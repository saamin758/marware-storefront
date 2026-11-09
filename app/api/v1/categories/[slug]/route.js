import { NextResponse } from "next/server";
import { mockStore } from "@/mocks/store";

export async function GET(request, { params }) {
  try {
    const { slug } = await params;
    const category = mockStore(request).getCategoryBySlug(slug);

    if (!category) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "NOT_FOUND",
            message: `Category with slug '${slug}' not found`,
          },
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: category,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "SERVER_ERROR",
          message: error.message || "Failed to fetch category",
        },
      },
      { status: 500 }
    );
  }
}
