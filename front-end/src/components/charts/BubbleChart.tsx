import React, { useState, ChangeEvent } from 'react';
import { Bubble } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, Title, Tooltip, Legend);

// Define types
interface DataItem {
  [key: string]: any; // This allows any structure for the data
}

interface BubbleChartProps {
  data: DataItem[];
}

const BubbleChart: React.FC<BubbleChartProps> = ({ data }) => {
  const [xCategory, setXCategory] = useState<string>('');
  const [xExercise, setXExercise] = useState<string>('');
  const [yCategory, setYCategory] = useState<string>('');
  const [yExercise, setYExercise] = useState<string>('');
  const [sizeCategory, setSizeCategory] = useState<string>('');
  const [sizeExercise, setSizeExercise] = useState<string>('');
  const [borderColor, setBorderColor] = useState<string>('rgba(75, 192, 192, 1)');
  const [fillColor, setFillColor] = useState<string>('rgba(75, 192, 192, 0.5)');
  const [showXAxisZero, setShowXAxisZero] = useState<boolean>(true);
  const [showYAxisZero, setShowYAxisZero] = useState<boolean>(true);

  // Extract categories and exercises dynamically
  const categories: Record<string, string[]> = {};

  data.forEach(item => {
    Object.keys(item).forEach(key => {
      if (typeof item[key] === 'object' && item[key] !== null) {
        categories[key] = Object.keys(item[key]);
      } else if (typeof item[key] === 'number') {
        if (!categories[key]) categories[key] = [];
      }
    });
  });

  // Handle category and exercise changes
  const handleXCategoryChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setXCategory(event.target.value);
    setXExercise(''); // Reset exercise when category changes
  };

  const handleXExerciseChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setXExercise(event.target.value);
  };

  const handleYCategoryChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setYCategory(event.target.value);
    setYExercise(''); // Reset exercise when category changes
  };

  const handleYExerciseChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setYExercise(event.target.value);
  };

  const handleSizeCategoryChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSizeCategory(event.target.value);
    setSizeExercise(''); // Reset exercise when category changes
  };

  const handleSizeExerciseChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSizeExercise(event.target.value);
  };

  // Prepare data for the chart
  const xAxisData = data.map((item) => {
    if (xCategory && xExercise) {
      const categoryData = item[xCategory as keyof DataItem] as Record<string, number>;
      return categoryData[xExercise as keyof typeof categoryData] || 0;
    }
    return item[xCategory as keyof DataItem] || 0;
  });

  const yAxisData = data.map((item) => {
    if (yCategory && yExercise) {
      const categoryData = item[yCategory as keyof DataItem] as Record<string, number>;
      return categoryData[yExercise as keyof typeof categoryData] || 0;
    }
    return item[yCategory as keyof DataItem] || 0;
  });

  const sizeData = data.map((item) => {
    if (sizeCategory && sizeExercise) {
      const categoryData = item[sizeCategory as keyof DataItem] as Record<string, number>;
      return categoryData[sizeExercise as keyof typeof categoryData] || 0;
    }
    return item[sizeCategory as keyof DataItem] || 0;
  });

  // Bubble chart data
  const chartData = {
    datasets: [{
      label: sizeExercise || sizeCategory || 'Data',
      data: data.map((_, index) => ({
        x: xAxisData[index],
        y: yAxisData[index],
        r: sizeData[index] || 5, // Default size if no data
      })),
      backgroundColor: fillColor,
      borderColor: borderColor,
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
          text: xExercise || 'X-Axis Exercise', // Change to xExercise
        },
        beginAtZero: showXAxisZero,
      },
      y: {
        title: {
          display: true,
          text: yExercise || 'Y-Axis Exercise', // Change to yExercise
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

          <div>
            <label>Size Category:</label>
            <select value={sizeCategory} onChange={handleSizeCategoryChange}>
              <option value="">Select Category</option>
              {Object.keys(categories).map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>

            {sizeCategory && (
              <div>
                <label>Size Exercise:</label>
                <select value={sizeExercise} onChange={handleSizeExerciseChange}>
                  <option value="">Select Exercise</option>
                  {(categories[sizeCategory] || []).map(exercise => (
                    <option key={exercise} value={exercise}>{exercise}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>

        <div>
          <label>Bubble Border Color: </label>
          <input
            type="color"
            value={borderColor}
            onChange={(e) => setBorderColor(e.target.value)}
          />

          <label> Bubble Fill Color:</label>
          <input
            type="color"
            value={fillColor}
            onChange={(e) => setFillColor(e.target.value)}
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
      <Bubble data={chartData} options={options} />
    </div>
  );
};

export default BubbleChart;
