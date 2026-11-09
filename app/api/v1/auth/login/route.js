import { NextResponse } from "next/server";
import { mockStore } from "@/mocks/store";

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Email and password are required",
          },
        },
        { status: 400 }
      );
    }

    const authResult = mockStore(request).authenticate(email, password);
    if (!authResult) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "INVALID_CREDENTIALS",
            message: "Invalid email or password",
          },
        },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      data: authResult,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: { code: "AUTH_FAILED", message: error.message },
      },
      { status: 500 }
    );
  }
}
