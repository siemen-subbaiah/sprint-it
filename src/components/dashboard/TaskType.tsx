'use client';

import { ApexOptions } from 'apexcharts';
import React from 'react';
import Chart from 'react-apexcharts';

const TaskType = ({ series, label }: { series: number[]; label: string[] }) => {
  const options: ApexOptions = {
    chart: {
      width: 470,
      type: 'donut',
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
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 10,
          },
          legend: {
            position: 'bottom',
          },
        },
      },
    ],
  };

  return (
    <div id='chart' className='border p-3 rounded-lg'>
      <h1 className='text-xl mb-2'>Tasks Item Type</h1>
      <Chart options={options} series={series} type='donut' width={470} />
    </div>
  );
};

export default TaskType;
