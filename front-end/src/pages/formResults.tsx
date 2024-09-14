import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DashboardGenerator from '../components/dashboardGenerator';
import MyResults from '../components/myResults';
import Layout from '../components/layout';
import { SidebarData } from '../interface/sidebarInterface';
import { backEndUrl } from '../constants';

// Define generic types for fetched data
interface Data {
  [key: string]: any; // Flexible structure to handle any data shape
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
///this needs to be changed when cookies and authnticaiton has been implimented to get the right student ID
const StudentID = 1;
const FormTemplateID =  "123" 

const FormResults: React.FC = () => {
  const [mainContent, setMainContent] = useState<JSX.Element>(<div>Loading...</div>);
  const [sidebarData, setSidebarData] = useState<SidebarData>(initialSidebarData);
  const [studentData, setStudentData] = useState<Data | null>(null);
  const [normativeResults, setNormativeResults] = useState<Data | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const studentResponse = await axios.get<Data>(`${backEndUrl}/specific_student_data/${StudentID}`);
        const normativeResponse = await axios.get<Data>(`${backEndUrl}/normative_results/${StudentID}/${FormTemplateID}`);
        setStudentData(studentResponse.data);
        setNormativeResults(normativeResponse.data);
        setMainContent(
          studentResponse.data && normativeResponse.data
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
    if (studentData && normativeResults) {
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
