import { NextResponse } from "next/server";
import { mockStore } from "@/mocks/store";

export async function GET(request) {
  try {
    const categories = mockStore(request).getCategories();
    return NextResponse.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "SERVER_ERROR",
          message: error.message || "Failed to fetch categories",
        },
      },
      { status: 500 }
    );
  }
}
