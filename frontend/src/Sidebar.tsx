import { Link, useLocation } from "react-router-dom"

type MenuItem = {
  label: string
  href: string
}

type SidebarProps = {
  setCurrentScreen: (screen: string) => void
}

const topMenu: MenuItem[] = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Contacts", href: "/contacts" },
  { label: "Customers", href: "/customers" },
  { label: "Leads", href: "/leads" },
  { label: "Transactions", href: "/transactions" },
]

const bottomMenu: MenuItem[] = [
  { label: "Settings", href: "/settings" },
  { label: "Logout", href: "/logout" },
]

export default function Sidebar({ setCurrentScreen }: SidebarProps) {
  const location = useLocation()

  return (
    <div className="fixed top-0 left-0 flex flex-col justify-between h-screen w-64 bg-gray-200 text-gray-900">
      <div>
        <div className="p-6 text-2xl font-bold border-b border-gray-700">
          CRM
        </div>
        <nav className="mt-6">
          {topMenu.map(({ label, href }, i) => (
            <Link
              key={i}
              to={href}
              onClick={() => setCurrentScreen(label)}
              className={`block px-6 py-3 transition-colors ${
                location.pathname === href
                  ? "bg-gray-400 font-semibold"
                  : "hover:bg-gray-300"
              }`}
            >
              <span>{label}</span>
            </Link>
          ))}
        </nav>
      </div>
      <nav className="mb-6">
        {bottomMenu.map(({ label, href }, i) => (
          <Link
            key={i}
            to={href}
            onClick={() => setCurrentScreen(label)}
            className={`block px-6 py-3 transition-colors ${
              location.pathname === href
                ? "bg-gray-400 font-semibold"
                : "hover:bg-gray-300"
            }`}
          >
            <span>{label}</span>
          </Link>
        ))}
      </nav>
    </div>
  )
}
