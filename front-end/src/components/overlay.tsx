// TODO: Create a overlay component that will be used to close the modal when clicked on the overlay

const Overlay = ({ handleChange }: { handleChange: () => void }) => {
    return (
        <div
            className="bg-black h-full w-screen absolute opacity-50 cursor-pointer"
            onClick={handleChange}
        ></div>
    );
};

export default Overlay;
