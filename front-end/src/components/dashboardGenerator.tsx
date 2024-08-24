import React, { useState } from 'react';
import BarChart from './charts/BarChart';
import LineChart from './charts/LineChart';
import PieChart from './charts/PieChart';
import BubbleChart from './charts/BubbleChart';
import ScatterChart from './charts/ScatterChart';
import RadarChart from './charts/RadarChart';

// Dummy data
const dummyData = [
  {
    Name: "Alice",
    Age: 22,
    Height: 170,
    Mass: 60,
    Flexibility: { "Sit & Reach Test": 6 },
    "Muscular Strength": { "Grip Strength": 15, "Bench Press": 50, "Leg Press": 80 },
    "Cardiovascular Endurance": { "12-minute Run": 4 }
  },
  {
    Name: "Bob",
    Age: 25,
    Height: 180,
    Mass: 75,
    Flexibility: { "Sit & Reach Test": 5 },
    "Muscular Strength": { "Grip Strength": 20, "Bench Press": 70, "Leg Press": 100 },
    "Cardiovascular Endurance": { "12-minute Run": 5 }
  }
];

const DashboardGenerator: React.FC = () => {
  const [chartType, setChartType] = useState<string>('');

  const renderChart = () => {
    switch (chartType) {
      case 'bar':
        return <BarChart data={dummyData} />;
      case 'line':
        return <LineChart data={dummyData} />;
      case 'pie':
        return <PieChart data={dummyData} />;
      case 'bubble':
        return <BubbleChart data={dummyData} />;
      case 'scatter':
        return <ScatterChart data={dummyData} />;
      case 'radar':
        return <RadarChart data={dummyData} />;
      default:
        return <p>Please select a chart type.</p>;
    }
  };

  return (
    <div className="flex flex-col min-h-full">
      <h1 className="text-2xl font-bold mb-1">Dashboard Generator</h1>
      <hr className="w-44 border-t-2 border-uwa-yellow " />
      <label>Select Chart Type:</label>
      <select value={chartType} onChange={(e) => setChartType(e.target.value)}>
        <option value="">Select</option>
        <option value="bar">Bar</option>
        <option value="line">Line</option>
        <option value="pie">Pie</option>
        <option value="bubble">Bubble</option>
        <option value="scatter">Scatter</option>
        <option value="radar">Radar</option>
      </select>
      {renderChart()}
    </div>
  );
};

export default DashboardGenerator;
