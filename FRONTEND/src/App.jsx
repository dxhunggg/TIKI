import React, { Fragment, useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { routes } from "./routes/index.js";
import HeaderComponent from "./components/HeaderComponent/HeaderComponent.jsx";
import DefaultComponent from "./components/DefaultComponent/DefaultComponent.jsx";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { isJsonString } from "./utils.js";
import { jwtDecode } from "jwt-decode";
import * as UserService from "./services/UserService.js";
import { useDispatch, useSelector } from "react-redux";
import { updateUser } from "./redux/slides/userSlide.js";
import Loading from "./components/LoadingComponent/Loading.jsx";

const App = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    setIsLoading(true);
    const checkTokenAndRefresh = async () => {
      const { storageData, decoded } = handleDecoded();
      const currentTime = Math.floor(Date.now() / 1000);

      if (decoded?.exp && decoded.exp < currentTime) {
        try {
          const data = await UserService.refreshToken();
          if (data?.access_token) {
            localStorage.setItem(
              "access_token",
              JSON.stringify(data.access_token)
            );
            handleGetDetailsUser(decoded.id, data.access_token);
          } else {
            console.log("⚠️ Không nhận được access_token mới!");
          }
        } catch (error) {
          console.error("❌ Lỗi khi refresh token:", error);
        }
      } else if (decoded?.id) {
        handleGetDetailsUser(decoded.id, storageData);
      }
    };

    checkTokenAndRefresh();
    setIsLoading(false);
  }, []);

  const handleDecoded = () => {
    let storageData = localStorage.getItem("access_token");
    let decoded = {};
    if (storageData && isJsonString(storageData)) {
      storageData = JSON.parse(storageData);
      decoded = jwtDecode(storageData);
    }
    return { decoded, storageData };
  };

  UserService.axiosJWT.interceptors.request.use(
    async (config) => {
      let storageData = localStorage.getItem("access_token");
      if (storageData) {
        storageData = JSON.parse(storageData);
        config.headers["token"] = `Bearer ${storageData}`;
      }

      const currentTime = Math.floor(Date.now() / 1000);
      const { decoded } = handleDecoded();

      if (decoded?.exp && decoded.exp < currentTime) {
        console.log("🔥 Token hết hạn, đang refresh...");
        try {
          const data = await UserService.refreshToken();
          console.log("🚀 API refresh response:", data);

          if (data?.access_token) {
            localStorage.setItem(
              "access_token",
              JSON.stringify(data.access_token)
            );
            config.headers["token"] = `Bearer ${data.access_token}`;
          } else {
            console.log("⚠️ Không nhận được access_token mới!");
          }
        } catch (error) {
          console.error("❌ Lỗi khi refresh token:", error);
          return Promise.reject(error);
        }
      }

      return config;
    },
    (err) => {
      return Promise.reject(err);
    }
  );

  const handleGetDetailsUser = async (id, token) => {
    try {
      const res = await UserService.getDetailsUser(id, token);
      dispatch(updateUser({ ...res?.data, access_token: token }));
      setIsLoading(false);
    } catch (error) {
      console.error("Lỗi khi lấy thông tin user:", error);
    }
  };

  const fetchApi = async () => {
    const apiUrl = import.meta.env.VITE_API_URL_BACKEND;
    const res = await axios.get(`${apiUrl}/product/get-all`);
    return res.data;
  };

  const query = useQuery({ queryKey: ["todos"], queryFn: fetchApi });

  return (
    <div>
      <Loading isLoading={isLoading}>
        <Router>
          <Routes>
            {routes.map((route) => {
              const Page = route.page;
              const isCheckAuth = !route.isPrivate || user.isAdmin;
              const Layout = route.isShowHeader ? DefaultComponent : Fragment;
              return (
                <Route
                  key={route.path}
                  path={isCheckAuth ? route.path : ""}
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
      </Loading>
    </div>
  );
};

export default App;
