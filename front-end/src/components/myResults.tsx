import React from 'react';

// Define the types for student data and normative results
interface CategoryData {
  [test: string]: number | string;
}

interface MyResultsProps {
  studentData: {
    [key: string]: number | CategoryData;
  };
  normativeResults: {
    [key: string]: string | CategoryData;
  };
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

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">
        My Results
        <hr className="w-32 border-t-2 border-uwa-yellow mt-1" />
      </h1>
      <div className="mb-6">
        <ul className="list-none">
          {Object.entries(studentData).map(([key, value]) => {
            if (typeof value === 'number') {
              return (
                <li key={key} className="mb-1">
                  <strong>{key}:</strong> {value} ({(normativeResults[key] as string) || 'N/A'})
                </li>
              );
            }
            return null;
          })}
        </ul>
      </div>
      <div>
        {Object.keys(studentData).map((category) => {
          if (typeof studentData[category] !== 'object') return null;
          return renderCategory(
            category,
            studentData[category] as CategoryData,
            normativeResults[category] as CategoryData
          );
        })}
      </div>
    </div>
  );
};

export default MyResults;
