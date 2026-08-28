export type ProductId =
  | "broto_pro_monthly"
  | "broto_pro_annual"
  | "broto_chat_monthly"
  | "broto_chat_annual"
  | "broto_analysis_single";

export type ProductKind = "pro" | "chat" | "single";
export type ProductPeriod = "month" | "year" | "once";

export interface Product {
  id: ProductId;
  kind: ProductKind;
  period: ProductPeriod;
  price: string;
  monthly: string | null;
  saves: string | null;
}

export const CATALOG: Product[] = [
  {
    id: "broto_pro_monthly",
    kind: "pro",
    period: "month",
    price: "R$ 12,90",
    monthly: null,
    saves: null,
  },
  {
    id: "broto_pro_annual",
    kind: "pro",
    period: "year",
    price: "R$ 119,90",
    monthly: "R$ 9,99",
    saves: "R$ 34,90",
  },
  {
    id: "broto_chat_monthly",
    kind: "chat",
    period: "month",
    price: "R$ 4,90",
    monthly: null,
    saves: null,
  },
  {
    id: "broto_chat_annual",
    kind: "chat",
    period: "year",
    price: "R$ 49,90",
    monthly: "R$ 4,16",
    saves: "R$ 8,90",
  },
  {
    id: "broto_analysis_single",
    kind: "single",
    period: "once",
    price: "R$ 1,90",
    monthly: null,
    saves: null,
  },
];

export const SINGLE_ANALYSIS = CATALOG.find(
  (product) => product.kind === "single",
)!;

export const purchasesAvailable = false;

export async function loadProducts(): Promise<Product[]> {
  return CATALOG;
}

export async function purchaseProduct(_id: ProductId): Promise<void> {
  throw new Error("purchases_unavailable");
}

export async function restorePurchases(): Promise<void> {
  throw new Error("purchases_unavailable");
}
