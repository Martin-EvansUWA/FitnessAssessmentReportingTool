import React, { useState, ChangeEvent } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from 'chart.js';


ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

// Generalized DataItem interface to handle dynamic data structures
interface DataItem {
  [key: string]: any; // Allows flexibility for dynamic data structures
}

interface HistogramProps {
  data: DataItem[];
}

const Histogram: React.FC<HistogramProps> = ({ data }) => {
  const [xCategory, setXCategory] = useState<string>('');
  const [xExercise, setXExercise] = useState<string>('');
  const [binSize, setBinSize] = useState<number>(10); // Default bin size

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

  const handleBinSizeChange = (event: ChangeEvent<HTMLInputElement>) => {
    setBinSize(Number(event.target.value));
  };

  // Prepare data for the x-axis
  const exerciseValues = data
    .map(item => item[xCategory] && (item[xCategory] as Record<string, number>)[xExercise])
    .filter(value => typeof value === 'number') as number[];

  // Calculate min and max values for x-axis
  const minValue = Math.min(...exerciseValues);
  const maxValue = Math.max(...exerciseValues);

  // Create bins and counts
  const bins: { [key: number]: number } = {};
  for (let i = minValue; i <= maxValue; i += binSize) {
    bins[i] = 0;
  }
  exerciseValues.forEach(value => {
    const bin = Math.floor(value / binSize) * binSize;
    if (bins[bin] !== undefined) {
      bins[bin]++;
    }
  });

  // Prepare data for the histogram
  const chartData = {
    labels: Object.keys(bins).map(bin => `${bin}-${+bin + binSize}`),
    datasets: [
      {
        label: `Counts of ${xExercise || 'Values'}`,
        data: Object.values(bins),
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Histogram configuration
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
        title: {
          display: true,
          text: xExercise || 'X-Axis Exercise',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Count',
        },
        beginAtZero: true,
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
            <label>Bin Size:</label>
            <input
              type="number"
              value={binSize}
              onChange={handleBinSizeChange}
              min="1"
            />
          </div>
        </div>
      </div>
      <br />
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default Histogram;
