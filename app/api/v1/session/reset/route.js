import { NextResponse } from "next/server";
import { mockStore } from "@/mocks/store";

export async function POST(request) {
  try {
    const store = mockStore(request);
    store.reset();

    return NextResponse.json({
      success: true,
      message: "Session data reset successfully to initial pristine demo state.",
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "RESET_FAILED",
          message: error.message || "Failed to reset session data",
        },
      },
      { status: 500 }
    );
  }
}
