'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Smartphone, CheckCircle, Clock, AlertCircle, X } from 'lucide-react';
import { MpesaPaymentService, MpesaPaymentRequest } from '@/lib/mpesa-payment-service';

interface MpesaPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  billId: string;
  amount: number;
  patientId: string;
  onPaymentSuccess: (transactionId: string) => void;
}

export default function MpesaPaymentModal({
  isOpen,
  onClose,
  billId,
  amount,
  patientId,
  onPaymentSuccess
}: MpesaPaymentModalProps) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'pending' | 'completed' | 'failed'>('idle');
  const [message, setMessage] = useState('');
  const [checkoutRequestId, setCheckoutRequestId] = useState('');

  if (!isOpen) return null;

  const handlePayment = async () => {
    if (!MpesaPaymentService.validatePhoneNumber(phoneNumber)) {
      setMessage('Please enter a valid phone number (07XXXXXXXX or 01XXXXXXXX)');
      return;
    }

    setLoading(true);
    setPaymentStatus('pending');

    const request: MpesaPaymentRequest = {
      phoneNumber: MpesaPaymentService.formatPhoneNumber(phoneNumber),
      amount,
      billId,
      patientId
    };

    const response = await MpesaPaymentService.initiatePayment(request);
    
    if (response.success && response.checkoutRequestId) {
      setMessage(response.message);
      setCheckoutRequestId(response.checkoutRequestId);
      
      // Poll for payment status
      const pollStatus = setInterval(async () => {
        const status = await MpesaPaymentService.checkPaymentStatus(response.checkoutRequestId!);
        
        if (status.status === 'completed') {
          clearInterval(pollStatus);
          setPaymentStatus('completed');
          setMessage('Payment completed successfully!');
          setLoading(false);
          if (status.transactionId) {
            onPaymentSuccess(status.transactionId);
          }
        } else if (status.status === 'failed') {
          clearInterval(pollStatus);
          setPaymentStatus('failed');
          setMessage(status.message);
          setLoading(false);
        }
      }, 3000);

      // Stop polling after 2 minutes
      setTimeout(() => {
        clearInterval(pollStatus);
        if (paymentStatus === 'pending') {
          setPaymentStatus('failed');
          setMessage('Payment timeout. Please try again.');
          setLoading(false);
        }
      }, 120000);
    } else {
      setPaymentStatus('failed');
      setMessage(response.message);
      setLoading(false);
    }
  };

  const resetModal = () => {
    setPhoneNumber('');
    setPaymentStatus('idle');
    setMessage('');
    setCheckoutRequestId('');
    setLoading(false);
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Smartphone className="h-6 w-6 text-green-600" />
              <CardTitle>M-Pesa Payment</CardTitle>
            </div>
            <Button variant="ghost" size="sm" onClick={handleClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <CardDescription>
            Pay your hospital bill using M-Pesa
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Payment Details */}
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Bill ID:</span>
              <span className="font-medium">{billId}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Amount:</span>
              <span className="font-bold text-lg">KSh {amount.toLocaleString()}</span>
            </div>
          </div>

          {paymentStatus === 'idle' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="07XXXXXXXX or 01XXXXXXXX"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="text-center"
                />
                <p className="text-xs text-gray-500 text-center">
                  Enter your M-Pesa registered phone number
                </p>
              </div>

              <Button 
                onClick={handlePayment}
                disabled={loading || !phoneNumber}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                <Smartphone className="h-4 w-4 mr-2" />
                Pay with M-Pesa
              </Button>
            </>
          )}

          {paymentStatus === 'pending' && (
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center">
                <Clock className="h-8 w-8 text-orange-500 animate-pulse" />
              </div>
              <Badge className="bg-orange-100 text-orange-800">
                Payment Pending
              </Badge>
              <p className="text-sm text-gray-600">{message}</p>
              <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                <p className="text-sm text-green-800">
                  Check your phone for the M-Pesa prompt and enter your PIN to complete the payment.
                </p>
              </div>
            </div>
          )}

          {paymentStatus === 'completed' && (
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
              <Badge className="bg-green-100 text-green-800">
                Payment Successful
              </Badge>
              <p className="text-sm text-gray-600">{message}</p>
              <Button onClick={handleClose} className="w-full">
                Close
              </Button>
            </div>
          )}

          {paymentStatus === 'failed' && (
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center">
                <AlertCircle className="h-8 w-8 text-red-500" />
              </div>
              <Badge className="bg-red-100 text-red-800">
                Payment Failed
              </Badge>
              <p className="text-sm text-gray-600">{message}</p>
              <div className="flex gap-2">
                <Button variant="outline" onClick={resetModal} className="flex-1">
                  Try Again
                </Button>
                <Button variant="outline" onClick={handleClose} className="flex-1">
                  Close
                </Button>
              </div>
            </div>
          )}

          {/* M-Pesa Info */}
          <div className="text-center">
            <p className="text-xs text-gray-500">
              Powered by M-Pesa • Secure payments
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}