import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const AddNewForm = () => {
    // TODO: Implement the handleGetRequest function
    const handleGetRequest = () => {
        console.log("Get request sent");
    };

    return (
        <div className="flex flex-col min-h-full justify-between">
            <div>
                <div>
                    <h1 className="text-2xl font-bold mb-5">Add New Form</h1>
                    <hr className="w-28 border-t-2 border-uwa-yellow mt-2" />
                    <p className="font-bold my-5">
                        Enter the Form Template ID provided by your unit
                        coordinator to access the form.
                    </p>
                </div>
                <div className="text-center my-10">
                    <input
                        type="text"
                        placeholder="Form Template ID"
                        className="border-2 border-gray-300 rounded-md p-2 w-96"
                    />
                </div>
            </div>

            <div className="flex flex-row-reverse">
                <button
                    title="Get Form Template"
                    className="font-bold"
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
