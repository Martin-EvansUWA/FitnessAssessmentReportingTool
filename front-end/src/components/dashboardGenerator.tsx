import React, { useState } from 'react';
import LineChart from './charts/LineChart';
import BubbleChart from './charts/BubbleChart';
import ScatterChart from './charts/ScatterChart';
import RadarChart from './charts/RadarChart';

// Expanded Dummy Data with more students
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
  },
  {
    Name: "Carol",
    Age: 21,
    Height: 165,
    Mass: 55,
    Flexibility: { "Sit & Reach Test": 7 },
    "Muscular Strength": { "Grip Strength": 18, "Bench Press": 60, "Leg Press": 90 },
    "Cardiovascular Endurance": { "12-minute Run": 4.5 }
  },
  {
    Name: "David",
    Age: 28,
    Height: 175,
    Mass: 68,
    Flexibility: { "Sit & Reach Test": 4 },
    "Muscular Strength": { "Grip Strength": 22, "Bench Press": 80, "Leg Press": 110 },
    "Cardiovascular Endurance": { "12-minute Run": 6 }
  },
  {
    Name: "Eva",
    Age: 23,
    Height: 160,
    Mass: 58,
    Flexibility: { "Sit & Reach Test": 8 },
    "Muscular Strength": { "Grip Strength": 17, "Bench Press": 55, "Leg Press": 85 },
    "Cardiovascular Endurance": { "12-minute Run": 4.2 }
  },
  {
    Name: "Frank",
    Age: 26,
    Height: 182,
    Mass: 80,
    Flexibility: { "Sit & Reach Test": 5 },
    "Muscular Strength": { "Grip Strength": 25, "Bench Press": 85, "Leg Press": 120 },
    "Cardiovascular Endurance": { "12-minute Run": 5.5 }
  },
  {
    Name: "Grace",
    Age: 24,
    Height: 168,
    Mass: 62,
    Flexibility: { "Sit & Reach Test": 6 },
    "Muscular Strength": { "Grip Strength": 19, "Bench Press": 65, "Leg Press": 95 },
    "Cardiovascular Endurance": { "12-minute Run": 4.8 }
  }
];

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
      case 'line':
        return <LineChart data={dummyData} />;
      case 'bubble':
        return <BubbleChart data={dummyData} />;
      case 'scatter':
        return <ScatterChart data={dummyData} />;
      case 'radar':
        return <RadarChart data={dummyData} specificStudentData={specificStudentData} />;
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
        <option value="line">Line</option>
        <option value="bubble">Bubble</option>
        <option value="scatter">Scatter</option>
        <option value="radar">Radar</option>
      </select>
      {renderChart()}
    </div>
  );
};

export default DashboardGenerator;
