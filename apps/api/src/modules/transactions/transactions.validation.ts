import { z } from "zod";

export const TRANSACTION_ACTIONS = [
  "p2p.create_requisition",
  "p2p.approve",
  "p2p.create_po",
  "p2p.goods_receipt",
  "p2p.post_invoice",
  "o2c.create_sales_order",
  "o2c.check_availability",
  "o2c.deliver",
  "o2c.bill",
  "inv.transfer",
  "inv.count_adjust",
  "fin.clear_open_item",
] as const;

export type TransactionAction = (typeof TRANSACTION_ACTIONS)[number];

export const TransactionActionRequestSchema = z.object({
  action: z.enum(TRANSACTION_ACTIONS),
  payload: z.record(z.unknown()),
});

export type TransactionActionRequest = z.infer<typeof TransactionActionRequestSchema>;
