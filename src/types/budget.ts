export type BudgetEntryType = "expense" | "income";

/** Expense categories  -  keep in sync with budget-schema + UI */
export type ExpenseCategory =
  | "food"
  | "transport"
  | "entertainment"
  | "essentials"
  | "education"
  | "health"
  | "other";

export type IncomeCategory = "pocket_money" | "gift" | "part_time" | "other";

export type BudgetCategory = ExpenseCategory | IncomeCategory;

export type BudgetEntryRow = {
  id: string;
  user_id: string;
  entry_type: BudgetEntryType;
  amount_paise: number;
  category: string;
  note: string;
  occurred_on: string;
  created_at: string;
};

export type BudgetSummary = {
  totalIncomePaise: number;
  totalExpensePaise: number;
  netPaise: number;
  expenseByCategoryPaise: Record<string, number>;
  /** Daily net (income - expense) for occurred_on in range */
  dailyNetPaise: { date: string; netPaise: number }[];
};
