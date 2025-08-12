import { Link } from "react-router-dom"

type MenuItem = {
    label: string
    href?:string
}

type SidebarProps = {
    setCurrentScreen: (screen: string) => void
}

const topMenu: MenuItem[] = [
    { label: 'Dashboard', href: "/" },
    { label: 'Leads and Deals', href: "/deals" },
    { label: 'Customer and Vendors', href: "/customers" },
    { label: 'Projects', href: "/projects" },
    { label: 'Support Ticket', href: "/tickets" },
    { label: 'Messaging', href: "#" },
]

const bottomMenu: MenuItem[] = [
    { label: 'Settings', href: "/settings" },
    { label: 'Logout', href: "/logout" },
]

function Sidebar({ setCurrentScreen }: SidebarProps) {
    return (
        <div className="fixed top-0 left-0 flex flex-col justify-between h-screen w-64 bg-gray-200 text-gray-900">
            <div>
                <div className="p-6 text-2xl font-bold border-b border-gray-700">
                    CRM
                </div>
                <nav className="mt-6">
                    { topMenu.map(({ label, href }, i) => (
                        <Link
                            key = { i }
                            to = { href || "#" }
                            onClick={ () => setCurrentScreen(label) }
                            className="block px-6 py-3 hover:bg-gray-700 transition-colors"
                        >
                            <span>{ label }</span>
                        </Link>
                    ))}
                </nav>
            </div>
            <nav className="mb-6">
                { bottomMenu.map(({ label, href }, i) => (
                    <Link
                        key = { i }
                        to = { href || "#" }
                        onClick={ () => setCurrentScreen(label) }
                        className="block px-6 py-3 hover:bg-gray-700 transition-colors"
                    >
                        <span>{ label }</span>
                    </Link>
                ))}
            </nav>
        </div>
    )
}

export default Sidebar