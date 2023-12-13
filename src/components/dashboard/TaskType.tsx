'use client';

import { ApexOptions } from 'apexcharts';
import React from 'react';
import Chart from 'react-apexcharts';

const TaskType = ({ series, label }: { series: number[]; label: string[] }) => {
  const options: ApexOptions = {
    chart: {
      type: 'donut',
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      colors: ['#0A0A0A'],
    },
    legend: {
      labels: {
        colors: ['#fafafa', '#fafafa', '#fafafa'],
      },
    },
    labels: label,
    colors: ['#1E88E5', '#E57373', '#1AB394'],
  };

  return (
    <div id='chart' className='border p-3 rounded-lg'>
      <h1 className='text-xl mb-2'>Tasks Item Type</h1>
      {series.length >= 0 ? (
        <Chart options={options} series={series} type='donut' />
      ) : (
        <p>Not enough data to display</p>
      )}
    </div>
  );
};

export default TaskType;
