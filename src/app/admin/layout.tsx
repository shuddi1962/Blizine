import { AdminSidebar } from "@/components/admin/sidebar"
import { AdminHeader } from "@/components/admin/admin-header"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex-1 overflow-auto">
        <AdminHeader />
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  )
}
