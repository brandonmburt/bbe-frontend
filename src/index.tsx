import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import store from './redux/store'
import { Provider } from 'react-redux'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Dashboard from './components/Dashboard.comp';
import NotFound from './components/NotFound.comp';
import { UploadExposureForm } from './pages/Upload Exposure';
import SignIn from './pages/Sign In';
import SignUp from './pages/Sign Up';
import { Home } from './pages/Home';
import Exposure from './pages/Exposure';
import { UploadAdp } from './pages/admin/Upload Adp';
import { Drafts } from './pages/Drafts';
import SignOut from './components/SignOut.comp';
import { ReplacementRules } from './pages/admin/Replacement Rules';
import ByeWeeks from './components/ByeWeeks.comp';
import { Rookies } from './pages/admin/Rookies';

const router = createBrowserRouter([
    {
        path: "/",
        element: <Dashboard />,
        errorElement: <NotFound />,
        children: [
            {
                path: "/",
                element: <Home />,
            },
            {
                path: "/exposure",
                element: <Exposure />,
            },
            {
                path: "/upload",
                element: <UploadExposureForm />,
            },
            {
                path: "/demo",
                element: <SignIn demo={true} />,
            },
            {
                path: "/signIn",
                element: <SignIn />,
            },
            {
                path: "/signUp",
                element: <SignUp />,
            },
            {
                path: "/uploadADPs",
                element: <UploadAdp />,
            },
            {
                path: "/drafts",
                element: <Drafts />,
            },
            {
                path: "/signOut",
                element: <SignOut />,
            },
            {
                path: "/replacement",
                element: <ReplacementRules />,
            },
            {
                path: "/byes",
                element: <ByeWeeks />,
            },
            {
                path: "/rookies",
                element: <Rookies />,
            }
        ],
    },
]);

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(
    <Provider store={store}>
        <RouterProvider router={router} />
    </Provider>
);
