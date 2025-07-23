import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const ResetPassword = () => {
  const { uidb64, token } = useParams();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
      toast.error('Please fill in both fields');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`http://localhost:8000/api/auth/reset/${uidb64}/${token}/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: newPassword }),
      });

      if (res.ok) {
        toast.success('Password changed successfully! 🎉');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        toast.error('Reset link is invalid or expired');
      }
    } catch {
      toast.error('Server error. Try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-6">
      <div className="bg-white border border-blue-500 p-8 rounded shadow-md w-full max-w-md text-center text-blue-700">
        <h2 className="text-2xl font-bold mb-4">Set New Password</h2>
        <form onSubmit={handleReset}>
          <input type="password" placeholder="New password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required className="mb-4 w-full px-4 py-2 border rounded text-blue-700" />
          <input type="password" placeholder="Confirm password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className="mb-6 w-full px-4 py-2 border rounded text-blue-700" />
          <button type="submit" disabled={loading} className={`w-full py-2 font-semibold rounded transition ${loading ? 'bg-blue-300 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}>
            {loading ? 'Submitting...' : 'Change My Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;