import React, { useState, ChangeEvent } from 'react';
import { Radar } from 'react-chartjs-2';
import { Chart as ChartJS, RadialLinearScale, Title, Tooltip, Legend } from 'chart.js';
import { ChartData, ChartOptions } from 'chart.js';

// Register necessary components
ChartJS.register(RadialLinearScale, Title, Tooltip, Legend);

// Define types for dynamic data
interface DataItem {
  [key: string]: any;
}

interface RadarChartProps {
  data: DataItem[];
  specificStudentData: DataItem;
}

const RadarChart: React.FC<RadarChartProps> = ({ specificStudentData , data }) => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedExercises, setSelectedExercises] = useState<string[]>([]);
  const [studentColor, setStudentColor] = useState<string>('rgba(75, 192, 192, 1)');

  // Extract categories from data
  const categories = specificStudentData[0] ? Object.keys(specificStudentData[0]).filter(key => typeof specificStudentData[0][key] === 'object') : [];

  // Prepare chart data
  const chartData: ChartData<'radar'> = {
    labels: selectedExercises,
    datasets: [
      {
        label: specificStudentData[0]?.['Student Details']?.Name || 'Specific Student',
        data: selectedExercises.map((exercise) => {
          for (const category of selectedCategories) {
            const categoryData = specificStudentData[0][category];
            if (categoryData && typeof categoryData === 'object') {
              const value = categoryData[exercise];
              if (typeof value === 'number') {
                return value;
              }
            }
          }
          return 0; // Default to 0 if not found or not a number
        }),
        backgroundColor: 'rgba(0, 0, 0, 0)', // No fill
        borderColor: studentColor, // Use selected color
        borderWidth: 2, // Adjust the border width if needed
      },
    ],
  };

  // Radar chart options
  const options: ChartOptions<'radar'> = {
    responsive: true,
    maintainAspectRatio: false, // Allow chart to adjust dynamically
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: { enabled: true },
    },
    scales: {
      r: {
        angleLines: { display: false },
        suggestedMin: 0,
        suggestedMax: 100, // Fixed maximum value
        ticks: {
          stepSize: 10, // Adjust step size if needed
        },
      },
    },
  };

  // Handlers for checkbox changes
  const handleCategoryChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = event.target;
    setSelectedCategories((prevState) =>
      checked ? [...prevState, value] : prevState.filter((category) => category !== value)
    );

    if (checked) {
      const newExercises = Array.from(new Set([...selectedExercises, ...Object.keys(specificStudentData[0][value] || {})]));
      setSelectedExercises(newExercises);
    } else {
      setSelectedExercises((prevExercises) =>
        prevExercises.filter((exercise) => !Object.keys(specificStudentData[0][value] || {}).includes(exercise))
      );
    }
  };

  const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = event.target;
    setSelectedExercises((prevState) => {
      const newSelectedExercises = checked
        ? [...prevState, value]
        : prevState.filter((exercise) => exercise !== value);
  
      // Filter out exercises that have non-integer values
      return newSelectedExercises.filter((exercise) => {
        return selectedCategories.some((category) => {
          const categoryData = specificStudentData[0][category];
          return typeof categoryData === 'object' && typeof categoryData[exercise] === 'number' && Number.isInteger(categoryData[exercise]);
        });
      });
    });
  };
  
  const handleStudentColorChange = (event: ChangeEvent<HTMLInputElement>) => {
    setStudentColor(event.target.value);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start' }}>
        {/* Category Selectors */}
        <div style={{ flex: '1', marginRight: '20px' }}>
          <h2>Select Categories:</h2>
          {categories.map((category) => (
            <div key={category}>
              <label>
                <input
                  type="checkbox"
                  value={category}
                  checked={selectedCategories.includes(category)}
                  onChange={handleCategoryChange}
                />
                {category}
              </label>
            </div>
          ))}
        </div>

        {/* Exercise Selectors and Options */}
        <div style={{ flex: '2', display: 'flex', alignItems: 'flex-start' }}>
          {/* Select Exercises */}
          <div style={{ flex: '2' }}>
            <h3>Select Exercises:</h3>
            {selectedCategories.flatMap((category) =>
              Object.keys(specificStudentData[0][category] || {})
                .filter((exercise) => typeof specificStudentData[0][category][exercise] === 'number') // Filter for numeric values
                .map((exercise) => (
                  <div key={exercise}>
                    <label>
                      <input
                        type="checkbox"
                        value={exercise}
                        checked={selectedExercises.includes(exercise)}
                        onChange={handleCheckboxChange}
                      />
                      {exercise}
                    </label>
                  </div>
                ))
            )}
          </div>

          {/* Color Picker */}
          <div style={{ flex: '1', marginLeft: '20px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ marginTop: '20px' }}>
              <label>
                Student Data Line Color:
                <input
                  type="color"
                  value={studentColor}
                  onChange={handleStudentColorChange}
                />
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Radar Chart */}
      <div style={{ marginTop: '20px', width: '100%', height: '80vh' /* Adjust height as needed */ }}>
        <Radar data={chartData} options={options} />
      </div>
    </div>
  );
};

export default RadarChart;
