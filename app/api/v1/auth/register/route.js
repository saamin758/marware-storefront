import { NextResponse } from "next/server";
import { mockStore } from "@/mocks/store";

export async function POST(request) {
  try {
    const body = await request.json();
    const { fullName, email, phone, password } = body;

    if (!fullName || !email || !password) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Full name, email, and password are required",
          },
        },
        { status: 400 }
      );
    }

    const authResult = mockStore(request).register({
      fullName,
      email,
      phone: phone || "",
      password,
    });

    return NextResponse.json(
      {
        success: true,
        data: authResult,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "REGISTRATION_FAILED",
          message: error.message || "Failed to register user",
        },
      },
      { status: 400 }
    );
  }
}
