import React, { useState, useEffect } from 'react';
import { CreditCard, DollarSign, Check, X, Clock } from 'lucide-react';
import { useAuthStore, useNotificationStore } from '../../store';
import { api } from '../../services/api';
import { paymentService } from '../../services/payment';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import Loading from '../ui/Loading';
import Badge from '../ui/Badge';
import { format } from 'date-fns';

const Payments = () => {
  const { user } = useAuthStore();
  const { addNotification } = useNotificationStore();
  
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [selectedGateway, setSelectedGateway] = useState('');
  const [processingPayment, setProcessingPayment] = useState(false);
  
  useEffect(() => {
    fetchPayments();
  }, []);
  
  const fetchPayments = async () => {
    try {
      const result = await paymentService.getPaymentHistory(user.id);
      if (result.success) {
        setPayments(result.payments);
      }
    } catch (error) {
      console.error('Failed to fetch payments:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleInitiatePayment = async () => {
    if (!selectedGateway) {
      addNotification({
        type: 'error',
        message: 'Please select a payment method',
      });
      return;
    }
    
    setProcessingPayment(true);
    
    try {
      const result = await paymentService.initiatePayment({
        amount: selectedAppointment.fee,
        orderId: `APPT-${selectedAppointment.id}`,
        gateway: selectedGateway,
        appointmentId: selectedAppointment.id,
      });
      
      if (result.success) {
        // Redirect to payment gateway
        window.location.href = result.redirectUrl;
      } else {
        addNotification({
          type: 'error',
          message: result.error || 'Failed to initiate payment',
        });
      }
    } catch (error) {
      addNotification({
        type: 'error',
        message: 'Payment initialization failed',
      });
    } finally {
      setProcessingPayment(false);
    }
  };
  
  const paymentGateways = [
    {
      id: 'easypaisa',
      name: 'EasyPaisa',
      icon: '💳',
      description: 'Pay via EasyPaisa wallet',
    },
    {
      id: 'jazzcash',
      name: 'JazzCash',
      icon: '💰',
      description: 'Pay via JazzCash wallet',
    },
    {
      id: 'card',
      name: 'Credit/Debit Card',
      icon: '💳',
      description: 'Visa, Mastercard accepted',
    },
  ];
  
  const getStatusIcon = (status) => {
    const icons = {
      paid: Check,
      pending: Clock,
      failed: X,
    };
    return icons[status] || Clock;
  };
  
  if (loading) {
    return <Loading fullScreen text="Loading payment history..." />;
  }
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Payment History</h1>
          <p className="text-gray-600 mt-2">View and manage your payment transactions</p>
        </div>
        
        {/* Payment Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Paid</p>
                <p className="text-2xl font-bold text-gray-900">
                  {paymentService.formatAmount(
                    payments.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0)
                  )}
                </p>
              </div>
            </div>
          </Card>
          
          <Card>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">
                  {payments.filter(p => p.status === 'pending').length}
                </p>
              </div>
            </div>
          </Card>
          
          <Card>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Transactions</p>
                <p className="text-2xl font-bold text-gray-900">{payments.length}</p>
              </div>
            </div>
          </Card>
        </div>
        
        {/* Payment List */}
        <Card title="Transaction History">
          {payments.length === 0 ? (
            <div className="text-center py-12">
              <CreditCard className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No payments yet</h3>
              <p className="text-gray-600">Your payment history will appear here</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      Transaction ID
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      Date
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      Amount
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      Gateway
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((payment) => {
                    const StatusIcon = getStatusIcon(payment.status);
                    return (
                      <tr key={payment.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-4 px-4 text-sm font-medium text-gray-900">
                          {payment.transaction_id}
                        </td>
                        <td className="py-4 px-4 text-sm text-gray-600">
                          {format(new Date(payment.created_at), 'MMM dd, yyyy HH:mm')}
                        </td>
                        <td className="py-4 px-4 text-sm font-semibold text-gray-900">
                          {paymentService.formatAmount(payment.amount)}
                        </td>
                        <td className="py-4 px-4 text-sm text-gray-600">
                          {paymentService.getGatewayName(payment.gateway)}
                        </td>
                        <td className="py-4 px-4">
                          <Badge variant={paymentService.getStatusColor(payment.status)}>
                            <StatusIcon className="w-4 h-4 inline mr-1" />
                            {payment.status}
                          </Badge>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Card>
        
        {/* Payment Modal */}
        <Modal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          title="Select Payment Method"
          size="md"
        >
          <div className="space-y-4">
            {paymentGateways.map((gateway) => (
              <button
                key={gateway.id}
                onClick={() => setSelectedGateway(gateway.id)}
                className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                  selectedGateway === gateway.id
                    ? 'border-primary-600 bg-primary-50'
                    : 'border-gray-200 hover:border-primary-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{gateway.icon}</span>
                  <div>
                    <p className="font-semibold text-gray-900">{gateway.name}</p>
                    <p className="text-sm text-gray-600">{gateway.description}</p>
                  </div>
                </div>
              </button>
            ))}
            
            <div className="pt-4">
              <Button
                onClick={handleInitiatePayment}
                loading={processingPayment}
                disabled={!selectedGateway}
                className="w-full"
              >
                Proceed to Payment
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default Payments;