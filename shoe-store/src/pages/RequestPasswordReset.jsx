import { useState } from 'react';
import { toast } from 'react-toastify';

const RequestPasswordReset = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error('Email is required');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('http://localhost:8000/api/auth/request-password-reset/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success('Check your inbox for the reset link');
        setEmail('');
      } else {
        toast.error(data.error || 'Failed to send reset link');
      }
    } catch {
      toast.error('Server error. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-6">
      <div className="bg-white border border-red-500 p-8 rounded shadow-md w-full max-w-md text-center text-red-700">
        <h2 className="text-2xl font-bold mb-4">Reset Your Password</h2>
        <form onSubmit={handleSubmit}>
          <input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} required className="mb-6 w-full px-4 py-2 border rounded text-red-700" />
          <button type="submit" disabled={loading} className={`w-full py-2 font-semibold rounded transition ${loading ? 'bg-red-300 text-white' : 'bg-red-600 hover:bg-red-700 text-white'}`}>
            {loading ? 'Sending...' : 'Reset password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RequestPasswordReset;