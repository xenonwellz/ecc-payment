import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home";
import React from "react";
import ErrorPage from "../components/ErrorPage";
import InvoiceList from "../pages/InvoiceList.jsx";


const routes = createBrowserRouter([
    {
        path: "/",
        element: <Home />,
        errorElement: <ErrorPage error='-1' />,
    },
    {
        path: "/invoices",
        element: <InvoiceList />,
        errorElement: <ErrorPage error='-1' />,
    },
]);

export default routes;