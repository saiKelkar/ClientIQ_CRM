type TopbarProps = {
  currentScreen: string
  role: string
}

export default function Topbar({ currentScreen, role }: TopbarProps) {
  const formattedScreen =
    currentScreen.charAt(0).toUpperCase() + currentScreen.slice(1)

  return (
    <div className="flex justify-between items-center px-6 h-16">
      <div className="text-lg font-semibold flex items-center space-x-2">
        <span>{formattedScreen}</span>
        <span className="text-gray-500">/</span>
        <span
          className={`px-2 py-1 rounded text-sm font-medium ${
            role === "admin"
              ? "bg-red-100 text-red-700"
              : "bg-blue-100 text-blue-700"
          }`}
        >
          {role}
        </span>
      </div>
      {/* placeholder for future buttons like notifications/profile */}
      <div className="flex items-center space-x-4">
        {/* Example: could add profile pic or bell icon later */}
      </div>
    </div>
  )
}
