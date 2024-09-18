import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LineChart from './charts/LineChart';
import BarChart from './charts/BarChart';
import BubbleChart from './charts/BubbleChart';
import ScatterChart from './charts/ScatterChart';
import RadarChart from './charts/RadarChart';
import { backEndUrl } from "../global_helpers/constants";

///this needs to be changed when cookies and authnticaiton has been implimented to get the right student ID
const StudentID = 23374376
const FormID = 1

const DashboardGenerator: React.FC = () => {
  const [chartType, setChartType] = useState<string>('');
  const [studentData, setStudentData] = useState<any[]>([]);
  const [specificStudentData, setSpecificStudentData] = useState<any>({});

  useEffect(() => {
    // Fetch all student data
    axios.get(`${backEndUrl}/student_data/${FormID}`)
      .then(response => {
        setStudentData(response.data);
      })
      .catch(error => {
        console.error('Error fetching student data:', error);
      });

    // Fetch specific student data
    axios.get(`${backEndUrl}/normative_results/${StudentID}/${FormID}`)
      .then(response => {
        setSpecificStudentData(response.data);
      })
      .catch(error => {
        console.error('Error fetching specific student data:', error);
      });
  }, []);

  const renderChart = () => {
    switch (chartType) {
      case 'line':
        return <LineChart data={studentData} />;
      case 'Bar':
        return <BarChart data={studentData} />;
      case 'bubble':
        return <BubbleChart data={studentData} />;
      case 'scatter':
        return <ScatterChart data={studentData} />;
      case 'radar':
        return <RadarChart specificStudentData={specificStudentData} data={[]} />;
      default:
        return <p>Please select a chart type.</p>;
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">
        Data Visualization
        <hr className="w-32 border-t-2 border-uwa-yellow mt-1" />
      </h1>
      <div className="mb-6">
        <label className="mb-2">Select Chart Type:
          <select
            className="w-30 mb-2"
            value={chartType}
            onChange={(e) => setChartType(e.target.value)}
          >
            <option value="">Select</option>
            <option value="line">Line</option>
            <option value="Bar">Bar</option>
            <option value="bubble">Bubble</option>
            <option value="scatter">Scatter</option>
            <option value="radar">Radar</option>
          </select>
        </label>
      </div>
      {renderChart()}
    </div>
  );
};

export default DashboardGenerator;
