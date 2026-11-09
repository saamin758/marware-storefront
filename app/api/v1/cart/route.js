import { NextResponse } from "next/server";
import { mockStore } from "@/mocks/store";

export async function GET(request) {
  try {
    const cart = mockStore(request).getCart();
    return NextResponse.json({
      success: true,
      data: cart,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: { code: "CART_ERROR", message: error.message },
      },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { variantId, quantity = 1 } = body;

    if (!variantId) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "variantId is required",
          },
        },
        { status: 400 }
      );
    }

    const updatedCart = mockStore(request).addToCart({
      variantId,
      quantity: parseInt(quantity, 10) || 1,
    });

    return NextResponse.json({
      success: true,
      data: updatedCart,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "ADD_TO_CART_FAILED",
          message: error.message || "Failed to add product variant to cart",
        },
      },
      { status: 400 }
    );
  }
}
