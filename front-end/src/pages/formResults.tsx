import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DashboardGenerator from '../components/dashboardGenerator';
import MyResults from '../components/myResults';
import Layout from '../components/layout';
import { SidebarData } from '../interface/sidebarInterface';
import { backEndUrl } from "../global_helpers/constants";

// Define generic types for fetched data
interface CategoryData {
  [test: string]: number | string;
}

const initialSidebarData: SidebarData = {
  title: 'SSEH2201 - 2024 Sem1',
  footer: [],
  sections: [
    {
      'My Results': {
        sectionName: 'My Results',
        sectionOnClick: () => {} // Placeholder; will be set in the component
      }
    },
    {
      'Data Visualization': {
        sectionName: 'Data Visualization',
        sectionOnClick: () => {} // Placeholder; will be set in the component
      }
    }
  ]
};

// Placeholder student and form IDs
const StudentID = 23374376;
const FormID = 1;

const FormResults: React.FC = () => {
  const [mainContent, setMainContent] = useState<JSX.Element>(<div>Loading...</div>);
  const [sidebarData, setSidebarData] = useState<SidebarData>(initialSidebarData);
  const [studentData, setStudentData] = useState<CategoryData[]>([]); // Updated type
  const [normativeResults, setNormativeResults] = useState<CategoryData[]>([]); // Updated type

  useEffect(() => {
    const fetchData = async () => {
      try {
        const studentResponse = await axios.get<CategoryData[]>(`${backEndUrl}/specific_student_data/${StudentID}/${FormID}`);
        const normativeResponse = await axios.get<CategoryData[]>(`${backEndUrl}/normative_results/${StudentID}/${FormID}`);
        setStudentData(studentResponse.data);
        setNormativeResults(normativeResponse.data);
        setMainContent(
          studentResponse.data.length > 0 && normativeResponse.data.length > 0
            ? <MyResults studentData={studentResponse.data} normativeResults={normativeResponse.data} />
            : <div>No data available</div>
        );
      } catch (error) {
        console.error('Error fetching data:', error);
        setMainContent(<div>Error loading data</div>);
      }
    };

    fetchData();
  }, []);

  // Handler for "Data Visualization" click
  const handleDataVisualizationClick = () => {
    setMainContent(<DashboardGenerator />);
  };

  // Handler for "My Results" click
  const handleMyResultsClick = () => {
    if (studentData.length > 0 && normativeResults.length > 0) {
      setMainContent(<MyResults studentData={studentData} normativeResults={normativeResults} />);
    }
  };

  // Set the onClick handlers for sidebar sections
  const sidebarContent: SidebarData = {
    ...sidebarData,
    sections: sidebarData.sections.map((section) => {
      const sectionName = Object.keys(section)[0];
      return {
        [sectionName]: {
          ...section[sectionName],
          sectionOnClick: sectionName === 'Data Visualization'
            ? handleDataVisualizationClick
            : sectionName === 'My Results'
            ? handleMyResultsClick
            : (section[sectionName as keyof typeof section] as { sectionOnClick: () => void }).sectionOnClick
        }
      };
    })
  };

  return (
    <Layout sidebarContent={sidebarContent} mainContent={mainContent} />
  );
};

export default FormResults;
