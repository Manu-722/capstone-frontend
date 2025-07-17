import React from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const CardCheckoutForm = ({ amount, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();

  const handleCardSubmit = async (e) => {
    e.preventDefault();

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardElement),
    });

    if (error) {
      console.error(error.message);
      return;
    }

    const res = await fetch('http://localhost:8000/api/create-payment-intent/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount }),
    });

    const data = await res.json();

    const confirmRes = await stripe.confirmCardPayment(data.clientSecret, {
      payment_method: paymentMethod.id,
    });

    if (confirmRes.paymentIntent.status === 'succeeded') {
      onSuccess();
    } else {
      console.error('Payment failed:', confirmRes);
    }
  };

  return (
    <form onSubmit={handleCardSubmit} className="space-y-4 mt-4">
      <CardElement className="border p-3 rounded-md" />
      <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded">
        Pay by Card
      </button>
    </form>
  );
};

export default CardCheckoutForm;