import React from 'react';

// Define the type for student data
interface CategoryData {
  [test: string]: number | string;
}

interface MyResultsProps {
  studentData: CategoryData[]; // Array of CategoryData objects
}

const MyResults: React.FC<MyResultsProps> = ({ studentData }) => {
  // Helper function to render categories
  const renderCategory = (category: string, data: CategoryData) => (
    <div key={category} className="mt-6">
      <h3 className="text-xl font-semibold mb-2">{category}</h3>
      <div className="exercise-list">
        {Object.entries(data).map(([test, score]) => (
          <p key={test} className="mb-1">
            <strong>{test}:</strong> {score}
          </p>
        ))}
      </div>
    </div>
  );

  if (!studentData.length) {
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
                  return (
                    <li key={key} className="mb-1">
                      <strong>{key}:</strong> {value}
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
              const categoryData = data[category];
              
              if (typeof categoryData !== 'object') return null;
              return renderCategory(category, categoryData as CategoryData);
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyResults;
