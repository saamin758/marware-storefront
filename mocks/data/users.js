export const initialUsers = [
  {
    id: "usr-super-001",
    fullName: "Sultan Mahmud (Chief Executive)",
    email: "superadmin@ecstasy.local",
    phone: "+8801700000000",
    role: "super_admin",
    permissions: [
      "all",
      "manage_staff",
      "manage_catalog",
      "manage_orders",
      "manage_settings",
      "view_reports"
    ],
    isActive: true,
    token: "mock-jwt-token-superadmin-000111",
    createdAt: "2026-01-01T00:00:00Z"
  },
  {
    id: "usr-admin-001",
    fullName: "Store Administrator",
    email: "admin@ecstasy.local",
    phone: "+8801711000001",
    role: "admin",
    permissions: [
      "manage_catalog",
      "manage_orders",
      "view_reports"
    ],
    isActive: true,
    token: "mock-jwt-token-admin-998877",
    createdAt: "2026-01-15T00:00:00Z"
  },
  {
    id: "usr-cust-002",
    fullName: "Samin Ahmed",
    email: "customer@ecstasy.local",
    phone: "+8801812345678",
    role: "customer",
    permissions: [],
    isActive: true,
    token: "mock-jwt-token-customer-112233",
    createdAt: "2026-02-01T00:00:00Z"
  }
];
