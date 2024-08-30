import React, { useState } from 'react';
import LineChart from './charts/LineChart';
import BubbleChart from './charts/BubbleChart';
import ScatterChart from './charts/ScatterChart';
import RadarChart from './charts/RadarChart';

// Expanded Dummy Data with more students


// Specific student data
const specificStudentData = {
  Name: "Alice",
  Age: 22,
  Height: 170,
  Mass: 60,
  Flexibility: { "Sit & Reach Test": 6 },
  "Muscular Strength": { "Grip Strength": 15, "Bench Press": 50, "Leg Press": 80 },
  "Cardiovascular Endurance": { "12-minute Run": 4 }
};

const DashboardGenerator: React.FC = () => {
  const [chartType, setChartType] = useState<string>('');

  const renderChart = () => {
    switch (chartType) {

      default:
        return <p>Please select a chart type.</p>;
    }
  };

  return (
    <div className="flex flex-col min-h-full">
      <h1 className="text-2xl font-bold mb-1 relative">Dashboard Generator
        <hr className="w-28 border-t-2 border-uwa-yellow mt-2" />
      </h1>

      
    
      
      {renderChart()}
    </div>
  );
};

export default DashboardGenerator;