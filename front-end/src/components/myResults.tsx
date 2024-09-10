import React from 'react';

// Define generic types for data
interface MyResultsProps {
  studentData: { [key: string]: any }; // Flexible structure
  normativeResults: { [key: string]: any }; // Flexible structure
}

const MyResults: React.FC<MyResultsProps> = ({ studentData, normativeResults }) => {
  // Helper function to render categories dynamically
  const renderCategory = (category: string, data: any, normative: any) => (
    <div key={category} className="mt-6">
      <h3 className="text-xl font-semibold mb-2">{category}</h3>
      <div className="exercise-list">
        {Object.entries(data).map(([test, score]) => (
          <p key={test} className="mb-1">
            <strong>{test}:</strong> {score} ({normative[test]})
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
          {Object.entries(studentData).filter(([key]) => !['Name', 'Age', 'Height', 'Mass'].includes(key)).map(([key, value]) => (
            renderCategory(key, value, normativeResults[key])
          ))}
        </ul>
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-2">Personal Info</h3>
          <ul className="list-none">
            <li className="mb-1"><strong>Age:</strong> {studentData.Age} ({normativeResults.Age})</li>
            <li className="mb-1"><strong>Height:</strong> {studentData.Height} cm ({normativeResults.Height})</li>
            <li className="mb-1"><strong>Mass:</strong> {studentData.Mass} kg ({normativeResults.Mass})</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MyResults;
