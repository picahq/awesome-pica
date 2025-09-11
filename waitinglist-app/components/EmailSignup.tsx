'use client';

import { useState } from 'react';
import { db } from '@/lib/db';
import { id } from '@instantdb/react';

export default function EmailSignup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    interest: ''
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  // Real-time signup count
  const { data } = db.useQuery({ signups: {} });
  const signupCount = data?.signups?.length || 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const signupId = id();
      
      // Save to InstantDB
      await db.transact([
        db.tx.signups[signupId].update({
          name: formData.name,
          email: formData.email,
          interest: formData.interest,
          status: 'pending',
          welcomeEmailSent: false,
          createdAt: new Date(),
        })
      ]);

      // Send welcome email
      const emailResponse = await fetch('/api/send-welcome-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          signupId: signupId,
        }),
      });

      if (emailResponse.ok) {
        await db.transact([
          db.tx.signups[signupId].update({ 
            welcomeEmailSent: true,
            status: 'confirmed'
          })
        ]);
      }

      setStatus('success');
      setMessage('🎉 Welcome! Check your email for confirmation.');
      setFormData({ name: '', email: '', interest: '' });

    } catch (error) {
      setStatus('error');
      setMessage('Something went wrong. Please try again.');
      console.error('Signup error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Join the Waiting List
          </h1>
          <p className="text-gray-600 font-medium">
            Be the first to know when we launch
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name Input */}
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-gray-900 mb-2">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 font-medium placeholder-gray-500"
                placeholder="Enter your full name"
              />
            </div>

            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-900 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 font-medium placeholder-gray-500"
                placeholder="you@example.com"
              />
            </div>

            {/* Interest Select */}
            <div>
              <label htmlFor="interest" className="block text-sm font-semibold text-gray-900 mb-2">
                What interests you?
              </label>
              <select
                id="interest"
                value={formData.interest}
                onChange={(e) => setFormData(prev => ({ ...prev, interest: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 font-medium"
              >
                <option value="">Select an option</option>
                <option value="early-access">Early Access</option>
                <option value="pricing">Special Pricing</option>
                <option value="features">New Features</option>
                <option value="updates">Product Updates</option>
              </select>
            </div>

            {/* Status Message */}
            {message && (
              <div className={`p-4 rounded-lg text-sm font-semibold ${
                status === 'success' 
                  ? 'bg-green-50 text-green-800 border border-green-200' 
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}>
                {message}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {status === 'loading' ? '⏳ Joining...' : '🚀 Join Waiting List'}
            </button>

            {/* Signup Count */}
            <div className="text-center pt-2">
              <span className="text-sm font-semibold text-gray-700">
                🔥 {signupCount} people have already joined!
              </span>
            </div>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-600 font-medium mt-6">
          We respect your privacy. No spam, ever. 🔒
        </p>
      </div>
    </div>
  );
}