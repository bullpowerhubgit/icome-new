
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
} from 'lucide-react';
import { Agent, TabId } from './types';

export const NAV_ITEMS = [
  { id: 'dashboard' as TabId, label: 'Dashboard', icon: <BarChart3 size={20} />, color: 'blue' },
  { id: 'agents' as TabId, label: 'Agent Center', icon: <Bot size={20} />, color: 'purple' },
  { id: 'youtube' as TabId, label: 'YouTube Studio', icon: <Youtube size={20} />, color: 'red' },
  { id: 'chat' as TabId, label: 'AI Assistant', icon: <MessageSquare size={20} />, color: 'pink' },
  { id: 'code' as TabId, label: 'Agent Lab', icon: <Code size={20} />, color: 'emerald' },
  { id: 'media' as TabId, label: 'Media Studio', icon: <ImageIcon size={20} />, color: 'cyan' },
  { id: 'live' as TabId, label: 'Live Comms', icon: <Mic size={20} />, color: 'orange' },
  { id: 'github' as TabId, label: 'Source Control', icon: <Github size={20} />, color: 'slate' },
  { id: 'analytics' as TabId, label: 'Analytics', icon: <Activity size={20} />, color: 'amber' },
  { id: 'settings' as TabId, label: 'Settings', icon: <Settings size={20} />, color: 'slate' },
];

export const INITIAL_AGENTS: Agent[] = [
  {
    id: 'agent-y1',
    name: 'YouTube Pilot',
    category: 'Content Automation',
    status: 'idle',
    dailyEarnings: 55.20,
    totalEarnings: 3120.40,
    uptime: 99.1,
    description: 'Autonomous channel manager that scripts, produces, and optimizes faceless high-retention videos.',
    icon: 'Youtube',
    config: { niche: 'Sci-Fi Documentaries', targetViews: 10000 }
  },
  {
    id: 'agent-1',
    name: 'Arbitrage Oracle',
    category: 'DeFi Trading',
    status: 'idle',
    dailyEarnings: 42.50,
    totalEarnings: 1240.80,
    uptime: 99.9,
    description: 'Scans decentralized exchanges for price discrepancies and executes flash-loan arbitrage trades.',
    icon: 'Zap',
    config: { exchange: 'Uniswap/Sushiswap', threshold: 0.5 }
  },
  {
    id: 'agent-2',
    name: 'SEO Content Weaver',
    category: 'Affiliate Marketing',
    status: 'idle',
    dailyEarnings: 12.80,
    totalEarnings: 450.20,
    uptime: 98.4,
    description: 'Generates high-ranking product reviews and informative articles for niche affiliate blogs.',
    icon: 'FileText',
    config: { niche: 'Eco-Friendly Tech', frequency: 'Daily' }
  }
];
