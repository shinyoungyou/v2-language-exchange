import { observer } from "mobx-react-lite";
import { Outlet, ScrollRestoration, useLocation } from "react-router-dom";
import HomePage from "@/components/home/HomePage";
import { ToastContainer } from "react-toastify";
import { useStore } from "@/stores/store";
import { useEffect } from "react";
import LoadingComponent from "@/components/layout/LoadingComponent";
import ModalContainer from "@/components/common/modals/ModalContainer";

function App() {
    const location = useLocation();
    const { commonStore, userStore } = useStore();

    useEffect(() => {
        if (commonStore.token) {
            userStore.getUser().finally(() => commonStore.setAppLoaded());
        } else {
            commonStore.setAppLoaded();
        }
    }, [commonStore, userStore]);

    if (!commonStore.appLoaded)
        return <LoadingComponent content="Loading app..." />;

    return (
        <>
            <ScrollRestoration />
            <ModalContainer />
            <ToastContainer
                position="bottom-right"
                hideProgressBar
                theme="colored"
            />
            {location.pathname === "/" ? (
                <HomePage />
            ) : (
                <>
                    <Outlet />
                </>
            )}
        </>
    );
}

export default observer(App);
