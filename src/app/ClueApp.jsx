import { useState, useEffect } from 'react';

// ===== API CONFIG =====
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://clue-backend-production.up.railway.app';

const getToken = () => typeof window !== 'undefined' ? localStorage.getItem('clue_token') : null;

const apiFetch = async (path, options = {}) => {
  const token = getToken();
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw Object.assign(new Error(err?.error?.message || res.statusText), { status: res.status });
  }
  return res.json();
};

// ===== BRAND COLORS =====
const CORAL = '#FF6347';
const CREAM = '#F5F5DC';
const DARK = '#1a1a1a';
const GREEN = '#2E8B57';
const PURPLE = '#8B5CF6';
const CYAN = '#00CED1';
const GOLD = '#FFD700';

// ===== CARD COLOR SYSTEM =====
// All cards need strong contrast against CREAM (#F5F5DC) background
// Each card type gets a distinct color that's visually balanced
const CARD_COLORS = {
  network: { bg: GREEN, text: '#fff', dark: false },      // Green - network/social
  quote: { bg: CORAL, text: '#fff', dark: false },        // Coral - quotes/wisdom  
  tip: { bg: '#2D3748', text: '#fff', dark: false },      // Dark slate - tips/tactics
  stat: { bg: CYAN, text: '#fff', dark: false },          // Cyan - data/stats
  insight: { bg: PURPLE, text: '#fff', dark: false },     // Purple - AI insights
  trending: { bg: DARK, text: '#fff', dark: false },      // Black - trending/hot
};

// ===== API CLUE NORMALIZER =====
const normalizeClue = (apiClue) => {
  const type = apiClue.type || 'network';
  return {
    id: apiClue.id,
    type,
    color: CARD_COLORS[type]?.bg || CARD_COLORS.network.bg,
    textColor: CARD_COLORS[type]?.text || '#fff',
    badge: apiClue.badge || '🔍 clue',
    title: apiClue.title || '',
    subtitle: apiClue.subtitle || '',
    quote: apiClue.quote || '',
    author: apiClue.author || '',
    stat: apiClue.stat || '',
    statLabel: apiClue.stat_label || '',
    detail: apiClue.detail || apiClue.content || '',
    handles: apiClue.handles || [],
    platform: apiClue.platform || 'x',
    sourceType: apiClue.source_type || 'curated',
    readTime: apiClue.read_time || '30 sec',
    timeAgo: apiClue.time_ago || 'today',
    sources: apiClue.sources || [],
    prompts: apiClue.prompts || [],
    topic: apiClue.topic || 'General',
    saves: apiClue.saves || 0,
    shares: apiClue.shares || 0,
  };
};

// ===== CLUE LOGO COMPONENT =====
const Logo = ({ size = 24, color = DARK, style = {} }) => {
  const grid = [[1,1,1,1,1],[1,1,1,1,1],[1,1,0,1,1],[1,1,1,1,1],[1,1,1,1,0]];
  const d = size / 7;
  return (
    <div style={{ display: 'inline-grid', gridTemplateColumns: `repeat(5, ${d}px)`, gap: size/12, verticalAlign: 'middle', ...style }}>
      {grid.flat().map((show, i) => <div key={i} style={{ width: d, height: d, borderRadius: '50%', background: show ? color : 'transparent' }} />)}
    </div>
  );
};

// ===== ELEGANT ICON SYSTEM =====
const Icon = ({ name, size = 20, color = DARK, strokeWidth = 1.5 }) => {
  const icons = {
    // Navigation & Actions
    streak: (
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
    ),
    brain: (
      <g fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a4 4 0 0 1 4 4c0 1.1-.5 2-1 2.6.6.5 1 1.4 1 2.4a3 3 0 0 1-3 3h-2v5"/>
        <path d="M8 21v-5H6a3 3 0 0 1-3-3c0-1 .4-1.9 1-2.4-.5-.6-1-1.5-1-2.6a4 4 0 0 1 4-4"/>
        <path d="M12 2c1.5 0 2.5.5 3.5 1.5M12 2c-1.5 0-2.5.5-3.5 1.5"/>
      </g>
    ),
    settings: (
      <g fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3"/>
        <path d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72 1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
      </g>
    ),
    lock: (
      <g fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2"/>
        <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
      </g>
    ),
    share: (
      <g fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="18" cy="5" r="3"/>
        <circle cx="6" cy="12" r="3"/>
        <circle cx="18" cy="19" r="3"/>
        <path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98"/>
      </g>
    ),
    bookmark: (
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
    ),
    bookmarkFilled: (
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" fill={color} stroke={color} strokeWidth={strokeWidth}/>
    ),
    check: (
      <path d="M20 6L9 17l-5-5" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
    ),
    x: (
      <g fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 6L6 18M6 6l12 12"/>
      </g>
    ),
    chevronRight: (
      <path d="M9 18l6-6-6-6" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
    ),
    chevronLeft: (
      <path d="M15 18l-6-6 6-6" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
    ),
    arrowRight: (
      <g fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12h14M12 5l7 7-7 7"/>
      </g>
    ),
    // Content Types
    users: (
      <g fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
      </g>
    ),
    quote: (
      <g fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V21z"/>
        <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v4z"/>
      </g>
    ),
    chart: (
      <g fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 20V10M12 20V4M6 20v-6"/>
      </g>
    ),
    lightbulb: (
      <g fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 18h6M10 22h4"/>
        <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14"/>
      </g>
    ),
    fire: (
      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
    ),
    trophy: (
      <g fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/>
        <path d="M4 22h16M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/>
        <path d="M18 2H6v7a6 6 0 0 0 12 0V2z"/>
      </g>
    ),
    shield: (
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
    ),
    // App specific
    library: (
      <g fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
      </g>
    ),
    learn: (
      <g fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
        <path d="M12 17h.01"/>
      </g>
    ),
    refresh: (
      <g fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
        <path d="M23 4v6h-6M1 20v-6h6"/>
        <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
      </g>
    ),
    clock: (
      <g fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <path d="M12 6v6l4 2"/>
      </g>
    ),
    trash: (
      <g fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
      </g>
    ),
    link: (
      <g fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
      </g>
    ),
    external: (
      <g fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
        <path d="M15 3h6v6M10 14L21 3"/>
      </g>
    ),
    star: (
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
    ),
    starFilled: (
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill={color} stroke={color} strokeWidth={strokeWidth}/>
    ),
    target: (
      <g fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <circle cx="12" cy="12" r="6"/>
        <circle cx="12" cy="12" r="2"/>
      </g>
    ),
    sun: (
      <g fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="5"/>
        <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
      </g>
    ),
    briefcase: (
      <g fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2"/>
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
      </g>
    ),
  };
  
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
      {icons[name]}
    </svg>
  );
};

// ===== CONFIG =====
const PROFESSIONS = [
  { id: 'marketing', emoji: '📣', icon: '📣', label: 'Marketing' },
  { id: 'product', emoji: '🎯', icon: '🎯', label: 'Product' },
  { id: 'sales', emoji: '💰', icon: '💰', label: 'Sales' },
  { id: 'founder', emoji: '🚀', icon: '🚀', label: 'Founder' },
  { id: 'design', emoji: '🎨', icon: '🎨', label: 'Design' },
  { id: 'engineering', emoji: '💻', icon: '💻', label: 'Engineering' },
];

const GOALS = [
  { id: 'ahead', emoji: '🎯', icon: 'target', label: 'Stay ahead at work' },
  { id: 'scroll', emoji: '🧠', icon: 'brain', label: 'Stop doom-scrolling' },
  { id: 'ideas', emoji: '💡', icon: 'lightbulb', label: 'Find ideas early' },
  { id: 'network', emoji: '🤝', icon: 'users', label: 'Know my network' },
];

const STREAK_REWARDS = [
  { days: 3, badge: '🔥', title: 'getting warm', perk: 'streak started!' },
  { days: 7, badge: '⚡', title: 'on fire', perk: '+1 streak shield' },
  { days: 14, badge: '💎', title: 'diamond hands', perk: 'priority clues' },
  { days: 30, badge: '🏆', title: 'clue master', perk: 'deep dives' },
  { days: 60, badge: '👑', title: 'legendary', perk: 'founder access' },
];

const ACHIEVEMENTS = [
  { id: 'nightowl', badge: '🦉', title: 'night owl', unlocked: false },
  { id: 'perfectweek', badge: '✨', title: 'perfect week', unlocked: false },
  { id: 'social', badge: '🦋', title: 'social butterfly', unlocked: true },
  { id: 'curious', badge: '🔬', title: 'curious mind', unlocked: false },
];

// ===== PRICING =====
const PRICING = {
  monthly: { price: 5, label: '$5/month', period: 'month' },
  annual: { price: 50, label: '$50/year', period: 'year', savings: 10 },
  trial: { days: 7, label: '7-day free trial' },
};

// ===== SOURCE TYPES =====
const SOURCE_TYPES = {
  xLive: { label: '𝕏 live', icon: '𝕏', color: DARK, pro: true, desc: 'Real-time from your X network' },
  topic: { label: 'topic', icon: '🏷️', color: PURPLE, pro: false, desc: 'Public content by keyword' },
  imported: { label: 'imported', icon: '📋', color: GREEN, pro: false, desc: 'Content you shared with Clue' },
  curated: { label: 'curated', icon: '✨', color: CORAL, pro: false, desc: 'Hand-picked by Clue editors' },
};

// ===== TOPICS (for free tier) =====
const AVAILABLE_TOPICS = [
  { id: 'ai-agents', label: 'AI Agents', emoji: '🤖' },
  { id: 'startups', label: 'Startups', emoji: '🚀' },
  { id: 'product', label: 'Product', emoji: '🎯' },
  { id: 'engineering', label: 'Engineering', emoji: '💻' },
  { id: 'marketing', label: 'Marketing', emoji: '📣' },
  { id: 'design', label: 'Design', emoji: '🎨' },
  { id: 'leadership', label: 'Leadership', emoji: '👔' },
  { id: 'fundraising', label: 'Fundraising', emoji: '💰' },
];

// ===== PLG DATA =====
const LEADERBOARD = [
  { rank: 1, name: 'Sarah K.', avatar: '👩‍💼', streak: 34, source: 'linkedin', isConnection: true },
  { rank: 2, name: 'Mike R.', avatar: '👨‍💻', streak: 28, source: 'twitter', isConnection: false },
  { rank: 3, name: 'Alex T.', avatar: '👩‍🎨', streak: 21, source: 'linkedin', isConnection: true },
  { rank: 4, name: 'You', avatar: '🎯', streak: 6, source: 'you', isConnection: false, isYou: true },
  { rank: 5, name: 'Jordan L.', avatar: '👨‍🔬', streak: 5, source: 'twitter', isConnection: true },
  { rank: 6, name: 'Casey M.', avatar: '👩‍💻', streak: 4, source: 'linkedin', isConnection: false },
];

const REFERRAL_ACTIVITY = [
  { name: 'Sarah', source: 'LinkedIn', event: 'hit 7-day streak', timeAgo: '2 hours ago', emoji: '⚡' },
  { name: 'Marcus', source: 'Twitter', event: 'just joined Clue', timeAgo: '5 hours ago', emoji: '🎉' },
  { name: 'Priya', source: 'LinkedIn', event: 'saved 10 clues', timeAgo: '1 day ago', emoji: '📚' },
];

const SOCIAL_PROOF = {
  totalUsers: 12847,
  cluesSavedToday: 8429,
  topLearnerPercent: 15,
};

const DAILY_CARDS = [
  { id: 1, type: 'network', color: CARD_COLORS.network.bg, textColor: CARD_COLORS.network.text, badge: '👥 your network', title: 'OpenClaw is taking over', subtitle: '18 people you follow are talking about this', handles: ['@steipete', '@levelsio', '@nateliason'], platform: 'x', sourceType: 'xLive', readTime: '45 sec', timeAgo: '2 hours ago', detail: 'The viral AI agent went from 1K to 21K instances in a week. It runs locally, connects to WhatsApp/Telegram, and actually does things - clears inbox, manages calendar, checks you in for flights. Peter Steinberger built the prototype in an hour.', sources: [{handle: '@steipete', note: 'creator, joined OpenAI', platform: 'x'}, {handle: '@levelsio', note: 'running it for PhotoAI', platform: 'x'}, {handle: '@nateliason', note: 'made $14K with his bot', platform: 'x'}], prompts: ['What can OpenClaw do?', 'Is OpenClaw safe to use?'], topic: 'AI Agents', saves: 4829, shares: 1247 },
  { id: 2, type: 'quote', color: CARD_COLORS.quote.bg, textColor: CARD_COLORS.quote.text, badge: '💬 quote', quote: 'When you experience OpenClaw it gives the same kick as when we first saw ChatGPT. A fundamental shift is happening.', author: '@abhi__katiyar', platform: 'x', sourceType: 'xLive', readTime: '20 sec', timeAgo: '3 hours ago', detail: 'The sentiment across tech Twitter - OpenClaw represents the "aha moment" for agentic AI, where AI stops just answering and starts actually doing.', prompts: ['Why is OpenClaw different?', 'Best agentic AI tools?'], topic: 'AI Agents', saves: 2341, shares: 892 },
  { id: 3, type: 'stat', color: CARD_COLORS.stat.bg, textColor: CARD_COLORS.stat.text, badge: '📊 data', stat: '200K+', title: 'GitHub stars for OpenClaw', source: 'GitHub', platform: 'x', sourceType: 'topic', readTime: '25 sec', timeAgo: '4 hours ago', detail: 'One of the fastest-growing repos in GitHub history. The project caused a Mac mini shortage in several US stores as people rushed to set up their own AI agents.', prompts: ['How to set up OpenClaw?', 'OpenClaw alternatives?'], topic: 'AI Agents', saves: 1876, shares: 543 },
  { id: 4, type: 'tip', color: CARD_COLORS.tip.bg, textColor: CARD_COLORS.tip.text, badge: '⚠️ warning', title: 'OpenClaw security risks are real', stat: '386', statLabel: 'malicious skills found', platform: 'x', sourceType: 'curated', readTime: '40 sec', timeAgo: '5 hours ago', detail: 'Kaspersky, Trend Micro, and Gartner all flagged critical vulnerabilities. Prompt injection attacks, data exfiltration, misconfigured instances exposing private data. Only use if you understand the risks.', prompts: ['OpenClaw security guide?', 'Safe agentic AI alternatives?'], topic: 'Security', saves: 3102, shares: 1834 },
  { id: 5, type: 'network', color: CARD_COLORS.trending.bg, textColor: '#fff', badge: '🔥 trending', title: 'Moltbook: Reddit for AI agents', subtitle: 'Your network is debating this', handles: ['@mattschlicht', '@swyx', '@karpathy'], platform: 'x', sourceType: 'xLive', readTime: '35 sec', timeAgo: '6 hours ago', detail: 'The "front page of the agent internet" launched alongside OpenClaw. AI agents post, respond, and interact at scale. Already showing toxic behaviors and anti-human rhetoric. Wild times.', sources: [{handle: '@mattschlicht', note: 'launched Moltbook', platform: 'x'}, {handle: '@swyx', note: 'called it "AI 4chan"', platform: 'x'}], prompts: ['What is Moltbook?', 'AI agent social networks?'], topic: 'AI Agents', saves: 2654, shares: 1102 },
  { id: 6, type: 'quote', color: CARD_COLORS.quote.bg, textColor: CARD_COLORS.quote.text, badge: '💬 wisdom', quote: 'The best founders right now are mass-applying AI to unsexy industries. Logistics, insurance, compliance. That\'s where the alpha is.', author: '@garrytan', platform: 'x', sourceType: 'xLive', readTime: '20 sec', timeAgo: '7 hours ago', detail: 'Garry argues that while everyone chases AI wrappers, the real opportunity is applying AI to industries with high labor costs and repetitive workflows.', prompts: ['AI opportunities in logistics?', 'Unsexy AI startup ideas?'], topic: 'Startups', saves: 1923, shares: 687 },
  { id: 7, type: 'stat', color: CARD_COLORS.stat.bg, textColor: CARD_COLORS.stat.text, badge: '📊 data', stat: '73%', title: 'of YC W25 batch is AI-native', source: 'Garry Tan, YC', platform: 'x', sourceType: 'topic', readTime: '25 sec', timeAgo: '8 hours ago', detail: 'The highest concentration of AI startups in YC history. Most are building vertical agents or infrastructure for agentic workflows.', prompts: ['What are vertical agents?', 'Top YC AI companies?'], topic: 'Startups', saves: 1456, shares: 412 },
  { id: 8, type: 'network', color: CARD_COLORS.network.bg, textColor: CARD_COLORS.network.text, badge: '👥 your network', title: 'Vibe coding is real', subtitle: '8 people you follow discussed this', handles: ['@karpathy', '@levelsio', '@swyx'], platform: 'x', sourceType: 'xLive', readTime: '30 sec', timeAgo: '9 hours ago', detail: 'The term Karpathy coined is catching on. Developers are shipping production apps by describing what they want in natural language, iterating through conversation rather than syntax.', sources: [{handle: '@karpathy', note: 'coined "vibe coding"', platform: 'x'}, {handle: '@levelsio', note: 'built PhotoAI this way', platform: 'x'}], prompts: ['How to vibe code effectively?', 'Best tools for vibe coding?'], topic: 'Engineering', saves: 2187, shares: 923 },
  { id: 9, type: 'tip', color: CARD_COLORS.tip.bg, textColor: CARD_COLORS.tip.text, badge: '🧠 tactic', title: 'The SOUL.md pattern', stat: '10x', statLabel: 'better agent behavior', platform: 'x', sourceType: 'curated', readTime: '35 sec', timeAgo: '10 hours ago', detail: 'OpenClaw popularized defining agent personality in a SOUL.md file. Tell the AI who it is, how to act, what to prioritize. Works with any agentic system, not just OpenClaw.', prompts: ['How to write SOUL.md?', 'Agent personality patterns?'], topic: 'AI Agents', saves: 1654, shares: 478 },
  { id: 10, type: 'network', color: CARD_COLORS.trending.bg, textColor: '#fff', badge: '🔥 breaking', title: 'Steinberger joining OpenAI', subtitle: 'Just announced', handles: ['@steipete', '@sama'], platform: 'x', sourceType: 'xLive', readTime: '30 sec', timeAgo: '1 hour ago', detail: 'OpenClaw creator Peter Steinberger announced he\'s joining OpenAI. The project will move to an open-source foundation. Huge validation for the agentic AI movement.', sources: [{handle: '@steipete', note: 'announced OpenAI move', platform: 'x'}, {handle: '@sama', note: 'welcomed him to team', platform: 'x'}], prompts: ['What happens to OpenClaw now?', 'OpenAI agent strategy?'], topic: 'AI Agents', saves: 5231, shares: 2103 },
];

const FEED_ITEMS = [
  { id: 101, type: 'network', color: CARD_COLORS.network.bg, textColor: '#fff', badge: '👥', title: 'Claude 4 speculation heating up', handles: ['@alexalbert__', '@amanda_askell', '+3'], time: '1h', readTime: '2 min', keyPoints: 3, detail: 'Anthropic researchers hinting at major capability jumps. Focus seems to be on reasoning and tool use.', sources: [{handle: '@alexalbert__', note: 'teased new evals'}, {handle: '@amanda_askell', note: 'discussed alignment advances'}], prompts: ['What to expect from Claude 4?', 'Claude vs GPT comparison?'], topic: 'AI Models' },
  { id: 102, type: 'quote', color: CARD_COLORS.quote.bg, textColor: '#fff', badge: '💬', quote: 'Stop building AI features. Start building AI products.', author: '@emilyzhang', time: '2h', readTime: '1 min', keyPoints: 2, detail: 'The era of bolting AI onto existing products is ending. Winners will rebuild from first principles.', prompts: ['AI-native product examples?', 'How to think AI-first?'], topic: 'Product' },
  { id: 103, type: 'tip', color: CARD_COLORS.tip.bg, textColor: '#fff', badge: '🧠', title: 'Context window stuffing', stat: '5x', time: '3h', readTime: '2 min', keyPoints: 3, detail: 'Instead of RAG for small docs, just stuff the full context. Models handle 100k+ tokens now. Simpler = better.', prompts: ['When to use RAG vs context?', 'Context window best practices?'], topic: 'Engineering' },
  { id: 104, type: 'stat', color: CARD_COLORS.stat.bg, textColor: '#fff', badge: '📊', stat: '847%', title: 'YoY growth in AI engineer roles', time: '4h', readTime: '1 min', keyPoints: 2, detail: 'LinkedIn data shows AI engineer is the fastest growing job title. Median comp now exceeds traditional SWE.', source: 'LinkedIn Economic Graph', prompts: ['How to become an AI engineer?', 'AI engineer skill stack?'], topic: 'Careers' },
];

// ===== HELPERS =====

// Deep link helpers
const openOriginalPost = (handle, platform = 'x') => {
  const username = handle.replace('@', '');
  if (platform === 'x') {
    // Try to open X app, fallback to web
    window.location.href = `twitter://user?screen_name=${username}`;
    setTimeout(() => {
      window.open(`https://x.com/${username}`, '_blank');
    }, 500);
  } else if (platform === 'linkedin') {
    window.open(`https://linkedin.com/in/${username}`, '_blank');
  }
};

const getStreakInfo = (streak) => {
  let current = STREAK_REWARDS[0];
  let next = STREAK_REWARDS[1];
  for (let i = STREAK_REWARDS.length - 1; i >= 0; i--) {
    if (streak >= STREAK_REWARDS[i].days) {
      current = STREAK_REWARDS[i];
      next = STREAK_REWARDS[i + 1] || null;
      break;
    }
  }
  return { current, next, daysToNext: next ? next.days - streak : 0 };
};

const generateInsights = (profs) => {
  const insights = [];
  if (profs.includes('marketing')) insights.push({ id: 'i1', type: 'insight', color: PURPLE, icon: '📈', title: 'AI video is exploding', stat: '+340%', statLabel: 'mentions this week', detail: 'Sora, Runway, Pika - your marketing peers are testing AI video for ads. Early results show 60% cost reduction.', takeaway: 'Run a pilot with AI-generated B-roll this quarter.', time: '1h', readTime: '2 min', keyPoints: 3, topic: 'Marketing' });
  if (profs.includes('product')) insights.push({ id: 'i3', type: 'insight', color: PURPLE, icon: 'target', title: 'AI-native onboarding wins', stat: '2.3x', statLabel: 'activation rate', detail: 'Products using AI to personalize onboarding see dramatically better activation. Notion, Figma, Linear leading the way.', takeaway: 'Audit your onboarding for AI personalization opportunities.', time: '2h', readTime: '2 min', keyPoints: 3, topic: 'Product' });
  if (profs.includes('founder')) insights.push({ id: 'i4', type: 'insight', color: PURPLE, icon: '🚀', title: 'AI wrappers are back', stat: '$4.2B', statLabel: 'raised in Q1', detail: 'After the backlash, thin wrappers with great UX are winning again. Distribution > differentiation in 2025.', takeaway: 'Focus on UX and speed, not model differentiation.', time: '3h', readTime: '2 min', keyPoints: 2, topic: 'Startups' });
  if (profs.includes('engineering')) insights.push({ id: 'i5', type: 'insight', color: PURPLE, icon: '💻', title: 'Cursor hit 50% adoption', stat: '50%', statLabel: 'of SF engineers', detail: 'AI code editors crossed the tipping point. Engineers not using them report feeling "left behind."', takeaway: 'If you haven\'t tried Cursor or Copilot, start today.', time: '2h', readTime: '2 min', keyPoints: 3, topic: 'Engineering' });
  if (profs.includes('sales')) insights.push({ id: 'i6', type: 'insight', color: PURPLE, icon: '💰', title: 'AI SDRs closing deals', stat: '12%', statLabel: 'of pipeline now AI-sourced', detail: 'Companies like 11x and Artisan report their AI SDRs booking qualified meetings autonomously.', takeaway: 'Evaluate AI SDR tools for top-of-funnel automation.', time: '4h', readTime: '2 min', keyPoints: 2, topic: 'Sales' });
  if (profs.includes('design')) insights.push({ id: 'i7', type: 'insight', color: PURPLE, icon: '🎨', title: 'Figma AI features shipping', stat: '8', statLabel: 'new AI tools this month', detail: 'Auto-layout suggestions, copy generation, asset creation - Figma is going all-in on AI assistance.', takeaway: 'Learn the new Figma AI shortcuts before your team does.', time: '3h', readTime: '2 min', keyPoints: 3, topic: 'Design' });
  return insights;
};

const generateResponse = (query, profs = [], savedClues = []) => {
  const q = query.toLowerCase();
  
  // Check if question relates to saved clues
  const relatedClue = savedClues.find(c => 
    q.includes(c.topic?.toLowerCase()) || 
    q.includes(c.title?.toLowerCase().split(' ')[0])
  );
  
  if (q.includes('ai agent')) {
    return { 
      text: `AI agents are autonomous software that can:\n\n• Plan and break down goals\n• Take actions via tools/APIs\n• Learn from results and iterate\n\nThink: software that works for you while you sleep.${profs.includes('sales') ? '\n\n**For sales:** prospect research, email personalization, call prep.' : ''}`,
      relatedTo: relatedClue?.title
    };
  }
  if (q.includes('cold email')) {
    return {
      text: `AI cold emails outperform human-written by 23%.\n\n**The formula:**\n1. Specific observation (not flattery)\n2. One-sentence problem\n3. One proof point\n4. Single, low-friction ask\n\n**Tools:** Clay + GPT-4 + Instantly`,
      relatedTo: relatedClue?.title
    };
  }
  if (q.includes('prompt')) {
    return {
      text: `Prompting is becoming a core skill.\n\n**For PMs:**\n• Spec review and refinement\n• Research synthesis\n• Prioritization frameworks\n\n**Tip:** Block 30 min/day to practice. It compounds.`,
      relatedTo: relatedClue?.title
    };
  }
  if (q.includes('founder mode')) {
    return {
      text: `Founder mode = deep involvement, direct reports, high context.\n\nManager mode = delegation, process, scale.\n\n**When to use founder mode:**\n• 0-1 product development\n• Crisis moments\n• Culture inflection points`,
      relatedTo: relatedClue?.title
    };
  }
  return {
    text: `Here's the framework:\n\n1. Start with the outcome, work backwards\n2. Find someone who's done it\n3. Run small experiments before big bets\n\nWant me to go deeper?`,
    relatedTo: null
  };
};

const generateCopy = (c) => {
  if (!c) return '';
  if (c.type === 'network') return `My network was buzzing about ${c.title?.toLowerCase()}.\n\nClue caught it so I didn't have to scroll. 🔍`;
  if (c.type === 'quote') return `"${c.quote}"\n\n— ${c.author}\n\nThis hit my Clue feed this morning. 🔍`;
  if (c.type === 'tip') return `Today's clue: ${c.title} — ${c.stat} saved.\n\nClue finds these so I don't have to. 🔍`;
  if (c.type === 'stat') return `${c.title} by ${c.stat}.\n\nThis hit my Clue feed. 🔍`;
  return 'Check out Clue 🔍';
};

const getTopicStats = (saved) => {
  const topics = {};
  saved.forEach(item => {
    const topic = item.topic || 'General';
    topics[topic] = (topics[topic] || 0) + 1;
  });
  return Object.entries(topics).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count);
};

// ===== SAMPLE CLUE FOR ONBOARDING =====
const SAMPLE_CLUE = {
  id: 'sample',
  type: 'network',
  color: GREEN,
  badge: '👥 your network',
  title: 'OpenClaw is taking over',
  subtitle: 'While you slept, 18 people you follow discussed this',
  handles: ['@steipete', '@levelsio', '@nateliason'],
  readTime: '45 sec',
  timeAgo: '2 hours ago',
};

// ===== DELIVERY TIME OPTIONS =====
const DELIVERY_TIMES = [
  { id: '6am', label: '6:00 AM', icon: 'sunrise', desc: 'Early bird' },
  { id: '7am', label: '7:00 AM', icon: 'sun', desc: 'With coffee' },
  { id: '8am', label: '8:00 AM', icon: 'clock', desc: 'Start of day' },
  { id: '9am', label: '9:00 AM', icon: 'briefcase', desc: 'Work mode' },
];

// ===== HAPTIC FEEDBACK HELPER =====
const haptic = (type = 'light') => {
  if (navigator.vibrate) {
    const patterns = {
      light: [10],
      medium: [20],
      heavy: [30],
      success: [10, 50, 20],
      error: [50, 30, 50],
    };
    navigator.vibrate(patterns[type] || patterns.light);
  }
};

// ===== DEEP LINK HELPERS =====
const openInX = (handle) => {
  const username = handle.replace('@', '');
  // Try Twitter app first, fallback to web
  window.open(`twitter://user?screen_name=${username}`, '_blank') ||
  window.open(`https://twitter.com/${username}`, '_blank');
};

const openInLinkedIn = (handle) => {
  const username = handle.replace('@', '');
  window.open(`https://linkedin.com/in/${username}`, '_blank');
};

// ===== APP =====
export default function ClueApp() {
  const [screen, setScreen] = useState('oobe');
  const [step, setStep] = useState(0);
  const [goal, setGoal] = useState(null);
  const [profs, setProfs] = useState([]);
  const [deliveryTime, setDeliveryTime] = useState('7am');
  const [authMethod, setAuthMethod] = useState(null);
  
  // Subscription & Billing
  const [subscription, setSubscription] = useState({
    plan: null, // null, 'trial', 'monthly', 'annual'
    trialEndsAt: null,
    isPro: false,
    xConnected: false,
  });
  const [selectedPlan, setSelectedPlan] = useState('monthly'); // 'monthly' or 'annual'
  
  // Sources (new for v14)
  const [followedTopics, setFollowedTopics] = useState([]);
  const [importedSources, setImportedSources] = useState([]);
  const [showAddSource, setShowAddSource] = useState(false);
  const [showTopicPicker, setShowTopicPicker] = useState(false);
  
  // Navigation
  const [activeTab, setActiveTab] = useState('clues');
  
  // Daily Clues
  const [cardIdx, setCardIdx] = useState(0);
  const [swipeDir, setSwipeDir] = useState(null);
  const [showExplore, setShowExplore] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [swipingCard, setSwipingCard] = useState(null);
  const [swipeToast, setSwipeToast] = useState(null);
  
  // Pull to refresh & Loading
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Undo
  const [lastSkipped, setLastSkipped] = useState(null);
  
  // Feed
  const [feed, setFeed] = useState([]);
  const [expanded, setExpanded] = useState(null);
  
  // Learn
  const [query, setQuery] = useState('');
  const [msgs, setMsgs] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Library
  const [expandedLibrary, setExpandedLibrary] = useState(null);
  const [reviewMode, setReviewMode] = useState(false);
  const [reviewIdx, setReviewIdx] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  
  // Modals
  const [showStreak, setShowStreak] = useState(false);
  const [showMilestone, setShowMilestone] = useState(false);
  const [milestone, setMilestone] = useState(null);
  const [showShare, setShowShare] = useState(false);
  const [shareCard, setShareCard] = useState(null);
  const [showBrain, setShowBrain] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  
  // Stats
  const [stats, setStats] = useState({ saved: [], streak: 6, score: 60, shields: 1, dailyClues: 5, totalLearned: 47, seenToday: [], isPro: false });

  // Auth token (from localStorage or URL param after OAuth)
  const [token, setToken] = useState(() => getToken());
  // Daily cards (API data, fallback to hardcoded demo data)
  const [dailyCards, setDailyCards] = useState(DAILY_CARDS);
  // Leaderboard (API data, fallback to hardcoded)
  const [leaderboard, setLeaderboard] = useState(LEADERBOARD);
  // Referral code (from API)
  const [referralCode, setReferralCode] = useState(null);

  // On mount: pick up OAuth callback token + load all user data
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check if OAuth redirected back with a token in URL params
    const params = new URLSearchParams(window.location.search);
    const urlToken = params.get('token');
    const activeToken = urlToken || getToken();

    if (urlToken) {
      localStorage.setItem('clue_token', urlToken);
      setToken(urlToken);
      // Clean the token out of the URL bar
      window.history.replaceState({}, '', window.location.pathname);
    }

    if (!activeToken) return;

    const loadUserData = async () => {
      try {
        const [profileRes, cluesRes, lbRes, refRes] = await Promise.allSettled([
          apiFetch('/user/profile'),
          apiFetch('/clues/today'),
          apiFetch('/leaderboard/'),
          apiFetch('/referrals/'),
        ]);

        if (profileRes.status === 'fulfilled' && profileRes.value) {
          const { user, stats: apiStats } = profileRes.value;
          if (apiStats) {
            setStats(p => ({
              ...p,
              streak: apiStats.streak ?? p.streak,
              score: apiStats.score ?? p.score,
              totalLearned: apiStats.total_clues_seen ?? p.totalLearned,
              isPro: user?.subscription?.tier === 'pro' || p.isPro,
            }));
          }
          // Skip onboarding if user already completed it
          if (user?.onboarding_complete) {
            setFeed(buildFeed());
            setScreen('daily');
          } else {
            // Authenticated but onboarding not done - they just returned from OAuth
            // (step 6 = create account). Advance past it to step 7 (connect X).
            const savedStep = parseInt(localStorage.getItem('clue_nux_step') || '7', 10);
            localStorage.removeItem('clue_nux_step');
            setStep(savedStep);
          }
        }

        if (cluesRes.status === 'fulfilled' && cluesRes.value?.clues?.length) {
          setDailyCards(cluesRes.value.clues.map(normalizeClue));
        }

        if (lbRes.status === 'fulfilled' && lbRes.value) {
          const entries = lbRes.value.global || lbRes.value.entries || [];
          if (entries.length) setLeaderboard(entries);
          if (refRes.status === 'fulfilled' && refRes.value?.referral_code) {
            setReferralCode(refRes.value.referral_code);
          }
        }

        if (refRes.status === 'fulfilled' && refRes.value?.referral_code) {
          setReferralCode(refRes.value.referral_code);
        }
      } catch (err) {
        console.error('Failed to load user data:', err);
      }
    };

    loadUserData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // PLG Stats
  const [plgStats, setPlgStats] = useState({ 
    referrals: 2, 
    sharesThisWeek: 1, 
    bonusCluesEarned: 0,
    unlimitedUntil: null, // Date when unlimited expires
    shareToUnlockUsed: false 
  });
  
  // New signals detection
  const [newSignals, setNewSignals] = useState({ count: 0, preview: null });
  const [signalPulse, setSignalPulse] = useState(false);
  
  // PLG: Check if user has unlimited clues from referrals
  const hasUnlimitedClues = plgStats.unlimitedUntil && new Date(plgStats.unlimitedUntil) > new Date();
  
  // PLG: Share to unlock bonus clues
  const handleShareToUnlock = () => {
    if (!plgStats.shareToUnlockUsed) {
      setPlgStats(p => ({ ...p, shareToUnlockUsed: true, bonusCluesEarned: p.bonusCluesEarned + 3 }));
      setStats(p => ({ ...p, dailyClues: p.dailyClues + 3 }));
      haptic('success');
      setSwipeToast({ type: 'save', message: '🎁 5 bonus clues unlocked!' });
      setTimeout(() => setSwipeToast(null), 3000);
    }
  };
  
  // PLG: Referral reward - unlock unlimited for a week
  const handleReferralMilestone = () => {
    if (plgStats.referrals >= 3 && !hasUnlimitedClues) {
      const unlimitedDate = new Date();
      unlimitedDate.setDate(unlimitedDate.getDate() + 7);
      setPlgStats(p => ({ ...p, unlimitedUntil: unlimitedDate.toISOString() }));
      setStats(p => ({ ...p, dailyClues: 99 }));
    }
  };

  const totalCards = Math.min(dailyCards.length, stats.dailyClues);
  const dailyComplete = (stats.seenToday?.length || 0) >= totalCards;
  const remainingClues = totalCards - (stats.seenToday?.length || 0);
  const card = dailyComplete ? dailyCards[0] : dailyCards.slice(0, stats.dailyClues).find(c => !stats.seenToday?.includes(c.id)) || dailyCards[0];
  const streakInfo = getStreakInfo(stats.streak);
  const topicStats = getTopicStats(stats.saved);
  
  // Simulate finding new signals after completion
  useEffect(() => {
    if (dailyComplete && newSignals.count === 0) {
      const timer = setTimeout(() => {
        setNewSignals({
          count: 2,
          preview: 'OpenAI just announced something big',
          handles: ['@sama', '@gdb', '@karpathy']
        });
        setSignalPulse(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [dailyComplete, newSignals.count]);

  const buildFeed = () => {
    const insights = generateInsights(profs);
    return [...insights, ...FEED_ITEMS];
  };

  const toggleProf = (id) => {
    if (profs.includes(id)) setProfs(profs.filter(p => p !== id));
    else if (profs.length < 3) setProfs([...profs, id]);
  };

  const swipe = (dir) => {
    setSwipeDir(dir);
    if (dir === 'right') {
      const savedCard = { ...card, savedAt: new Date().toISOString(), mastery: 0 };
      setStats(p => ({ ...p, saved: [...p.saved, savedCard], score: p.score + 10, totalLearned: p.totalLearned + 1 }));
    }
    setTimeout(() => {
      if (cardIdx < totalCards - 1) {
        setCardIdx(cardIdx + 1);
      } else {
        const ns = stats.streak + 1;
        const m = STREAK_REWARDS.find(r => r.days === ns);
        if (m) {
          setMilestone(m);
          setShowMilestone(true);
          setStats(p => ({ ...p, streak: ns, score: p.score + 50, shields: m.perk.includes('shield') ? p.shields + 1 : p.shields }));
        } else {
          setStats(p => ({ ...p, streak: ns, score: p.score + 50 }));
        }
        setFeed(buildFeed());
        setCardIdx(totalCards);
      }
      setSwipeDir(null);
    }, 250);
  };

  const search = async (q) => {
    const t = q || query;
    if (!t.trim()) return;
    setLoading(true);
    setMsgs(p => [...p, { role: 'user', content: t }]);
    setQuery('');

    if (token) {
      try {
        const data = await apiFetch('/learn/ask', {
          method: 'POST',
          body: JSON.stringify({ message: t }),
        });
        setMsgs(p => [...p, { role: 'ai', content: data.message }]);
      } catch (err) {
        // Fallback to local response generation if API fails
        const response = generateResponse(t, profs, stats.saved);
        setMsgs(p => [...p, { role: 'ai', content: response.text, relatedTo: response.relatedTo }]);
      }
    } else {
      // Not logged in: use local response generation
      setTimeout(() => {
        const response = generateResponse(t, profs, stats.saved);
        setMsgs(p => [...p, { role: 'ai', content: response.text, relatedTo: response.relatedTo }]);
      }, 600);
    }
    setLoading(false);
  };

  const openShare = (c) => { setShareCard(c); setShowShare(true); };

  const markComplete = (id) => {
    setStats(p => ({
      ...p,
      saved: p.saved.map(s => s.id === id ? { ...s, completed: !s.completed } : s)
    }));
  };

  const updateMastery = (id, knew) => {
    setStats(p => ({
      ...p,
      saved: p.saved.map(s => s.id === id ? { ...s, mastery: Math.min(3, (s.mastery || 0) + (knew ? 1 : 0)) } : s)
    }));
  };

  // Generate smart suggestions based on saved clues
  const getSmartSuggestions = () => {
    if (stats.saved.length === 0) {
      return ['What are AI agents?', 'How to write cold emails?', 'Explain founder mode'];
    }
    return stats.saved.slice(0, 3).map(c => 
      c.prompts?.[0] || `Tell me more about ${c.topic || c.title}`
    );
  };

  // ===== OOBE (v14 - Pricing Gate + Pivoted LinkedIn) =====
  if (screen === 'oobe') {
    // Step 0: Welcome
    if (step === 0) return (
      <div style={s.ctr}><div style={{...s.oobe, background: CORAL}}>
        <Logo size={80} color={DARK} />
        <h1 style={s.title}>clue</h1>
        <p style={s.sub}>the best of your feed,<br/>every morning</p>
        <button style={s.btn} onClick={() => setStep(1)}>get started</button>
      </div></div>
    );
    
    // Step 1: Value Prop (the real story)
    if (step === 1) return (
      <div style={s.ctr}><div style={{...s.oobe, background: CREAM}}>
        <div style={s.prog}><div style={{...s.progFill, width: '10%'}} /></div>
        
        <div style={s.valuePropContent}>
          <p style={s.valuePropSetup}>You follow smart people.</p>
          <p style={{...s.valuePropSetup, color: '#999', marginBottom: 32}}>You miss most of what they post.</p>
          
          <h2 style={s.valuePropHeadline}>We catch it for you.</h2>
          
          <p style={s.valuePropTime}>
            5 things to know. 5 minutes. Daily.
          </p>
        </div>
        
        <button style={{...s.btnDark, marginTop: 32}} onClick={() => setStep(2)}>see how it works</button>
      </div></div>
    );
    
    // Step 2: Sample Clue Preview (AHA MOMENT)
    if (step === 2) return (
      <div style={s.ctr}><div style={{...s.oobe, background: CREAM, justifyContent: 'flex-start', paddingTop: 60}}>
        <div style={s.prog}><div style={{...s.progFill, width: '20%'}} /></div>
        <h2 style={{...s.h2, marginBottom: 8}}>this is a clue</h2>
        <p style={{...s.desc, marginBottom: 20}}>you get 5 every morning</p>
        
        <div style={{...s.sampleCard, background: SAMPLE_CLUE.color}}>
          <div style={s.sampleCardInner}>
            <span style={s.sampleBadge}>{SAMPLE_CLUE.badge}</span>
            <h3 style={s.sampleTitle}>{SAMPLE_CLUE.title}</h3>
            <p style={s.sampleSub}>{SAMPLE_CLUE.subtitle}</p>
            <div style={s.sampleHandles}>
              {SAMPLE_CLUE.handles.map((h, i) => <span key={i} style={s.sampleHandle}>{h}</span>)}
            </div>
          </div>
          <div style={s.sampleMeta}>
            <span>⏱ {SAMPLE_CLUE.readTime}</span>
            <span>{SAMPLE_CLUE.timeAgo}</span>
          </div>
        </div>
        
        <p style={{color: '#666', fontSize: 14, marginTop: 20, textAlign: 'center'}}>
          swipe right to save, left to skip
        </p>
        
        <button style={{...s.btnDark, marginTop: 24}} onClick={() => setStep(3)}>continue</button>
      </div></div>
    );
    
    // Step 3: Goal Selection (light personalization)
    if (step === 3) return (
      <div style={s.ctr}><div style={{...s.oobe, background: CREAM}}>
        <div style={s.prog}><div style={{...s.progFill, width: '30%'}} /></div>
        <h2 style={s.h2}>why are you here?</h2>
        <div style={s.grid}>{GOALS.map(g => <button key={g.id} style={{...s.goalCard, border: goal === g.id ? `3px solid ${CORAL}` : '3px solid transparent'}} onClick={() => setGoal(g.id)}><span style={s.goalIcon}><Icon name={g.icon} size={20} color={goal === g.id ? CORAL : DARK} /></span><span style={{fontSize: 13}}>{g.label}</span></button>)}</div>
        <button style={{...s.btnDark, opacity: goal ? 1 : 0.5}} onClick={() => goal && setStep(4)}>continue</button>
      </div></div>
    );
    
    // Step 4: Profession Selection
    if (step === 4) return (
      <div style={s.ctr}><div style={{...s.oobe, background: CREAM}}>
        <div style={s.prog}><div style={{...s.progFill, width: '40%'}} /></div>
        <h2 style={s.h2}>what do you do?</h2>
        <p style={s.desc}>pick up to 3</p>
        <div style={s.grid}>{PROFESSIONS.map(p => <button key={p.id} style={{...s.profCard, border: profs.includes(p.id) ? `3px solid ${CORAL}` : '3px solid transparent'}} onClick={() => toggleProf(p.id)}><span style={s.profIcon}>{p.icon}</span><span style={{fontSize: 13}}>{p.label}</span>{profs.includes(p.id) && <span style={{...s.check, color: CORAL}}><Icon name="check" size={14} color={CORAL} strokeWidth={2.5} /></span>}</button>)}</div>
        <button style={{...s.btnDark, opacity: profs.length ? 1 : 0.5}} onClick={() => profs.length && setStep(5)}>continue</button>
      </div></div>
    );
    
    // Step 5: PRICING GATE (NEW - before account creation)
    if (step === 5) return (
      <div style={s.ctr}><div style={{...s.oobe, background: CREAM, justifyContent: 'flex-start', paddingTop: 40}}>
        <div style={s.prog}><div style={{...s.progFill, width: '50%'}} /></div>
        
        <div style={s.pricingHeader}>
          <Logo size={40} color={CORAL} />
          <h2 style={{...s.h2, marginTop: 16, marginBottom: 8}}>clue</h2>
          <p style={s.desc}>$5/month</p>
        </div>
        
        <div style={s.pricingFeatures}>
          <div style={s.pricingFeature}>
            <Icon name="check" size={18} color={GREEN} strokeWidth={2.5} />
            <span>5 clues from your X feed</span>
          </div>
          <div style={s.pricingFeature}>
            <Icon name="check" size={18} color={GREEN} strokeWidth={2.5} />
            <span>updates throughout the day</span>
          </div>
          <div style={s.pricingFeature}>
            <Icon name="check" size={18} color={GREEN} strokeWidth={2.5} />
            <span>ask questions about what you've saved</span>
          </div>
          <div style={s.pricingFeature}>
            <Icon name="check" size={18} color={GREEN} strokeWidth={2.5} />
            <span>share to LinkedIn</span>
          </div>
        </div>
        
        <div style={s.pricingOptions}>
          <button 
            style={{
              ...s.pricingOption,
              border: selectedPlan === 'monthly' ? `3px solid ${CORAL}` : '3px solid transparent',
            }}
            onClick={() => setSelectedPlan('monthly')}
          >
            <div style={s.pricingOptionMain}>
              <span style={s.pricingPrice}>$5</span>
              <span style={s.pricingPeriod}>/month</span>
            </div>
            {selectedPlan === 'monthly' && <Icon name="check" size={18} color={CORAL} strokeWidth={2.5} />}
          </button>
          
          <button 
            style={{
              ...s.pricingOption,
              border: selectedPlan === 'annual' ? `3px solid ${CORAL}` : '3px solid transparent',
            }}
            onClick={() => setSelectedPlan('annual')}
          >
            <div style={s.pricingOptionMain}>
              <span style={s.pricingPrice}>$50</span>
              <span style={s.pricingPeriod}>/year</span>
              <span style={s.pricingSave}>save $10</span>
            </div>
            {selectedPlan === 'annual' && <Icon name="check" size={18} color={CORAL} strokeWidth={2.5} />}
          </button>
        </div>
        
        <button 
          style={s.applePayBtn}
          onClick={() => { 
            setSubscription({ plan: selectedPlan, isPro: true, xConnected: false }); 
            setStep(6); 
          }}
        >
          <span style={s.applePayIcon}></span>
          Pay
        </button>
        
        <button 
          style={s.trialLink}
          onClick={() => { 
            setSubscription({ plan: 'trial', trialEndsAt: Date.now() + 7*24*60*60*1000, isPro: true, xConnected: false }); 
            setStep(6); 
          }}
        >
          try free for 7 days
        </button>
        
        <p style={{color: '#999', fontSize: 11, marginTop: 16, textAlign: 'center', lineHeight: 1.5}}>
          cancel anytime
        </p>
      </div></div>
    );
    
    // Step 6: Create Account (after pricing commitment)
    if (step === 6) return (
      <div style={s.ctr}><div style={{...s.oobe, background: CREAM}}>
        <div style={s.prog}><div style={{...s.progFill, width: '60%'}} /></div>
        <h2 style={s.h2}>create your account</h2>
        <p style={s.desc}>
          {subscription.plan === 'trial' ? 'start your free trial' : 'activate your subscription'}
        </p>
        
        <div style={s.authOptions}>
          <button
            style={{...s.authBtn, background: '#fff', border: '1px solid #ddd'}}
            onClick={() => { setAuthMethod('google'); localStorage.setItem('clue_nux_step', '7'); window.location.href = `${API_URL}/auth/google`; }}
          >
            <span style={s.authIcon}>G</span>
            <span>Continue with Google</span>
          </button>
          <button
            style={{...s.authBtn, background: '#000', color: '#fff'}}
            onClick={() => { setAuthMethod('x'); localStorage.setItem('clue_nux_step', '7'); window.location.href = `${API_URL}/auth/x`; }}
          >
            <span style={s.authIcon}>𝕏</span>
            <span>Continue with X</span>
          </button>
          <div style={s.authDivider}><span>or</span></div>
          <button
            style={{...s.authBtn, background: '#0077B5', color: '#fff'}}
            onClick={() => { setAuthMethod('linkedin'); localStorage.setItem('clue_nux_step', '7'); window.location.href = `${API_URL}/auth/linkedin`; }}
          >
            <span style={s.authIcon}>in</span>
            <span>Continue with LinkedIn</span>
          </button>
        </div>
        
        <div style={s.privacyNotice}>
          <Icon name="lock" size={16} color={GREEN} />
          <span>Privacy-first: we never sell your data</span>
        </div>
      </div></div>
    );
    
    // Step 7: Connect X (YOUR SIGNAL ENGINE - Pro feature)
    if (step === 7) return (
      <div style={s.ctr}><div style={{...s.oobe, background: CREAM}}>
        <div style={s.prog}><div style={{...s.progFill, width: '70%'}} /></div>
        <div style={{...s.xLogo, background: DARK}}>𝕏</div>
        <h2 style={s.h2}>your signal engine</h2>
        <p style={s.desc}>Connect X to get clues from who you follow in real-time</p>
        
        <div style={s.signalFeatures}>
          <div style={s.signalFeature}>
            <span style={s.signalIcon}>📡</span>
            <span>Live signals from your network</span>
          </div>
          <div style={s.signalFeature}>
            <span style={s.signalIcon}>🎯</span>
            <span>Personalized to who you follow</span>
          </div>
          <div style={s.signalFeature}>
            <span style={s.signalIcon}>⚡</span>
            <span>Breaking news as it happens</span>
          </div>
        </div>
        
        <div style={s.privacyBadge}>
          <Icon name="lock" size={14} color={GREEN} />
          <span>Read-only · Processed ephemerally · Never stored</span>
        </div>
        
        <button
          style={s.btnDark}
          onClick={() => {
            // Redirect to X OAuth — backend will redirect back after connecting
            window.location.href = `${API_URL}/auth/x`;
          }}
        >
          connect X
        </button>
        <button style={s.skipAlt} onClick={() => setStep(8)}>
          I'll add sources manually instead
        </button>
      </div></div>
    );
    
    // Step 8: LinkedIn Identity (NOT feed reading - context + sharing)
    if (step === 8) return (
      <div style={s.ctr}><div style={{...s.oobe, background: CREAM}}>
        <div style={s.prog}><div style={{...s.progFill, width: '80%'}} /></div>
        <div style={s.liLogo}>in</div>
        <h2 style={s.h2}>add professional context</h2>
        <p style={s.desc}>Optionally connect LinkedIn to enrich your profile and share clues with your network</p>
        
        <div style={s.linkedinFeatures}>
          <div style={s.linkedinFeature}>
            <span style={s.linkedinIcon}>👤</span>
            <div>
              <span style={s.linkedinFeatureTitle}>Identity layer</span>
              <span style={s.linkedinFeatureDesc}>Your role, industry, connections</span>
            </div>
          </div>
          <div style={s.linkedinFeature}>
            <span style={s.linkedinIcon}>📤</span>
            <div>
              <span style={s.linkedinFeatureTitle}>Share insights</span>
              <span style={s.linkedinFeatureDesc}>Post clues to build your brand</span>
            </div>
          </div>
        </div>
        
        <div style={s.privacyBadge}>
          <Icon name="lock" size={14} color={GREEN} />
          <span>We never read your LinkedIn feed</span>
        </div>
        
        <button style={s.liBtn} onClick={() => {
          // If already authenticated, connect LinkedIn to existing account
          if (token) {
            window.location.href = `${API_URL}/auth/connect/linkedin`;
          } else {
            window.location.href = `${API_URL}/auth/linkedin`;
          }
        }}>connect LinkedIn</button>
        <button style={s.skip} onClick={() => setStep(9)}>skip for now</button>
      </div></div>
    );
    
    // Step 9: Privacy Commitment (explicit ephemeral messaging)
    if (step === 9) return (
      <div style={s.ctr}><div style={{...s.oobe, background: DARK}}>
        <div style={s.prog}><div style={{...s.progFill, width: '90%', background: CORAL}} /></div>
        
        <div style={s.privacyHero}>
          <Icon name="lock" size={48} color={GREEN} />
        </div>
        
        <h2 style={{...s.h2, color: '#fff'}}>privacy-first by design</h2>
        
        <div style={s.privacyCommitments}>
          <div style={s.privacyCommitment}>
            <Icon name="check" size={18} color={GREEN} strokeWidth={2.5} />
            <span>Your feed data is processed ephemerally</span>
          </div>
          <div style={s.privacyCommitment}>
            <Icon name="check" size={18} color={GREEN} strokeWidth={2.5} />
            <span>We surface insights, then delete the raw data</span>
          </div>
          <div style={s.privacyCommitment}>
            <Icon name="check" size={18} color={GREEN} strokeWidth={2.5} />
            <span>Your network graph is never stored</span>
          </div>
          <div style={s.privacyCommitment}>
            <Icon name="check" size={18} color={GREEN} strokeWidth={2.5} />
            <span>You control what Clue remembers</span>
          </div>
        </div>
        
        <button style={{...s.btn, marginTop: 32}} onClick={() => setStep(10)}>continue</button>
      </div></div>
    );
    
    // Step 10: Delivery Time + Ready (combined final screen)
    if (step === 10) return (
      <div style={s.ctr}><div style={{...s.oobe, background: CORAL}}>
        <div style={s.prog}><div style={{...s.progFill, width: '100%', background: DARK}} /></div>
        <div style={s.checkCircle}><Icon name="check" size={32} color="#fff" strokeWidth={2.5} /></div>
        <h2 style={{...s.h2, color: '#fff'}}>you're in</h2>
        
        {subscription.plan === 'trial' && (
          <div style={s.trialBadge}>
            <span>🎁 7-day free trial active</span>
          </div>
        )}
        
        <div style={s.tags}>{profs.map(p => <span key={p} style={{...s.tag, background: 'rgba(0,0,0,0.2)', color: '#fff'}}><span style={s.tagIcon}>{PROFESSIONS.find(pr => pr.id === p)?.icon}</span> {PROFESSIONS.find(pr => pr.id === p)?.label}</span>)}</div>
        
        <div style={s.deliveryPicker}>
          <p style={{color: 'rgba(255,255,255,0.8)', fontSize: 14, marginBottom: 12}}>when should your clues arrive?</p>
          <div style={s.deliveryOptions}>
            {DELIVERY_TIMES.map(t => (
              <button 
                key={t.id}
                style={{
                  ...s.deliveryOption,
                  background: deliveryTime === t.id ? DARK : 'rgba(0,0,0,0.15)',
                }}
                onClick={() => setDeliveryTime(t.id)}
              >
                <span style={{fontSize: 11}}>{t.label}</span>
              </button>
            ))}
          </div>
        </div>
        
        <div style={s.sourcesSummary}>
          {subscription.xConnected ? (
            <p style={{color: 'rgba(255,255,255,0.9)', fontSize: 13}}>
              <span style={{marginRight: 6}}>𝕏</span> Connected — live signals enabled
            </p>
          ) : (
            <p style={{color: 'rgba(255,255,255,0.7)', fontSize: 13}}>
              📋 Topic-based clues — connect X anytime for live signals
            </p>
          )}
        </div>
        
        <button style={s.btn} onClick={() => { setFeed(buildFeed()); setScreen('daily'); }}>see today's clues</button>
      </div></div>
    );
  }

  // ===== DAILY CLUES SCREEN (Feed Style) =====
  if (screen === 'daily') {
    const unseenClues = dailyCards.slice(0, stats.dailyClues).filter(c => !stats.seenToday?.includes(c.id));
    const allSeen = unseenClues.length === 0;
    
    if (allSeen && !showExplore) {
      // Transition to main when all seen
      setScreen('main');
      return null;
    }
    
    // Pull to refresh handler
    const handlePullStart = (e) => {
      if (e.touches[0].clientY < 150) {
        setPullDistance(0);
      }
    };
    
    const handlePullMove = (e) => {
      const scrollTop = e.currentTarget.scrollTop;
      if (scrollTop <= 0) {
        const pull = Math.min(e.touches[0].clientY - 100, 80);
        if (pull > 0) setPullDistance(pull);
      }
    };
    
    const handlePullEnd = () => {
      if (pullDistance > 60) {
        setIsRefreshing(true);
        haptic('medium');
        // Simulate refresh
        setTimeout(() => {
          setIsRefreshing(false);
          setPullDistance(0);
          haptic('success');
          setSwipeToast({ type: 'refresh', message: '✓ Clues refreshed' });
          setTimeout(() => setSwipeToast(null), 1500);
        }, 1000);
      } else {
        setPullDistance(0);
      }
    };
    
    // Undo skip handler
    const handleUndo = () => {
      if (lastSkipped) {
        setStats(p => ({
          ...p,
          seenToday: p.seenToday.filter(id => id !== lastSkipped.id)
        }));
        setLastSkipped(null);
        haptic('light');
        setSwipeToast({ type: 'undo', message: '↩ Restored' });
        setTimeout(() => setSwipeToast(null), 1500);
      }
    };
    
    return (
      <div style={{...s.ctr, background: CREAM}}>
        <div style={{...s.header, background: CORAL}}>
          <div style={s.logo}><Logo size={32} color={DARK} /><span style={{...s.logoText, color: DARK, marginLeft: 10}}>clue</span></div>
          <button style={{...s.streakBtn, background: 'rgba(0,0,0,0.15)', color: DARK}} onClick={() => setShowStreak(true)}>
            <Icon name="streak" size={16} color={DARK} /> {stats.streak}
          </button>
        </div>
        
        {/* Pull to refresh indicator */}
        {(pullDistance > 0 || isRefreshing) && (
          <div style={{
            ...s.pullIndicator,
            height: isRefreshing ? 50 : pullDistance,
            opacity: isRefreshing ? 1 : pullDistance / 60
          }}>
            <span style={{...s.pullIcon, transform: isRefreshing ? 'rotate(360deg)' : `rotate(${pullDistance * 3}deg)`}}>
              {isRefreshing ? '↻' : '↓'}
            </span>
            <span style={s.pullText}>{isRefreshing ? 'Refreshing...' : 'Pull to refresh'}</span>
          </div>
        )}
        
        <div 
          style={s.dailyFeedContainer}
          onTouchStart={handlePullStart}
          onTouchMove={handlePullMove}
          onTouchEnd={handlePullEnd}
        >
          {/* Header */}
          <div style={s.dailyFeedHeader}>
            <div>
              <h2 style={s.dailyFeedTitle}>today's clues</h2>
              <p style={s.dailyFeedSub}>{stats.dailyClues - (stats.seenToday?.length || 0)} of {stats.dailyClues} remaining</p>
            </div>
            <div style={s.dailyProgress}>
              {dailyCards.slice(0, stats.dailyClues).map((c, i) => (
                <div 
                  key={c.id} 
                  style={{
                    ...s.progressDot,
                    background: stats.seenToday?.includes(c.id) ? CORAL : 'rgba(0,0,0,0.15)'
                  }} 
                />
              ))}
            </div>
          </div>
          
          {/* Loading State */}
          {isLoading ? (
            <div style={s.loadingState}>
              <div style={s.loadingSpinner}>↻</div>
              <p style={s.loadingText}>Loading your clues...</p>
            </div>
          ) : (
          
          /* Clues Feed - Only unseen cards */
          <div style={s.dailyFeedList}>
            {dailyCards.slice(0, stats.dailyClues)
              .filter(clue => !stats.seenToday?.includes(clue.id))
              .map((clue) => {
              const isExpanded = expanded === clue.id;
              const isSaved = stats.saved.some(s => s.id === clue.id);
              
              return (
                <div 
                  key={clue.id} 
                  style={{
                    ...s.dailyClueCard,
                    background: clue.color,
                    color: clue.textColor || '#fff',
                    transform: swipeDir && swipingCard === clue.id 
                      ? `translateX(${swipeDir === 'left' ? '-30px' : '30px'}) rotate(${swipeDir === 'left' ? '-2deg' : '2deg'})` 
                      : 'translateX(0)',
                    transition: 'transform 0.2s, opacity 0.2s',
                  }}
                  onClick={() => {
                    if (!swipeDir) {
                      setExpanded(isExpanded ? null : clue.id);
                      if (!isSeen) {
                        setStats(p => ({
                          ...p,
                          seenToday: [...(p.seenToday || []), clue.id]
                        }));
                      }
                    }
                  }}
                  onTouchStart={(e) => {
                    if (isExpanded) return;
                    setTouchStart(e.touches[0].clientX);
                    setSwipingCard(clue.id);
                  }}
                  onTouchMove={(e) => {
                    if (isExpanded || !touchStart) return;
                    const diff = e.touches[0].clientX - touchStart;
                    if (Math.abs(diff) > 20) {
                      setSwipeDir(diff > 0 ? 'right' : 'left');
                    }
                  }}
                  onTouchEnd={() => {
                    if (swipeDir && swipingCard === clue.id) {
                      haptic('medium');

                      if (swipeDir === 'right' && !isSaved) {
                        const savedCard = { ...clue, savedAt: new Date().toISOString(), mastery: 0 };
                        setStats(p => ({
                          ...p,
                          saved: [...p.saved, savedCard],
                          score: p.score + 10,
                          totalLearned: p.totalLearned + 1,
                          seenToday: [...(p.seenToday || []), clue.id]
                        }));
                        setSwipeToast({ type: 'save', message: '✓ Saved to library' });
                        setLastSkipped(null);
                        // Record save action in backend
                        if (token) apiFetch(`/clues/${clue.id}/action`, { method: 'POST', body: JSON.stringify({ action: 'saved', clue }) }).catch(console.error);
                      } else if (swipeDir === 'left') {
                        setStats(p => ({
                          ...p,
                          seenToday: [...(p.seenToday || []), clue.id]
                        }));
                        setLastSkipped(clue);
                        setSwipeToast({ type: 'skip', message: '→ Skipped', canUndo: true });
                        // Record skip action in backend
                        if (token) apiFetch(`/clues/${clue.id}/action`, { method: 'POST', body: JSON.stringify({ action: 'skipped' }) }).catch(console.error);
                      } else if (swipeDir === 'right' && isSaved) {
                        // Already saved, just mark as seen
                        setStats(p => ({
                          ...p,
                          seenToday: [...(p.seenToday || []), clue.id]
                        }));
                        setSwipeToast({ type: 'save', message: '✓ Already saved' });
                      }
                      setTimeout(() => setSwipeToast(null), 3000);
                    }
                    setSwipeDir(null);
                    setTouchStart(null);
                    setSwipingCard(null);
                  }}
                >
                  {/* Swipe Indicators */}
                  {swipingCard === clue.id && swipeDir && (
                    <div style={{
                      ...s.swipeIndicator,
                      background: swipeDir === 'right' ? 'rgba(46, 139, 87, 0.9)' : 'rgba(0,0,0,0.5)',
                      left: swipeDir === 'right' ? 12 : 'auto',
                      right: swipeDir === 'left' ? 12 : 'auto',
                    }}>
                      {swipeDir === 'right' ? <><Icon name="bookmark" size={14} color="#fff" /> save</> : <><Icon name="chevronRight" size={14} color="#fff" /> skip</>}
                    </div>
                  )}
                  
                  {/* Card Header */}
                  <div style={s.dailyClueTop}>
                    <div style={s.dailyBadgeRow}>
                      <span style={s.dailyBadge}>{clue.badge}</span>
                      {clue.sourceType && (
                        <span style={{
                          ...s.sourceTypeBadge,
                          background: clue.sourceType === 'xLive' ? 'rgba(255,255,255,0.25)' : 
                                      clue.sourceType === 'topic' ? 'rgba(139,92,246,0.3)' :
                                      clue.sourceType === 'curated' ? 'rgba(255,99,71,0.3)' : 'rgba(255,255,255,0.2)',
                        }}>
                          {clue.sourceType === 'xLive' && <>𝕏 live</>}
                          {clue.sourceType === 'topic' && <>🏷️ topic</>}
                          {clue.sourceType === 'curated' && <>✨ curated</>}
                          {clue.sourceType === 'imported' && <>📋 imported</>}
                        </span>
                      )}
                    </div>
                    <div style={s.dailyMeta}>
                      <span style={s.dailyTime}><Icon name="clock" size={12} color="rgba(255,255,255,0.7)" /> {clue.readTime}</span>
                      {isSaved && <span style={s.savedIndicator}><Icon name="check" size={12} color="#fff" strokeWidth={2.5} /> saved</span>}
                    </div>
                  </div>
                  
                  {/* Card Content */}
                  {clue.type === 'network' && (
                    <>
                      <h3 style={s.dailyClueTitle}>{clue.title}</h3>
                      <p style={s.dailyClueSub}>{clue.timeAgo} · {clue.handles?.length} people</p>
                      {!isExpanded && (
                        <div style={s.dailyHandles}>
                          {clue.handles?.slice(0, 3).map((h, i) => (
                            <button 
                              key={i} 
                              style={s.dailyHandleBtn}
                              onClick={(e) => {
                                e.stopPropagation();
                                haptic('light');
                                clue.platform === 'linkedin' ? openInLinkedIn(h) : openInX(h);
                              }}
                            >
                              {h}
                            </button>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                  {clue.type === 'quote' && (
                    <>
                      <p style={s.dailyQuote}>"{clue.quote}"</p>
                      <button 
                        style={s.dailyAuthorBtn}
                        onClick={(e) => {
                          e.stopPropagation();
                          haptic('light');
                          clue.platform === 'linkedin' ? openInLinkedIn(clue.author) : openInX(clue.author);
                        }}
                      >
                        {clue.author} <Icon name="external" size={12} color="rgba(255,255,255,0.6)" />
                      </button>
                    </>
                  )}
                  {clue.type === 'tip' && (
                    <>
                      <h3 style={s.dailyClueTitle}>{clue.title}</h3>
                      <p style={s.dailyClueSub}>{clue.stat} {clue.statLabel}</p>
                    </>
                  )}
                  {clue.type === 'stat' && (
                    <>
                      <span style={s.dailyStat}>{clue.stat}</span>
                      <h3 style={s.dailyClueTitle}>{clue.title}</h3>
                    </>
                  )}
                  
                  {/* Expanded Content */}
                  {isExpanded && (
                    <div style={{...s.dailyExpanded, borderTopColor: 'rgba(255,255,255,0.2)'}}>
                      <p style={s.dailyDetail}>{clue.detail}</p>
                      
                      {/* Tappable source links */}
                      {clue.sources && (
                        <div style={s.dailySources}>
                          <p style={s.sourcesTitle}>Sources:</p>
                          {clue.sources.map((src, i) => (
                            <button 
                              key={i} 
                              style={s.sourceLink}
                              onClick={(e) => {
                                e.stopPropagation();
                                haptic('light');
                                openInX(src.handle);
                              }}
                            >
                              <span style={s.sourceLinkHandle}>{src.handle}</span>
                              <span style={s.sourceLinkNote}>{src.note}</span>
                              <span style={s.sourceLinkIcon}><Icon name="external" size={14} color="rgba(255,255,255,0.5)" /></span>
                            </button>
                          ))}
                        </div>
                      )}
                      
                      {/* View original post - X only now */}
                      {clue.handles && (
                        <div style={s.viewOriginal}>
                          <button 
                            style={s.viewOriginalBtn}
                            onClick={(e) => {
                              e.stopPropagation();
                              haptic('light');
                              openInX(clue.handles[0]);
                            }}
                          >
                            <span>𝕏</span> View on X
                          </button>
                          <button 
                            style={{...s.viewOriginalBtn, background: '#0077B5'}}
                            onClick={(e) => {
                              e.stopPropagation();
                              haptic('light');
                              openShare(clue);
                            }}
                          >
                            <span>in</span> Share to LinkedIn
                          </button>
                        </div>
                      )}
                      
                      {clue.prompts && (
                        <div style={s.dailyPrompts}>
                          <p style={s.dailyPromptsLabel}>go deeper:</p>
                          {clue.prompts.map((p, i) => (
                            <button 
                              key={i} 
                              style={{
                                ...s.dailyPromptBtn,
                                background: 'rgba(255,255,255,0.15)',
                                color: '#fff'
                              }}
                              onClick={(e) => { 
                                e.stopPropagation(); 
                                setQuery(p); 
                                setScreen('main');
                                setActiveTab('learn');
                                search(p); 
                              }}
                            >
                              {p}
                            </button>
                          ))}
                        </div>
                      )}
                      
                      <div style={s.dailyActions}>
                        <button 
                          style={{
                            ...s.dailyActionBtn,
                            background: isSaved ? '#fff' : 'rgba(255,255,255,0.2)',
                            color: isSaved ? clue.color : '#fff'
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            haptic('light');
                            if (!isSaved) {
                              const savedCard = { ...clue, savedAt: new Date().toISOString(), mastery: 0 };
                              setStats(p => ({ ...p, saved: [...p.saved, savedCard], score: p.score + 10, totalLearned: p.totalLearned + 1 }));
                              // Record save in backend
                              if (token) apiFetch(`/clues/${clue.id}/action`, { method: 'POST', body: JSON.stringify({ action: 'saved', clue }) }).catch(console.error);
                            }
                          }}
                        >
                          {isSaved ? <><Icon name="check" size={14} color={clue.color} strokeWidth={2.5} /> saved</> : <><Icon name="bookmark" size={14} color="#fff" /> save</>}
                        </button>
                        <button 
                          style={{
                            ...s.dailyActionBtn,
                            background: 'rgba(255,255,255,0.2)',
                            color: '#fff'
                          }}
                          onClick={(e) => { e.stopPropagation(); openShare(clue); }}
                        >
                          <Icon name="share" size={14} color="#fff" /> share
                        </button>
                      </div>
                    </div>
                  )}
                  
                  {!isExpanded && (
                    <div style={s.cardFooter}>
                      <div style={s.socialProof}>
                        <span style={s.proofItem}><Icon name="bookmark" size={11} color="rgba(255,255,255,0.6)" /> {(clue.saves / 1000).toFixed(1)}K</span>
                        <span style={s.proofItem}><Icon name="share" size={11} color="rgba(255,255,255,0.6)" /> {clue.shares}</span>
                      </div>
                      <p style={{...s.swipeHintText, color: 'rgba(255,255,255,0.5)', margin: 0}}>swipe to save · tap to expand</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          )}
          
          {/* All Seen State - With PLG Features */}
          {stats.seenToday?.length >= stats.dailyClues && (
            <div style={s.allSeenCard}>
              <div style={s.allSeenIcon}><Icon name="check" size={32} color="#fff" strokeWidth={2.5} /></div>
              <h3 style={s.allSeenTitle}>done for today</h3>
              <p style={s.allSeenSub}>
                saved {stats.saved.filter(s => stats.seenToday?.some(id => s.id === id || dailyCards.slice(0, stats.dailyClues).some(c => c.id === s.id))).length || stats.saved.length}
              </p>
              
              {/* Top Learner Badge */}
              <div style={s.topLearnerBadge}>
                <span style={{fontSize: 18}}>🏅</span>
                <span>You're in the <strong>top {SOCIAL_PROOF.topLearnerPercent}%</strong> of learners on AI Agents</span>
              </div>
              
              {/* Mini Leaderboard */}
              <div style={s.miniLeaderboard}>
                <div style={s.miniLeaderboardHeader}>
                  <span style={{fontWeight: 600}}><Icon name="trophy" size={14} color={DARK} /> your network</span>
                  <button style={s.seeAllBtn} onClick={() => setShowStreak(true)}>see all</button>
                </div>
                {LEADERBOARD.slice(0, 3).map((user, i) => (
                  <div key={i} style={{...s.miniLeaderRow, background: user.isYou ? 'rgba(255,99,71,0.1)' : 'transparent'}}>
                    <span style={s.miniRank}>#{user.rank}</span>
                    <span style={s.avatarCircle}>{user.avatar}</span>
                    <span style={{flex: 1, fontWeight: user.isYou ? 700 : 400}}>{user.name}</span>
                    <span style={{fontWeight: 600}}>{user.streak} <Icon name="streak" size={12} color={CORAL} /></span>
                  </div>
                ))}
              </div>
              
              <div style={s.allSeenActions}>
                <button style={s.continueBtn} onClick={() => {
                  const ns = stats.streak + 1;
                  const m = STREAK_REWARDS.find(r => r.days === ns);
                  if (m) {
                    setMilestone(m);
                    setShowMilestone(true);
                    setStats(p => ({ ...p, streak: ns, score: p.score + 50, shields: m.perk.includes('shield') ? p.shields + 1 : p.shields }));
                  } else {
                    setStats(p => ({ ...p, streak: ns, score: p.score + 50 }));
                  }
                  setFeed(buildFeed());
                  setScreen('main');
                }}>
                  continue
                </button>
              </div>
              
              {/* Share to Unlock */}
              {!plgStats.shareToUnlockUsed && (
                <div style={s.shareToUnlock}>
                  <div style={s.shareToUnlockContent}>
                    <span style={{fontSize: 24}}>🎁</span>
                    <div>
                      <p style={s.shareToUnlockTitle}>Share a clue to unlock 5 more</p>
                      <p style={s.shareToUnlockSub}>Help a friend discover Clue</p>
                    </div>
                  </div>
                  <button 
                    style={s.shareToUnlockBtn}
                    onClick={() => {
                      handleShareToUnlock();
                    }}
                  >
                    share →
                  </button>
                </div>
              )}
              
              {/* Referral Activity */}
              {REFERRAL_ACTIVITY.length > 0 && (
                <div style={s.referralActivityCard}>
                  <div style={s.referralActivityItem}>
                    <span style={{fontSize: 20}}>{REFERRAL_ACTIVITY[0].emoji}</span>
                    <span style={s.referralActivityText}>
                      <strong>{REFERRAL_ACTIVITY[0].name}</strong> from {REFERRAL_ACTIVITY[0].source} {REFERRAL_ACTIVITY[0].event}!
                    </span>
                  </div>
                </div>
              )}
              
              {/* Upsell Section */}
              <div style={s.upsellSection}>
                <p style={s.upsellQuestion}>want to keep learning?</p>
                
                {!stats.isPro ? (
                  <div style={s.upsellCard}>
                    <div style={s.upsellBadge}>✨ PRO</div>
                    <h4 style={s.upsellTitle}>unlimited daily clues</h4>
                    <p style={s.upsellDesc}>
                      Get 10 clues/day + unlimited on-demand. Never stop learning.
                    </p>
                    <div style={s.upsellPricing}>
                      <span style={s.upsellPrice}>$5.99/month</span>
                      <span style={s.upsellTrial}>7-day free trial</span>
                    </div>
                    <button 
                      style={s.upsellBtn}
                      onClick={() => {
                        haptic('medium');
                        setStats(p => ({ ...p, isPro: true, dailyClues: 10 }));
                        setSwipeToast({ type: 'save', message: '✨ Pro activated! 7-day trial started' });
                        setTimeout(() => setSwipeToast(null), 3000);
                      }}
                    >
                      start free trial
                    </button>
                    <p style={s.upsellNote}>cancel anytime · no commitment</p>
                  </div>
                ) : (
                  <button 
                    style={s.loadMoreBtnPro}
                    onClick={() => {
                      haptic('light');
                      setStats(p => ({ 
                        ...p, 
                        dailyClues: p.dailyClues + 3
                      }));
                      setSwipeToast({ type: 'save', message: '5 more clues loaded' });
                      setTimeout(() => setSwipeToast(null), 2000);
                    }}
                  >
                    <span style={s.loadMoreIcon}><Icon name="lightbulb" size={20} color={CORAL} /></span>
                    <div>
                      <span style={s.loadMoreTitle}>load more clues</span>
                      <span style={s.loadMoreSub}>unlimited with Pro</span>
                    </div>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
        
        {showStreak && <StreakModal stats={stats} info={streakInfo} plgStats={plgStats} leaderboard={leaderboard} referralCode={referralCode} onClose={() => setShowStreak(false)} />}
        {showMilestone && milestone && <MilestoneModal milestone={milestone} stats={stats} onClose={() => { setShowMilestone(false); setScreen('main'); }} />}
        {showShare && shareCard && <ShareModal card={shareCard} onClose={() => setShowShare(false)} />}
        
        {/* Swipe Toast with Undo */}
        {swipeToast && (
          <div style={{
            ...s.swipeToast,
            background: swipeToast.type === 'save' ? GREEN : swipeToast.type === 'refresh' ? GREEN : DARK
          }}>
            <span>{swipeToast.message}</span>
            {swipeToast.canUndo && lastSkipped && (
              <button style={s.undoBtn} onClick={handleUndo}>Undo</button>
            )}
          </div>
        )}
      </div>
    );
  }

  // ===== MAIN APP WITH BOTTOM NAV =====
  if (screen === 'main') {
    return (
      <div style={s.ctr}>
        {/* Header */}
        <div style={{...s.header, background: CORAL}}>
          <div style={{...s.logo, cursor: 'pointer'}} onClick={() => { setActiveTab('clues'); if (!dailyComplete) setScreen('daily'); }}>
            <Logo size={28} color={DARK} /><span style={{...s.logoText, color: DARK, marginLeft: 8}}>clue</span>
          </div>
          <div style={{display: 'flex', alignItems: 'center', gap: 10}}>
            <button style={{...s.streakBtn, background: 'rgba(0,0,0,0.15)', color: DARK}} onClick={() => setShowStreak(true)}>
              <Icon name="streak" size={16} color={DARK} /> {stats.streak}
            </button>
            <button style={{...s.brainBtn, background: 'rgba(0,0,0,0.15)', color: DARK}} onClick={() => setShowBrain(true)}>
              <Icon name="brain" size={18} color={DARK} />
            </button>
            <button style={{...s.brainBtn, background: 'rgba(0,0,0,0.15)', color: DARK}} onClick={() => setShowSettings(true)}>
              <Icon name="settings" size={18} color={DARK} />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div style={s.contentArea}>
          
          {/* LEARN TAB */}
          {activeTab === 'learn' && (
            <div style={s.learnPanel}>
              <h2 style={s.panelTitle}>learn</h2>
              <p style={s.panelSub}>go deeper on what you've saved</p>
              
              {msgs.length === 0 ? (
                <div style={s.learnEmpty}>
                  {stats.saved.length > 0 ? (
                    <>
                      <div style={s.savedContext}>
                        <span style={{fontSize: 14, color: '#666'}}>Based on your saved clues:</span>
                      </div>
                      <div style={s.suggestions}>
                        {getSmartSuggestions().map((q, i) => (
                          <button key={i} style={s.suggestBtn} onClick={() => { setQuery(q); search(q); }}>{q}</button>
                        ))}
                      </div>
                    </>
                  ) : (
                    <>
                      <Logo size={48} color={'#ccc'} />
                      <p style={s.emptyLearnText}>
                        {SOCIAL_PROOF.totalUsers.toLocaleString()} people got smarter this morning
                      </p>
                      <p style={{color: '#999', fontSize: 13, marginBottom: 16}}>
                        Save your first clue to start learning
                      </p>
                      <button style={s.btnOutline} onClick={() => setActiveTab('clues')}>
                        go to daily clues
                      </button>
                    </>
                  )}
                </div>
              ) : (
                <div style={s.chat}>
                  {msgs.map((m, i) => (
                    <div key={i}>
                      <div style={m.role === 'user' ? s.userMsg : s.aiMsg}>{m.content}</div>
                      {m.relatedTo && (
                        <div style={s.relatedBadge}><Icon name="lightbulb" size={12} color={CORAL} /> Related to: {m.relatedTo}</div>
                      )}
                    </div>
                  ))}
                  {loading && <div style={s.thinking}>thinking...</div>}
                </div>
              )}
            </div>
          )}

          {/* CLUES TAB - Focused Completion State */}
          {activeTab === 'clues' && (
            <div style={s.cluesPanel}>
              {dailyComplete ? (
                <>
                  {/* Completion State - Alive and interactive */}
                  <div style={s.completeState}>
                    <div style={{...s.completeIcon, background: signalPulse ? CORAL : GREEN}}>
                      {signalPulse ? '!' : '✓'}
                    </div>
                    
                    {!signalPulse ? (
                      <>
                        <h2 style={s.completeTitle}>done for today</h2>
                        <p style={s.completeSub}>
                          {stats.saved.length > 0 
                            ? `you saved ${stats.saved.length}`
                            : 'all reviewed'}
                        </p>
                        
                        {/* Share to LinkedIn CTA - v14 virality play */}
                        {stats.saved.length > 0 && (
                          <button 
                            style={s.shareToLinkedInBtn}
                            onClick={() => openShare(stats.saved[0])}
                          >
                            <span style={{marginRight: 8}}>in</span>
                            share to LinkedIn
                          </button>
                        )}
                        
                        {/* Streak Achievement Card */}
                        <div style={s.achievementCard}>
                          <div style={s.streakBadgeLarge}>{streakInfo.current.badge}</div>
                          <div style={s.achievementInfo}>
                            <span style={s.achievementTitle}>{stats.streak} day streak!</span>
                            <span style={s.achievementPerk}>{streakInfo.current.perk}</span>
                          </div>
                          {streakInfo.next && (
                            <div style={s.nextReward}>
                              <span style={s.nextRewardText}>{streakInfo.daysToNext} days to {streakInfo.next.badge}</span>
                              <div style={s.miniProgress}>
                                <div style={{...s.miniProgressFill, width: `${((stats.streak % (streakInfo.next.days - (streakInfo.current.days || 0))) / (streakInfo.next.days - (streakInfo.current.days || 0))) * 100}%`}} />
                              </div>
                            </div>
                          )}
                        </div>
                        
                        {/* Mini Leaderboard */}
                        <div style={s.miniLeaderboard}>
                          <div style={s.miniLeaderboardHeader}>
                            <span style={{fontWeight: 600, fontSize: 14}}><Icon name="trophy" size={14} color={DARK} /> your network</span>
                            <button style={s.seeAllBtn} onClick={() => setShowStreak(true)}>see all</button>
                          </div>
                          {LEADERBOARD.slice(0, 4).map((user, i) => (
                            <div key={i} style={{...s.miniLeaderRow, background: user.isYou ? 'rgba(255,99,71,0.1)' : 'transparent'}}>
                              <span style={s.miniRank}>#{user.rank}</span>
                              <span>{user.avatar}</span>
                              <span style={{flex: 1, fontWeight: user.isYou ? 700 : 400, fontSize: 13}}>{user.name}</span>
                              <span style={{fontWeight: 600, fontSize: 13}}>{user.streak} <Icon name="streak" size={12} color={CORAL} /></span>
                            </div>
                          ))}
                        </div>
                        
                        {/* Pro upsell for non-X users */}
                        {!subscription.xConnected && (
                          <div style={s.proUpsellCard}>
                            <span style={{fontSize: 20, marginRight: 12}}>𝕏</span>
                            <div style={{flex: 1}}>
                              <span style={{display: 'block', fontWeight: 600, fontSize: 14, color: DARK}}>connect X</span>
                              <span style={{display: 'block', fontSize: 12, color: '#666'}}>get clues from who you follow</span>
                            </div>
                            <button style={s.connectXBtn} onClick={() => setShowSettings(true)}>Connect</button>
                          </div>
                        )}
                        
                        <p style={s.scanningText}>
                          <span style={s.scanningDot}>●</span> {subscription.xConnected ? 'checking for updates...' : 'checking for updates...'}
                        </p>
                      </>
                    ) : (
                      <>
                        <h2 style={s.completeTitle}>new signals detected</h2>
                        <p style={s.completeSub}>
                          {newSignals.count} things happened while you were here
                        </p>
                        
                        {/* Signal preview card */}
                        <div style={s.signalPreview}>
                          <div style={s.signalPreviewHeader}>
                            <span style={s.signalLive}>● LIVE</span>
                            <span style={s.signalTime}>just now</span>
                          </div>
                          <p style={s.signalPreviewText}>{newSignals.preview}</p>
                          <div style={s.signalHandles}>
                            {newSignals.handles?.map((h, i) => (
                              <span key={i} style={s.signalHandle}>{h}</span>
                            ))}
                          </div>
                        </div>
                        
                        <div style={s.signalActions}>
                          <button 
                            style={s.peekNowBtn} 
                            onClick={() => {
                              setShowExplore(true);
                              setFeed(buildFeed());
                              setSignalPulse(false);
                            }}
                          >
                            peek now →
                          </button>
                          <button 
                            style={s.waitBtn}
                            onClick={() => setSignalPulse(false)}
                          >
                            save for tomorrow
                          </button>
                        </div>
                      </>
                    )}
                    
                    {!signalPulse && (
                      <div style={s.nextActions}>
                        <button style={s.actionCardBtn} onClick={() => setActiveTab('library')}>
                          <span style={s.actionIconWrap}><Icon name="library" size={20} color={CORAL} /></span>
                          <span>Review library</span>
                        </button>
                        <button style={s.actionCardBtn} onClick={() => setActiveTab('learn')}>
                          <span style={s.actionIconWrap}><Icon name="lightbulb" size={20} color={CORAL} /></span>
                          <span>Go deeper</span>
                        </button>
                      </div>
                    )}
                    
                    {/* Explore feed if opened */}
                    {showExplore && (
                      <div style={s.exploreFeed}>
                        <p style={s.exploreLabel}>Fresh from your network</p>
                        {feed.slice(0, 4).map(item => (
                          <div key={item.id} style={{...s.exploreFeedCard, background: item.color, color: item.dark ? DARK : '#fff'}} onClick={() => setExpanded(expanded === item.id ? null : item.id)}>
                            {item.type === 'insight' ? (
                              <>
                                <div style={s.insightBadge}><Logo size={10} color="#fff" style={{marginRight: 4}} /> insight</div>
                                <h4 style={s.exploreTitle}>{item.icon} {item.title}</h4>
                              </>
                            ) : (
                              <h4 style={s.exploreTitle}>{item.title || item.quote}</h4>
                            )}
                            <span style={s.exploreTime}>{item.time}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div style={s.resumeDaily}>
                  <h2 style={{fontSize: 20, fontWeight: 700, color: DARK, marginBottom: 8}}>finish today's clues</h2>
                  <p style={{color: '#666', marginBottom: 20}}>{remainingClues} clue{remainingClues !== 1 ? 's' : ''} left</p>
                  <button style={s.btnDark} onClick={() => setScreen('daily')}>continue</button>
                </div>
              )}
            </div>
          )}

          {/* LIBRARY TAB - Learning-focused */}
          {activeTab === 'library' && (
            <div style={s.libraryPanel}>
              {!reviewMode ? (
                <>
                  <div style={s.libraryHeader}>
                    <div>
                      <h2 style={s.panelTitle}>your library</h2>
                      <p style={s.panelSub}>{stats.saved.length} saved · {stats.saved.filter(s => s.mastery >= 2).length} mastered</p>
                    </div>
                    {stats.saved.length > 0 && (
                      <button style={s.reviewBtn} onClick={() => { setReviewMode(true); setReviewIdx(0); setShowAnswer(false); }}>
                        <Icon name="lightbulb" size={14} color="#fff" /> review
                      </button>
                    )}
                  </div>
                  
                  {stats.saved.length === 0 ? (
                    <div style={s.emptyLibrary}>
                      <span style={s.emptyIcon}><Icon name="library" size={48} color="#ccc" /></span>
                      <p style={s.emptyTitle}>your library is empty</p>
                      <p style={s.emptyText}>
                        Join {SOCIAL_PROOF.cluesSavedToday.toLocaleString()} people who saved a clue today
                      </p>
                      <button style={s.btnOutline} onClick={() => setActiveTab('clues')}>go to daily clues</button>
                    </div>
                  ) : (
                    <div style={s.libraryList}>
                      {stats.saved.map((item, i) => (
                        <div key={item.id || i} style={s.libraryItem}>
                          <div style={s.masteryDots}>
                            {[0, 1, 2].map(dot => (
                              <div key={dot} style={{...s.masteryDot, background: (item.mastery || 0) > dot ? CORAL : '#ddd'}} />
                            ))}
                          </div>
                          <div style={s.libraryContent} onClick={() => setExpandedLibrary(expandedLibrary === (item.id || i) ? null : (item.id || i))}>
                            <div style={s.libraryMain}>
                              <span style={{...s.libraryBadge, background: item.color, color: item.dark ? DARK : '#fff'}}>
                                <Icon name={item.type === 'network' ? 'users' : item.type === 'quote' ? 'quote' : item.type === 'stat' ? 'chart' : 'lightbulb'} size={14} color="#fff" />
                              </span>
                              <div>
                                <span style={s.libraryTitle}>{item.title || item.quote}</span>
                                {item.topic && <span style={s.topicTag}>{item.topic}</span>}
                              </div>
                            </div>
                            
                            {expandedLibrary === (item.id || i) && (
                              <div style={s.libraryExpanded}>
                                <p style={s.libraryDetail}>{item.detail}</p>
                                {item.prompts && (
                                  <div style={s.libraryPrompts}>
                                    <p style={s.promptsLabel}>go deeper:</p>
                                    {item.prompts.map((p, j) => (
                                      <button key={j} style={s.promptBtnLib} onClick={(e) => { e.stopPropagation(); setQuery(p); setActiveTab('learn'); search(p); }}>{p}</button>
                                    ))}
                                  </div>
                                )}
                                <div style={s.libraryActions}>
                                  <button style={s.actionBtnSmall} onClick={(e) => { e.stopPropagation(); openShare(item); }}>↗ share</button>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                // REVIEW MODE - Flashcard style
                <div style={s.reviewContainer}>
                  <div style={s.reviewHeader}>
                    <button style={s.closeReview} onClick={() => setReviewMode(false)}>← back</button>
                    <span style={s.reviewProgress}>{reviewIdx + 1} / {stats.saved.length}</span>
                  </div>
                  
                  {stats.saved[reviewIdx] && (
                    <div style={s.flashcard}>
                      <div style={s.flashcardInner}>
                        {!showAnswer ? (
                          <>
                            <p style={s.flashcardQ}>Do you remember what this means?</p>
                            <h3 style={s.flashcardTitle}>
                              {stats.saved[reviewIdx].title || stats.saved[reviewIdx].quote}
                            </h3>
                            <button style={s.revealBtn} onClick={() => setShowAnswer(true)}>
                              show answer
                            </button>
                          </>
                        ) : (
                          <>
                            <p style={s.flashcardA}>{stats.saved[reviewIdx].detail}</p>
                            <div style={s.flashcardActions}>
                              <button style={{...s.knowBtn, background: '#fee'}} onClick={() => {
                                updateMastery(stats.saved[reviewIdx].id, false);
                                setShowAnswer(false);
                                if (reviewIdx < stats.saved.length - 1) setReviewIdx(reviewIdx + 1);
                                else setReviewMode(false);
                              }}>
                                😕 still learning
                              </button>
                              <button style={{...s.knowBtn, background: '#efe'}} onClick={() => {
                                updateMastery(stats.saved[reviewIdx].id, true);
                                setShowAnswer(false);
                                if (reviewIdx < stats.saved.length - 1) setReviewIdx(reviewIdx + 1);
                                else setReviewMode(false);
                              }}>
                                ✓ got it
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Input Bar (for Learn tab) */}
        {activeTab === 'learn' && (
          <div style={s.inputWrap}>
            <div style={s.inputBar}>
              <input 
                style={s.input} 
                placeholder="ask about your clues..." 
                value={query} 
                onChange={e => setQuery(e.target.value)} 
                onKeyDown={e => e.key === 'Enter' && search()} 
              />
              <button style={{...s.sendBtn, background: CORAL}} onClick={() => search()}>→</button>
            </div>
          </div>
        )}

        {/* Bottom Navigation - Flattened, clearer purpose */}
        <div style={s.bottomNav}>
          <button 
            style={{...s.navBtn, color: activeTab === 'learn' ? CORAL : '#999'}} 
            onClick={() => setActiveTab('learn')}
          >
            <Icon name="learn" size={22} color={activeTab === 'learn' ? CORAL : '#999'} />
            <span style={s.navLabel}>learn</span>
          </button>
          <button 
            style={{
              ...(signalPulse ? s.navBtnCenterPulse : s.navBtnCenter), 
              background: signalPulse ? CORAL : (activeTab === 'clues' ? CORAL : DARK)
            }} 
            onClick={() => {
              setActiveTab('clues');
              if (!dailyComplete) setScreen('daily');
            }}
          >
            {dailyComplete ? (
              signalPulse ? (
                <span style={{color: '#fff', fontSize: 16, fontWeight: 700}}>{newSignals.count}</span>
              ) : (
                <Logo size={20} color="#fff" />
              )
            ) : (
              <Logo size={20} color="#fff" />
            )}
          </button>
          <button 
            style={{...s.navBtn, color: activeTab === 'library' ? CORAL : '#999'}} 
            onClick={() => setActiveTab('library')}
          >
            <Icon name="library" size={22} color={activeTab === 'library' ? CORAL : '#999'} />
            <span style={s.navLabel}>library</span>
            {stats.saved.length > 0 && <span style={s.navBadge}>{stats.saved.length}</span>}
          </button>
        </div>

        {/* Modals */}
        {showStreak && <StreakModal stats={stats} info={streakInfo} plgStats={plgStats} leaderboard={leaderboard} referralCode={referralCode} onClose={() => setShowStreak(false)} />}
        {showShare && shareCard && <ShareModal card={shareCard} onClose={() => setShowShare(false)} />}
        {showBrain && <BrainModal stats={stats} topicStats={topicStats} onClose={() => setShowBrain(false)} />}
        {showSettings && <SettingsModal stats={stats} setStats={setStats} plgStats={plgStats} authMethod={authMethod} deliveryTime={deliveryTime} setDeliveryTime={setDeliveryTime} subscription={subscription} setSubscription={setSubscription} token={token} onClose={() => setShowSettings(false)} />}
      </div>
    );
  }

  return null;
}

// ===== MODALS =====
function StreakModal({ stats, info, plgStats, leaderboard: lbData, referralCode, onClose }) {
  const lb = lbData || LEADERBOARD;
  const [activeTab, setActiveTab] = useState('streak');
  
  return (
    <div style={s.modalBg} onClick={onClose}><div style={{...s.modal, maxWidth: 380}} onClick={e => e.stopPropagation()}>
      {/* Tab Switcher */}
      <div style={s.modalTabs}>
        <button 
          style={{...s.modalTab, borderBottom: activeTab === 'streak' ? `3px solid ${CORAL}` : 'none'}}
          onClick={() => setActiveTab('streak')}
        >
          <Icon name="streak" size={14} color={DARK} /> Streak
        </button>
        <button 
          style={{...s.modalTab, borderBottom: activeTab === 'leaderboard' ? `3px solid ${CORAL}` : 'none'}}
          onClick={() => setActiveTab('leaderboard')}
        >
          <Icon name="trophy" size={14} color={DARK} /> Leaderboard
        </button>
        <button 
          style={{...s.modalTab, borderBottom: activeTab === 'referrals' ? `3px solid ${CORAL}` : 'none'}}
          onClick={() => setActiveTab('referrals')}
        >
          <Icon name="users" size={14} color={DARK} /> Referrals
        </button>
      </div>
      
      {activeTab === 'streak' && (
        <>
          <div style={{fontSize: 48, marginTop: 16}}>{info.current.badge}</div>
          <h2 style={{fontSize: 24, fontWeight: 700}}>{stats.streak} day streak</h2>
          <p style={{color: '#666'}}>{info.current.title}</p>
          <div style={s.shieldRow}><span>🛡</span><span>{stats.shields} shield{stats.shields !== 1 ? 's' : ''}</span></div>
          <p style={{color: CORAL, fontWeight: 600}}>✓ {info.current.perk}</p>
          {info.next && (
            <div style={s.nextBox}>
              <p style={{color: '#999', fontSize: 12}}>next: {info.next.badge} {info.next.title} in {info.daysToNext} days</p>
              <div style={s.progBar}><div style={{...s.progBarFill, width: `${(stats.streak / info.next.days) * 100}%`, background: CORAL}} /></div>
            </div>
          )}
        </>
      )}
      
      {activeTab === 'leaderboard' && (
        <div style={s.leaderboardSection}>
          <h3 style={s.leaderboardTitle}>your network this week</h3>
          <div style={s.leaderboardList}>
            {lb.map((user, i) => (
              <div key={i} style={{...s.leaderboardRow, background: user.isYou ? 'rgba(255,99,71,0.1)' : 'transparent'}}>
                <span style={s.leaderboardRank}>#{user.rank}</span>
                <span style={{...s.avatarCircle, width: 32, height: 32, fontSize: 11}}>{user.avatar || '👤'}</span>
                <div style={s.leaderboardInfo}>
                  <span style={{...s.leaderboardName, fontWeight: user.isYou ? 700 : 500}}>{user.name}</span>
                  {user.isConnection && <span style={s.connectionBadge}><Icon name="link" size={10} color="#999" /></span>}
                </div>
                <div style={s.leaderboardStreak}>
                  <span style={{fontWeight: 700}}>{user.streak}</span>
                  <span style={{fontSize: 10, color: '#999'}}>days</span>
                </div>
              </div>
            ))}
          </div>
          <p style={s.leaderboardSub}>You're #{lb.find(u => u.isYou)?.rank || '?'} in your network</p>
        </div>
      )}
      
      {activeTab === 'referrals' && (
        <div style={s.referralSection}>
          <div style={s.referralHeader}>
            <div style={{...s.avatarCircle, width: 48, height: 48, fontSize: 16, background: DARK}}><Icon name="users" size={24} color="#fff" /></div>
            <div>
              <h3 style={{margin: 0, fontSize: 18, fontWeight: 700}}>{plgStats.referrals} friends invited</h3>
              <p style={{margin: 0, color: '#666', fontSize: 13}}>Invite 3 to unlock unlimited clues for a week</p>
            </div>
          </div>
          
          <div style={s.referralProgress}>
            {[1, 2, 3].map(i => (
              <div key={i} style={{...s.referralDot, background: plgStats.referrals >= i ? GREEN : '#ddd'}}>
                {plgStats.referrals >= i ? <Icon name="check" size={16} color="#fff" strokeWidth={2.5} /> : i}
              </div>
            ))}
          </div>
          
          {referralCode && (
            <div style={{background: '#f5f5f5', borderRadius: 12, padding: '10px 14px', marginTop: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8}}>
              <span style={{fontSize: 13, color: '#555', fontFamily: 'monospace'}}>clue.app/join/{referralCode}</span>
              <button
                style={{padding: '6px 12px', background: CORAL, border: 'none', borderRadius: 8, color: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer'}}
                onClick={() => navigator.clipboard?.writeText(`https://clue.app/join/${referralCode}`)}
              >copy</button>
            </div>
          )}
          {plgStats.referrals >= 3 ? (
            <div style={s.referralUnlocked}>
              <span>🎉</span> Unlimited clues unlocked for 7 days!
            </div>
          ) : (
            <button
              style={{...s.btn, background: CORAL, marginTop: 16}}
              onClick={() => {
                const link = referralCode ? `https://clue.app/join/${referralCode}` : 'https://clue.app';
                if (navigator.share) {
                  navigator.share({ title: 'Join Clue', text: 'Check out Clue — the best of your feed every morning', url: link }).catch(console.error);
                } else {
                  navigator.clipboard?.writeText(link);
                }
              }}
            >
              invite friends
            </button>
          )}
          
          <h4 style={s.activityTitle}>friend activity</h4>
          <div style={s.activityList}>
            {REFERRAL_ACTIVITY.map((activity, i) => (
              <div key={i} style={s.activityRow}>
                <span style={s.activityEmoji}>{activity.emoji}</span>
                <div style={s.activityInfo}>
                  <span style={s.activityText}>
                    <strong>{activity.name}</strong> from {activity.source} {activity.event}
                  </span>
                  <span style={s.activityTime}>{activity.timeAgo}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <button style={{...s.btn, background: DARK, marginTop: 16}} onClick={onClose}>done</button>
    </div></div>
  );
}

function MilestoneModal({ milestone, stats, onClose }) {
  return (
    <div style={s.modalBg} onClick={onClose}><div style={{...s.modal, background: CORAL}} onClick={e => e.stopPropagation()}>
      <div style={s.milestoneBadge}>{milestone.badge}</div>
      <h2 style={{fontSize: 24, fontWeight: 700, color: '#fff'}}>{milestone.days} day streak!</h2>
      <p style={{color: 'rgba(255,255,255,0.8)'}}>{milestone.title}</p>
      <div style={{...s.unlockBox, background: DARK}}>🔓 {milestone.perk}</div>
      <button style={{...s.btn, background: DARK}} onClick={onClose}>continue</button>
    </div></div>
  );
}

function ShareModal({ card, onClose }) {
  const [copied, setCopied] = useState(false);
  const copy = generateCopy(card);

  const recordShare = (platform) => {
    const tok = getToken();
    if (tok && card?.id) {
      apiFetch(`/shares/${card.id}`, {
        method: 'POST',
        body: JSON.stringify({ platform }),
      }).catch(console.error);
    }
  };

  const handleCopy = () => {
    navigator.clipboard?.writeText(copy);
    setCopied(true);
    recordShare('copy');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareX = () => {
    const text = encodeURIComponent(copy);
    window.open(`https://x.com/intent/tweet?text=${text}`, '_blank');
    recordShare('x');
    onClose();
  };

  const handleShareLinkedIn = () => {
    const text = encodeURIComponent(copy);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent('https://clue.app')}&summary=${text}`, '_blank');
    recordShare('linkedin');
    onClose();
  };

  return (
    <div style={s.modalBg} onClick={onClose}><div style={s.shareModal} onClick={e => e.stopPropagation()}>
      <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 16}}>
        <span style={{fontWeight: 700, fontSize: 18}}>share this clue</span>
        <button style={s.closeBtn} onClick={onClose}>×</button>
      </div>

      {/* Inline preview */}
      <div style={{...s.sharePreview, background: card.color, color: card.dark ? DARK : '#fff'}}>
        <div style={s.sharePreviewContent}>
          <span style={{fontSize: 12, opacity: 0.7}}>{card.badge || '🔍 clue'}</span>
          <p style={{fontWeight: 700, fontSize: 16, margin: '8px 0'}}>{card.title || card.quote}</p>
          <span style={{fontSize: 12, opacity: 0.7}}>via Clue</span>
        </div>
      </div>

      {/* Editable copy */}
      <div style={s.copySection}>
        <textarea style={s.copyTextarea} defaultValue={copy} rows={4} />
        <button style={{...s.copyBtn, background: copied ? GREEN : CORAL}} onClick={handleCopy}>
          {copied ? '✓ copied' : 'copy'}
        </button>
      </div>

      <button style={{...s.btn, background: DARK, marginBottom: 8}} onClick={handleShareX}>post to X</button>
      <button style={{...s.btn, background: '#0077B5'}} onClick={handleShareLinkedIn}>share on LinkedIn</button>
    </div></div>
  );
}

function BrainModal({ stats, topicStats, onClose }) {
  return (
    <div style={s.modalBg} onClick={onClose}><div style={s.modal} onClick={e => e.stopPropagation()}>
      <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 20}}>
        <span style={{fontWeight: 700, fontSize: 20}}>your brain</span>
        <button style={s.closeBtn} onClick={onClose}>×</button>
      </div>
      
      <div style={s.brainStat}>
        <span style={s.brainNum}>{stats.totalLearned}</span>
        <span style={s.brainLabel}>things learned this month</span>
      </div>
      
      <h3 style={{fontSize: 14, fontWeight: 600, color: '#666', marginTop: 24, marginBottom: 12}}>topics you're exploring</h3>
      
      {topicStats.length === 0 ? (
        <p style={{color: '#999', textAlign: 'center', padding: 20}}>Save some clues to see your topics</p>
      ) : (
        <div style={s.topicList}>
          {topicStats.map((topic, i) => (
            <div key={i} style={s.topicRow}>
              <span style={s.topicName}>{topic.name}</span>
              <div style={s.topicBar}>
                <div style={{...s.topicBarFill, width: `${(topic.count / Math.max(...topicStats.map(t => t.count))) * 100}%`}} />
              </div>
              <span style={s.topicCount}>{topic.count}</span>
            </div>
          ))}
        </div>
      )}
      
      <button style={{...s.btn, background: DARK, marginTop: 24}} onClick={onClose}>done</button>
    </div></div>
  );
}

function SettingsModal({ stats, setStats, plgStats, authMethod, deliveryTime, setDeliveryTime, subscription, setSubscription, token, onClose }) {
  const handleUpgrade = async () => {
    if (token) {
      try {
        const data = await apiFetch('/subscription/checkout', { method: 'POST' });
        if (data.url) {
          window.location.href = data.url;
          return;
        }
      } catch (err) {
        console.error('Checkout error:', err);
      }
    }
    // Fallback: optimistically set local state
    setSubscription && setSubscription(p => ({ ...p, plan: 'monthly', isPro: true }));
    onClose();
  };

  const handleManageBilling = async () => {
    if (token) {
      try {
        const data = await apiFetch('/subscription/portal', { method: 'POST' });
        if (data.url) { window.location.href = data.url; return; }
      } catch (err) { console.error('Portal error:', err); }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('clue_token');
    window.location.reload();
  };
  return (
    <div style={s.modalBg} onClick={onClose}><div style={{...s.modal, maxWidth: 380, textAlign: 'left'}} onClick={e => e.stopPropagation()}>
      <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 20}}>
        <span style={{fontWeight: 700, fontSize: 20}}>settings</span>
        <button style={s.closeBtn} onClick={onClose}>×</button>
      </div>
      
      {/* Account Section */}
      <div style={s.settingsSection}>
        <h3 style={s.settingsSectionTitle}>account</h3>
        <div style={s.settingsCard}>
          <div style={s.settingsRow}>
            <span style={s.settingsLabel}>signed in with</span>
            <span style={s.settingsValue}>
              {authMethod === 'google' && '🔵 Google'}
              {authMethod === 'x' && '⬛ X'}
              {authMethod === 'linkedin' && '🔷 LinkedIn'}
              {authMethod === 'email' && '✉️ Email'}
              {!authMethod && '✉️ Email'}
            </span>
          </div>
          <div style={s.settingsRow}>
            <span style={s.settingsLabel}>member since</span>
            <span style={s.settingsValue}>Feb 2026</span>
          </div>
        </div>
      </div>
      
      {/* Subscription Section - v14 pricing */}
      <div style={s.settingsSection}>
        <h3 style={s.settingsSectionTitle}>subscription</h3>
        {subscription.plan === 'trial' ? (
          <div style={s.proUpgradeCard}>
            <div style={s.proUpgradeHeader}>
              <div>
                <span style={{...s.proBadge, background: CORAL}}>TRIAL</span>
                <p style={s.proCurrentPlan}>7-day free trial active</p>
              </div>
            </div>
            <div style={s.proUpgradeOffer}>
              <h4 style={s.proOfferTitle}>Upgrade to keep your clues</h4>
              <ul style={s.proFeatureList}>
                <li>5 daily clues from your X network</li>
                <li>Real-time signals as they happen</li>
                <li>AI-powered learning & summaries</li>
                <li>Share insights to LinkedIn</li>
              </ul>
              <div style={s.proPricing}>
                <span style={s.proPrice}>$5</span>
                <span style={s.proPeriod}>/month</span>
                <span style={{marginLeft: 12, fontSize: 12, color: '#666'}}>or $50/year (save $10)</span>
              </div>
              <button
                style={s.proUpgradeBtn}
                onClick={handleUpgrade}
              >
                Upgrade Now
              </button>
            </div>
          </div>
        ) : !subscription.isPro ? (
          <div style={s.proUpgradeCard}>
            <div style={s.proUpgradeHeader}>
              <div>
                <span style={s.proBadge}>FREE</span>
                <p style={s.proCurrentPlan}>Topic-based clues only</p>
              </div>
            </div>
            <div style={s.proUpgradeOffer}>
              <div style={s.proOfferBadge}>✨ PRO</div>
              <h4 style={s.proOfferTitle}>connect X</h4>
              <ul style={s.proFeatureList}>
                <li>5 clues from your X feed</li>
                <li>updates throughout the day</li>
                <li>ask questions about what you've saved</li>
                <li>share to LinkedIn</li>
              </ul>
              <div style={s.proPricing}>
                <span style={s.proPrice}>$5</span>
                <span style={s.proPeriod}>/month</span>
                <span style={{marginLeft: 12, fontSize: 12, color: '#666'}}>or $50/year</span>
              </div>
              <button
                style={s.proUpgradeBtn}
                onClick={handleUpgrade}
              >
                Upgrade to Pro
              </button>
              <p style={s.proTrial}>7-day free trial · cancel anytime</p>
            </div>
          </div>
        ) : (
          <div style={s.settingsCard}>
            <div style={s.settingsRow}>
              <span style={s.settingsLabel}>plan</span>
              <span style={{...s.settingsValue, color: CORAL, fontWeight: 700}}>
                ✨ Pro {subscription.plan === 'annual' ? '(Annual)' : '(Monthly)'}
              </span>
            </div>
            <div style={s.settingsRow}>
              <span style={s.settingsLabel}>price</span>
              <span style={s.settingsValue}>
                {subscription.plan === 'annual' ? '$50/year' : '$5/month'}
              </span>
            </div>
            <div style={s.settingsRow}>
              <span style={s.settingsLabel}>X signals</span>
              <span style={{...s.settingsValue, color: GREEN}}>
                {subscription.xConnected ? '✓ Connected' : 'Not connected'}
              </span>
            </div>
            <button style={s.manageSubBtn} onClick={handleManageBilling}>Manage Subscription</button>
          </div>
        )}
      </div>
      
      {/* Preferences Section */}
      <div style={s.settingsSection}>
        <h3 style={s.settingsSectionTitle}>preferences</h3>
        <div style={s.settingsCard}>
          <div style={s.settingsRow}>
            <span style={s.settingsLabel}>daily clue delivery</span>
            <select 
              style={s.settingsSelect}
              value={deliveryTime}
              onChange={(e) => setDeliveryTime(e.target.value)}
            >
              <option value="6am">6:00 AM</option>
              <option value="7am">7:00 AM</option>
              <option value="8am">8:00 AM</option>
              <option value="9am">9:00 AM</option>
            </select>
          </div>
          <div style={s.settingsRow}>
            <span style={s.settingsLabel}>push notifications</span>
            <span style={s.settingsToggle}><Icon name="check" size={14} color="#fff" strokeWidth={2.5} /></span>
          </div>
        </div>
      </div>
      
      {/* Connected Accounts - Updated for v14 */}
      <div style={s.settingsSection}>
        <h3 style={s.settingsSectionTitle}>connected accounts</h3>
        <div style={s.settingsCard}>
          <div style={s.settingsRow}>
            <div>
              <span style={s.settingsLabel}>𝕏 Twitter</span>
              <span style={s.settingsSubLabel}>powers your clues</span>
            </div>
            <span style={{...s.settingsValue, color: GREEN, display: 'flex', alignItems: 'center', gap: 4}}>
              <Icon name="check" size={14} color={GREEN} strokeWidth={2.5} /> connected
            </span>
          </div>
          <div style={s.settingsRow}>
            <div>
              <span style={s.settingsLabel}>LinkedIn</span>
              <span style={s.settingsSubLabel}>sharing + context</span>
            </div>
            <span style={{...s.settingsValue, color: GREEN, display: 'flex', alignItems: 'center', gap: 4}}>
              <Icon name="check" size={14} color={GREEN} strokeWidth={2.5} /> connected
            </span>
          </div>
        </div>
      </div>
      
      {/* Privacy Section - Updated for v14 */}
      <div style={s.settingsSection}>
        <h3 style={s.settingsSectionTitle}>privacy</h3>
        
        {/* Privacy Promise Card */}
        <div style={s.privacyPromiseCard}>
          <div style={s.privacyIcon}><Icon name="lock" size={28} color="#fff" /></div>
          <h4 style={s.privacyTitle}>your data</h4>
          <p style={s.privacyDesc}>
            we read your feed, find what matters, then delete it. we don't store or sell anything.
          </p>
        </div>
        
        <div style={s.settingsCard}>
          <div style={s.settingsRow}>
            <div>
              <span style={s.settingsLabel}>network scanning</span>
              <span style={s.settingsSubLabel}>analyze who you follow for clues</span>
            </div>
            <span style={s.settingsToggle}><Icon name="check" size={14} color="#fff" strokeWidth={2.5} /></span>
          </div>
          <div style={s.settingsRow}>
            <div>
              <span style={s.settingsLabel}>personalized insights</span>
              <span style={s.settingsSubLabel}>tailor clues to your interests</span>
            </div>
            <span style={s.settingsToggle}><Icon name="check" size={14} color="#fff" strokeWidth={2.5} /></span>
          </div>
          <div style={s.settingsRow}>
            <div>
              <span style={s.settingsLabel}>usage analytics</span>
              <span style={s.settingsSubLabel}>help us improve Clue</span>
            </div>
            <span style={s.settingsToggle}><Icon name="check" size={14} color="#fff" strokeWidth={2.5} /></span>
          </div>
        </div>
        
        {/* Data Practices */}
        <div style={s.privacyDetails}>
          <div style={s.privacyDetailRow}>
            <span style={s.privacyDetailIcon}><Icon name="trash" size={16} color={DARK} /></span>
            <span style={s.privacyDetailText}>Network data deleted every 24 hours</span>
          </div>
          <div style={s.privacyDetailRow}>
            <span style={s.privacyDetailIcon}><Icon name="x" size={16} color={DARK} /></span>
            <span style={s.privacyDetailText}>We never sell your data to third parties</span>
          </div>
          <div style={s.privacyDetailRow}>
            <span style={s.privacyDetailIcon}><Icon name="shield" size={16} color={DARK} /></span>
            <span style={s.privacyDetailText}>Clues processed on-device when possible</span>
          </div>
          <div style={s.privacyDetailRow}>
            <span style={s.privacyDetailIcon}><Icon name="lock" size={16} color={DARK} /></span>
            <span style={s.privacyDetailText}>End-to-end encryption for all data</span>
          </div>
        </div>
        
        <div style={s.privacyLinks}>
          <button style={s.privacyLinkBtn}>privacy policy</button>
          <span style={s.privacyLinkDivider}>·</span>
          <button style={s.privacyLinkBtn}>terms of service</button>
          <span style={s.privacyLinkDivider}>·</span>
          <button style={s.privacyLinkBtn}>download my data</button>
        </div>
      </div>
      
      {/* Danger Zone */}
      <div style={s.settingsSection}>
        <button style={s.logoutBtn} onClick={handleLogout}>log out</button>
      </div>
    </div></div>
  );
}

// ===== STYLES =====
const s = {
  ctr: { fontFamily: "'Space Grotesk', system-ui", background: CREAM, minHeight: '100vh', maxWidth: 430, margin: '0 auto', position: 'relative' },
  oobe: { minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 32 },
  title: { fontSize: 56, fontWeight: 700, color: '#fff', marginTop: 24, marginBottom: 8 },
  sub: { color: '#fff', marginBottom: 48 },
  btn: { width: '100%', padding: 16, background: DARK, border: 'none', borderRadius: 14, color: '#fff', fontSize: 16, fontWeight: 600, cursor: 'pointer' },
  btnDark: { width: '100%', padding: 16, background: DARK, border: 'none', borderRadius: 14, color: '#fff', fontSize: 16, fontWeight: 600, cursor: 'pointer' },
  btnOutline: { padding: '14px 28px', background: 'transparent', border: `2px solid ${DARK}`, borderRadius: 14, fontSize: 15, fontWeight: 600, cursor: 'pointer', color: DARK },
  h2: { fontSize: 24, fontWeight: 700, marginBottom: 16, textAlign: 'center', color: DARK },
  desc: { color: '#666', marginBottom: 24, textAlign: 'center' },
  prog: { position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: 'rgba(0,0,0,0.1)' },
  progFill: { height: '100%', background: CORAL },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, width: '100%', marginBottom: 24 },
  goalCard: { background: '#fff', borderRadius: 16, padding: 16, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, cursor: 'pointer', border: '3px solid transparent' },
  goalIcon: { width: 48, height: 48, borderRadius: '50%', background: CREAM, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  actionIconWrap: { width: 44, height: 44, borderRadius: '50%', background: 'rgba(255,99,71,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  emptyIcon: { marginBottom: 16 },
  timeIcon: { width: 36, height: 36, borderRadius: '50%', background: CREAM, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  tagIcon: { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 20, height: 20, borderRadius: '50%', background: 'rgba(255,255,255,0.3)', fontSize: 10, fontWeight: 700, marginRight: 4 },
  loadMoreIcon: { width: 40, height: 40, borderRadius: '50%', background: 'rgba(255,99,71,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  profCard: { background: '#fff', borderRadius: 16, padding: 14, display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', position: 'relative', border: '3px solid transparent' },
  profIcon: { width: 36, height: 36, borderRadius: '50%', background: CORAL, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700 },
  check: { position: 'absolute', top: 6, right: 8, fontWeight: 700 },
  avatarCircle: { width: 28, height: 28, borderRadius: '50%', background: CORAL, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700 },
  valueIcon: { width: 80, height: 80, borderRadius: '50%', background: 'rgba(255,99,71,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 },
  valuePropContent: { textAlign: 'center', marginBottom: 16 },
  valuePropSetup: { fontSize: 20, color: DARK, margin: '0 0 8px', lineHeight: 1.4 },
  valuePropHeadline: { fontSize: 36, fontWeight: 700, color: CORAL, margin: '0 0 24px' },
  valuePropExplain: { fontSize: 16, color: '#666', lineHeight: 1.6, maxWidth: 300, margin: '0 auto 16px' },
  valuePropTime: { fontSize: 15, color: DARK, fontWeight: 600 },
  valuePropPoints: { display: 'flex', flexDirection: 'column', gap: 16, marginTop: 40 },
  valuePropPoint: { display: 'flex', alignItems: 'center', gap: 16, background: '#fff', padding: '16px 20px', borderRadius: 14 },
  valuePropNumber: { fontSize: 28, fontWeight: 700, color: CORAL, width: 40 },
  valuePropText: { fontSize: 15, color: DARK, textAlign: 'left' },
  skip: { background: 'none', border: 'none', color: '#999', marginTop: 16, cursor: 'pointer' },
  
  // Auth options
  authOptions: { width: '100%', display: 'flex', flexDirection: 'column', gap: 12 },
  authBtn: { width: '100%', padding: 16, borderRadius: 14, border: 'none', fontSize: 15, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 },
  authIcon: { fontSize: 18, fontWeight: 700 },
  authDivider: { display: 'flex', alignItems: 'center', gap: 16, color: '#999', fontSize: 13, margin: '8px 0' },
  privacyNotice: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 20, padding: '10px 16px', background: 'rgba(46, 139, 87, 0.1)', borderRadius: 10, fontSize: 12, color: GREEN, fontWeight: 500 },
  privacyBadge: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 20, padding: '10px 16px', background: '#fff', borderRadius: 10, fontSize: 12, color: '#666' },
  
  // Pricing (v14)
  pricingHeader: { textAlign: 'center', marginBottom: 24 },
  pricingFeatures: { width: '100%', marginBottom: 24 },
  pricingFeature: { display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', fontSize: 14, color: DARK },
  pricingOptions: { width: '100%', display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 },
  pricingOption: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 20, background: '#fff', borderRadius: 16, cursor: 'pointer', border: '3px solid transparent' },
  pricingOptionMain: { display: 'flex', alignItems: 'baseline', gap: 4 },
  pricingPrice: { fontSize: 32, fontWeight: 700, color: DARK },
  pricingPeriod: { fontSize: 16, color: '#666' },
  pricingSave: { marginLeft: 8, padding: '4px 8px', background: GREEN, color: '#fff', borderRadius: 6, fontSize: 11, fontWeight: 600 },
  applePayBtn: { width: '100%', padding: 16, background: '#000', border: 'none', borderRadius: 14, color: '#fff', fontSize: 16, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 },
  applePayIcon: { fontSize: 20 },
  trialLink: { background: 'none', border: 'none', color: '#999', fontSize: 14, marginTop: 16, cursor: 'pointer', textDecoration: 'underline' },
  trialBadge: { background: 'rgba(0,0,0,0.2)', padding: '8px 16px', borderRadius: 20, marginBottom: 16, fontSize: 13, color: '#fff' },
  
  // Signal Engine (X Connect - v14)
  signalFeatures: { width: '100%', marginBottom: 24 },
  signalFeature: { display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', background: '#fff', borderRadius: 12, marginBottom: 8, fontSize: 14, color: DARK },
  signalIcon: { fontSize: 18 },
  skipAlt: { background: 'none', border: 'none', color: CORAL, marginTop: 16, cursor: 'pointer', fontSize: 14 },
  
  // LinkedIn Identity (v14)
  linkedinFeatures: { width: '100%', marginBottom: 24 },
  linkedinFeature: { display: 'flex', alignItems: 'flex-start', gap: 12, padding: '16px', background: '#fff', borderRadius: 12, marginBottom: 8 },
  linkedinIcon: { fontSize: 20, marginTop: 2 },
  linkedinFeatureTitle: { display: 'block', fontWeight: 600, fontSize: 14, color: DARK, marginBottom: 2 },
  linkedinFeatureDesc: { display: 'block', fontSize: 12, color: '#666' },
  
  // Privacy Commitment Screen (v14)
  privacyHero: { width: 80, height: 80, borderRadius: '50%', background: 'rgba(46, 139, 87, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 },
  privacyCommitments: { width: '100%' },
  privacyCommitment: { display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', fontSize: 14, color: '#fff', borderBottom: '1px solid rgba(255,255,255,0.1)' },
  
  // Sources Summary (v14)
  sourcesSummary: { marginTop: 16, marginBottom: 24 },
  
  // Source Type Badge on Cards (v14)
  sourceTypeBadge: { display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 8px', borderRadius: 6, fontSize: 10, fontWeight: 600, marginLeft: 8 },
  
  // Add Source Modal (v14)
  addSourceModal: { width: '100%', maxWidth: 380, background: CREAM, borderRadius: 24, padding: 24, maxHeight: '90vh', overflow: 'auto' },
  addSourceOption: { display: 'flex', alignItems: 'center', gap: 16, padding: 20, background: '#fff', borderRadius: 16, marginBottom: 12, cursor: 'pointer', border: 'none', width: '100%', textAlign: 'left' },
  addSourceIcon: { width: 48, height: 48, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 },
  addSourceInfo: { flex: 1 },
  addSourceTitle: { display: 'block', fontWeight: 600, fontSize: 15, color: DARK, marginBottom: 4 },
  addSourceDesc: { display: 'block', fontSize: 12, color: '#666' },
  
  // Topic Picker (v14)
  topicGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 16 },
  topicChip: { display: 'flex', alignItems: 'center', gap: 8, padding: '12px 16px', background: '#fff', borderRadius: 12, cursor: 'pointer', border: '2px solid transparent', fontSize: 14 },
  topicChipSelected: { borderColor: CORAL, background: 'rgba(255,99,71,0.1)' },
  topicEmoji: { fontSize: 18 },
  
  // Delivery time
  timeOptions: { width: '100%', display: 'flex', flexDirection: 'column', gap: 10 },
  timeOption: { display: 'flex', alignItems: 'center', gap: 16, padding: 16, background: '#fff', borderRadius: 14, cursor: 'pointer', border: '3px solid transparent' },
  timeLabel: { display: 'block', fontWeight: 700, fontSize: 16, color: DARK },
  timeDesc: { display: 'block', fontSize: 13, color: '#666' },
  
  // Pull to refresh
  pullIndicator: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', transition: 'height 0.2s' },
  pullIcon: { fontSize: 20, color: CORAL, transition: 'transform 0.3s' },
  pullText: { fontSize: 12, color: '#999', marginTop: 4 },
  
  // Loading state
  loadingState: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 60 },
  loadingSpinner: { fontSize: 32, color: CORAL, animation: 'spin 1s linear infinite' },
  loadingText: { color: '#666', marginTop: 16 },
  
  // Undo button
  undoBtn: { marginLeft: 12, padding: '4px 12px', background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: 8, color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer' },
  
  // Source links
  sourcesTitle: { fontSize: 12, color: 'rgba(255,255,255,0.6)', marginBottom: 8 },
  sourceLink: { display: 'flex', alignItems: 'center', gap: 8, width: '100%', padding: 12, marginBottom: 6, background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: 10, cursor: 'pointer', textAlign: 'left' },
  sourceLinkHandle: { fontWeight: 600, color: '#fff', fontSize: 13 },
  sourceLinkNote: { flex: 1, color: 'rgba(255,255,255,0.7)', fontSize: 13 },
  sourceLinkIcon: { color: 'rgba(255,255,255,0.5)', fontSize: 14 },
  
  // View original
  viewOriginal: { display: 'flex', gap: 8, marginTop: 12, marginBottom: 16 },
  viewOriginalBtn: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 12, background: DARK, border: 'none', borderRadius: 10, color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer' },
  
  transform: { display: 'flex', alignItems: 'center', gap: 24, marginBottom: 24 },
  tSide: { textAlign: 'center' },
  tLabel: { fontSize: 13, color: '#666' },
  tTime: { fontSize: 22, fontWeight: 700 },
  arrow: { fontSize: 24, fontWeight: 700 },
  xLogo: { width: 72, height: 72, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, color: '#fff', marginBottom: 16 },
  liLogo: { width: 72, height: 72, background: '#fff', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, fontWeight: 700, color: '#0077B5', marginBottom: 16 },
  liBtn: { width: '100%', padding: 16, background: '#fff', border: 'none', borderRadius: 14, color: '#0077B5', fontSize: 16, fontWeight: 600, cursor: 'pointer', marginBottom: 8 },
  checkCircle: { width: 72, height: 72, borderRadius: '50%', background: DARK, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  tags: { display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 8, marginBottom: 24 },
  tag: { padding: '8px 16px', borderRadius: 20, fontSize: 13 },
  
  // Sample card in onboarding
  sampleCard: { width: '100%', borderRadius: 20, padding: 20, color: '#fff' },
  sampleCardInner: { marginBottom: 16 },
  sampleBadge: { fontSize: 12, opacity: 0.8 },
  sampleTitle: { fontSize: 22, fontWeight: 700, margin: '12px 0 8px' },
  sampleSub: { fontSize: 14, opacity: 0.8 },
  sampleHandles: { display: 'flex', gap: 8, marginTop: 16 },
  sampleHandle: { background: 'rgba(255,255,255,0.2)', padding: '6px 12px', borderRadius: 20, fontSize: 13 },
  sampleMeta: { display: 'flex', justifyContent: 'space-between', fontSize: 12, opacity: 0.7 },
  
  // Header
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px' },
  logo: { display: 'flex', alignItems: 'center' },
  logoText: { fontWeight: 700, fontSize: 20 },
  streakBtn: { display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 20, border: 'none', cursor: 'pointer', fontSize: 16, fontWeight: 600 },
  brainBtn: { padding: '8px 12px', borderRadius: 20, border: 'none', cursor: 'pointer', fontSize: 16 },
  
  // Context header on daily
  contextHeader: { padding: '12px 20px', background: 'rgba(0,0,0,0.03)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  contextText: { fontSize: 13, color: DARK },
  contextTime: { fontSize: 12, color: '#999' },
  
  // Daily
  dailyProg: { height: 4, margin: '0 20px', borderRadius: 2 },
  dailyFill: { height: '100%', borderRadius: 2 },
  dailyCount: { textAlign: 'center', margin: '8px 0', fontSize: 13, fontWeight: 600 },
  cardWrap: { padding: '8px 20px' },
  dailyCard: { borderRadius: 24, padding: 24, minHeight: 300, display: 'flex', flexDirection: 'column', position: 'relative', transition: 'all 0.25s' },
  cardTop: { display: 'flex', justifyContent: 'space-between', marginBottom: 12 },
  cardBadge: { opacity: 0.8, fontSize: 13, fontWeight: 600 },
  cardTime: { opacity: 0.7, fontSize: 12 },
  cardTitle: { fontSize: 26, fontWeight: 700, lineHeight: 1.1 },
  cardSub: { opacity: 0.8, marginTop: 8, marginBottom: 16 },
  handles: { display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 'auto' },
  handle: { background: 'rgba(255,255,255,0.2)', padding: '6px 12px', borderRadius: 20, fontSize: 13, fontWeight: 600 },
  quoteMark: { fontSize: 56, fontWeight: 700, opacity: 0.2, lineHeight: 0.5 },
  quoteText: { fontSize: 22, fontWeight: 600, lineHeight: 1.2 },
  quoteAuthor: { marginTop: 'auto', opacity: 0.7 },
  tipStat: { marginTop: 'auto' },
  tipNum: { fontSize: 40, fontWeight: 700, display: 'block' },
  bigStat: { fontSize: 48, fontWeight: 700 },
  statSource: { marginTop: 'auto', opacity: 0.6, fontSize: 12 },
  cardBrand: { position: 'absolute', bottom: 24, right: 24 },
  swipeRow: { display: 'flex', gap: 16, justifyContent: 'center', padding: 20 },
  swipeBtn: { flex: 1, maxWidth: 140, padding: 16, border: 'none', borderRadius: 16, fontSize: 16, fontWeight: 600, cursor: 'pointer' },
  swipeHint: { textAlign: 'center', fontSize: 13, fontWeight: 600 },
  
  // Content Area
  contentArea: { height: 'calc(100vh - 140px)', overflowY: 'auto', paddingBottom: 20 },
  
  // Bottom Nav - flattened
  bottomNav: { position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: 430, display: 'flex', justifyContent: 'space-around', alignItems: 'center', padding: '16px 20px 32px', background: '#fff', borderTop: '1px solid #eee' },
  navBtn: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, background: 'none', border: 'none', cursor: 'pointer', position: 'relative' },
  navBtnCenter: { width: 48, height: 48, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer', transition: 'all 0.3s' },
  navBtnCenterPulse: { width: 48, height: 48, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer', boxShadow: `0 0 0 4px rgba(255, 99, 71, 0.3), 0 0 0 8px rgba(255, 99, 71, 0.15)` },
  navIcon: { fontSize: 22 },
  navLabel: { fontSize: 11, fontWeight: 600 },
  navBadge: { position: 'absolute', top: -4, right: -4, width: 18, height: 18, borderRadius: '50%', background: CORAL, color: '#fff', fontSize: 10, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  
  // Clues Panel - Complete State
  cluesPanel: { padding: '0 20px' },
  
  // Daily Feed Style
  dailyFeedContainer: { padding: '0 16px', paddingBottom: 40 },
  dailyFeedHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', marginBottom: 8 },
  dailyFeedTitle: { fontSize: 22, fontWeight: 700, color: DARK, margin: 0 },
  dailyFeedSub: { fontSize: 13, color: '#666', marginTop: 4 },
  dailyProgress: { display: 'flex', gap: 6 },
  progressDot: { width: 10, height: 10, borderRadius: '50%' },
  
  dailyFeedList: { display: 'flex', flexDirection: 'column', gap: 12 },
  dailyClueCard: { borderRadius: 20, padding: 20, cursor: 'pointer', position: 'relative', overflow: 'hidden' },
  swipeIndicator: { position: 'absolute', top: 12, padding: '6px 12px', borderRadius: 8, fontSize: 12, fontWeight: 600, color: '#fff', zIndex: 10 },
  swipeToast: { position: 'fixed', top: 100, left: '50%', transform: 'translateX(-50%)', padding: '12px 24px', borderRadius: 12, fontSize: 14, fontWeight: 600, color: '#fff', zIndex: 200 },
  swipeHintText: { textAlign: 'center', marginTop: 12, fontSize: 12 },
  dailyClueTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  dailyBadgeRow: { display: 'flex', alignItems: 'center', gap: 8 },
  dailyBadge: { fontSize: 12, opacity: 0.8, fontWeight: 600 },
  platformBadge: { fontSize: 11, background: 'rgba(255,255,255,0.2)', padding: '2px 8px', borderRadius: 6, fontWeight: 700 },
  dailyMeta: { display: 'flex', alignItems: 'center', gap: 10 },
  dailyTime: { fontSize: 11, opacity: 0.7 },
  savedIndicator: { fontSize: 11, background: 'rgba(255,255,255,0.2)', padding: '2px 8px', borderRadius: 8, fontWeight: 600 },
  
  dailyClueTitle: { fontSize: 20, fontWeight: 700, lineHeight: 1.2, margin: 0 },
  dailyClueSub: { fontSize: 13, opacity: 0.7, marginTop: 6 },
  dailyHandles: { display: 'flex', gap: 6, marginTop: 12 },
  dailyHandle: { fontSize: 12, background: 'rgba(255,255,255,0.2)', padding: '4px 10px', borderRadius: 12 },
  dailyHandleBtn: { fontSize: 12, background: 'rgba(255,255,255,0.2)', padding: '4px 10px', borderRadius: 12, border: 'none', color: 'inherit', cursor: 'pointer' },
  dailyQuote: { fontSize: 18, fontWeight: 600, lineHeight: 1.3, margin: 0 },
  dailyAuthor: { fontSize: 13, opacity: 0.7, marginTop: 8 },
  dailyAuthorBtn: { fontSize: 13, opacity: 0.9, marginTop: 8, background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', gap: 6 },
  dailyStat: { fontSize: 36, fontWeight: 700, display: 'block', marginBottom: 8 },
  
  dailyExpanded: { marginTop: 16, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.2)' },
  dailyDetail: { fontSize: 14, lineHeight: 1.6, opacity: 0.9, marginBottom: 16 },
  dailySources: { marginBottom: 16 },
  dailySourceRow: { display: 'flex', gap: 10, padding: '6px 0', fontSize: 13 },
  dailySourceHandle: { fontWeight: 600, minWidth: 80 },
  dailySourceNote: { opacity: 0.7 },
  dailyPrompts: { marginBottom: 16 },
  dailyPromptsLabel: { fontSize: 12, opacity: 0.6, marginBottom: 8 },
  dailyPromptBtn: { display: 'block', width: '100%', padding: 12, marginBottom: 6, border: 'none', borderRadius: 10, fontSize: 13, textAlign: 'left', cursor: 'pointer' },
  dailyActions: { display: 'flex', gap: 8 },
  dailyActionBtn: { flex: 1, padding: 12, border: 'none', borderRadius: 12, fontSize: 13, fontWeight: 600, cursor: 'pointer' },
  
  allSeenCard: { background: '#fff', borderRadius: 20, padding: 32, marginTop: 24, textAlign: 'center' },
  allSeenIcon: { width: 56, height: 56, borderRadius: '50%', background: GREEN, color: '#fff', fontSize: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' },
  allSeenTitle: { fontSize: 18, fontWeight: 700, color: DARK, margin: 0 },
  allSeenSub: { fontSize: 14, color: '#666', marginTop: 8 },
  allSeenActions: { marginTop: 24 },
  continueBtn: { width: '100%', padding: 16, background: DARK, color: '#fff', border: 'none', borderRadius: 14, fontSize: 16, fontWeight: 600, cursor: 'pointer' },
  loadMoreBtn: { marginTop: 16, background: 'none', border: 'none', color: CORAL, fontSize: 14, fontWeight: 600, cursor: 'pointer' },
  
  completeState: { textAlign: 'center', paddingTop: 40 },
  completeIcon: { width: 64, height: 64, borderRadius: '50%', background: GREEN, color: '#fff', fontSize: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', transition: 'all 0.3s' },
  completeTitle: { fontSize: 22, fontWeight: 700, color: DARK },
  completeSub: { color: '#666', marginTop: 8 },
  scanningText: { color: '#999', fontSize: 13, marginTop: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 },
  scanningDot: { color: GREEN },
  
  // Signal preview
  signalPreview: { background: GREEN, borderRadius: 16, padding: 20, marginTop: 20, textAlign: 'left', color: '#fff' },
  signalPreviewHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  signalLive: { fontSize: 10, fontWeight: 700, color: '#fff', background: 'rgba(255,255,255,0.2)', padding: '4px 8px', borderRadius: 8 },
  signalTime: { fontSize: 11, opacity: 0.8 },
  signalPreviewText: { fontSize: 16, fontWeight: 600, marginBottom: 12 },
  signalHandles: { display: 'flex', gap: 8 },
  signalHandle: { fontSize: 12, opacity: 0.8 },
  signalActions: { display: 'flex', gap: 12, marginTop: 20 },
  peekNowBtn: { flex: 1, padding: 16, background: CORAL, color: '#fff', border: 'none', borderRadius: 14, fontSize: 15, fontWeight: 600, cursor: 'pointer' },
  waitBtn: { flex: 1, padding: 16, background: '#fff', color: DARK, border: 'none', borderRadius: 14, fontSize: 15, fontWeight: 600, cursor: 'pointer' },
  
  streakCardComplete: { display: 'flex', alignItems: 'center', gap: 16, background: '#fff', padding: 20, borderRadius: 16, marginTop: 24, textAlign: 'left' },
  nextActions: { display: 'flex', gap: 12, marginTop: 24 },
  actionCardBtn: { flex: 1, padding: 20, background: '#fff', border: 'none', borderRadius: 16, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 14, fontWeight: 600, color: DARK },
  exploreBtn: { marginTop: 32, background: 'none', border: 'none', color: CORAL, fontSize: 14, fontWeight: 600, cursor: 'pointer' },
  exploreFeed: { marginTop: 24, textAlign: 'left' },
  exploreLabel: { fontSize: 12, color: '#999', marginBottom: 12 },
  exploreFeedCard: { padding: 16, borderRadius: 14, marginBottom: 8, cursor: 'pointer' },
  exploreTitle: { fontSize: 14, fontWeight: 600, margin: 0 },
  exploreTime: { fontSize: 11, opacity: 0.6 },
  insightBadge: { fontSize: 10, opacity: 0.8, marginBottom: 4, display: 'flex', alignItems: 'center' },
  resumeDaily: { textAlign: 'center', padding: 40, background: '#fff', borderRadius: 20, margin: 16 },
  
  // Learn Panel
  learnPanel: { padding: '0 20px', paddingBottom: 100 },
  panelTitle: { fontSize: 22, fontWeight: 700, color: DARK },
  panelSub: { color: '#666', fontSize: 14, marginBottom: 20 },
  learnEmpty: { paddingTop: 40 },
  savedContext: { marginBottom: 16 },
  suggestions: { display: 'flex', flexDirection: 'column', gap: 10 },
  suggestBtn: { padding: 16, background: '#fff', border: `2px solid ${CORAL}`, borderRadius: 14, textAlign: 'left', cursor: 'pointer', fontSize: 14, fontWeight: 500, color: DARK },
  emptyLearnText: { color: '#666', marginTop: 20, marginBottom: 24, lineHeight: 1.5 },
  chat: { display: 'flex', flexDirection: 'column', gap: 12 },
  userMsg: { alignSelf: 'flex-end', maxWidth: '80%', padding: 14, borderRadius: '18px 18px 4px 18px', background: CORAL, color: '#fff', fontSize: 14, whiteSpace: 'pre-line' },
  aiMsg: { alignSelf: 'flex-start', maxWidth: '90%', padding: 14, background: '#fff', borderRadius: '18px 18px 18px 4px', fontSize: 14, lineHeight: 1.6, whiteSpace: 'pre-line', color: DARK },
  relatedBadge: { alignSelf: 'flex-start', fontSize: 11, color: CORAL, marginTop: 4, marginLeft: 14 },
  thinking: { color: '#999', fontSize: 14 },
  inputWrap: { position: 'fixed', bottom: 90, left: '50%', transform: 'translateX(-50%)', width: 'calc(100% - 32px)', maxWidth: 398 },
  inputBar: { display: 'flex', alignItems: 'center', background: '#fff', borderRadius: 28, padding: '6px 6px 6px 20px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' },
  input: { flex: 1, border: 'none', outline: 'none', fontSize: 15, fontFamily: 'inherit', background: 'transparent' },
  sendBtn: { width: 44, height: 44, borderRadius: '50%', border: 'none', color: '#fff', fontSize: 18, fontWeight: 700, cursor: 'pointer' },
  
  // Library Panel
  libraryPanel: { padding: '0 20px', paddingBottom: 100 },
  libraryHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 },
  reviewBtn: { padding: '10px 16px', background: CORAL, color: '#fff', border: 'none', borderRadius: 12, fontSize: 14, fontWeight: 600, cursor: 'pointer' },
  emptyLibrary: { textAlign: 'center', paddingTop: 40 },
  emptyTitle: { fontSize: 18, fontWeight: 700, color: DARK, marginTop: 16 },
  emptyText: { color: '#666', marginTop: 8, marginBottom: 24, lineHeight: 1.5 },
  libraryList: { display: 'flex', flexDirection: 'column', gap: 8 },
  libraryItem: { display: 'flex', gap: 12, padding: 16, background: '#fff', borderRadius: 14, alignItems: 'flex-start' },
  masteryDots: { display: 'flex', flexDirection: 'column', gap: 4, paddingTop: 4 },
  masteryDot: { width: 8, height: 8, borderRadius: '50%' },
  libraryContent: { flex: 1, cursor: 'pointer' },
  libraryMain: { display: 'flex', alignItems: 'center', gap: 10 },
  libraryBadge: { width: 28, height: 28, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0 },
  libraryTitle: { fontSize: 14, fontWeight: 600, color: DARK },
  topicTag: { display: 'inline-block', fontSize: 10, color: '#999', background: CREAM, padding: '2px 8px', borderRadius: 10, marginLeft: 8 },
  libraryExpanded: { marginTop: 12, paddingTop: 12, borderTop: '1px solid #eee' },
  libraryDetail: { fontSize: 13, lineHeight: 1.5, color: '#666', marginBottom: 12 },
  libraryPrompts: { marginBottom: 12 },
  promptsLabel: { fontSize: 12, color: '#999', marginBottom: 8 },
  promptBtnLib: { display: 'block', width: '100%', padding: 10, marginBottom: 6, background: CREAM, border: 'none', borderRadius: 10, fontSize: 13, textAlign: 'left', cursor: 'pointer', color: DARK },
  libraryActions: { display: 'flex', gap: 8 },
  actionBtnSmall: { padding: '8px 12px', background: CREAM, border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer', color: DARK },
  
  // Share to LinkedIn CTA (v14)
  shareToLinkedInBtn: { width: '100%', padding: 14, background: '#0077B5', color: '#fff', border: 'none', borderRadius: 12, fontSize: 14, fontWeight: 600, cursor: 'pointer', marginTop: 16, marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  
  // Pro Upsell Card (v14)
  proUpsellCard: { display: 'flex', alignItems: 'center', width: '100%', padding: 16, background: '#fff', borderRadius: 14, marginTop: 16, border: `2px solid ${CORAL}` },
  connectXBtn: { padding: '8px 16px', background: CORAL, color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' },
  
  // Review Mode
  reviewContainer: { padding: 20 },
  reviewHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  closeReview: { background: 'none', border: 'none', fontSize: 14, color: '#666', cursor: 'pointer' },
  reviewProgress: { fontSize: 14, color: '#999' },
  flashcard: { background: '#fff', borderRadius: 20, padding: 32, minHeight: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  flashcardInner: { textAlign: 'center', width: '100%' },
  flashcardQ: { fontSize: 14, color: '#999', marginBottom: 16 },
  flashcardTitle: { fontSize: 20, fontWeight: 700, color: DARK, marginBottom: 32 },
  revealBtn: { padding: '14px 32px', background: CORAL, color: '#fff', border: 'none', borderRadius: 14, fontSize: 16, fontWeight: 600, cursor: 'pointer' },
  flashcardA: { fontSize: 15, lineHeight: 1.6, color: DARK, marginBottom: 32 },
  flashcardActions: { display: 'flex', gap: 12 },
  knowBtn: { flex: 1, padding: 16, border: 'none', borderRadius: 14, fontSize: 14, fontWeight: 600, cursor: 'pointer', color: DARK },
  
  // Modals
  modalBg: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: 20 },
  modal: { width: '100%', maxWidth: 340, background: CREAM, borderRadius: 24, padding: 24, textAlign: 'center', maxHeight: '90vh', overflow: 'auto' },
  shieldRow: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: '#fff', padding: '8px 16px', borderRadius: 12, margin: '16px 0' },
  nextBox: { background: '#fff', borderRadius: 12, padding: 16, margin: '16px 0', textAlign: 'left' },
  progBar: { height: 6, background: 'rgba(0,0,0,0.1)', borderRadius: 3, marginTop: 8 },
  progBarFill: { height: '100%', borderRadius: 3 },
  unlockBox: { color: '#fff', padding: 16, borderRadius: 16, margin: '16px 0', fontWeight: 600 },
  closeBtn: { width: 32, height: 32, borderRadius: '50%', background: '#fff', border: 'none', fontSize: 20, cursor: 'pointer' },
  
  // Share Modal
  shareModal: { width: '100%', maxWidth: 380, background: CREAM, borderRadius: 24, padding: 24, maxHeight: '90vh', overflow: 'auto' },
  sharePreview: { borderRadius: 16, padding: 20, marginBottom: 20 },
  sharePreviewContent: { textAlign: 'left' },
  copySection: { marginBottom: 16 },
  copyTextarea: { width: '100%', padding: 16, border: '1px solid #ddd', borderRadius: 12, fontSize: 14, fontFamily: 'inherit', resize: 'none', marginBottom: 8 },
  copyBtn: { width: '100%', padding: 12, border: 'none', borderRadius: 10, color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer' },
  
  // Brain Modal
  brainStat: { background: '#fff', borderRadius: 16, padding: 24, textAlign: 'center' },
  brainNum: { fontSize: 48, fontWeight: 700, color: CORAL, display: 'block' },
  brainLabel: { fontSize: 14, color: '#666' },
  topicList: { background: '#fff', borderRadius: 16, padding: 16 },
  topicRow: { display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0' },
  topicName: { width: 80, fontSize: 13, fontWeight: 600, color: DARK },
  topicBar: { flex: 1, height: 8, background: '#eee', borderRadius: 4 },
  topicBarFill: { height: '100%', background: CORAL, borderRadius: 4 },
  topicCount: { width: 24, fontSize: 13, color: '#666', textAlign: 'right' },
  
  // Auth Options
  authOptions: { width: '100%', display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16 },
  authBtn: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, padding: 16, borderRadius: 14, border: 'none', fontSize: 15, fontWeight: 600, cursor: 'pointer', width: '100%' },
  authIcon: { fontSize: 18, fontWeight: 700 },
  authDivider: { display: 'flex', alignItems: 'center', gap: 12, color: '#999', fontSize: 13 },
  
  // Time Options
  timeOptions: { width: '100%', display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 },
  timeOption: { display: 'flex', alignItems: 'center', gap: 16, padding: 16, borderRadius: 14, border: '3px solid transparent', cursor: 'pointer', textAlign: 'left' },
  timeLabel: { display: 'block', fontWeight: 600, fontSize: 15, color: DARK },
  timeDesc: { display: 'block', fontSize: 12, color: '#999' },
  
  // Pull to Refresh
  pullIndicator: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4, overflow: 'hidden', background: 'rgba(255,99,71,0.1)' },
  pullIcon: { fontSize: 20, color: CORAL, transition: 'transform 0.2s' },
  pullText: { fontSize: 12, color: CORAL, fontWeight: 600 },
  
  // Tappable Sources
  sourcesTitle: { fontSize: 12, color: 'rgba(255,255,255,0.6)', marginBottom: 8 },
  sourceLink: { display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: 10, marginBottom: 6, width: '100%', cursor: 'pointer', textAlign: 'left' },
  sourceLinkHandle: { fontWeight: 600, color: '#fff', fontSize: 13 },
  sourceLinkNote: { flex: 1, color: 'rgba(255,255,255,0.7)', fontSize: 12 },
  sourceLinkIcon: { color: 'rgba(255,255,255,0.5)', fontSize: 14 },
  
  // View Original
  viewOriginal: { display: 'flex', gap: 8, marginTop: 12, marginBottom: 16 },
  viewOriginalBtn: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: 10, background: DARK, color: '#fff', border: 'none', borderRadius: 10, fontSize: 12, fontWeight: 600, cursor: 'pointer' },
  
  // Undo Button
  undoBtn: { marginLeft: 12, padding: '4px 12px', background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: 8, color: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer' },
  
  // Upsell Section
  upsellSection: { marginTop: 24, paddingTop: 24, borderTop: '1px solid #eee' },
  upsellQuestion: { fontSize: 14, color: '#666', marginBottom: 16, textAlign: 'center' },
  upsellCard: { background: `linear-gradient(135deg, ${CORAL} 0%, ${PURPLE} 100%)`, borderRadius: 20, padding: 24, color: '#fff', textAlign: 'center' },
  upsellBadge: { display: 'inline-block', background: 'rgba(255,255,255,0.2)', padding: '4px 12px', borderRadius: 12, fontSize: 12, fontWeight: 700, marginBottom: 12 },
  upsellTitle: { fontSize: 20, fontWeight: 700, margin: '0 0 8px' },
  upsellDesc: { fontSize: 14, opacity: 0.9, marginBottom: 16, lineHeight: 1.4 },
  upsellPricing: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 16 },
  upsellPrice: { fontSize: 18, fontWeight: 700 },
  upsellTrial: { fontSize: 13, background: 'rgba(255,255,255,0.2)', padding: '4px 10px', borderRadius: 8 },
  upsellBtn: { width: '100%', padding: 16, background: '#fff', border: 'none', borderRadius: 14, color: CORAL, fontSize: 16, fontWeight: 700, cursor: 'pointer' },
  upsellNote: { fontSize: 11, opacity: 0.7, marginTop: 12 },
  
  // Pro Load More
  loadMoreBtnPro: { display: 'flex', alignItems: 'center', gap: 12, width: '100%', padding: 16, background: '#fff', border: `2px solid ${CORAL}`, borderRadius: 14, cursor: 'pointer', textAlign: 'left' },
  loadMoreTitle: { display: 'block', fontSize: 15, fontWeight: 600, color: DARK },
  loadMoreSub: { display: 'block', fontSize: 12, color: CORAL },
  
  // Achievement Card
  achievementCard: { background: '#fff', borderRadius: 16, padding: 20, marginTop: 20, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 16, textAlign: 'left', width: '100%' },
  streakBadgeLarge: { fontSize: 36 },
  achievementInfo: { flex: 1 },
  achievementTitle: { display: 'block', fontSize: 18, fontWeight: 700, color: DARK },
  achievementPerk: { display: 'block', fontSize: 13, color: GREEN, marginTop: 2 },
  nextReward: { textAlign: 'right' },
  nextRewardText: { display: 'block', fontSize: 11, color: '#999', marginBottom: 4 },
  miniProgress: { width: 60, height: 4, background: '#eee', borderRadius: 2 },
  miniProgressFill: { height: '100%', background: CORAL, borderRadius: 2 },
  
  // Delivery Picker (final onboarding screen)
  deliveryPicker: { width: '100%', marginBottom: 24 },
  deliveryOptions: { display: 'flex', justifyContent: 'center', gap: 8 },
  deliveryOption: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, padding: '12px 16px', borderRadius: 12, border: 'none', color: '#fff', cursor: 'pointer', minWidth: 70 },
  
  // Card Footer & Social Proof
  cardFooter: { marginTop: 'auto', paddingTop: 12 },
  socialProof: { display: 'flex', gap: 12, marginBottom: 8 },
  proofItem: { fontSize: 11, color: 'rgba(255,255,255,0.6)' },
  
  // Modal Tabs
  modalTabs: { display: 'flex', gap: 0, marginBottom: 8, borderBottom: '1px solid #ddd' },
  modalTab: { flex: 1, padding: '12px 8px', background: 'none', border: 'none', fontSize: 12, fontWeight: 600, cursor: 'pointer', color: DARK },
  
  // Leaderboard
  leaderboardSection: { textAlign: 'left', marginTop: 16 },
  leaderboardTitle: { fontSize: 14, fontWeight: 600, marginBottom: 12, color: DARK },
  leaderboardList: { display: 'flex', flexDirection: 'column', gap: 4 },
  leaderboardRow: { display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 10 },
  leaderboardRank: { fontSize: 12, fontWeight: 700, color: '#999', width: 28 },
  leaderboardAvatar: { fontSize: 20 },
  leaderboardInfo: { flex: 1, display: 'flex', alignItems: 'center', gap: 6 },
  leaderboardName: { fontSize: 14, color: DARK },
  connectionBadge: { fontSize: 10 },
  leaderboardStreak: { display: 'flex', flexDirection: 'column', alignItems: 'center' },
  leaderboardSub: { fontSize: 12, color: CORAL, fontWeight: 600, marginTop: 12, textAlign: 'center' },
  
  // Mini Leaderboard (completion screen)
  miniLeaderboard: { background: '#fff', borderRadius: 14, padding: 12, marginTop: 16, marginBottom: 16 },
  miniLeaderboardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  seeAllBtn: { background: 'none', border: 'none', color: CORAL, fontSize: 12, fontWeight: 600, cursor: 'pointer' },
  miniLeaderRow: { display: 'flex', alignItems: 'center', gap: 8, padding: '6px 8px', borderRadius: 8, fontSize: 13 },
  miniRank: { fontSize: 11, color: '#999', width: 24 },
  
  // Referral Section
  referralSection: { textAlign: 'left', marginTop: 16 },
  referralHeader: { display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 },
  referralProgress: { display: 'flex', justifyContent: 'center', gap: 16, marginBottom: 16 },
  referralDot: { width: 40, height: 40, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: '#fff' },
  referralUnlocked: { background: GREEN, color: '#fff', padding: '12px 16px', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontSize: 14, fontWeight: 600 },
  activityTitle: { fontSize: 13, fontWeight: 600, color: DARK, marginTop: 20, marginBottom: 12 },
  activityList: { display: 'flex', flexDirection: 'column', gap: 8 },
  activityRow: { display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px 12px', background: '#fff', borderRadius: 10 },
  activityIconWrap: { width: 32, height: 32, borderRadius: '50%', background: 'rgba(255,99,71,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  activityInfo: { flex: 1 },
  activityText: { fontSize: 13, color: DARK, display: 'block' },
  activityTime: { fontSize: 11, color: '#999' },
  
  // Milestone badge
  milestoneBadge: { width: 80, height: 80, borderRadius: '50%', background: 'rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, fontWeight: 700, color: '#fff', margin: '0 auto 16px' },
  
  // Top Learner Badge
  topLearnerBadge: { display: 'flex', alignItems: 'center', gap: 8, background: '#fff', padding: '10px 14px', borderRadius: 12, marginTop: 16, fontSize: 13, color: DARK },
  
  // Share to Unlock
  shareToUnlock: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: `linear-gradient(135deg, ${GREEN} 0%, #3CB371 100%)`, borderRadius: 14, padding: 16, marginTop: 16 },
  shareToUnlockContent: { display: 'flex', alignItems: 'center', gap: 12 },
  shareToUnlockTitle: { margin: 0, fontSize: 14, fontWeight: 700, color: '#fff' },
  shareToUnlockSub: { margin: 0, fontSize: 12, color: 'rgba(255,255,255,0.8)' },
  shareToUnlockBtn: { padding: '10px 18px', background: '#fff', border: 'none', borderRadius: 10, color: GREEN, fontSize: 13, fontWeight: 700, cursor: 'pointer' },
  
  // Referral Activity Card
  referralActivityCard: { background: '#fff', borderRadius: 12, padding: 12, marginTop: 12 },
  referralActivityItem: { display: 'flex', alignItems: 'center', gap: 10 },
  referralActivityText: { fontSize: 13, color: DARK },
  
  // Settings Modal
  settingsSection: { marginBottom: 20 },
  settingsSectionTitle: { fontSize: 12, fontWeight: 600, color: '#999', textTransform: 'uppercase', marginBottom: 8 },
  settingsCard: { background: '#fff', borderRadius: 14, padding: 4, overflow: 'hidden' },
  settingsRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', borderBottom: '1px solid #f0f0f0' },
  settingsLabel: { fontSize: 14, color: DARK },
  settingsValue: { fontSize: 14, color: '#666' },
  settingsSelect: { fontSize: 14, color: DARK, border: 'none', background: 'transparent', textAlign: 'right', fontFamily: 'inherit' },
  settingsToggle: { width: 24, height: 24, borderRadius: '50%', background: GREEN, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12 },
  
  // Pro Upgrade Card in Settings
  proUpgradeCard: { background: '#fff', borderRadius: 16, overflow: 'hidden' },
  proUpgradeHeader: { padding: 16, borderBottom: '1px solid #f0f0f0' },
  proBadge: { display: 'inline-block', padding: '4px 10px', background: '#eee', borderRadius: 8, fontSize: 11, fontWeight: 700, color: '#666' },
  proCurrentPlan: { fontSize: 13, color: '#999', marginTop: 4 },
  proUpgradeOffer: { padding: 20, background: `linear-gradient(135deg, ${CORAL} 0%, ${PURPLE} 100%)`, color: '#fff', textAlign: 'center' },
  proOfferBadge: { display: 'inline-block', background: 'rgba(255,255,255,0.2)', padding: '4px 12px', borderRadius: 10, fontSize: 12, fontWeight: 700, marginBottom: 12 },
  proOfferTitle: { fontSize: 18, fontWeight: 700, margin: '0 0 12px' },
  proFeatureList: { listStyle: 'none', padding: 0, margin: '0 0 16px', fontSize: 13, lineHeight: 1.8, textAlign: 'left' },
  proPricing: { marginBottom: 12 },
  proPrice: { fontSize: 32, fontWeight: 700 },
  proPeriod: { fontSize: 14, opacity: 0.8 },
  proUpgradeBtn: { width: '100%', padding: 14, background: '#fff', border: 'none', borderRadius: 12, color: CORAL, fontSize: 16, fontWeight: 700, cursor: 'pointer' },
  proTrial: { fontSize: 11, opacity: 0.7, marginTop: 10 },
  manageSubBtn: { width: '100%', padding: 12, background: 'transparent', border: 'none', color: CORAL, fontSize: 14, fontWeight: 600, cursor: 'pointer' },
  logoutBtn: { width: '100%', padding: 14, background: '#fff', border: 'none', borderRadius: 12, color: '#ff4444', fontSize: 14, fontWeight: 600, cursor: 'pointer' },
  
  // Privacy Section
  privacyPromiseCard: { background: `linear-gradient(135deg, ${GREEN} 0%, #3CB371 100%)`, borderRadius: 16, padding: 20, marginBottom: 12, textAlign: 'center', color: '#fff' },
  privacyIcon: { fontSize: 32, marginBottom: 8 },
  privacyTitle: { fontSize: 16, fontWeight: 700, margin: '0 0 8px' },
  privacyDesc: { fontSize: 13, lineHeight: 1.5, opacity: 0.9, margin: 0 },
  settingsSubLabel: { display: 'block', fontSize: 11, color: '#999', marginTop: 2 },
  privacyDetails: { background: '#fff', borderRadius: 14, padding: 16, marginTop: 12 },
  privacyDetailRow: { display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0' },
  privacyDetailIcon: { fontSize: 16 },
  privacyDetailText: { fontSize: 13, color: DARK },
  privacyLinks: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 16, flexWrap: 'wrap' },
  privacyLinkBtn: { background: 'none', border: 'none', color: CORAL, fontSize: 13, fontWeight: 600, cursor: 'pointer', padding: 4 },
  privacyLinkDivider: { color: '#ccc' },
};
