// src/app/admin/dashboard/page.js
export const metadata = { title: 'Admin — VendTrust' }

export default function AdminDashboard() {
  // in prod, protect route with auth + role check
  return (
    <div className="min-h-screen bg-slate-50">
      <main className="max-w-6xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Admin dashboard</h1>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-white border rounded">
            <div className="text-sm text-slate-500">Pending KYC</div>
            <div className="mt-2 font-medium">12</div>
          </div>

          <div className="p-4 bg-white border rounded">
            <div className="text-sm text-slate-500">Open loans</div>
            <div className="mt-2 font-medium">34</div>
          </div>

          <div className="p-4 bg-white border rounded">
            <div className="text-sm text-slate-500">Low-trust lenders</div>
            <div className="mt-2 font-medium">8</div>
          </div>

          <div className="p-4 bg-white border rounded">
            <div className="text-sm text-slate-500">Community pool</div>
            <div className="mt-2 font-medium">₹524,800</div>
          </div>
        </div>
      </main>
    </div>
  )
}
