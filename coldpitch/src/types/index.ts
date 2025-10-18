// Core type definitions for the Cold Pitch Management System

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Manager' | 'Outreach';
  avatar?: string;
}

export interface Prospect {
  id: string;
  name: string;
  email?: string;
  company?: string;
  role?: string;
  phone?: string;
  whatsapp?: string;
  website?: string;
  state?: string;
  country?: string;
  niche?: string;
  avatarUrl?: string;
  hasSocials: boolean;
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
    instagram?: string;
  };
  modeOfReachout: 'Email' | 'WhatsApp' | 'Phone' | 'LinkedIn' | 'Twitter' | 'Multiple';
  status: 'New' | 'Contacted' | 'Replied' | 'Qualified' | 'Converted' | 'Unsubscribed';
  tags: string[];
  dateAdded: string;
  lastActivity?: string;
  source?: string;
  generatedPitch?: string;
  websiteAnalysis?: {
    analyzed: boolean;
    analyzedAt?: string;
    insights?: string;
    recommendations?: string;
    keyFindings?: string[];
  };
}

export interface Campaign {
  id: string;
  name: string;
  status: 'Draft' | 'Active' | 'Paused' | 'Completed';
  type: 'Email' | 'LinkedIn' | 'Multi-Channel';
  subject?: string;
  body: string;
  prospect_ids: string[];
  totalProspects: number;
  sent: number;
  opened: number;
  replied: number;
  converted: number;
  created_by: string;
  created_by_name: string;
  scheduled_date?: string;
  sent_at?: string;
  createdAt: string;
  updatedAt: string;
  nextSendTime?: string;
}

export interface Template {
  id: string;
  name: string;
  subject: string;
  body: string;
  type: 'Email' | 'LinkedIn';
  variables: string[];
  createdAt: string;
  updatedAt: string;
}

export interface KPI {
  totalProspects: number;
  prospectChange: number;
  totalCampaigns: number;
  campaignChange: number;
  totalSent: number;
  sentChange: number;
  replyRate: number;
  replyRateChange: number;
  openRate: number;
  openRateChange: number;
  conversionRate: number;
  conversionRateChange: number;
}

export interface ChartDataPoint {
  date: string;
  sent: number;
  opened: number;
  replied: number;
}

export interface Activity {
  id: string;
  prospectName: string;
  prospectAvatar?: string;
  campaignName: string;
  type: 'Email Sent' | 'Email Opened' | 'Replied' | 'Clicked' | 'Converted';
  timestamp: string;
  time: string;
}

export interface Staff {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Sales Manager' | 'Sales Rep' | 'Staff';
  avatarUrl?: string;
  avatar_seed?: string;
  login_times: string[];
  total_leads_added: number;
  status: 'active' | 'inactive';
  duty_days?: string[]; // ['Monday', 'Tuesday', 'Wednesday', etc.]
  created_at: string;
  updated_at: string;
}

export interface ActivityLog {
  id: string;
  user_id: string;
  user_name: string;
  action: string;
  entity_type: 'prospect' | 'campaign' | 'template' | 'staff' | 'settings';
  entity_id?: string;
  details: Record<string, any>;
  timestamp: string;
}

export interface Settings {
  id: string;
  user_id: string;
  profile: {
    name: string;
    email: string;
    phone?: string;
    avatar?: string;
    timezone?: string;
  };
  notifications: {
    email_notifications: boolean;
    browser_notifications: boolean;
    new_reply_alert: boolean;
    daily_summary: boolean;
    weekly_report: boolean;
  };
  api_keys: {
    openai_key?: string;
    sendgrid_key?: string;
    twilio_key?: string;
  };
  team_settings: {
    company_name?: string;
    company_website?: string;
    default_email_signature?: string;
    auto_assign_leads: boolean;
  };
  created_at: string;
  updated_at: string;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  created_at: string;
  updated_at: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unit_price: number;
  amount: number;
}

export interface Invoice {
  id: string;
  invoice_number: string;
  client_id: string;
  client_name: string;
  client_email: string;
  client_company?: string;
  client_address?: string;
  items: InvoiceItem[];
  subtotal: number;
  tax_rate: number;
  tax_amount: number;
  discount: number;
  total: number;
  currency: 'NGN'; // Naira only
  status: 'Draft' | 'Sent' | 'Paid' | 'Overdue' | 'Cancelled';
  payment_status: 'Unpaid' | 'Partial' | 'Paid';
  amount_paid: number;
  balance_due: number;
  issue_date: string;
  due_date: string;
  paid_date?: string;
  payment_method?: string;
  notes?: string;
  terms?: string;
  created_by: string;
  created_by_name: string;
  created_at: string;
  updated_at: string;
}
