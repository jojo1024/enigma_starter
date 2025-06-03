import React from 'react'
import Chart from '../../../base-components/Chart'

interface DashboardChartProps {
    title: string
    type: 'line' | 'bar' | 'pie'
    data: any
    width?: number
    height?: number
}

const DashboardChart: React.FC<DashboardChartProps> = ({
    title,
    type,
    data,
    width = 500,
    height = 300
}) => {
    return (
        <div className="p-5 bg-white rounded-lg shadow hover:shadow-lg transition-shadow duration-300">
            <h4 className="text-lg font-semibold mb-4 text-gray-700">{title}</h4>
            <div className="w-full overflow-x-auto">
                <Chart
                    type={type}
                    data={data}
                    options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                position: 'top'
                            }
                        }
                    }}
                    width={width}
                    height={height}
                    getRef={() => { }}
                />
            </div>
        </div>
    )
}

export default DashboardChart 