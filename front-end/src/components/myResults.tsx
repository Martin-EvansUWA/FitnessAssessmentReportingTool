import React from 'react';

// Define the types for student data and normative results
interface CategoryData {
  [test: string]: number | string;
}

interface MyResultsProps {
  studentData: CategoryData[]; // Array of CategoryData objects
  normativeResults: CategoryData[]; // Array of CategoryData objects
}

const MyResults: React.FC<MyResultsProps> = ({ studentData, normativeResults }) => {
  // Helper function to render categories
  const renderCategory = (category: string, data: CategoryData, normative: CategoryData) => (
    <div key={category} className="mt-6">
      <h3 className="text-xl font-semibold mb-2">{category}</h3>
      <div className="exercise-list">
        {Object.entries(data).map(([test, score]) => (
          <p key={test} className="mb-1">
            <strong>{test}:</strong> {score} ({(normative[test] as string) || 'N/A'})
          </p>
        ))}
      </div>
    </div>
  );

  if (!studentData.length || !normativeResults.length) {
    return <div>No data available</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">
        My Results
        <hr className="w-32 border-t-2 border-uwa-yellow mt-1" />
      </h1>
      <div className="mb-6">
        <ul className="list-none">
          {studentData.map((data, index) => (
            <div key={index}>
              {Object.entries(data).map(([key, value]) => {
                if (typeof value === 'number') {
                  // Ensure normativeResults[index] exists and is of type CategoryData
                  const normativeValue = normativeResults[index] && typeof normativeResults[index] === 'object' ? normativeResults[index][key] : 'N/A';
                  return (
                    <li key={key} className="mb-1">
                      <strong>{key}:</strong> {value} ({normativeValue})
                    </li>
                  );
                }
                return null;
              })}
            </div>
          ))}
        </ul>
      </div>
      <div>
        {studentData.map((data, index) => (
          <div key={index}>
            {Object.keys(data).map((category) => {
              // Ensure category data is of type CategoryData
              const categoryData = data[category];
              const categoryNormative = normativeResults[index] && typeof normativeResults[index] === 'object' ? normativeResults[index][category] : {};
              
              if (typeof categoryData !== 'object' || typeof categoryNormative !== 'object') return null;
              return renderCategory(
                category,
                categoryData as CategoryData,
                categoryNormative as CategoryData
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyResults;
