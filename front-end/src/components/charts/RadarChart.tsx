import React, { useState, ChangeEvent } from 'react';
import { Radar } from 'react-chartjs-2';
import { Chart as ChartJS, RadialLinearScale, Title, Tooltip, Legend } from 'chart.js';

// Registering necessary components
ChartJS.register(
  RadialLinearScale,
  Title,
  Tooltip,
  Legend
);

// Define types
interface Student {
  Name: string;
  Flexibility: Record<string, number>;
  'Muscular Strength': Record<string, number>;
  'Cardiovascular Endurance': Record<string, number>;
}

interface RadarChartProps {
  data: Student[];
}

const RadarChart: React.FC<RadarChartProps> = ({ data }) => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedExercises, setSelectedExercises] = useState<string[]>([]);

  // Extract categories and exercises from data
  const categories: { [key: string]: string[] } = {
    Flexibility: Object.keys(data[0].Flexibility || {}),
    'Muscular Strength': Object.keys(data[0]['Muscular Strength'] || {}),
    'Cardiovascular Endurance': Object.keys(data[0]['Cardiovascular Endurance'] || {}),
  };

  // Handle category selection
  const handleCategoryChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = event.target;
    setSelectedCategories(prevState =>
      checked ? [...prevState, value] : prevState.filter(category => category !== value)
    );
  };

  // Handle checkbox change for exercises
  const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = event.target;
    setSelectedExercises(prevState =>
      checked ? [...prevState, value] : prevState.filter(exercise => exercise !== value)
    );
  };

  // Prepare chart data based on selected exercises
  const chartData = {
    labels: selectedExercises,
    datasets: data.map(item => ({
      label: item.Name,
      data: selectedExercises.map(exercise => {
        // Safely access properties using type assertions
        let value = 0;
        for (const category of selectedCategories) {
          const categoryData = item[category as keyof Student];
          if (categoryData) {
            value = value || (categoryData as Record<string, number>)[exercise];
          }
        }
        return value || 0;
      }),
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 1,
    }))
  };

  // Radar chart options
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
      r: {
        angleLines: {
          display: false,
        },
        suggestedMin: 0,
        suggestedMax: 100,
        ticks: {
          stepSize: 10,
        },
      },
    },
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex' }}>
        {/* Category Selectors */}
        <div style={{ flex: '1', marginRight: '20px' }}>
          <h2>Select Categories:</h2>
          {Object.keys(categories).map(category => (
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

        {/* Exercise Selectors */}
        {selectedCategories.length > 0 && (
          <div style={{ flex: '1' }}>
            <h3>Select Exercises:</h3>
            {selectedCategories.flatMap(category =>
              categories[category].map(exercise => (
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
        )}
      </div>

      {/* Radar Chart */}
      <div style={{ marginTop: '20px' }}>
        <Radar data={chartData} options={options} />
      </div>
    </div>
  );
};

export default RadarChart;
