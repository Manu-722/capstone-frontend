import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { toast } from 'react-toastify';

const CardCheckoutForm = ({ amount, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handleCardSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) {
      toast.error('Stripe is not ready. Please try again shortly.');
      return;
    }

    setLoading(true);

    try {
      // Create payment method from card input
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: elements.getElement(CardElement),
      });

      if (error) {
        toast.error(error.message || 'Card setup failed');
        setLoading(false);
        return;
      }

      // Request PaymentIntent from backend
      const res = await fetch('http://localhost:8000/api/create-payment-intent/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount }),
      });

      const data = await res.json();

      if (!data.clientSecret) {
        toast.error('Failed to create payment intent');
        setLoading(false);
        return;
      }

      // Confirm payment with clientSecret
      const confirmRes = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: paymentMethod.id,
      });

      if (confirmRes.paymentIntent.status === 'succeeded') {
        // Log successful transaction to backend
        await fetch('http://localhost:8000/api/confirm-card-payment/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            intent_id: confirmRes.paymentIntent.id,
            amount,
          }),
        });

        toast.success('Card payment successful!');
        onSuccess(); // Clear cart, redirect, etc.
      } else {
        toast.error('Card payment failed');
        console.error('Payment failed:', confirmRes);
      }
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong during card payment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleCardSubmit} className="space-y-4 mt-4">
      <CardElement className="border p-3 rounded-md bg-white" />
      <button
        type="submit"
        disabled={loading}
        className={`w-full bg-blue-600 text-white font-semibold px-4 py-2 rounded ${
          loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
        }`}
      >
        {loading ? 'Processing Payment...' : 'Pay by Card'}
      </button>
    </form>
  );
};

export default CardCheckoutForm;