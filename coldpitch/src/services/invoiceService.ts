import { supabase } from '../lib/supabase';
import type { Invoice, InvoiceItem, Client } from '../types';

export const invoiceService = {
  // ============ CLIENTS ============
  
  // Get all clients
  async getClients(): Promise<Client[]> {
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
    console.log('🗑️ Deleting client:', id);

    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('❌ Error deleting client:', error);
      throw error;
    }

    console.log('✅ Client deleted successfully');
  },

  // ============ INVOICES ============

  // Get all invoices
  async getInvoices(): Promise<Invoice[]> {
    console.log('🔍 Fetching invoices...');
    
    const { data, error } = await supabase
      .from('invoices')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Error fetching invoices:', error);
      throw error;
    }

    console.log('✅ Invoices fetched successfully:', data?.length || 0);
    return data || [];
  },

  // Get single invoice by ID
  async getInvoiceById(id: string): Promise<Invoice | null> {
    const { data, error } = await supabase
      .from('invoices')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('❌ Error fetching invoice:', error);
      throw error;
    }

    return data;
  },

  // Generate next invoice number
  async generateInvoiceNumber(): Promise<string> {
    const { data, error } = await supabase
      .from('invoices')
      .select('invoice_number')
      .order('created_at', { ascending: false })
      .limit(1);

    if (error) {
      console.error('❌ Error generating invoice number:', error);
      // Fallback to default if error
      return `INV-${new Date().getFullYear()}-0001`;
    }

    if (!data || data.length === 0) {
      // First invoice
      return `INV-${new Date().getFullYear()}-0001`;
    }

    // Extract number from last invoice and increment
    const lastNumber = data[0].invoice_number;
    const match = lastNumber.match(/INV-(\d{4})-(\d{4})/);
    
    if (match) {
      const year = new Date().getFullYear();
      const lastYear = parseInt(match[1]);
      const lastNum = parseInt(match[2]);
      
      if (year === lastYear) {
        // Same year, increment number
        const nextNum = (lastNum + 1).toString().padStart(4, '0');
        return `INV-${year}-${nextNum}`;
      } else {
        // New year, reset to 0001
        return `INV-${year}-0001`;
      }
    }

    // Fallback if pattern doesn't match
    return `INV-${new Date().getFullYear()}-0001`;
  },

  // Create a new invoice
  async createInvoice(
    invoice: Omit<Invoice, 'id' | 'created_at' | 'updated_at' | 'invoice_number'>
  ): Promise<Invoice> {
    console.log('📝 Creating invoice for client:', invoice.client_name);

    // Generate invoice number if not provided
    const invoiceNumber = await this.generateInvoiceNumber();

    const { data, error } = await supabase
      .from('invoices')
      .insert({
        ...invoice,
        invoice_number: invoiceNumber,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error('❌ Error creating invoice:', error);
      throw error;
    }

    console.log('✅ Invoice created successfully:', data.invoice_number);

    // Log activity
    try {
      await supabase.from('activity_logs').insert({
        user_id: invoice.created_by,
        user_name: invoice.created_by_name,
        action: 'created invoice',
        entity_type: 'invoice',
        entity_id: data.id,
        details: {
          invoice_number: data.invoice_number,
          client_name: invoice.client_name,
          total: invoice.total,
        },
        timestamp: new Date().toISOString(),
      });
    } catch (activityError) {
      console.warn('⚠️ Failed to log activity:', activityError);
    }

    return data;
  },

  // Update an existing invoice
  async updateInvoice(
    id: string,
    updates: Partial<Invoice>,
    userId: string,
    userName: string
  ): Promise<Invoice> {
    console.log('📝 Updating invoice:', id);

    const { data, error } = await supabase
      .from('invoices')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('❌ Error updating invoice:', error);
      throw error;
    }

    console.log('✅ Invoice updated successfully');

    // Log activity
    try {
      await supabase.from('activity_logs').insert({
        user_id: userId,
        user_name: userName,
        action: 'updated invoice',
        entity_type: 'invoice',
        entity_id: id,
        details: {
          invoice_number: data.invoice_number,
        },
        timestamp: new Date().toISOString(),
      });
    } catch (activityError) {
      console.warn('⚠️ Failed to log activity:', activityError);
    }

    return data;
  },

  // Delete an invoice
  async deleteInvoice(id: string, userId: string, userName: string): Promise<void> {
    console.log('🗑️ Deleting invoice:', id);

    // Get invoice details for activity log
    const invoice = await this.getInvoiceById(id);

    const { error } = await supabase
      .from('invoices')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('❌ Error deleting invoice:', error);
      throw error;
    }

    console.log('✅ Invoice deleted successfully');

    // Log activity
    try {
      await supabase.from('activity_logs').insert({
        user_id: userId,
        user_name: userName,
        action: 'deleted invoice',
        entity_type: 'invoice',
        entity_id: id,
        details: {
          invoice_number: invoice?.invoice_number || 'Unknown',
        },
        timestamp: new Date().toISOString(),
      });
    } catch (activityError) {
      console.warn('⚠️ Failed to log activity:', activityError);
    }
  },

  // Mark invoice as paid
  async markAsPaid(
    id: string,
    paymentAmount: number,
    paymentMethod: string,
    userId: string,
    userName: string
  ): Promise<Invoice> {
    console.log('💰 Marking invoice as paid:', id);

    const invoice = await this.getInvoiceById(id);
    if (!invoice) {
      throw new Error('Invoice not found');
    }

    const totalPaid = (invoice.amount_paid || 0) + paymentAmount;
    const balanceDue = invoice.total - totalPaid;
    
    let paymentStatus: Invoice['payment_status'] = 'Unpaid';
    if (totalPaid >= invoice.total) {
      paymentStatus = 'Paid';
    } else if (totalPaid > 0) {
      paymentStatus = 'Partial';
    }

    const status = paymentStatus === 'Paid' ? 'Paid' : invoice.status;

    const { data, error } = await supabase
      .from('invoices')
      .update({
        amount_paid: totalPaid,
        balance_due: balanceDue,
        payment_status: paymentStatus,
        status: status,
        paid_date: paymentStatus === 'Paid' ? new Date().toISOString() : invoice.paid_date,
        payment_method: paymentMethod,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('❌ Error marking invoice as paid:', error);
      throw error;
    }

    console.log('✅ Invoice payment recorded successfully');

    // Log activity
    try {
      await supabase.from('activity_logs').insert({
        user_id: userId,
        user_name: userName,
        action: 'recorded payment',
        entity_type: 'invoice',
        entity_id: id,
        details: {
          invoice_number: data.invoice_number,
          amount: paymentAmount,
          payment_method: paymentMethod,
          total_paid: totalPaid,
          balance_due: balanceDue,
        },
        timestamp: new Date().toISOString(),
      });
    } catch (activityError) {
      console.warn('⚠️ Failed to log activity:', activityError);
    }

    return data;
  },

  // Update invoice status
  async updateStatus(
    id: string,
    status: Invoice['status'],
    userId: string,
    userName: string
  ): Promise<Invoice> {
    console.log('📝 Updating invoice status:', id, status);

    const { data, error } = await supabase
      .from('invoices')
      .update({
        status,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('❌ Error updating invoice status:', error);
      throw error;
    }

    console.log('✅ Invoice status updated successfully');

    // Log activity
    try {
      await supabase.from('activity_logs').insert({
        user_id: userId,
        user_name: userName,
        action: 'updated invoice status',
        entity_type: 'invoice',
        entity_id: id,
        details: {
          invoice_number: data.invoice_number,
          new_status: status,
        },
        timestamp: new Date().toISOString(),
      });
    } catch (activityError) {
      console.warn('⚠️ Failed to log activity:', activityError);
    }

    return data;
  },

  // Get invoice statistics
  async getInvoiceStats(): Promise<{
    total_invoices: number;
    total_revenue: number;
    total_paid: number;
    total_outstanding: number;
    total_overdue: number;
    paid_invoices: number;
    unpaid_invoices: number;
    overdue_invoices: number;
  }> {
    const invoices = await this.getInvoices();
    
    return {
      total_invoices: invoices.length,
      total_revenue: invoices.reduce((sum, inv) => sum + inv.total, 0),
      total_paid: invoices.reduce((sum, inv) => sum + (inv.amount_paid || 0), 0),
      total_outstanding: invoices.reduce((sum, inv) => sum + inv.balance_due, 0),
      total_overdue: invoices
        .filter(inv => inv.status === 'Overdue')
        .reduce((sum, inv) => sum + inv.balance_due, 0),
      paid_invoices: invoices.filter(inv => inv.payment_status === 'Paid').length,
      unpaid_invoices: invoices.filter(inv => inv.payment_status === 'Unpaid').length,
      overdue_invoices: invoices.filter(inv => inv.status === 'Overdue').length,
    };
  },

  // Calculate invoice totals from items
  calculateTotals(
    items: InvoiceItem[],
    taxRate: number = 0,
    discount: number = 0
  ): {
    subtotal: number;
    tax_amount: number;
    total: number;
  } {
    const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
    const afterDiscount = subtotal - discount;
    const tax_amount = (afterDiscount * taxRate) / 100;
    const total = afterDiscount + tax_amount;

    return {
      subtotal,
      tax_amount: Math.round(tax_amount * 100) / 100,
      total: Math.round(total * 100) / 100,
    };
  },

  // Format currency in Naira
  formatNaira(amount: number): string {
    return `₦${amount.toLocaleString('en-NG', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  },
};
