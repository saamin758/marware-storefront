import { NextResponse } from "next/server";
import { mockStore } from "@/mocks/store";

export async function GET(request) {
  try {
    const store = mockStore(request);
    const authHeader = request.headers.get("authorization");
    const user = store.getUserByToken(authHeader);

    // Both Admin and Super Admin can view staff list
    if (!user || (user.role !== "admin" && user.role !== "super_admin")) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "FORBIDDEN",
            message: "Administrator privilege required to view staff directory",
          },
        },
        { status: 403 }
      );
    }

    const staff = store.getStaffUsers();
    return NextResponse.json({
      success: true,
      data: staff,
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

export async function POST(request) {
  try {
    const store = mockStore(request);
    const authHeader = request.headers.get("authorization");
    const user = store.getUserByToken(authHeader);

    // ONLY Super Admin can create staff accounts
    if (!user || user.role !== "super_admin") {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "FORBIDDEN_SUPER_ADMIN_REQUIRED",
            message:
              "Only Super Administrators have permission to invite or create administrator accounts.",
          },
        },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { fullName, email, phone, role, permissions, password } = body;

    if (!fullName || !email || !role) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Full Name, Email, and Role are required.",
          },
        },
        { status: 400 }
      );
    }

    const newStaff = store.createStaffUser({
      fullName,
      email,
      phone,
      role,
      permissions: permissions || [],
      password: password || "password",
    });

    return NextResponse.json(
      {
        success: true,
        data: newStaff,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: { code: "STAFF_CREATION_FAILED", message: error.message },
      },
      { status: 400 }
    );
  }
}

