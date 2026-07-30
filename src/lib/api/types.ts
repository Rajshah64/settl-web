export type GroupRole = "OWNER" | "ADMIN" | "MEMBER";

export interface AuthUser {
  id: number;
  email: string;
}

export interface UserProfile {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserSummary {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

export interface GroupMember {
  id: number;
  role: GroupRole;
  joinedAt: string;
  user: UserSummary;
}

export interface Group {
  id: number;
  name: string;
  description: string | null;
  inviteCode: string;
  inviteCodeExpiresAt: string | null;
  createdAt: string;
  updatedAt: string;
  creator?: UserSummary;
  members?: GroupMember[];
}

export interface ExpenseShare {
  id: number;
  amountPaise: string;
  user: UserSummary;
}

export interface Expense {
  id: number;
  description: string;
  amountPaise: string;
  currency: string;
  spentAt: string;
  createdAt: string;
  updatedAt: string;
  paidBy: UserSummary;
  shares: ExpenseShare[];
  group?: Group;
}

export interface Paginated<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface AuthTokenResponse {
  accessToken: string;
}

export interface ApiErrorBody {
  statusCode?: number;
  message?: string | string[];
  error?: string;
}

export interface NetBalance {
  user: UserSummary;
  netPaise: number;
}

export interface SuggestedSettlement {
  from: UserSummary;
  to: UserSummary;
  amountPaise: number;
}

export interface GroupBalances {
  balances: NetBalance[];
  settlements: SuggestedSettlement[];
}
