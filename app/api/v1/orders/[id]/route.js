import { NextResponse } from "next/server";
import { mockStore } from "@/mocks/store";

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const order = mockStore(request).getOrderById(id);

    if (!order) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "NOT_FOUND",
            message: `Order '${id}' not found`,
          },
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: order,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: { code: "SERVER_ERROR", message: error.message },
      },
      { status: 500 }
    );
  }
}
