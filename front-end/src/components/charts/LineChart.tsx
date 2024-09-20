import React, { useState, ChangeEvent } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(LineElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

// Define specific data interface for better type safety
interface ExerciseData {
  [category: string]: {
    [exercise: string]: number; // Adjust type if needed
  };
}

interface LineChartProps {
  data: ExerciseData[];
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
  const xAxisData = data
    .map(item => {
      if (xCategory && xExercise) {
        const categoryData = item[xCategory] as Record<string, number>;
        if (categoryData && xExercise in categoryData) {
          return { x: Number(categoryData[xExercise]), original: item };
        }
      } else if (xCategory && xCategory in item) {
        return { x: Number(item[xCategory]), original: item };
      }
      return null;
    })
    .filter(item => item !== null)
    .sort((a, b) => (a as { x: number }).x - (b as { x: number }).x);

  // Prepare data for the y-axis
  const yAxisData = xAxisData.map(item => {
    const original = (item as { original: ExerciseData }).original;
    if (yCategory && yExercise) {
      const categoryData = original[yCategory] as Record<string, number>;
      if (categoryData && yExercise in categoryData) {
        return categoryData[yExercise];
      }
      return null;
    }
    return original[yCategory] || null;
  }).filter(value => value !== null);

  // Chart configuration
  const chartData = {
    labels: xAxisData.map(item => (item as { x: number }).x),
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
          text: xExercise || 'X-Axis Exercise',
        },
        beginAtZero: showXAxisZero,
      },
      y: {
        title: {
          display: true,
          text: yExercise || 'Y-Axis Exercise',
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
