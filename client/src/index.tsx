import { createRoot } from "react-dom/client";

import "semantic-ui-css/semantic.min.css";
import "react-toastify/dist/ReactToastify.min.css";
import "react-datepicker/dist/react-datepicker.css";
import "@/assets/css/styles.css";
import { store, StoreContext } from "@/stores/store";
import { RouterProvider } from "react-router-dom";
import { router } from "@/routes/Routes";
import { GoogleOAuthProvider } from "@react-oauth/google";

createRoot(document.getElementById("root")!).render(
    <GoogleOAuthProvider
        clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID as string}
    >
        <StoreContext.Provider value={store}>
            <RouterProvider router={router} />
        </StoreContext.Provider>
    </GoogleOAuthProvider>
);
