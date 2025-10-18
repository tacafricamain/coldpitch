import { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import type { ApexOptions } from 'apexcharts';
import type { ChartDataPoint } from '../../types';

interface OverviewChartProps {
  data: ChartDataPoint[];
  height?: number;
}

export default function OverviewChart({ data, height = 350 }: OverviewChartProps) {
  const [chartData, setChartData] = useState<{
    series: any[];
    options: ApexOptions;
  }>({
    series: [],
    options: {},
  });

  useEffect(() => {
    const categories = data.map((d) => d.date);
    const sentData = data.map((d) => d.sent);
    const repliedData = data.map((d) => d.replied);

    setChartData({
      series: [
        {
          name: 'Sent',
          data: sentData,
        },
        {
          name: 'Replied',
          data: repliedData,
        },
      ],
      options: {
        chart: {
          type: 'area',
          toolbar: {
            show: false,
          },
          zoom: {
            enabled: false,
          },
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          curve: 'smooth',
          width: 2,
        },
        colors: ['#22c55e', '#3b82f6'],
        fill: {
          type: 'gradient',
          gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.4,
            opacityTo: 0.1,
            stops: [0, 90, 100],
          },
        },
        xaxis: {
          categories: categories,
          labels: {
            style: {
              colors: '#64748b',
              fontSize: '12px',
            },
          },
        },
        yaxis: {
          labels: {
            style: {
              colors: '#64748b',
              fontSize: '12px',
            },
          },
        },
        grid: {
          borderColor: '#e2e8f0',
          strokeDashArray: 4,
        },
        legend: {
          position: 'top',
          horizontalAlign: 'right',
          labels: {
            colors: '#64748b',
          },
        },
        tooltip: {
          theme: 'light',
          y: {
            formatter: (value: number) => value.toString(),
          },
        },
      },
    });
  }, [data]);

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Overview</h3>
        <div className="flex gap-2">
          <button className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded">
            Week
          </button>
          <button className="px-3 py-1 text-sm bg-primary-50 text-primary-600 rounded">
            Month
          </button>
          <button className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded">
            Year
          </button>
        </div>
      </div>
      
      {chartData.series.length > 0 && (
        <ReactApexChart
          options={chartData.options}
          series={chartData.series}
          type="area"
          height={height}
        />
      )}
    </div>
  );
}
