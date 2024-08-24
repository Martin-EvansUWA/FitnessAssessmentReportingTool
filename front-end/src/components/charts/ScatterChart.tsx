import React, { useState, ChangeEvent } from 'react';
import { Scatter } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, Title, Tooltip, Legend, PointElement } from 'chart.js';

// Registering necessary components for Scatter chart
ChartJS.register(CategoryScale, LinearScale, Title, Tooltip, Legend, PointElement);

interface DataItem {
  Name: string;
  Age: number;
  Height: number;
  Mass: number;
  Flexibility: { [key: string]: number };
  "Muscular Strength": { [key: string]: number };
  "Cardiovascular Endurance": { [key: string]: number };
}

interface ScatterChartProps {
  data: DataItem[];
}

const ScatterChart: React.FC<ScatterChartProps> = ({ data }) => {
  const [xCategory, setXCategory] = useState<string>('');
  const [xExercise, setXExercise] = useState<string>('');
  const [yCategory, setYCategory] = useState<string>('');
  const [yExercise, setYExercise] = useState<string>('');

  // Extract categories and exercises
  const categories = {
    Flexibility: Object.keys(data[0].Flexibility || {}),
    'Muscular Strength': Object.keys(data[0]['Muscular Strength'] || {}),
    'Cardiovascular Endurance': Object.keys(data[0]['Cardiovascular Endurance'] || {}),
  };

  // Handle category change for x-axis
  const handleXCategoryChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setXCategory(event.target.value);
    setXExercise(''); // Reset exercise when category changes
  };

  // Handle exercise change for x-axis
  const handleXExerciseChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setXExercise(event.target.value);
  };

  // Handle category change for y-axis
  const handleYCategoryChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setYCategory(event.target.value);
    setYExercise(''); // Reset exercise when category changes
  };

  // Handle exercise change for y-axis
  const handleYExerciseChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setYExercise(event.target.value);
  };

  // Prepare x-axis data
  const xAxisData = data.map((item) => {
    if (xCategory && xExercise) {
      const categoryData = item[xCategory as keyof DataItem] as Record<string, number>;
      return categoryData[xExercise as keyof typeof categoryData] || 0;
    }
    return item[xCategory as keyof DataItem] || 0;
  });

  // Prepare y-axis data
  const yAxisData = data.map((item) => {
    if (yCategory && yExercise) {
      const categoryData = item[yCategory as keyof DataItem] as Record<string, number>;
      return categoryData[yExercise as keyof typeof categoryData] || 0;
    }
    return item[yCategory as keyof DataItem] || 0;
  });

  // Prepare scatter chart data
  const chartData = {
    datasets: [{
      label: yExercise || yCategory || 'Data',
      data: data.map((item, index) => ({
        x: xAxisData[index],
        y: yAxisData[index],
      })),
      backgroundColor: 'rgba(75, 192, 192, 0.5)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 1,
    }]
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
      },
      y: {
        title: {
          display: true,
          text: yCategory || 'Y-Axis',
        },
      },
    },
  };

  return (
    <div>
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
                {(categories[xCategory as keyof typeof categories] || []).map((exercise: string) => (
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
                {(categories[yCategory as keyof typeof categories] || []).map((exercise: string) => (
                  <option key={exercise} value={exercise}>{exercise}</option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      <Scatter data={chartData} options={options} />
    </div>
  );
};

export default ScatterChart;
