import React from 'react';
import { ToastContainer } from "react-toastify";
import Routers from './routes/section';
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  return (
    <>
      <Routers />
      <ToastContainer />
    </>
  );
};

export default App;