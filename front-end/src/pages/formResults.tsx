import { faHome } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Bounce, toast, ToastContainer } from "react-toastify";
import DashboardGenerator from "../components/dashboardGenerator";
import Layout from "../components/layout";
import { backEndUrl } from "../global_helpers/constants";
import { SidebarData } from "../interface/sidebarInterface";
import Cookies from "js-cookie";

// Define generic types for fetched data
interface CategoryData {
  [test: string]: { [key: string]: number | string }; // Nested object with dynamic keys
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
  const { factUserFormID, formTitle, formTemplateID } = location.state || {};
  const [mainContent, setMainContent] = useState(defaultMainContent);
  const [studentData, setStudentData] = useState<CategoryData[]>([]); // Define it as an array of CategoryData

  const navigate = useNavigate();

  useEffect(() => {
    if (factUserFormID) {
      const fetchData = async () => {
        try {
          const access_token = Cookies.get("access_token");
          const studentResponse = await axios.get<CategoryData[]>(
            `${backEndUrl}/specific_student_data/${formTemplateID}`,
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

  // Dynamic rendering of studentData
  const handleMyResultsClick = useCallback(() => {
    if (studentData.length > 0) {
      const student = studentData[0]; // Get the first student entry

      const renderStudentData = () => {
        return Object.keys(student).map((categoryKey) => {
          const category = student[categoryKey]; // category is of type { [key: string]: number | string }

          if (typeof category === "object" && category !== null) {
            return (
              <div key={categoryKey}>
                <h2 className="text-xl font-bold mb-2">{categoryKey}</h2>
                {Object.keys(category).map((dataKey) => (
                  <p key={dataKey}>
                    {dataKey}: {category[dataKey]}
                  </p>
                ))}
                <hr className="my-4" />
              </div>
            );
          }
          return null; // Handle cases where the data is not an object
        });
      };

      setMainContent(
        <div>
          <h1 className="text-2xl font-bold mb-5">My Results</h1>
          <hr className="w-28 border-t-2 border-uwa-yellow mt-2" />
          
          {renderStudentData()}
        </div>
      );
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

  const handleDataVisualizationClick = useCallback(() => {
    setMainContent(
      <DashboardGenerator factUserFormID={factUserFormID} formTemplateID={formTemplateID} />
    );
  }, []);

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
