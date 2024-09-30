import { faPlus } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bounce, toast, ToastContainer } from "react-toastify";
import AddNewForm from "../components/addNewForm";
import Layout from "../components/layout";
import StudentFormManager from "../components/studentFormManager";
import { backEndUrl } from "../global_helpers/constants";
import { formTemplateTitleAndDescription } from "../interface/formInterface";
import {
  formHistorySidebarInfo,
  SidebarData,
  SidebarSection,
} from "../interface/sidebarInterface";

// Process for fetching form history:
// 1) Send current user ID to backend
// 2) Backend queries the fact_user_form table to get all forms filled out by the user or assigned to the user
// 3) Backend returns:
//      - FactUserFormID
//      - UserFormResponseID
//      - FormTemplateID
//      - FormTemplateTitle
//      - UserID
//      - SubjectUserID
//      - IsComplete
//      - CreatedAt
//      - CompletedAt
// 4) Frontend maps the response to the sidebar sections by assigning the FormTemplateID as the key and FormTemplateID+CreatedAt as the sectionName
// 5) Frontend also assigns a sectionOnClick function to each section that sets the selectedForm state to the FormTemplateID
// 6) When user clicks on a section, Frontend will send a GET request with the FormTemplateID to get the form details
//     - Form details will include: Title, Description
// 7) Frontend will then render the form details in the main content

const StudentFormManagerPage = () => {
  const [selectedFormId, setSelectedFormId] = useState<number | null>(null);
  const [fetchedFormHistory, setFetchedFormHistory] = useState<
    formHistorySidebarInfo[]
  >([]);
  const [addNewFormSelected, setAddNewFormSelected] = useState<boolean>(false);
  const [formDetails, setFormDetails] =
    useState<formTemplateTitleAndDescription | null>(null);

  const navigate = useNavigate();

  const baseSidebar: SidebarData = {
    title: "My Forms",
    titleOnClick: () => {
      setSelectedFormId(null);
    },
    footer: [
      {
        text: "Add a new form",
        fontAwesomeIcon: faPlus,
        onClick: () => {
          setAddNewFormSelected(true);
        },
      },
    ],
    sections: [] as SidebarSection[],
  };

  const [sidebarData, setSidebarData] = useState<SidebarData>({
    ...baseSidebar,
    sections: [] as SidebarSection[],
  });

  const getFormHistory = async () => {
    const access_token = Cookies.get("access_token");
    try {
      const response = await axios.get(
        `${backEndUrl}/retrieve_student_form_sidebar_info`,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
      setFetchedFormHistory(response.data);
      console.log("Fetched form history:", response.data);

      return response.data.map((form: formHistorySidebarInfo) => ({
        [form.FactUserFormID]: {
          sectionName: `${form.title} [${form.CreatedAt}]`,
          sectionOnClick: () => {
            setAddNewFormSelected(false);
            setSelectedFormId(form.FactUserFormID);
            fetchFormDetails(form.FactUserFormID);
          },
        },
      }));
    } catch (error) {
      console.error("Error fetching form history:", error);
      toast.error("Failed to fetch your form history!", {
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
      return [];
    }
  };

  const fetchFormDetails = (factUserFormID: number) => {
    const access_token = Cookies.get("access_token");
    axios
      .get(`${backEndUrl}/get_student_form_description/${factUserFormID}`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      })
      .then((response) => {
        console.log("Success:", response.data);
        setFormDetails(response.data || null);
      })
      .catch((error) => {
        console.error("Error:", error);
        toast.error("Failed to fetch selected form details!", {
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
      });
  };

  const buildSidebarData = (formHistory: any) => {
    return {
      ...baseSidebar,
      sections: formHistory,
    };
  };

  useEffect(() => {
    const fetchData = async () => {
      const formHistory = await getFormHistory();
      setSidebarData(buildSidebarData(formHistory));
    };
    fetchData();
  }, []);
  const defaultMainContent = (
    <div>
      <h1 className="text-2xl font-bold mb-5">Form Manager</h1>
      <hr className="w-28 border-t-2 border-uwa-yellow mt-2" />
      <p className="my-5">
        Welcome to your Form Manager! Here you can view your form history or
        fill out a new form.
      </p>
      <p className="my-5">
        Select a form from the sidebar to view or edit it. Otherwise, if you
        want to fill out a new form, click "Add a new form".
      </p>
    </div>
  );

  const renderFormDetails = () => {
    if (!formDetails) return null;
    const formHistory = fetchedFormHistory.find(
      (form) => form.FactUserFormID === selectedFormId
    );
    return (
      <StudentFormManager
        formTitle={formDetails.Title}
        formDescription={formDetails.Description}
        formStartDate={formHistory?.CreatedAt || ""}
        formCompletionDate={formHistory?.CompletedAt || ""}
        formCreatedBy={formHistory?.UserID.toString() || ""}
        formCreatedFor={formHistory?.SubjectUserID.toString() || ""}
        factUserFormID={formHistory?.FactUserFormID || null}
      />
    );
  };

  return (
    <>
      <Layout
        sidebarContent={sidebarData}
        mainContent={
          addNewFormSelected ? (
            <AddNewForm />
          ) : selectedFormId ? (
            renderFormDetails()
          ) : (
            defaultMainContent
          )
        }
      />
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

export default StudentFormManagerPage;
