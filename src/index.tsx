import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import store from './redux/store'
import { Provider } from 'react-redux'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Dashboard from './components/Dashboard.comp';
import NotFound from './components/NotFound.comp';
import { UploadExposureForm } from './components/UploadExposure.comp';
import SignIn from './components/SignIn.comp';
import SignUp from './components/SignUp.comp';
import { Home } from './components/Home.comp';
import Exposure from './components/Exposure.comp';
import { UploadAdp } from './components/UploadAdp.comp';
import { DraftedRoster } from './components/DraftedRoster.comp';
import SignOut from './components/SignOut.comp';
 
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
            path: "/uploadExposure",
            element: <UploadExposureForm />,
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
            element: <DraftedRoster />,
        },
        {
            path: "/signOut",
            element: <SignOut />,
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
