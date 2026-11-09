import { NextResponse } from "next/server";
import { mockStore } from "@/mocks/store";

export async function GET(request) {
  try {
    const store = mockStore(request);
    const authHeader = request.headers.get("authorization");
    const user = store.getUserByToken(authHeader);

    // RBAC validation: admin or super_admin
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

    const metrics = store.getDashboardMetrics();
    return NextResponse.json({
      success: true,
      data: metrics,
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
