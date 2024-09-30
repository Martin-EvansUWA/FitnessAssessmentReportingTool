import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { backEndUrl } from "../global_helpers/constants";
import { FormTemplateJSON } from "../interface/formInterface";
import Cookies from "js-cookie";

const AddNewForm = () => {
  const [formTemplateID, setFormTemplateID] = useState<string>("");
  const [fetchState, setFetchState] = useState<string>("");

  const navigate = useNavigate();

    const handleGetRequest = () => {
        // Send GET request to backend with formTemplateID
        const access_token = Cookies.get("access_token");
        if (formTemplateID) {
            const response =  axios.get(
                `${backEndUrl}/retrieve_form_template/${formTemplateID}`,
                {
                    headers: {
                        Authorization: `Bearer ${access_token}`,
                    },
                }
            ).then((response) => {
                console.log("Success:", response.data);
                setFetchState(""); // Clear fetch state on success
                navigate("/data-entry", {
                    state: { data: response.data as FormTemplateJSON },
                }); // Redirect and pass data
            }).catch((error) => {
                console.error("Error:", error);
                setFetchState("Error: Form Template ID not found");
            });;
        } else {
            setFetchState("Please enter a Form Template ID");
        }
    };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormTemplateID(event.target.value);
    setFetchState(""); // Clear fetch state on input change
  };

  return (
    <div className="flex flex-col min-h-full justify-between">
      <div>
        <div>
          <h1 className="text-2xl font-bold mb-5">Add New Form</h1>
          <hr className="w-28 border-t-2 border-uwa-yellow mt-2" />
          <p className="font-bold my-5">
            Enter the Form Template ID provided by your unit coordinator to
            access your form.
          </p>
        </div>
        <div className="text-center my-10">
          <input
            type="text"
            placeholder="Form Template ID"
            className={`border-2 rounded-md p-2 w-full md:w-2/5 ${
              fetchState ? "border-red-500" : "border-gray-300"
            }`}
            onChange={handleChange}
          />
          {fetchState && (
            <p className="text-red-500 mt-2 animate-pulse">{fetchState}</p>
          )}
        </div>
      </div>

      <div className="flex flex-row-reverse">
        <button
          title="Get Form Template"
          className="font-bold transform transition-transform duration-200 hover:scale-105"
          onClick={handleGetRequest}
        >
          Continue
          <FontAwesomeIcon icon={faChevronRight} className="fa-2xl" />
        </button>
      </div>
    </div>
  );
};

export default AddNewForm;
