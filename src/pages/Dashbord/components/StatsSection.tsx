import React from 'react'
import StatCard from './StatCard'

interface StatsSectionProps {
    title: string
    stats: Array<{
        title: string
        value: string | number
        icon: React.ReactNode
        color: string
    }>
}

const StatsSection: React.FC<StatsSectionProps> = ({ title, stats }) => {
    return (
        <div className="mt-5">
            <h3 className="text-lg font-medium mb-4 text-gray-700">{title}</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat, index) => (
                    <StatCard
                        key={index}
                        title={stat.title}
                        value={stat.value}
                        icon={stat.icon}
                        color={stat.color}
                    />
                ))}
            </div>
        </div>
    )
}

export default StatsSection 