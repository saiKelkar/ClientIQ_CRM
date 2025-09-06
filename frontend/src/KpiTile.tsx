type KpiTileProps = {
    title: string
    value: string | number
    className?: string
}

export default function KpiTile({ title, value, className = "" }: KpiTileProps) {
    return (
        <div className={`bg-white shadow rounded p-4 flex flex-col items-center justify-center text-center ${className}`}>
            <div className="text-gray-500 text-sm">{ title }</div>
            <div className="text-2xl font-semibold mt-1">{ value }</div>
        </div>
    )
}