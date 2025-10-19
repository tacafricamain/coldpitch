import { supabase } from '../lib/supabase';
import type { Client, ClientProject } from '../types';

export const clientService = {
  // ============ CLIENTS ============
  
  // Get all clients
  async getAllClients(): Promise<Client[]> {
    console.log('🔍 Fetching clients...');
    
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .order('name');

    if (error) {
      console.error('❌ Error fetching clients:', error);
      throw error;
    }

    console.log('✅ Clients fetched successfully:', data?.length || 0);
    return data || [];
  },

  // Get client by ID
  async getClientById(id: string): Promise<Client | null> {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('❌ Error fetching client:', error);
      throw error;
    }

    return data;
  },

  // Create a new client
  async createClient(client: Omit<Client, 'id' | 'created_at' | 'updated_at'>): Promise<Client> {
    console.log('📝 Creating client:', client.name);

    const { data, error } = await supabase
      .from('clients')
      .insert({
        ...client,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error('❌ Error creating client:', error);
      throw error;
    }

    console.log('✅ Client created successfully:', data.id);
    return data;
  },

  // Update a client
  async updateClient(id: string, updates: Partial<Client>): Promise<Client> {
    console.log('📝 Updating client:', id);

    const { data, error } = await supabase
      .from('clients')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('❌ Error updating client:', error);
      throw error;
    }

    console.log('✅ Client updated successfully');
    return data;
  },

  // Delete a client
  async deleteClient(id: string): Promise<void> {
    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('❌ Error deleting client:', error);
      throw error;
    }
  },

  // ============ CLIENT PROJECTS ============

  // Get all client projects
  async getAllProjects(): Promise<ClientProject[]> {
    console.log('🔍 Fetching client projects...');
    
    const { data, error } = await supabase
      .from('client_projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Error fetching projects:', error);
      throw error;
    }

    console.log('✅ Projects fetched successfully:', data?.length || 0);
    return data || [];
  },

  // Get projects by client ID
  async getProjectsByClientId(clientId: string): Promise<ClientProject[]> {
    const { data, error } = await supabase
      .from('client_projects')
      .select('*')
      .eq('client_id', clientId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Error fetching client projects:', error);
      throw error;
    }

    return data || [];
  },

  // Create a new project
  async createProject(project: Omit<ClientProject, 'id' | 'created_at' | 'updated_at'>): Promise<ClientProject> {
    console.log('📝 Creating project:', project.project_name);

    const { data, error } = await supabase
      .from('client_projects')
      .insert({
        ...project,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error('❌ Error creating project:', error);
      throw error;
    }

    console.log('✅ Project created successfully:', data.id);
    return data;
  },

  // Update a project
  async updateProject(id: string, updates: Partial<ClientProject>): Promise<ClientProject> {
    console.log('📝 Updating project:', id);

    const { data, error } = await supabase
      .from('client_projects')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('❌ Error updating project:', error);
      throw error;
    }

    console.log('✅ Project updated successfully');
    return data;
  },

  // Delete a project
  async deleteProject(id: string): Promise<void> {
    const { error } = await supabase
      .from('client_projects')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('❌ Error deleting project:', error);
      throw error;
    }
  },

  // Mark renewal as paid
  async markRenewalAsPaid(id: string, amountPaid: number): Promise<ClientProject> {
    const { data, error } = await supabase
      .from('client_projects')
      .update({
        renewal_status: 'Paid',
        payment_status: 'Paid',
        amount_paid: amountPaid,
        last_payment_date: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('❌ Error marking renewal as paid:', error);
      throw error;
    }

    return data;
  },

  // Get renewal revenue (for dashboard)
  async getRenewalRevenue(): Promise<number> {
    const { data, error } = await supabase
      .from('client_projects')
      .select('amount_paid')
      .eq('renewal_status', 'Paid');

    if (error) {
      console.error('❌ Error fetching renewal revenue:', error);
      return 0;
    }

    const total = (data || []).reduce((sum, project) => sum + (project.amount_paid || 0), 0);
    console.log('💰 Total renewal revenue:', total);
    return total;
  },

  // Get upcoming renewals (next 30 days)
  async getUpcomingRenewals(): Promise<ClientProject[]> {
    const today = new Date();
    const thirtyDaysFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);

    const { data, error } = await supabase
      .from('client_projects')
      .select('*')
      .gte('next_renewal_date', today.toISOString())
      .lte('next_renewal_date', thirtyDaysFromNow.toISOString())
      .eq('renewal_status', 'Pending')
      .order('next_renewal_date');

    if (error) {
      console.error('❌ Error fetching upcoming renewals:', error);
      return [];
    }

    return data || [];
  },

  // Get project stats
  async getProjectStats() {
    const { data, error } = await supabase
      .from('client_projects')
      .select('renewal_status, payment_status, amount, amount_paid, renewal_amount');

    if (error) {
      console.error('❌ Error fetching project stats:', error);
      return {
        total_projects: 0,
        active_renewals: 0,
        paid_renewals: 0,
        pending_renewals: 0,
        overdue_renewals: 0,
        total_revenue: 0,
        renewal_revenue: 0,
      };
    }

    const stats = {
      total_projects: data?.length || 0,
      active_renewals: data?.filter(p => p.renewal_status !== 'N/A' && p.renewal_status !== 'Cancelled').length || 0,
      paid_renewals: data?.filter(p => p.renewal_status === 'Paid').length || 0,
      pending_renewals: data?.filter(p => p.renewal_status === 'Pending').length || 0,
      overdue_renewals: data?.filter(p => p.renewal_status === 'Overdue').length || 0,
      total_revenue: data?.reduce((sum, p) => sum + (p.amount_paid || 0), 0) || 0,
      renewal_revenue: data?.filter(p => p.renewal_status === 'Paid').reduce((sum, p) => sum + (p.amount_paid || 0), 0) || 0,
    };

    console.log('📊 Project stats:', stats);
    return stats;
  },
};
