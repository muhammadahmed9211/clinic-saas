import { api } from './api';

export const paymentService = {
  // Create payment session and get redirect URL
  initiatePayment: async (paymentData) => {
    try {
      const { amount, orderId, gateway, appointmentId } = paymentData;

      const response = await api.createPaymentSession({
        amount,
        orderId,
        gateway,
        appointmentId,
        successUrl: import.meta.env.VITE_PAYMENT_SUCCESS_URL,
        cancelUrl: import.meta.env.VITE_PAYMENT_CANCEL_URL,
      });

      return {
        success: true,
        redirectUrl: response.redirectUrl,
        transactionId: response.transactionId,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  },

  // Check payment status
  checkPaymentStatus: async (transactionId) => {
    try {
      const response = await api.getPaymentStatus(transactionId);
      return {
        success: true,
        status: response.status,
        payment: response.payment,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  },

  // Get user payment history
  getPaymentHistory: async (userId) => {
    try {
      const payments = await api.getPayments(userId);
      return {
        success: true,
        payments,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  },

  // Format amount for display
  formatAmount: (amount) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
    }).format(amount);
  },

  // Get payment gateway display name
  getGatewayName: (gateway) => {
    const names = {
      easypaisa: 'EasyPaisa',
      jazzcash: 'JazzCash',
      card: 'Credit/Debit Card',
    };
    return names[gateway] || gateway;
  },

  // Get payment status badge color
  getStatusColor: (status) => {
    const colors = {
      pending: 'warning',
      paid: 'success',
      failed: 'danger',
      refunded: 'info',
    };
    return colors[status] || 'info';
  },
};

export default paymentService;