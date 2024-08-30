import React, { useState } from "react";
import DashboardGenerator from "../components/dashboardGenerator";
import Layout from "../components/layout";

// Define types for sidebar sections and data
type SidebarSection = {
  sectionName: string;
  sectionOnClick: () => void;
};

type SidebarData = {
  title: string;
  footer: any[];
  sections: {
    [key: string]: SidebarSection;
  }[];
};

// Dummy data for student details and test results
const studentData = {
  Name: "Alice",
  Age: 22,
  Height: 170,
  Mass: 60,
  Flexibility: { "Sit & Reach Test": 6 },
  "Muscular Strength": { "Grip Strength": 15, "Bench Press": 50, "Leg Press": 80 },
  "Cardiovascular Endurance": { "12-minute Run": 4 }
};

// Extract categories from studentData keys
type Category = keyof typeof studentData;

// Initial sidebar data
const initialSidebarData: SidebarData = {
  title: "SSEH2201 - 2024 Sem1",
  footer: [],
  sections: [
    {
      "Data Visualization": {
        sectionName: "Data Visualization",
        sectionOnClick: () => {} // Will be set in the component
      },
    },
    {
      "My Results": {
        sectionName: "My Results",
        sectionOnClick: () => {} // Will be set in the component
      },
    },
  ],
};

const categories: Category[] = ["Flexibility", "Muscular Strength", "Cardiovascular Endurance"];

const DashboardPage = () => {
  // State to manage the main content, sidebar data, and current category
  const [mainContent, setMainContent] = useState<JSX.Element>(<DashboardGenerator />);
  const [sidebarData, setSidebarData] = useState<SidebarData>(initialSidebarData);
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState<number>(0);

  // Handler for "Data Visualization" click
  const handleDataVisualizationClick = () => {
    setMainContent(<DashboardGenerator />);
    setSidebarData(initialSidebarData); // Reset sidebar to default options
  };

  // Handler for "My Results" click
  const handleMyResultsClick = () => {
    setMainContent(
      <div>
        <h2 className="text-2xl font-bold mb-1 relative">
          My Results
          <hr className="w-28 border-t-2 border-uwa-yellow mt-2" />
        </h2>
        <div>
          <p><strong>Name:</strong> {studentData.Name}</p>
          <p><strong>Age:</strong> {studentData.Age}</p>
          <p><strong>Height:</strong> {studentData.Height} cm</p>
          <p><strong>Mass:</strong> {studentData.Mass} kg</p>
        </div>
        <div className="flex justify-between mt-4">
          <button
            onClick={handlePreviousCategory}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            disabled={currentCategoryIndex === 0}
          >
            &lt; Previous
          </button>
          <button
            onClick={handleNextCategory}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            disabled={currentCategoryIndex === categories.length - 1}
          >
            Next &gt;
          </button>
        </div>
        <div>
          <h3 className="text-xl font-bold mt-4">{categories[currentCategoryIndex]}</h3>
          <ul>
            {Object.entries(studentData[categories[currentCategoryIndex]]).map(([test, score]) => (
              <li key={test}>{test}: {score}</li>
            ))}
          </ul>
        </div>
      </div>
    );

    // Update sidebar with options for "My Results"
    setSidebarData({
      title: "SSEH2201 - 2024 Sem1",
      footer: [],
      sections: [
        {
          "Data Visualization": {
            sectionName: "Data Visualization",
            sectionOnClick: handleDataVisualizationClick,
          },
        },
        {
          "My Results": {
            sectionName: "My Results",
            sectionOnClick: handleMyResultsClick,
          },
        },
        ...categories.map(category => ({
          [category]: {
            sectionName: category,
            sectionOnClick: () => handleCategoryClick(category),
          },
        })),
      ],
    });
  };

  // Handle category click to set main content
  const handleCategoryClick = (category: Category) => {
    setMainContent(
      <div>
        <h2 className="text-2xl font-bold mb-1 relative">
          {category}
          <hr className="w-28 border-t-2 border-uwa-yellow mt-2" />
        </h2>
        <ul>
          {Object.entries(studentData[category]).map(([test, score]) => (
            <li key={test}>{test}: {score}</li>
          ))}
        </ul>
      </div>
    );
    // Reset category index when switching categories
    setCurrentCategoryIndex(categories.indexOf(category));
  };

  // Move to previous category
  const handlePreviousCategory = () => {
    if (currentCategoryIndex > 0) {
      const newIndex = currentCategoryIndex - 1;
      setCurrentCategoryIndex(newIndex);
      handleCategoryClick(categories[newIndex]);
    }
  };

  // Move to next category
  const handleNextCategory = () => {
    if (currentCategoryIndex < categories.length - 1) {
      const newIndex = currentCategoryIndex + 1;
      setCurrentCategoryIndex(newIndex);
      handleCategoryClick(categories[newIndex]);
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
          sectionOnClick: sectionName === "Data Visualization"
            ? handleDataVisualizationClick
            : sectionName === "My Results"
            ? handleMyResultsClick
            : (section[sectionName as keyof typeof section] as { sectionOnClick: () => void }).sectionOnClick
        }
      };
    }),
  };

  return (
    <Layout sidebarContent={sidebarContent} mainContent={mainContent} />
  );
};

export default DashboardPage;
