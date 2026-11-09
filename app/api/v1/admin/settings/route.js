import { NextResponse } from "next/server";
import { mockStore } from "@/mocks/store";

export async function GET(request) {
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

    const settings = store.getStoreSettings();
    return NextResponse.json({
      success: true,
      data: settings,
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

export async function PATCH(request) {
  try {
    const store = mockStore(request);
    const authHeader = request.headers.get("authorization");
    const user = store.getUserByToken(authHeader);

    // Only Super Admin can change global store settings
    if (!user || user.role !== "super_admin") {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "FORBIDDEN_SUPER_ADMIN_REQUIRED",
            message: "Only Super Administrators have permission to modify store configuration and logistics settings.",
          },
        },
        { status: 403 }
      );
    }

    const body = await request.json();
    const updatedSettings = store.updateStoreSettings(body);

    return NextResponse.json({
      success: true,
      data: updatedSettings,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: { code: "UPDATE_FAILED", message: error.message },
      },
      { status: 400 }
    );
  }
}

