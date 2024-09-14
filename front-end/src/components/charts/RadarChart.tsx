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

const RadarChart: React.FC<RadarChartProps> = ({ data, specificStudentData }) => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedExercises, setSelectedExercises] = useState<string[]>([]);
  const [showStudentData, setShowStudentData] = useState<boolean>(true);
  const [showMaxValues, setShowMaxValues] = useState<boolean>(true);

  // State for colors
  const [studentColor, setStudentColor] = useState<string>('rgba(75, 192, 192, 1)');
  const [maxValuesColor, setMaxValuesColor] = useState<string>('rgba(255, 99, 132, 1)');

  // Extract categories and exercises from data
  const categories = data[0] ? Object.keys(data[0]).filter(key => typeof data[0][key] === 'object') : {};

  // Initialize max values object to store max values of each exercise
  const maxValues: Record<string, number> = {};

  // Loop through each category to compute max values
  Object.keys(categories).forEach((category) => {
    Object.keys(data[0][category] || {}).forEach((exercise) => {
      maxValues[exercise] = Math.max(
        ...data.map((item) => item[category]?.[exercise] || 0)
      );
    });
  });

  // Find the maximum value from the data to dynamically adjust the scale
  const overallMaxValue = Math.max(
    ...selectedExercises.map((exercise) => maxValues[exercise] || 0)
  );

  // Prepare chart data
  const chartData: ChartData<'radar'> = {
    labels: selectedExercises,
    datasets: [
      ...(showStudentData
        ? [
            {
              label: specificStudentData.Name || 'Specific Student',
              data: selectedExercises.map((exercise) => {
                let value = 0;
                selectedCategories.forEach((category) => {
                  value = value || specificStudentData[category]?.[exercise];
                });
                return value || 0;
              }),
              backgroundColor: 'rgba(0, 0, 0, 0)', // No fill
              borderColor: studentColor, // Use selected color
              borderWidth: 2, // Adjust the border width if needed
            },
          ]
        : []),
      ...(showMaxValues
        ? [
            {
              label: 'Max Values',
              data: selectedExercises.map((exercise) => maxValues[exercise] || 0),
              backgroundColor: 'rgba(0, 0, 0, 0)', // No fill
              borderColor: maxValuesColor, // Use selected color
              borderWidth: 2, // Adjust the border width if needed
            },
          ]
        : []),
    ],
  };

  // Radar chart options
  const options: ChartOptions<'radar'> = {
    responsive: true,
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
        suggestedMax: Math.ceil(overallMaxValue * 1.2), // Add a buffer (20% more than the max value)
        ticks: {
          stepSize: Math.ceil(overallMaxValue / 5), // Adjust step size based on data
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
  };

  const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = event.target;
    setSelectedExercises((prevState) =>
      checked ? [...prevState, value] : prevState.filter((exercise) => exercise !== value)
    );
  };

  const handleShowStudentDataChange = (event: ChangeEvent<HTMLInputElement>) => {
    setShowStudentData(event.target.checked);
  };

  const handleShowMaxValuesChange = (event: ChangeEvent<HTMLInputElement>) => {
    setShowMaxValues(event.target.checked);
  };

  const handleStudentColorChange = (event: ChangeEvent<HTMLInputElement>) => {
    setStudentColor(event.target.value);
  };

  const handleMaxValuesColorChange = (event: ChangeEvent<HTMLInputElement>) => {
    setMaxValuesColor(event.target.value);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start' }}>
        {/* Category Selectors */}
        <div style={{ flex: '1', marginRight: '20px' }}>
          <h2>Select Categories:</h2>
          {Object.keys(categories).map((category) => (
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
              Object.keys(data[0][category] || {}).map((exercise) => (
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

          {/* Options and Color Pickers */}
          <div style={{ flex: '1', marginLeft: '20px', display: 'flex', flexDirection: 'column' }}>
            {/* Show Options */}
            <div style={{ marginTop: '10px' }}>
              <label>
                Show Student Data: 
                <input
                  type="checkbox"
                  checked={showStudentData}
                  onChange={handleShowStudentDataChange}
                />
              </label>
              <br></br>
              <label style={{ marginTop: '10px' }}>
                Show Max Values: 
                <input
                  type="checkbox"
                  checked={showMaxValues}
                  onChange={handleShowMaxValuesChange}
                />
              </label>
            </div>

            {/* Color Pickers */}
            <div style={{ marginTop: '20px' }}>
              <label>
                Student Data Line Color: 
                <input
                  type="color"
                  value={studentColor}
                  onChange={handleStudentColorChange}
                />
              </label>
              <br></br>
              <label style={{ marginTop: '10px' }}>
                Max Values Line Color: 
                <input
                  type="color"
                  value={maxValuesColor}
                  onChange={handleMaxValuesColorChange}
                />
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Radar Chart */}
      <div style={{ marginTop: '20px' }}>
        <Radar data={chartData} options={options} />
      </div>
    </div>
  );
};

export default RadarChart;
