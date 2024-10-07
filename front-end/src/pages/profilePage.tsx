import { Bounce, ToastContainer } from "react-toastify";
import Layout from "../components/layout";

const ProfilePage = () => {
    const sidebarContent = {
        title: "Sidebar Title",
        footer: [],
        sections: [],
    };
    const mainContent = <div>Main Content</div>;
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
export default ProfilePage;
