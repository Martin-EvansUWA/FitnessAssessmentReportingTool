import { faHome } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DashboardGenerator from "../components/dashboardGenerator";
import Layout from "../components/layout";
import MyResults from "../components/myResults";
import { backEndUrl } from "../global_helpers/constants";
import { SidebarData } from "../interface/sidebarInterface";

// Define generic types for fetched data
interface CategoryData {
    [test: string]: number | string;
}

const FormResults: React.FC = () => {
    const location = useLocation();
    const { factUserFormID, formTitle } = location.state || {};

    const [state, setState] = useState({
        mainContent: <div>Loading...</div>,
        studentData: [] as CategoryData[],
    });

    const navigate = useNavigate();

    useEffect(() => {
        if (factUserFormID) {
            const fetchData = async () => {
                try {
                    const studentResponse = await axios.get<CategoryData[]>(
                        `${backEndUrl}/get_specific_student_data_fact_user_form_id/${factUserFormID}`
                    );
                    console.log(
                        "Successfully fetched data:",
                        studentResponse.data
                    );
                    setState({
                        mainContent:
                            studentResponse.data.length > 0 ? (
                                <MyResults studentData={studentResponse.data} />
                            ) : (
                                <div>No data available</div>
                            ),
                        studentData: studentResponse.data,
                    });
                } catch (error) {
                    console.error("Error fetching data:", error);
                    setState({
                        mainContent: <div>Error loading data</div>,
                        studentData: [],
                    });
                }
            };

            fetchData();
        } else {
            setState({
                mainContent: <div>No FactUserFormID provided</div>,
                studentData: [],
            });
        }
    }, [factUserFormID]);

    const handleDataVisualizationClick = useCallback(() => {
        setState((prevState) => ({
            ...prevState,
            mainContent: <DashboardGenerator />,
        }));
    }, []);

    const handleMyResultsClick = useCallback(() => {
        if (state.studentData.length > 0) {
            setState((prevState) => ({
                ...prevState,
                mainContent: <MyResults studentData={state.studentData} />,
            }));
        }
    }, [state.studentData]);

    const sidebarContent: SidebarData = {
        title: formTitle || "Form Results",
        sections: [
            {
                "My Results": {
                    sectionName: "My Results",
                    sectionOnClick: handleMyResultsClick,
                },
            },
            {
                "Data Visualization": {
                    sectionName: "Data Visualization",
                    sectionOnClick: handleDataVisualizationClick,
                },
            },
        ],
        footer: [
            {
                text: "Return to Form Manager",
                fontAwesomeIcon: faHome,
                onClick: () => {
                    navigate("/student-form-manager");
                },
            },
        ],
    };

    return (
        <Layout
            sidebarContent={sidebarContent}
            mainContent={state.mainContent}
        />
    );
};

export default FormResults;
