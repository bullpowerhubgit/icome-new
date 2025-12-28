export type TabId = 'dashboard' | 'agents' | 'marketplace' | 'printify' | 'youtube' | 'ebook' | 'arbitrage' | 'wallet' | 'chat' | 'code' | 'analytics' | 'compliance' | 'settings' | 'diagnostics' | 'media' | 'live';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  files?: Array<{ data: string; mimeType: string }>;
}

export interface Agent {
  id: string;
  name: string;
  category: string;
  status: 'idle' | 'running' | 'error';
  dailyEarnings: number;
  totalEarnings: number;
  description: string;
  uptime: number;
  config: Record<string, any>;
  icon: string;
}

export interface LogEntry {
  id: string;
  agentId: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: string;
}

export interface SystemStats {
  cpu: number;
  memory: number;
  network: number;
  uptime: string;
}

export interface Transaction {
  id: string;
  source: string;
  amount: number;
  status: 'pending' | 'cleared' | 'payout';
  timestamp: string;
}
