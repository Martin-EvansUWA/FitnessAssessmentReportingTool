import React, { useState } from 'react';
import DashboardGenerator from '../components/dashboardGenerator';
import MyResults from '../components/myResults';
import Layout from '../components/layout';
import { SidebarData } from '../interface/sidebarInterface';

// Dummy student data
const studentData = {
  Name: 'Alice',
  Age: 22,
  Height: 170,
  Mass: 60,
  Flexibility: { 'Sit & Reach Test': 6 },
  'Muscular Strength': { 'Grip Strength': 15, 'Bench Press': 50, 'Leg Press': 80 },
  'Cardiovascular Endurance': { '12-minute Run': 4 }
};

// Dummy normative results data
const studentResults = {
  Age: "good",
  Height: "good",
  Mass: "average",
  Flexibility: { 'Sit & Reach Test': "average" },
  'Muscular Strength': { 'Grip Strength': "good", 'Bench Press': "average", 'Leg Press': "bad" },
  'Cardiovascular Endurance': { '12-minute Run': "average" }
};

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


const FormResults: React.FC = () => {
  const [mainContent, setMainContent] = useState<JSX.Element>(
    <MyResults studentData={studentData} normativeResults={studentResults} />
  );
  const [sidebarData, setSidebarData] = useState<SidebarData>(initialSidebarData);

  // Handler for "Data Visualization" click
  const handleDataVisualizationClick = () => {
    setMainContent(<DashboardGenerator />);
  };

  // Handler for "My Results" click
  const handleMyResultsClick = () => {
    setMainContent(<MyResults studentData={studentData} normativeResults={studentResults} />);
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
