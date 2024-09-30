import { faHome } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Bounce, toast, ToastContainer } from "react-toastify";
import DashboardGenerator from "../components/dashboardGenerator";
import Layout from "../components/layout";
import MyResults from "../components/myResults";
import { backEndUrl } from "../global_helpers/constants";
import { SidebarData } from "../interface/sidebarInterface";
import Cookies from "js-cookie";

// Define generic types for fetched data
interface CategoryData {
  [test: string]: number | string;
}

const defaultMainContent = (
  <div>
    <h1 className="text-2xl font-bold mb-5">My Dashboard</h1>
    <hr className="w-28 border-t-2 border-uwa-yellow mt-2" />
    <p className="my-5">
      Welcome to your Dashboard! Here you can view your results and visualize
      your data.
    </p>
    <p className="my-5">
      To get started, select an option from the sidebar to view your results or
      visualize your data.
    </p>
  </div>
);

const FormResults: React.FC = () => {
  const location = useLocation();
  const { factUserFormID, formTitle } = location.state || {};
  const [mainContent, setMainContent] = useState(defaultMainContent);
  const [studentData, setStudentData] = useState([] as CategoryData[]);

  const navigate = useNavigate();

  useEffect(() => {
    if (factUserFormID) {
      const fetchData = async () => {
        try {
          const access_token = Cookies.get("access_token");
          const studentResponse = await axios.get<CategoryData[]>(
            `${backEndUrl}/get_specific_student_data_fact_user_form_id/${factUserFormID}`,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${access_token}`,
              },
            }
          );
          console.log("Successfully fetched data:", studentResponse.data);
          setStudentData(studentResponse.data);
        } catch (error) {
          console.error("Error fetching data:", error);
          toast.error("Failed to fetch your results!", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            transition: Bounce,
          });
          setStudentData([]);
        }
      };

      fetchData();
    }
  }, [factUserFormID]);

  const handleDataVisualizationClick = useCallback(() => {
    setMainContent(<DashboardGenerator factUserFormID={factUserFormID} />);
  }, []);

  const handleMyResultsClick = useCallback(() => {
    if (Object.keys(studentData).length > 0) {
      setMainContent(<MyResults studentData={studentData} />);
    } else {
      setMainContent(
        <div>
          <h1 className="text-2xl font-bold mb-5">My Results</h1>
          <hr className="w-28 border-t-2 border-uwa-yellow mt-2" />
          <p className="my-5">
            No results available for this form. Please check your connection or
            complete the form to view your results.
          </p>
        </div>
      );
    }
  }, [studentData]);

  const sidebarContent: SidebarData = {
    title: formTitle || "Form Results",
    titleOnClick: () => {
      setMainContent(defaultMainContent);
    },
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
    <>
      <Layout sidebarContent={sidebarContent} mainContent={mainContent} />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        transition={Bounce}
      />
    </>
  );
};

export default FormResults;
