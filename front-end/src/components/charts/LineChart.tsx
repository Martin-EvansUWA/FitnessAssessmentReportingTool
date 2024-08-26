import React, { useState, ChangeEvent } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(LineElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

// Define types
interface DataItem {
  Name: string;
  Age: number;
  Height: number;
  Mass: number;
  Flexibility: { [key: string]: number };
  "Muscular Strength": { [key: string]: number };
  "Cardiovascular Endurance": { [key: string]: number };
}

interface LineChartProps {
  data: DataItem[];
}

const LineChart: React.FC<LineChartProps> = ({ data }) => {
  const [xCategory, setXCategory] = useState<string>('');
  const [xExercise, setXExercise] = useState<string>('');
  const [yCategory, setYCategory] = useState<string>('');
  const [yExercise, setYExercise] = useState<string>('');
  const [lineColor, setLineColor] = useState<string>('rgba(75, 192, 192, 1)'); // Default line color
  const [showXAxisZero, setShowXAxisZero] = useState<boolean>(true); // Option to set x-axis to zero
  const [showYAxisZero, setShowYAxisZero] = useState<boolean>(true); // Option to set y-axis to zero

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
      return { x: Number(categoryData[xExercise as keyof typeof categoryData] || 0), original: item };
    }
    return { x: Number(item[xCategory as keyof DataItem] || 0), original: item };
  }).sort((a, b) => a.x - b.x);

  // Prepare y-axis data
  const yAxisData = xAxisData.map((item) => {
    if (yCategory && yExercise) {
      const categoryData = item.original[yCategory as keyof DataItem] as Record<string, number>;
      return categoryData[yExercise as keyof typeof categoryData] || 0;
    }
    return item.original[yCategory as keyof DataItem] || 0;
  });

  const chartData = {
    labels: xAxisData.map(item => item.x),
    datasets: [
      {
        label: yExercise || yCategory || 'Data',
        data: yAxisData,
        borderColor: lineColor,
        backgroundColor: 'rgba(0, 0, 0, 0)', // No fill
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
        <br></br>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default LineChart;
