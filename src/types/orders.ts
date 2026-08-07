// ── Order intake wizard admin config ──────────────────
// Stored as JSON in `site_settings` under the `orders_config` key. Drives the
// public multi-step order wizard: package options, website types, feature
// add-ons, design styles, page-count increments, budgets and timelines.
// The public site validates this payload and falls back to defaults when the
// database is unavailable or an older/invalid value is encountered.

export interface OrdersSectionContent {
  badgeBn: string;
  badgeEn: string;
  titleBn: string;
  titleEn: string;
  subtitleBn: string;
  subtitleEn: string;
}

export interface OrdersOption {
  id: string;
  value: string;
  labelBn: string;
  labelEn: string;
  visible: boolean;
}

export interface OrdersFeatureAddon {
  id: string;
  value: string;
  labelBn: string;
  labelEn: string;
  visible: boolean;
}

export interface OrdersDesignStyle {
  id: string;
  value: string;
  labelBn: string;
  labelEn: string;
  descriptionBn: string;
  descriptionEn: string;
  visible: boolean;
}

export interface OrdersBudgetRange {
  id: string;
  value: string;
  label: string;
  visible: boolean;
}

export interface OrdersStepLabels {
  packageBn: string;
  packageEn: string;
  designBn: string;
  designEn: string;
  detailsBn: string;
  detailsEn: string;
  contactBn: string;
  contactEn: string;
  reviewBn: string;
  reviewEn: string;
}

export interface OrdersCta {
  nextBn: string;
  nextEn: string;
  backBn: string;
  backEn: string;
  submitBn: string;
  submitEn: string;
  submittingBn: string;
  submittingEn: string;
  successTitleBn: string;
  successTitleEn: string;
  successMessageBn: string;
  successMessageEn: string;
}

export interface OrdersConfig {
  visible: boolean;
  section: OrdersSectionContent;
  steps: OrdersStepLabels;
  packages: OrdersOption[];
  websiteTypes: OrdersOption[];
  featureAddons: OrdersFeatureAddon[];
  designStyles: OrdersDesignStyle[];
  pageIncrements: number[];
  budgetRanges: OrdersBudgetRange[];
  timelineOptions: OrdersOption[];
  cta: OrdersCta;
}

// ── Order admin pipeline (operates on the `orders` table) ──

export type OrderKanbanStage =
  | "new_lead"
  | "under_review"
  | "in_progress"
  | "client_feedback"
  | "completed"
  | "archived";

export type OrderPaymentStatus =
  | "unpaid"
  | "pending_advance"
  | "fifty_percent"
  | "fully_settled"
  | "refunded";

export type OrderPaymentMethod = "bkash" | "nagad" | "bank_transfer" | "sslcommerz" | "other";

export interface OrderProjectLinks {
  repo?: string;
  staging?: string;
  figma?: string;
  live?: string;
}

export interface OrderPaymentMilestone {
  id: string;
  labelBn: string;
  labelEn: string;
  /** 0–100 percent of total, or a fixed amount. */
  amount: number;
  paid: boolean;
  paidAt?: string;
  method?: OrderPaymentMethod;
  reference?: string;
}

export interface OrderPayment {
  status: OrderPaymentStatus;
  method?: OrderPaymentMethod;
  advanceAmount?: number;
  totalAmount?: number;
  currency?: string;
  milestones?: OrderPaymentMilestone[];
}

export interface OrderCommunicationEntry {
  id: string;
  date: string;
  authorBn: string;
  authorEn: string;
  messageBn: string;
  messageEn: string;
}

/** Extended admin-only fields merged onto an order row. */
export interface OrderAdminFields {
  admin_notes?: string | null;
  project_links?: OrderProjectLinks | null;
  payment?: OrderPayment | null;
  communication_log?: OrderCommunicationEntry[] | null;
}

export const ORDER_KANBAN_STAGES: OrderKanbanStage[] = [
  "new_lead",
  "under_review",
  "in_progress",
  "client_feedback",
  "completed",
  "archived",
];

export const ORDER_PAYMENT_STATUSES: OrderPaymentStatus[] = [
  "unpaid",
  "pending_advance",
  "fifty_percent",
  "fully_settled",
  "refunded",
];

export const ORDER_PAYMENT_METHODS: OrderPaymentMethod[] = [
  "bkash",
  "nagad",
  "bank_transfer",
  "sslcommerz",
  "other",
];

/** Maps legacy order status values onto the canonical Kanban stages. */
export function normalizeStage(status: string | null | undefined): OrderKanbanStage {
  switch (status) {
    case "pending":
    case "new_lead":
      return "new_lead";
    case "review":
    case "under_review":
      return "under_review";
    case "in_progress":
      return "in_progress";
    case "client_feedback":
      return "client_feedback";
    case "completed":
      return "completed";
    case "cancelled":
    case "archived":
      return "archived";
    default:
      return "new_lead";
  }
}
