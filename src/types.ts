export interface DbHealth {
  status: 'ok' | 'error' | 'loading';
  latencyMs?: number;
  database?: string;
  version?: string;
  host?: string;
  message?: string;
}

export interface TableCounts {
  api_usage_logs: number;
  users: number;
  chat_sessions: number;
  messages: number;
  ai_interaction_logs: number;
  auth_logs: number;
  snowusers: number;
}

export interface ApiUsageLog {
  usage_id: string;
  user_id: string;
  session_id: string | null;
  tier_applied: string;
  model_or_endpoint: string;
  request_type: string | null;
  standard_cost: string | number;
  actual_cost: string | number;
  savings_amount: string | number;
  created_at: string;
  username?: string;
  email?: string;
  user_subscription?: string;
  session_title?: string;
}

export interface UsageMetrics {
  total_calls: number;
  total_standard_cost: string;
  total_actual_cost: string;
  total_savings: string;
  avg_actual_cost: string;
  avg_savings: string;
}

export interface TierAggregate {
  tier_applied: string;
  count: number;
  total_standard: string;
  total_actual: string;
  total_savings: string;
}

export interface ModelAggregate {
  model_or_endpoint: string;
  count: number;
  total_actual: string;
  total_savings: string;
  avg_cost: string;
}

export interface RequestTypeAggregate {
  request_type: string;
  count: number;
  total_actual: string;
  total_savings: string;
}

export interface TimelinePoint {
  date: string;
  count: number;
  standard_cost: string;
  actual_cost: string;
  savings: string;
}

export interface UsageSummaryData {
  metrics: UsageMetrics;
  byTier: TierAggregate[];
  byModel: ModelAggregate[];
  byType: RequestTypeAggregate[];
  timeline: TimelinePoint[];
}

export interface UserItem {
  user_id: string;
  username: string;
  email: string | null;
  status: string | null;
  subscription: string;
  license_key: string | null;
  created_at: string;
  Comments: string | null;
  snow_username?: string | null;
  snow_instance?: string | null;
  total_sessions: number;
  total_api_calls: number;
  total_spent: string;
  total_saved: string;
}

export interface ChatSessionItem {
  session_id: string;
  user_id: string;
  title: string;
  model_used: string | null;
  created_at: string;
  updated_at: string;
  username?: string;
  email?: string;
  message_count: number;
  total_prompt_tokens: number;
  total_completion_tokens: number;
  api_logs_count: number;
}

export interface SessionMessage {
  message_id: string;
  session_id: string;
  role: string;
  content: string;
  prompt_tokens: number | null;
  completion_tokens: number | null;
  created_at: string;
  latency_ms?: number | null;
  user_feedback?: string | null;
  error_code?: string | null;
}

export interface InteractionStats {
  total_interactions: number;
  avg_latency_ms: number;
  min_latency_ms: number;
  max_latency_ms: number;
  thumbs_up: number;
  thumbs_down: number;
  feedback_none: number;
  errors_count: number;
}

export interface InteractionRecentItem {
  log_id: string;
  message_id: string;
  latency_ms: number | null;
  user_feedback: string | null;
  error_code: string | null;
  role?: string;
  prompt_tokens?: number | null;
  completion_tokens?: number | null;
  created_at?: string;
  session_title?: string;
}

export interface AuthLogItem {
  log_id: string;
  user_id: string;
  timestamp: string;
  ip_address: string | null;
  status: string;
  username?: string;
  email?: string;
}

export interface TableColumn {
  column_name: string;
  data_type: string;
  character_maximum_length: number | null;
  column_default: string | null;
  is_nullable: string;
  is_generated: string;
  generation_expression: string | null;
}

export interface TableConstraint {
  constraint_name: string;
  constraint_type: string;
  column_name: string;
  foreign_table_name?: string | null;
  foreign_column_name?: string | null;
}

export interface TableIndex {
  indexname: string;
  indexdef: string;
}

export interface TableSchemaDetail {
  columns: TableColumn[];
  constraints: TableConstraint[];
  indexes: TableIndex[];
}

export interface LicenseDistributionItem {
  license: string;
  userCount: number;
  activeCount: number;
  loggedInCount: number;
  assignedKeys: number;
  totalApiCalls: number;
  totalSaved: number;
  totalSpent: number;
  isChargeable: boolean;
  tierMapping: string;
}

export interface UsersSummaryData {
  totalUsers: number;
  loggedInUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  totalLicensePoolKeys?: number;
  assignedLicensePoolKeys?: number;
  availableLicensePoolKeys?: number;
  licenseDistribution: LicenseDistributionItem[];
}

export interface TierDetailItem {
  name: string;
  calls: number;
  isChargeable: boolean;
  costToCustomer: number;
  standardCost?: number;
  standardGptCost?: number;
  totalSaved: number;
  ratePerCall?: number;
  gptBenchmarkRate?: number;
  description: string;
}

export interface TierEconomicsData {
  tier1: TierDetailItem;
  tier2: TierDetailItem;
  tier3: TierDetailItem;
  overall: {
    totalCalls: number;
    freeCallsCount: number;
    freeCallsPercent: number;
    chargeableCallsCount: number;
    totalRealSavings: number;
    totalChargedToCustomers: number;
    commercialEquivalentSpend: number;
    netSavingsRate: number;
  };
}

export interface LlmCompetitorItem {
  provider: string;
  model: string;
  ratePerCall: number;
  totalCost: number;
  savingsVsProvider: number;
  savingsPercent: number;
  isOurApp?: boolean;
  badgeColor: string;
}

export interface McKinseyAnalyticsData {
  usersSummary: UsersSummaryData;
  tierEconomics: TierEconomicsData;
  llmComparison: LlmCompetitorItem[];
}

export interface TrendingUserRequestItem {
  rank: number;
  id: string;
  query: string;
  category: string;
  count: number;
  percentageShare: number;
  primaryModel: string;
  tier: string;
  isFreeTier: boolean;
  avgTokens: number;
  avgLatencyMs: number;
  totalSaved: number;
  actualCost: number;
  velocityTrend: string;
  growthPercent: number;
  isHot?: boolean;
  department: string;
  lastRequestedAt?: string;
  apiMethod?: string;
  indicator?: string;
  sampleFilter?: string;
  sampleOutputColumn?: string;
}

export interface TrendingRequestsData {
  top10: TrendingUserRequestItem[];
  totalTrendingCalls: number;
  totalCatalogQueries: number;
  topCategory: string;
  avgTokensAcrossTop10: number;
  highestVolumeRequest: string;
  totalSavingsFromTop10: number;
  lastUpdated: string;
}
