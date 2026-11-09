import { NextResponse } from "next/server";
import { mockStore } from "@/mocks/store";

export async function PATCH(request, { params }) {
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

    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    const validStatuses = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"];
    if (!status || !validStatuses.includes(status)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: `Status must be one of: ${validStatuses.join(", ")}`,
          },
        },
        { status: 400 }
      );
    }

    const updatedOrder = store.updateOrderStatus(id, status);

    return NextResponse.json({
      success: true,
      data: updatedOrder,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: { code: "STATUS_UPDATE_FAILED", message: error.message },
      },
      { status: 400 }
    );
  }
}
