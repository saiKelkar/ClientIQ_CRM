type TopMenu = {
    currentScreen: string
    role: string
}

function Topbar({ currentScreen, role }: TopMenu) {
    return (
        <div className="flex justify-between items-center bg-gray-200 text-gray-900 p-6 h-16">
            <div className="text-lg font-semibold flex space-x-2">
                { currentScreen } / { role }
            </div>
        </div>
    )
}

export default Topbar