const StudentFormManager = ({
    formTitle,
    formDescription,
    formStartDate,
    formCompletionDate,
    formCreatedBy,
    formCreatedFor,
}: {
    formTitle: string;
    formDescription: string;
    formStartDate: string;
    formCompletionDate: string;
    formCreatedBy: string;
    formCreatedFor: string;
}) => {
    return (
        <div className="flex flex-col min-h-full justify-between">
            <div>
                <div>
                    <h1 className="text-2xl font-bold mb-5">{formTitle}</h1>
                    <hr className="w-28 border-t-2 border-uwa-yellow mt-2" />
                    <div className="my-5">
                        <p className="font-bold">Description:</p>
                        <p>{formDescription}</p>
                    </div>
                    <div className="my-5 flex flex-col md:flex-row space-x-10">
                        <p>
                            <span className="font-bold">Started Date:</span>{" "}
                            {formStartDate}
                        </p>
                        <p>
                            <span className="font-bold">Completed Date:</span>{" "}
                            {formCompletionDate}
                        </p>
                    </div>
                    <div className="my-5 flex flex-col">
                        <p>
                            <span className="font-bold">Recorded By:</span>{" "}
                            {formCreatedBy}
                        </p>
                        <p>
                            <span className="font-bold">Recorded For:</span>{" "}
                            {formCreatedFor}
                        </p>
                    </div>
                </div>
            </div>
            <div className="flex justify-end p-5">hello</div>
        </div>
    );
};

export default StudentFormManager;
