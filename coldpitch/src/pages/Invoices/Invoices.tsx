import { useState, useEffect } from 'react';
import { Trash2, Edit, Eye, DollarSign, Printer, Plus, CheckCircle, XCircle, Clock } from 'lucide-react';
import Navbar from '../../components/Navbar/Navbar';
import InvoiceModal from '../../components/InvoiceModal/InvoiceModal';
import ConfirmModal from '../../components/ConfirmModal/ConfirmModal';
import { useToast } from '../../components/Toast/ToastContext';
import { invoiceService } from '../../services/invoiceService';
import { useAuth } from '../../hooks/useAuth';
import type { Invoice } from '../../types';

export default function Invoices() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | undefined>();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [invoiceToDelete, setInvoiceToDelete] = useState<Invoice | null>(null);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [invoiceForPayment, setInvoiceForPayment] = useState<Invoice | null>(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Bank Transfer');
  const [filterStatus, setFilterStatus] = useState<'All' | Invoice['status']>('All');
  const [stats, setStats] = useState({
    total_invoices: 0,
    total_revenue: 0,
    total_paid: 0,
    total_outstanding: 0,
    paid_invoices: 0,
    unpaid_invoices: 0,
  });
  
  const { showToast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    loadInvoices();
    loadStats();
  }, []);

  useEffect(() => {
    // Filter invoices based on status
    if (filterStatus === 'All') {
      setFilteredInvoices(invoices);
    } else {
      setFilteredInvoices(invoices.filter(inv => inv.status === filterStatus));
    }
  }, [filterStatus, invoices]);

  const loadInvoices = async () => {
    try {
      setLoading(true);
      const data = await invoiceService.getInvoices();
      setInvoices(data);
      setFilteredInvoices(data);
    } catch (error) {
      console.error('Error loading invoices:', error);
      showToast('error', 'Failed to load invoices');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const data = await invoiceService.getInvoiceStats();
      setStats(data);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const handleCreateInvoice = () => {
    setModalMode('create');
    setSelectedInvoice(undefined);
    setModalOpen(true);
  };

  const handleEditInvoice = (invoice: Invoice) => {
    setModalMode('edit');
    setSelectedInvoice(invoice);
    setModalOpen(true);
  };

  const handleSaveInvoice = async (invoiceData: Partial<Invoice>) => {
    try {
      if (modalMode === 'create') {
        await invoiceService.createInvoice({
          ...invoiceData,
          created_by: user?.id || '',
          created_by_name: user?.name || 'Unknown',
        } as any);
        showToast('success', 'Invoice created successfully');
      } else if (selectedInvoice) {
        await invoiceService.updateInvoice(
          selectedInvoice.id,
          invoiceData,
          user?.id || '',
          user?.name || 'Unknown'
        );
        showToast('success', 'Invoice updated successfully');
      }
      
      await loadInvoices();
      await loadStats();
    } catch (error) {
      console.error('Error saving invoice:', error);
      showToast('error', 'Failed to save invoice');
      throw error;
    }
  };

  const handleDeleteClick = (invoice: Invoice) => {
    setInvoiceToDelete(invoice);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!invoiceToDelete) return;

    try {
      await invoiceService.deleteInvoice(
        invoiceToDelete.id,
        user?.id || '',
        user?.name || 'Unknown'
      );
      showToast('success', 'Invoice deleted successfully');
      await loadInvoices();
      await loadStats();
    } catch (error) {
      console.error('Error deleting invoice:', error);
      showToast('error', 'Failed to delete invoice');
    } finally {
      setDeleteModalOpen(false);
      setInvoiceToDelete(null);
    }
  };

  const handleRecordPayment = (invoice: Invoice) => {
    setInvoiceForPayment(invoice);
    setPaymentAmount(invoice.balance_due.toString());
    setPaymentModalOpen(true);
  };

  const handlePaymentSubmit = async () => {
    if (!invoiceForPayment || !paymentAmount) return;

    try {
      await invoiceService.markAsPaid(
        invoiceForPayment.id,
        parseFloat(paymentAmount),
        paymentMethod,
        user?.id || '',
        user?.name || 'Unknown'
      );
      
      showToast('success', 'Payment recorded successfully');
      await loadInvoices();
      await loadStats();
      setPaymentModalOpen(false);
      setInvoiceForPayment(null);
      setPaymentAmount('');
    } catch (error) {
      console.error('Error recording payment:', error);
      showToast('error', 'Failed to record payment');
    }
  };

  const handlePrintInvoice = (invoice: Invoice) => {
    // Open print view in new window
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const html = generateInvoiceHTML(invoice);
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.print();
  };

  const generateInvoiceHTML = (invoice: Invoice) => {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Invoice ${invoice.invoice_number}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 40px; color: #333; }
          .header { margin-bottom: 40px; }
          .invoice-title { font-size: 32px; font-weight: bold; color: #7c3aed; }
          .invoice-number { font-size: 18px; color: #666; margin-top: 10px; }
          .info-section { display: flex; justify-content: space-between; margin-bottom: 40px; }
          .info-block { }
          .info-block h3 { margin: 0 0 10px 0; font-size: 14px; color: #666; text-transform: uppercase; }
          .info-block p { margin: 5px 0; }
          table { width: 100%; border-collapse: collapse; margin: 40px 0; }
          thead { background: #f3f4f6; }
          th, td { padding: 12px; text-align: left; border-bottom: 1px solid #e5e7eb; }
          th { font-weight: 600; text-transform: uppercase; font-size: 12px; color: #666; }
          .text-right { text-align: right; }
          .totals { margin-top: 20px; max-width: 300px; margin-left: auto; }
          .totals-row { display: flex; justify-content: space-between; padding: 8px 0; }
          .totals-row.total { font-size: 20px; font-weight: bold; border-top: 2px solid #333; padding-top: 12px; margin-top: 12px; }
          .footer { margin-top: 60px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #666; }
          @media print {
            body { padding: 20px; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="invoice-title">INVOICE</div>
          <div class="invoice-number">#${invoice.invoice_number}</div>
        </div>

        <div class="info-section">
          <div class="info-block">
            <h3>Bill To:</h3>
            <p><strong>${invoice.client_name}</strong></p>
            ${invoice.client_company ? `<p>${invoice.client_company}</p>` : ''}
            <p>${invoice.client_email}</p>
            ${invoice.client_address ? `<p>${invoice.client_address}</p>` : ''}
          </div>
          <div class="info-block">
            <h3>Invoice Details:</h3>
            <p><strong>Issue Date:</strong> ${new Date(invoice.issue_date).toLocaleDateString()}</p>
            <p><strong>Due Date:</strong> ${new Date(invoice.due_date).toLocaleDateString()}</p>
            <p><strong>Status:</strong> ${invoice.status}</p>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Description</th>
              <th class="text-right">Quantity</th>
              <th class="text-right">Unit Price</th>
              <th class="text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            ${invoice.items.map(item => `
              <tr>
                <td>${item.description}</td>
                <td class="text-right">${item.quantity}</td>
                <td class="text-right">₦${item.unit_price.toLocaleString('en-NG', { minimumFractionDigits: 2 })}</td>
                <td class="text-right">₦${item.amount.toLocaleString('en-NG', { minimumFractionDigits: 2 })}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="totals">
          <div class="totals-row">
            <span>Subtotal:</span>
            <span>₦${invoice.subtotal.toLocaleString('en-NG', { minimumFractionDigits: 2 })}</span>
          </div>
          ${invoice.discount > 0 ? `
            <div class="totals-row">
              <span>Discount:</span>
              <span>-₦${invoice.discount.toLocaleString('en-NG', { minimumFractionDigits: 2 })}</span>
            </div>
          ` : ''}
          ${invoice.tax_rate > 0 ? `
            <div class="totals-row">
              <span>Tax (${invoice.tax_rate}%):</span>
              <span>₦${invoice.tax_amount.toLocaleString('en-NG', { minimumFractionDigits: 2 })}</span>
            </div>
          ` : ''}
          <div class="totals-row total">
            <span>Total:</span>
            <span>₦${invoice.total.toLocaleString('en-NG', { minimumFractionDigits: 2 })}</span>
          </div>
          ${invoice.amount_paid > 0 ? `
            <div class="totals-row">
              <span>Paid:</span>
              <span>₦${invoice.amount_paid.toLocaleString('en-NG', { minimumFractionDigits: 2 })}</span>
            </div>
            <div class="totals-row">
              <span>Balance Due:</span>
              <span>₦${invoice.balance_due.toLocaleString('en-NG', { minimumFractionDigits: 2 })}</span>
            </div>
          ` : ''}
        </div>

        ${invoice.notes ? `
          <div style="margin-top: 40px;">
            <h3 style="font-size: 14px; color: #666; text-transform: uppercase;">Notes:</h3>
            <p>${invoice.notes}</p>
          </div>
        ` : ''}

        ${invoice.terms ? `
          <div class="footer">
            <h3 style="font-size: 14px; color: #666; text-transform: uppercase; margin-bottom: 10px;">Payment Terms:</h3>
            <p>${invoice.terms}</p>
          </div>
        ` : ''}
      </body>
      </html>
    `;
  };

  const getStatusColor = (status: Invoice['status']) => {
    switch (status) {
      case 'Paid':
        return 'bg-green-100 text-green-700';
      case 'Sent':
        return 'bg-blue-100 text-blue-700';
      case 'Draft':
        return 'bg-gray-100 text-gray-700';
      case 'Overdue':
        return 'bg-red-100 text-red-700';
      case 'Cancelled':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getPaymentStatusIcon = (status: Invoice['payment_status']) => {
    switch (status) {
      case 'Paid':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'Partial':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'Unpaid':
        return <XCircle className="w-5 h-5 text-red-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar 
        title="Invoices" 
        onNewCampaign={handleCreateInvoice}
        newButtonText="New Invoice"
      />
      
      <div className="p-6">
        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Invoices</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {stats.total_invoices}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {invoiceService.formatNaira(stats.total_revenue)}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Paid</p>
                <p className="text-2xl font-bold text-green-600 mt-1">
                  {invoiceService.formatNaira(stats.total_paid)}
                </p>
                <p className="text-xs text-gray-500 mt-1">{stats.paid_invoices} invoices</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Outstanding</p>
                <p className="text-2xl font-bold text-red-600 mt-1">
                  {invoiceService.formatNaira(stats.total_outstanding)}
                </p>
                <p className="text-xs text-gray-500 mt-1">{stats.unpaid_invoices} invoices</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 mb-6">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Filter by status:</span>
            {(['All', 'Draft', 'Sent', 'Paid', 'Overdue', 'Cancelled'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  filterStatus === status
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Invoices List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              {filterStatus === 'All' ? 'All Invoices' : `${filterStatus} Invoices`}
            </h2>
          </div>

          {loading ? (
            <div className="p-12 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
              <p className="text-gray-500 mt-4">Loading invoices...</p>
            </div>
          ) : filteredInvoices.length === 0 ? (
            <div className="p-12 text-center">
              <DollarSign className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No invoices yet</h3>
              <p className="text-gray-500 mb-6">Create your first invoice to start tracking revenue</p>
              <button
                onClick={handleCreateInvoice}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Create Invoice
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Invoice
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Client
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Payment
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Due Date
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredInvoices.map((invoice) => (
                    <tr key={invoice.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{invoice.invoice_number}</div>
                        <div className="text-xs text-gray-500">
                          {new Date(invoice.issue_date).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{invoice.client_name}</div>
                        {invoice.client_company && (
                          <div className="text-xs text-gray-500">{invoice.client_company}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {invoiceService.formatNaira(invoice.total)}
                        </div>
                        {invoice.amount_paid > 0 && (
                          <div className="text-xs text-gray-500">
                            Paid: {invoiceService.formatNaira(invoice.amount_paid)}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(invoice.status)}`}>
                          {invoice.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          {getPaymentStatusIcon(invoice.payment_status)}
                          <span className="text-sm text-gray-900">{invoice.payment_status}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {new Date(invoice.due_date).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handlePrintInvoice(invoice)}
                            className="text-gray-600 hover:text-gray-900"
                            title="Print"
                          >
                            <Printer className="w-4 h-4" />
                          </button>
                          {invoice.payment_status !== 'Paid' && (
                            <button
                              onClick={() => handleRecordPayment(invoice)}
                              className="text-green-600 hover:text-green-900"
                              title="Record Payment"
                            >
                              <DollarSign className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => handleEditInvoice(invoice)}
                            className="text-purple-600 hover:text-purple-900"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(invoice)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Invoice Modal */}
      <InvoiceModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveInvoice}
        invoice={selectedInvoice}
        mode={modalMode}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        onCancel={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Invoice"
        message={`Are you sure you want to delete invoice ${invoiceToDelete?.invoice_number}? This action cannot be undone.`}
        confirmText="Delete"
        confirmVariant="danger"
      />

      {/* Payment Modal */}
      {paymentModalOpen && invoiceForPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">Record Payment</h2>
              <button
                onClick={() => setPaymentModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Invoice: <span className="font-medium text-gray-900">{invoiceForPayment.invoice_number}</span></p>
                <p className="text-sm text-gray-500">Client: <span className="font-medium text-gray-900">{invoiceForPayment.client_name}</span></p>
                <p className="text-sm text-gray-500">Balance Due: <span className="font-medium text-purple-600">{invoiceService.formatNaira(invoiceForPayment.balance_due)}</span></p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Amount (₦) *
                </label>
                <input
                  type="number"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900"
                  min="0"
                  step="0.01"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Method *
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900"
                >
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Cash">Cash</option>
                  <option value="Cheque">Cheque</option>
                  <option value="Mobile Money">Mobile Money</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setPaymentModalOpen(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePaymentSubmit}
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  Record Payment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
