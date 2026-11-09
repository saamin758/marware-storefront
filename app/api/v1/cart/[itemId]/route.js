import { NextResponse } from "next/server";
import { mockStore } from "@/mocks/store";

export async function PATCH(request, { params }) {
  try {
    const { itemId } = await params;
    const body = await request.json();
    const { quantity } = body;

    if (quantity === undefined || isNaN(quantity)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Valid numeric quantity is required",
          },
        },
        { status: 400 }
      );
    }

    const updatedCart = mockStore(request).updateCartItem(
      itemId,
      parseInt(quantity, 10)
    );

    return NextResponse.json({
      success: true,
      data: updatedCart,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: { code: "UPDATE_CART_FAILED", message: error.message },
      },
      { status: 400 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { itemId } = await params;
    const updatedCart = mockStore(request).removeFromCart(itemId);
    return NextResponse.json({
      success: true,
      data: updatedCart,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: { code: "REMOVE_CART_FAILED", message: error.message },
      },
      { status: 400 }
    );
  }
}
