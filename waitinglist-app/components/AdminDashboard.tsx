'use client';

import { db } from '@/lib/db';

export default function AdminDashboard() {
  const { data, isLoading } = db.useQuery({ 
    signups: {
      $: {
        order: {
          serverCreatedAt: 'desc'
        }
      }
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600 mx-auto mb-6"></div>
          <p className="text-gray-800 font-semibold text-lg">Loading dashboard...</p>
          <p className="text-gray-600 font-medium">Fetching real-time data</p>
        </div>
      </div>
    );
  }

  const signups = data?.signups || [];
  const totalSignups = signups.length;
  const emailsSent = signups.filter(s => s.welcomeEmailSent).length;
  const pendingEmails = signups.filter(s => !s.welcomeEmailSent).length;
  
  // Get today's signups
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todaySignups = signups.filter(s => new Date(s.createdAt) >= today).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">
                Waiting List Dashboard
              </h1>
              <p className="text-xl text-gray-700 font-medium">
                Real-time insights and management
              </p>
            </div>
          </div>
          
          {/* Live indicator */}
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-gray-800 font-semibold">Live Data</span>
            <span className="text-gray-600">• Updates automatically</span>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {/* Total Signups */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/50 p-6 shadow-xl hover:shadow-2xl transition-all duration-300 group">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-600 uppercase tracking-wider">Total Signups</p>
                  </div>
                </div>
                <p className="text-3xl font-black text-gray-900 mb-2">{totalSignups.toLocaleString()}</p>
                <p className="text-sm font-semibold text-blue-600">All time</p>
              </div>
            </div>
          </div>

          {/* Today's Signups */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/50 p-6 shadow-xl hover:shadow-2xl transition-all duration-300 group">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-3 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-600 uppercase tracking-wider">Today</p>
                  </div>
                </div>
                <p className="text-3xl font-black text-gray-900 mb-2">{todaySignups.toLocaleString()}</p>
                <p className="text-sm font-semibold text-emerald-600">New signups</p>
              </div>
            </div>
          </div>

          {/* Emails Sent */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/50 p-6 shadow-xl hover:shadow-2xl transition-all duration-300 group">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-3 bg-gradient-to-r from-green-500 to-green-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-600 uppercase tracking-wider">Confirmed</p>
                  </div>
                </div>
                <p className="text-3xl font-black text-gray-900 mb-2">{emailsSent.toLocaleString()}</p>
                <p className="text-sm font-semibold text-green-600">Emails sent</p>
              </div>
            </div>
          </div>

          {/* Pending */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/50 p-6 shadow-xl hover:shadow-2xl transition-all duration-300 group">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-3 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-600 uppercase tracking-wider">Pending</p>
                  </div>
                </div>
                <p className="text-3xl font-black text-gray-900 mb-2">{pendingEmails.toLocaleString()}</p>
                <p className="text-sm font-semibold text-orange-600">Awaiting email</p>
              </div>
            </div>
          </div>
        </div>

        {/* Signups Table */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/50 overflow-hidden shadow-xl">
          <div className="px-8 py-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 7a2 2 0 012-2h10a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Recent Signups</h2>
                <p className="text-gray-700 font-medium">Showing all {totalSignups} signups</p>
              </div>
            </div>
          </div>
          
          {signups.length === 0 ? (
            <div className="text-center py-16">
              <div className="p-4 bg-gray-100 rounded-2xl w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                <svg className="w-12 h-12 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No signups yet</h3>
              <p className="text-gray-700 font-medium">Your waiting list is ready to collect signups!</p>
              <div className="mt-6">
                <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-800 px-4 py-2 rounded-lg font-semibold">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Share your signup form to get started
                </div>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <tr>
                    <th className="px-8 py-4 text-left text-xs font-black text-gray-800 uppercase tracking-wider">
                      Person
                    </th>
                    <th className="px-8 py-4 text-left text-xs font-black text-gray-800 uppercase tracking-wider">
                      Interest
                    </th>
                    <th className="px-8 py-4 text-left text-xs font-black text-gray-800 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-8 py-4 text-left text-xs font-black text-gray-800 uppercase tracking-wider">
                      Joined
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {signups.map((signup, index) => (
                    <tr key={signup.id} className="hover:bg-blue-50/50 transition-colors duration-200">
                      <td className="px-8 py-6 whitespace-nowrap">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center font-bold text-white text-lg">
                            {signup.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="text-base font-bold text-gray-900">
                              {signup.name}
                            </div>
                            <div className="text-sm font-semibold text-gray-600">
                              {signup.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6 whitespace-nowrap">
                        <span className="inline-flex px-3 py-2 text-sm font-bold rounded-full bg-gray-100 text-gray-800 border border-gray-200">
                          {signup.interest || 'Not specified'}
                        </span>
                      </td>
                      <td className="px-8 py-6 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className={`inline-flex px-3 py-2 text-sm font-bold rounded-full border ${
                            signup.welcomeEmailSent 
                              ? 'bg-green-50 text-green-800 border-green-200' 
                              : 'bg-orange-50 text-orange-800 border-orange-200'
                          }`}>
                            {signup.welcomeEmailSent ? '✅ Confirmed' : '⏳ Pending'}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-6 whitespace-nowrap">
                        <div className="text-sm font-bold text-gray-900">
                          {new Date(signup.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </div>
                        <div className="text-sm font-semibold text-gray-600">
                          {new Date(signup.createdAt).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer Stats */}
        <div className="mt-10 text-center">
          <div className="inline-flex items-center gap-6 bg-white/70 backdrop-blur-sm rounded-2xl px-8 py-4 shadow-lg border border-white/50">
            <div className="text-center">
              <div className="text-2xl font-black text-gray-900">{((emailsSent / Math.max(totalSignups, 1)) * 100).toFixed(1)}%</div>
              <div className="text-sm font-bold text-gray-600">Confirmation Rate</div>
            </div>
            <div className="w-px h-8 bg-gray-300"></div>
            <div className="text-center">
              <div className="text-2xl font-black text-gray-900">{totalSignups > 0 ? Math.round(totalSignups / Math.max(1, Math.ceil((Date.now() - new Date(signups[signups.length - 1]?.createdAt || Date.now()).getTime()) / (1000 * 60 * 60 * 24)))) : 0}</div>
              <div className="text-sm font-bold text-gray-600">Daily Average</div>
            </div>
            <div className="w-px h-8 bg-gray-300"></div>
            <div className="text-center">
              <div className="text-2xl font-black text-emerald-600">{todaySignups}</div>
              <div className="text-sm font-bold text-gray-600">Today's Growth</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}