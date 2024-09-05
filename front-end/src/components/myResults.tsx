import React from 'react';

// Define the types for student data and normative results
interface MyResultsProps {
  studentData: {
    Name: string;
    Age: number;
    Height: number;
    Mass: number;
    Flexibility: { [test: string]: number };
    'Muscular Strength': { [test: string]: number };
    'Cardiovascular Endurance': { [test: string]: number };
  };
  normativeResults: {
    Age: string;
    Height: string;
    Mass: string;
    Flexibility: { [test: string]: string };
    'Muscular Strength': { [test: string]: string };
    'Cardiovascular Endurance': { [test: string]: string };
  };
}

const MyResults: React.FC<MyResultsProps> = ({ studentData, normativeResults }) => {
  // Helper function to render categories
  const renderCategory = (category: string, data: any, normative: any) => (
    <div key={category} className="mt-6">
      <h3 className="text-xl font-semibold mb-2">{category}</h3>
      <div className="exercise-list">
        {Object.entries(data).map(([test, score]) => (
          <p key={test} className="mb-1">
            <strong>{test}:</strong> {score} ({(normative as any)[test]})
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
          <li className="mb-1"><strong>Age:</strong> {studentData.Age} ({normativeResults.Age})</li>
          <li className="mb-1"><strong>Height:</strong> {studentData.Height} cm ({normativeResults.Height})</li>
          <li className="mb-1"><strong>Mass:</strong> {studentData.Mass} kg ({normativeResults.Mass})</li>
        </ul>
      </div>
      <div>
        {Object.keys(studentData).map((category) => {
          if (category === 'Name' || category === 'Age' || category === 'Height' || category === 'Mass') return null;
          return renderCategory(category, studentData[category as keyof typeof studentData], normativeResults[category as keyof typeof normativeResults] as any);
        })}
      </div>
    </div>
  );
};

export default MyResults;
