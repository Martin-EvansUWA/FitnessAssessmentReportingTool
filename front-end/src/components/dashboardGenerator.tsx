import axios from "axios";
import React, { useEffect, useState } from "react";
import { backEndUrl } from "../global_helpers/constants";
import BarChart from "./charts/BarChart";
import LineChart from "./charts/LineChart";
import RadarChart from "./charts/RadarChart";
import ScatterChart from "./charts/ScatterChart";
import Cookies from "js-cookie";


interface Props {
    factUserFormID: number | undefined; 
    formTemplateID: number | undefined;
    
}

const DashboardGenerator: React.FC<Props> = ({ factUserFormID, formTemplateID }) => {
    const [chartType, setChartType] = useState<string>("");
    const [studentData, setStudentData] = useState<any[]>([]);
    const [specificStudentData, setSpecificStudentData] = useState<any>({});


    useEffect(() => {
        // Fetch all student data
        const access_token = Cookies.get("access_token");
        axios
            .get(`${backEndUrl}/student_data/${formTemplateID}`, {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${access_token}`,
                },
              })
            .then((response) => {
                setStudentData(response.data);
            })
            .catch((error) => {
                console.error("Error fetching student data:", error);
            });

        // Fetch specific student data
        axios
            .get(`${backEndUrl}/normative_results/${formTemplateID}`,
                {
                    headers: {
                        Authorization: `Bearer ${access_token}`,
                    },
                }
            )
            .then((response) => {
                setSpecificStudentData(response.data);
            })
            .catch((error) => {
                console.error("Error fetching specific student data:", error);
            });
    }, []);

    const renderChart = () => {
        switch (chartType) {
            case "line":
                return <LineChart data={studentData} />;
            case "Bar":
                return <BarChart data={studentData} />;
            case "scatter":
                return <ScatterChart data={studentData} />;
            case "radar":
                return (
                    <RadarChart
                        specificStudentData={specificStudentData}
                        data={[]}
                    />
                );
            default:
                return <p>Please select a chart type.</p>;
        }
    };

    return (
        <div>
            <div>
                <h1 className="text-2xl font-bold mb-5">Data Visualization
                <hr className="w-28 border-t-2 border-uwa-yellow mt-2" />
                </h1>
            </div>
            <div className="my-6">
                <label className="mb-2">
                    Select Chart Type:
                    <select
                        className="w-30 mb-2"
                        value={chartType}
                        onChange={(e) => setChartType(e.target.value)}
                    >
                        <option value="">Select</option>
                        <option value="line">Line</option>
                        <option value="Bar">Bar</option>
                        <option value="scatter">Scatter</option>
                        <option value="radar">Radar</option>
                    </select>
                </label>
            </div>
            {renderChart()}
        </div>
    );
};

export default DashboardGenerator;
