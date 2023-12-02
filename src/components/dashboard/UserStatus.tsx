'use client';

import { ApexOptions } from 'apexcharts';
import { notFound } from 'next/navigation';
import React from 'react';
import Chart from 'react-apexcharts';

const UserStatus = ({
  xAxisLabels,
  series,
}: {
  xAxisLabels: string[];
  series: { name: string; data: number[] }[];
}) => {
  const options: ApexOptions = {
    chart: {
      type: 'bar',
      height: 350,
      stacked: true,
      toolbar: {
        show: false,
      },
    },
    tooltip: {
      theme: 'dark',
    },

    plotOptions: {
      bar: {
        horizontal: true,
      },
    },
    stroke: {
      colors: ['#0A0A0A'],
    },
    xaxis: {
      categories: xAxisLabels,
      labels: {
        style: {
          colors: ['#fafafa'],
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: ['#fafafa'],
        },
      },
    },
    fill: {
      opacity: 1,
    },
    legend: {
      position: 'top',
      horizontalAlign: 'right',
      offsetX: 40,
      labels: {
        colors: ['#fafafa', '#fafafa', '#fafafa', '#fafafa'],
      },
    },
    colors: ['#04A964', '#2E69BD', '#BD9E2E', '#0072F5'],
  };

  if (typeof window === 'undefined') {
    return notFound();
  }

  return (
    <div id='chart' className='border p-3 rounded-lg my-10'>
      <h1 className='text-xl mb-2'>Users Completion</h1>
      <Chart options={options} series={series} type='bar' height={350} />
    </div>
  );
};

export default UserStatus;
