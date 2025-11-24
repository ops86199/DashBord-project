import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

const LineChart = ({ title, dataPoints }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext("2d");

    chartInstance.current = new Chart(ctx, {
      type: "line",
      data: {
        labels: dataPoints.map((_, index) => index + 1),
        datasets: [
          {
            label: title,
            data: dataPoints,
            borderWidth: 2,
            tension: 0.3,
          },
        ],
      },
      options: {
        responsive: true,
        animation: false,
        scales: {
          y: { beginAtZero: true },
          x: { display: false },
        },
      },
    });
  }, [dataPoints, title]);

  return (
    <div className="p-4 rounded-2xl glass-card">
      <h3 style={{ marginBottom: "10px" }}>{title}</h3>
      <canvas ref={chartRef} height="120"></canvas>
    </div>
  );
};

export default LineChart;

