import React, { ReactNode } from 'react'

interface StatCardProps {
    title: string
    value: string | number
    icon: ReactNode
    color: string
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color }) => {
    return (
        <div className="p-5 bg-white rounded-lg shadow hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-center">
                <div className={`p-3 rounded-full ${color} text-white`}>
                    {icon}
                </div>
                <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
                    <p className="text-2xl font-bold text-gray-900">{value}</p>
                </div>
            </div>
        </div>
    )
}

export default StatCard 