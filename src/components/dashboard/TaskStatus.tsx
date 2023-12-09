'use client';

import { ApexOptions } from 'apexcharts';
import React from 'react';
import Chart from 'react-apexcharts';

const TaskStatus = ({
  series,
  label,
}: {
  series: number[];
  label: string[];
}) => {
  const options: ApexOptions = {
    chart: {
      type: 'pie',
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      colors: ['#0A0A0A'],
    },
    colors: ['#04A964', '#2E69BD', '#0072F5', '#BD9E2E'],
    legend: {
      labels: {
        colors: ['#fafafa', '#fafafa', '#fafafa', '#fafafa'],
      },
    },
    labels: label,
  };

  return (
    <div id='chart' className='border p-3 rounded-lg'>
      <h1 className='text-xl mb-2'>Tasks Completion</h1>
      <Chart options={options} series={series} type='pie' />
    </div>
  );
};

export default TaskStatus;
