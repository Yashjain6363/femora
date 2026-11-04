import type { ExpenseCategory, IncomeCategory } from "@/types/budget";

export const EXPENSE_CATEGORY_LABELS: Record<ExpenseCategory, string> = {
  food: "Food & drinks",
  transport: "Travel & commute",
  entertainment: "Entertainment",
  essentials: "Essentials & supplies",
  education: "Education",
  health: "Health",
  other: "Other",
};

export const INCOME_CATEGORY_LABELS: Record<IncomeCategory, string> = {
  pocket_money: "Pocket money / allowance",
  gift: "Gift",
  part_time: "Part-time / gig",
  other: "Other income",
};
