import { z } from "zod";
import { inrToPaise, MAX_ENTRY_INR } from "@/lib/inr";

export const EXPENSE_CATEGORIES = [
  "food",
  "transport",
  "entertainment",
  "essentials",
  "education",
  "health",
  "other",
] as const;

export const INCOME_CATEGORIES = [
  "pocket_money",
  "gift",
  "part_time",
  "other",
] as const;

const isoDate = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Use a valid date (YYYY-MM-DD).");

export const createBudgetEntryBodySchema = z
  .object({
    entryType: z.enum(["expense", "income"]),
    amountInr: z.number().positive().max(MAX_ENTRY_INR),
    category: z.string().min(1).max(40),
    note: z.string().max(500).optional().default(""),
    occurredOn: isoDate,
  })
  .superRefine((data, ctx) => {
    if (data.entryType === "expense") {
      if (!EXPENSE_CATEGORIES.includes(data.category as (typeof EXPENSE_CATEGORIES)[number])) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Invalid expense category.`,
          path: ["category"],
        });
      }
    } else {
      if (!INCOME_CATEGORIES.includes(data.category as (typeof INCOME_CATEGORIES)[number])) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Invalid income category.`,
          path: ["category"],
        });
      }
    }
  });

export type CreateBudgetEntryBody = z.infer<typeof createBudgetEntryBodySchema>;

export function bodyToAmountPaise(body: CreateBudgetEntryBody): number {
  return inrToPaise(body.amountInr);
}

export const listBudgetQuerySchema = z
  .object({
    from: isoDate,
    to: isoDate,
  })
  .refine((d) => d.from <= d.to, { message: "`from` must be on or before `to`." });
