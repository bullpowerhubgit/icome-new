import React from 'react';
import { 
  BarChart3, 
  Zap, 
  Bot, 
  Code, 
  MessageSquare, 
  Settings,
  Activity,
  Image as ImageIcon,
  Mic,
  Github,
  Youtube,
  Store,
  Shirt,
  Wallet,
  ShieldCheck,
  Search,
  HardDrive,
  BookOpen
} from 'lucide-react';
import { Agent, TabId } from './types';

export const NAV_ITEMS = [
  { id: 'dashboard' as TabId, label: 'Control Center', icon: <BarChart3 size={18} />, color: 'blue' },
  { id: 'agents' as TabId, label: 'Agent Fleet', icon: <Bot size={18} />, color: 'purple' },
  { id: 'wallet' as TabId, label: 'Payout Hub', icon: <Wallet size={18} />, color: 'emerald' },
  { id: 'marketplace' as TabId, label: 'Omni-Merchant', icon: <Store size={18} />, color: 'pink' },
  { id: 'ebook' as TabId, label: 'EBook Pilot', icon: <BookOpen size={18} />, color: 'amber' },
  { id: 'printify' as TabId, label: 'POD Logic', icon: <Shirt size={18} />, color: 'blue' },
  { id: 'youtube' as TabId, label: 'YT Pilot', icon: <Youtube size={18} />, color: 'red' },
  { id: 'arbitrage' as TabId, label: 'Arbitrage Bot', icon: <Search size={18} />, color: 'cyan' },
  { id: 'analytics' as TabId, label: 'Intelligence', icon: <Activity size={18} />, color: 'amber' },
  { id: 'compliance' as TabId, label: 'Legal/Tax', icon: <ShieldCheck size={18} />, color: 'slate' },
  { id: 'diagnostics' as TabId, label: 'System Check', icon: <HardDrive size={18} />, color: 'emerald' },
  { id: 'settings' as TabId, label: 'Nexus Config', icon: <Settings size={18} />, color: 'slate' },
];

export const INITIAL_AGENTS: Agent[] = [
  {
    id: 'agent-arb-1',
    name: 'Arbitrage Scanner',
    category: 'Market Inefficiency',
    status: 'idle',
    dailyEarnings: 45.20,
    totalEarnings: 820.50,
    uptime: 99.9,
    description: 'Scans major retailers for price discrepancies and auto-posts flipping opportunities to Discord/Telegram.',
    icon: 'Search',
    config: { markets: ['Amazon', 'eBay', 'StockX'] }
  },
  {
    id: 'agent-p1',
    name: 'POD Orchestrator',
    category: 'Logistics',
    status: 'idle',
    dailyEarnings: 112.50,
    totalEarnings: 5210.20,
    uptime: 99.7,
    description: 'Autonomous apparel designer and Printify manager.',
    icon: 'Shirt',
    config: { blueprints: ['T-Shirts', 'Hoodies'], margin_target: 40 }
  }
];
