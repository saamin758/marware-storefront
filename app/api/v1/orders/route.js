import { NextResponse } from "next/server";
import { mockStore } from "@/mocks/store";

export async function GET(request) {
  try {
    const store = mockStore(request);
    const authHeader = request.headers.get("authorization");
    const user = store.getUserByToken(authHeader);

    // If authenticated user, return their orders; if admin, return all
    const orders = store.getOrders(user?.id, user?.role);
    return NextResponse.json({
      success: true,
      data: orders,
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
    const body = await request.json();
    const {
      customerName,
      customerPhone,
      customerEmail,
      shippingArea,
      shippingAddress,
      orderNote,
      paymentMethod,
    } = body;

    // Validate required fields
    if (!customerName || !customerPhone || !shippingAddress) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Name, phone number, and shipping address are required",
          },
        },
        { status: 400 }
      );
    }

    // Check optional auth token for customer association
    const authHeader = request.headers.get("authorization");
    const user = store.getUserByToken(authHeader);

    // Maintenance Mode Guard: Block customer checkout when maintenance mode is active
    const settings = store.getStoreSettings();
    const isAdmin = user && (user.role === "admin" || user.role === "super_admin");
    if (settings?.maintenanceMode && !isAdmin) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "MAINTENANCE_MODE_ACTIVE",
            message:
              "The storefront is currently under scheduled maintenance. Ordering and checkout are temporarily suspended.",
          },
        },
        { status: 503 }
      );
    }

    const order = store.createOrder({
      userId: user?.id || null,
      customerName,
      customerPhone,
      customerEmail,
      shippingArea,
      shippingAddress,
      orderNote,
      paymentMethod,
    });

    return NextResponse.json(
      {
        success: true,
        data: order,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "ORDER_CREATION_FAILED",
          message: error.message || "Failed to create order",
        },
      },
      { status: 400 }
    );
  }
}
