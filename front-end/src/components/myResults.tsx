import React from "react";

// Define the type for student data
interface CategoryData {
    [test: string]: number | string;
}

interface MyResultsProps {
    studentData: CategoryData[]; // Array of CategoryData objects
}

const MyResults: React.FC<MyResultsProps> = ({ studentData }) => {
    return (
        <div>
            <div>
                <h1 className="text-2xl font-bold mb-5">My Results</h1>
                <hr className="w-28 border-t-2 border-uwa-yellow mt-2" />
                <p className="my-5">
                    Here are your results for the form you completed.
                </p>
            </div>
            <div>
                <ul>
                    {Object.keys(studentData).map((category, index) => {
                        return (
                            <li key={index}>
                                <h2 className="text-xl font-bold my-2">
                                    {category}
                                </h2>
                                <ul>
                                    {Object.keys(
                                        studentData[category as any]
                                    ).map((test, index) => {
                                        return (
                                            <li key={index}>
                                                <p className="my-2">
                                                    {test}:{" "}
                                                    {
                                                        studentData[
                                                            category as any
                                                        ][test]
                                                    }
                                                </p>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
};

export default MyResults;
