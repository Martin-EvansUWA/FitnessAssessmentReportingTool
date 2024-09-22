const StudentFormManager = ({
    formTitle,
    formDescription,
}: {
    formTitle: string;
    formDescription: string;
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
                </div>
            </div>
        </div>
    );
};

export default StudentFormManager;
