import React, { useState, ChangeEvent } from 'react';
import { Scatter } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, Title, Tooltip, Legend, PointElement, LineElement } from 'chart.js';
import regression from 'regression';

// Register necessary components for Scatter chart
ChartJS.register(CategoryScale, LinearScale, Title, Tooltip, Legend, PointElement, LineElement);

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
  const [showRegression, setShowRegression] = useState<boolean>(true); // Toggle for line of best fit
  const [pointColor, setPointColor] = useState<string>('rgba(75, 192, 192, 1)'); // Default point color
  const [lineColor, setLineColor] = useState<string>('rgba(75, 192, 192, 1)'); // Default line color
  const [startFromZero, setStartFromZero] = useState<boolean>(true); // Option to start axis from 0

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

  // Handle checkbox change for starting axis from 0
  const handleStartFromZeroChange = (event: ChangeEvent<HTMLInputElement>) => {
    setStartFromZero(event.target.checked);
  };

  // Prepare x-axis data
  const xAxisData: number[] = data.map((item) => {
    if (xCategory && xExercise) {
      const categoryData = item[xCategory as keyof DataItem] as Record<string, number>;
      return typeof categoryData[xExercise as keyof typeof categoryData] === 'number' ? categoryData[xExercise as keyof typeof categoryData] : 0;
    }
    return typeof item[xCategory as keyof DataItem] === 'number' ? item[xCategory as keyof DataItem] : 0;
  }).filter(value => typeof value === 'number') as number[];

  // Prepare y-axis data
  const yAxisData: number[] = data.map((item) => {
    if (yCategory && yExercise) {
      const categoryData = item[yCategory as keyof DataItem] as Record<string, number>;
      return typeof categoryData[yExercise as keyof typeof categoryData] === 'number' ? categoryData[yExercise as keyof typeof categoryData] : 0;
    }
    return typeof item[yCategory as keyof DataItem] === 'number' ? item[yCategory as keyof DataItem] : 0;
  }).filter(value => typeof value === 'number') as number[];

  // Ensure xAxisData and yAxisData are of equal length
  const filteredData = xAxisData.map((x, index) => [x, yAxisData[index]]).filter(([x, y]) => typeof x === 'number' && typeof y === 'number') as [number, number][];

  // Perform regression if needed
  const regressionData = showRegression ? regression.linear(filteredData).points : [];

  // Prepare scatter chart data
  const chartData = {
    datasets: [
      {
        label: yExercise || yCategory || 'Data',
        data: xAxisData.map((x, index) => ({
          x,
          y: yAxisData[index],
        })),
        backgroundColor: pointColor,
        borderColor: pointColor,
        borderWidth: 1,
        showLine: false, // No line for data points
      },
      {
        label: 'Line of Best Fit',
        data: regressionData.map(([x, y]) => ({ x, y })),
        borderColor: lineColor,
        borderWidth: 2,
        showLine: true,
        fill: false, // No fill for line of best fit
        pointRadius: 0, // Make points on line of best fit invisible
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
        min: startFromZero ? 0 : undefined, // Option to start x-axis from 0
      },
      y: {
        title: {
          display: true,
          text: yCategory || 'Y-Axis',
        },
        min: startFromZero ? 0 : undefined, // Option to start y-axis from 0
      },
    },
  };

  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
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
          <label>Show Line of Best Fit:</label>
          <input
            type="checkbox"
            checked={showRegression}
            onChange={(e) => setShowRegression(e.target.checked)}
          />
        </div>

        <div>
          <label>Point Color:</label>
          <input
            type="color"
            value={pointColor}
            onChange={(e) => setPointColor(e.target.value)}
          />

          <label>Line Color:</label>
          <input
            type="color"
            value={lineColor}
            onChange={(e) => setLineColor(e.target.value)}
          />
        </div>

        <div>
          <label>Start Axes from 0:</label>
          <input
            type="checkbox"
            checked={startFromZero}
            onChange={handleStartFromZeroChange}
          />
        </div>
      </div>

      <Scatter data={chartData} options={options} />
    </div>
  );
};

export default ScatterChart;
