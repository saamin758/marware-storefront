export const initialOrders = [
  {
    id: "ord-889102",
    orderNumber: "ORD-2026-8891",
    userId: "usr-cust-002",
    customerName: "Samin Ahmed",
    customerEmail: "customer@ecstasy.local",
    customerPhone: "+8801812345678",
    shippingArea: "Dhaka Inside",
    shippingAddress: "House 42, Road 11, Banani, Dhaka-1213",
    orderNote: "Please ring bell on arrival",
    subtotal: "4850.00",
    discountTotal: "0.00",
    shippingTotal: "80.00",
    grandTotal: "4930.00",
    orderStatus: "confirmed",
    paymentMethod: "cash_on_delivery",
    paymentStatus: "pending",
    createdAt: "2026-10-15T14:30:00Z",
    updatedAt: "2026-10-15T14:32:00Z",
    items: [
      {
        id: "item-ord-1",
        productId: "prod-002",
        variantId: "var-002-ivr-l",
        productName: "Raw Silk Heritage Panjabi",
        sku: "MPJ-002-IVR-L",
        selectedSize: "L",
        selectedColor: "Sandstone Ivory",
        unitPrice: "4850.00",
        quantity: 1,
        lineTotal: "4850.00",
        imageUrl: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1000&auto=format&fit=crop"
      }
    ]
  },
  {
    id: "ord-889103",
    orderNumber: "ORD-2026-8892",
    userId: null, // Guest checkout
    customerName: "Farhan Kabir",
    customerEmail: "farhan@example.com",
    customerPhone: "+8801719876543",
    shippingArea: "Dhaka Outside",
    shippingAddress: "GEC Circle, Nasirabad, Chattogram",
    orderNote: null,
    subtotal: "3850.00",
    discountTotal: "200.00",
    shippingTotal: "150.00",
    grandTotal: "3800.00",
    orderStatus: "shipped",
    paymentMethod: "online_simulation",
    paymentStatus: "paid",
    createdAt: "2026-10-16T09:15:00Z",
    updatedAt: "2026-10-17T11:00:00Z",
    items: [
      {
        id: "item-ord-2",
        productId: "prod-003",
        variantId: "var-003-ter-s",
        productName: "Minimalist Linen Wrap Dress",
        sku: "WDR-003-TER-S",
        selectedSize: "S",
        selectedColor: "Terracotta",
        unitPrice: "3850.00",
        quantity: 1,
        lineTotal: "3850.00",
        imageUrl: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=1000&auto=format&fit=crop"
      }
    ]
  }
];
