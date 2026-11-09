import { NextResponse } from "next/server";
import { mockStore } from "@/mocks/store";

export async function DELETE(request, { params }) {
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
            message: "Administrator privilege required to delete products.",
          },
        },
        { status: 403 }
      );
    }

    const { id } = await params;
    const result = store.deleteProduct(id);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: { code: "DELETE_FAILED", message: error.message },
      },
      { status: 400 }
    );
  }
}

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
            message: "Administrator privilege required to update products.",
          },
        },
        { status: 403 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const updated = store.updateProduct(id, body);

    return NextResponse.json({
      success: true,
      data: updated,
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

