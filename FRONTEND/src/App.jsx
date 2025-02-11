import React, { Fragment, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { routes } from "./routes/index.js";
import HeaderComponent from "./components/HeaderComponent/HeaderComponent.jsx";
import DefaultComponent from "./components/DefaultComponent/DefaultComponent.jsx";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
const App = () => {
  useEffect(() => {
    fetchApi();
  }, []);

  const fetchApi = async () => {
    const apiUrl = import.meta.env.VITE_API_URL_BACKEND;    
    const res = await axios.get(`${apiUrl}/product/get-all`);
    return res.data;
  };
  const query = useQuery({ queryKey: ["todos"], queryFn: fetchApi });
  return (
    <div>
      <Router>
        <Routes>
          {routes.map((route) => {
            const Page = route.page;
            const Layout = route.isShowHeader ? DefaultComponent : Fragment;
            return (
              <Route
                key={route.path}
                path={route.path}
                element={
                  <Layout>
                    <Page />
                  </Layout>
                }
              />
            );
          })}
        </Routes>
      </Router>
    </div>
  );
};

export default App;
