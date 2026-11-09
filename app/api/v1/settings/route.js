import { NextResponse } from "next/server";
import { mockStore } from "@/mocks/store";

export async function GET(request) {
  try {
    const store = mockStore(request);
    const settings = store.getStoreSettings();

    return NextResponse.json({
      success: true,
      data: {
        storeName: settings?.storeName || "MARWARE",
        currency: settings?.currency || "BDT",
        currencySymbol: settings?.currencySymbol || "৳",
        maintenanceMode: !!settings?.maintenanceMode,
        allowGuestCheckout: settings?.allowGuestCheckout ?? true,
        supportEmail: settings?.supportEmail || "support@marware.com",
        supportPhone: settings?.supportPhone || "+880 9678-000000",
        shippingFeeInsideDhaka: settings?.shippingFeeInsideDhaka ?? 80,
        shippingFeeOutsideDhaka: settings?.shippingFeeOutsideDhaka ?? 150,
        freeShippingThreshold: settings?.freeShippingThreshold ?? 5000,
      },
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

