// src/app/users/[userId]/page.js
import LiveFeed from '../../components/LiveFeed'

export const metadata = {
  title: 'User profile — VendTrust',
}

export default function UserPage({ params }) {
  const { userId } = params
  // server-side fetch would go here; client could fetch; using mock view
  return (
    <div className="min-h-screen bg-slate-50">
      <main className="max-w-4xl mx-auto p-6">
        <div className="bg-white border rounded p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-lg font-semibold">Masked User — {userId}</div>
              <div className="text-sm text-slate-500">Trust score: <span className="font-semibold">28</span></div>
            </div>

            <div>
              <div className="text-sm">Total funded: ₹12,500</div>
            </div>
          </div>

          <div className="mt-4">
            <h3 className="font-medium">Public activity</h3>
            <LiveFeed />
          </div>
        </div>
      </main>
    </div>
  )
}
