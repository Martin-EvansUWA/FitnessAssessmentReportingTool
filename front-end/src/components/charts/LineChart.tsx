import React, { useState, ChangeEvent } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(LineElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

// Generalized DataItem interface to handle dynamic data structures
interface DataItem {
  [key: string]: any; // Allows flexibility for dynamic data structures
}

interface LineChartProps {
  data: DataItem[];
}

const LineChart: React.FC<LineChartProps> = ({ data }) => {
  const [xCategory, setXCategory] = useState<string>('');
  const [xExercise, setXExercise] = useState<string>('');
  const [yCategory, setYCategory] = useState<string>('');
  const [yExercise, setYExercise] = useState<string>('');
  const [lineColor, setLineColor] = useState<string>('rgba(75, 192, 192, 1)');
  const [showXAxisZero, setShowXAxisZero] = useState<boolean>(true);
  const [showYAxisZero, setShowYAxisZero] = useState<boolean>(true);

  // Dynamically extract categories and exercises
  const categories: Record<string, string[]> = {};

  data.forEach(item => {
    Object.keys(item).forEach(key => {
      if (typeof item[key] === 'object' && item[key] !== null) {
        // Collect subcategories (exercises)
        categories[key] = Object.keys(item[key]);
      } else if (typeof item[key] === 'number') {
        // Single value categories
        if (!categories[key]) categories[key] = [];
      }
    });
  });

  // Handle category and exercise selections
  const handleXCategoryChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setXCategory(event.target.value);
    setXExercise(''); // Reset the exercise when changing category
  };

  const handleXExerciseChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setXExercise(event.target.value);
  };

  const handleYCategoryChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setYCategory(event.target.value);
    setYExercise(''); // Reset the exercise when changing category
  };

  const handleYExerciseChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setYExercise(event.target.value);
  };

  // Prepare data for the x-axis
  const xAxisData = data.map((item) => {
    if (xCategory && xExercise) {
      const categoryData = item[xCategory] as Record<string, number>;
      return { x: Number(categoryData[xExercise] || 0), original: item };
    }
    return { x: Number(item[xCategory] || 0), original: item };
  }).sort((a, b) => a.x - b.x);

  // Prepare data for the y-axis
  const yAxisData = xAxisData.map((item) => {
    if (yCategory && yExercise) {
      const categoryData = item.original[yCategory] as Record<string, number>;
      return categoryData[yExercise] || 0;
    }
    return item.original[yCategory] || 0;
  });

  // Chart configuration
  const chartData = {
    labels: xAxisData.map(item => item.x),
    datasets: [
      {
        label: yExercise || yCategory || 'Data',
        data: yAxisData,
        borderColor: lineColor,
        backgroundColor: 'rgba(0, 0, 0, 0)',
        fill: false,
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        enabled: true,
      },
    },
    scales: {
      x: {
        type: 'linear' as const,
        position: 'bottom' as const,
        title: {
          display: true,
          text: xCategory || 'X-Axis',
        },
        beginAtZero: showXAxisZero,
      },
      y: {
        title: {
          display: true,
          text: yCategory || 'Y-Axis',
        },
        beginAtZero: showYAxisZero,
      },
    },
  };

  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <label>X-Axis Category:</label>
            <select value={xCategory} onChange={handleXCategoryChange}>
              <option value="">Select Category</option>
              {Object.keys(categories).map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>

            {xCategory && (
              <div>
                <label>X-Axis Exercise:</label>
                <select value={xExercise} onChange={handleXExerciseChange}>
                  <option value="">Select Exercise</option>
                  {(categories[xCategory] || []).map(exercise => (
                    <option key={exercise} value={exercise}>{exercise}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div>
            <label>Y-Axis Category:</label>
            <select value={yCategory} onChange={handleYCategoryChange}>
              <option value="">Select Category</option>
              {Object.keys(categories).map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>

            {yCategory && (
              <div>
                <label>Y-Axis Exercise:</label>
                <select value={yExercise} onChange={handleYExerciseChange}>
                  <option value="">Select Exercise</option>
                  {(categories[yCategory] || []).map(exercise => (
                    <option key={exercise} value={exercise}>{exercise}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>

        <div>
          <label>Line Color: </label>
          <input
            type="color"
            value={lineColor}
            onChange={(e) => setLineColor(e.target.value)}
          />

          <label> Show X-Axis Starting at Zero: </label>
          <input
            type="checkbox"
            checked={showXAxisZero}
            onChange={(e) => setShowXAxisZero(e.target.checked)}
          />

          <label> Show Y-Axis Starting at Zero: </label>
          <input
            type="checkbox"
            checked={showYAxisZero}
            onChange={(e) => setShowYAxisZero(e.target.checked)}
          />
        </div>
      </div>
      <br />
      <Line data={chartData} options={options} />
    </div>
  );
};

export default LineChart;
