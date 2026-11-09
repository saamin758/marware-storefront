import { NextResponse } from "next/server";
import { mockStore } from "@/mocks/store";
import { removePersistentProduct, updatePersistentProduct } from "@/lib/catalog-storage";

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
    await removePersistentProduct(id);

    // Extract current deleted list from cookie to append to it
    const cookieHeader = request.headers.get("cookie") || "";
    const match = cookieHeader.match(/(?:^|;\s*)marware_deleted_products=([^;]+)/);
    const existingList = match && match[1] ? decodeURIComponent(match[1]).split(",").map(s => s.trim()).filter(Boolean) : [];
    if (!existingList.includes(id)) existingList.push(id);
    if (result.deletedSlug && !existingList.includes(result.deletedSlug)) existingList.push(result.deletedSlug);

    const response = NextResponse.json({
      success: true,
      data: result,
    });

    response.cookies.set("marware_deleted_products", existingList.join(","), {
      path: "/",
      maxAge: 31536000,
      sameSite: "lax",
    });

    return response;
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
    await updatePersistentProduct(id, body);

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

