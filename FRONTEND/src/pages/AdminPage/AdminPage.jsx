import React, { useState } from "react";
import {
  AppstoreOutlined,
  SettingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Menu } from "antd";
import HeaderComponent from "../../components/HeaderComponent/HeaderComponent";
import AdminUser from "../../components/AdminUser/AdminUser";
import AdminProduct from "../../components/AdminProduct/AdminProduct";
const items = [
  {
    key: "user",
    label: "Người dùng",
    icon: <UserOutlined />,
  },
  {
    key: "product",
    label: "Sản phẩm",
    icon: <AppstoreOutlined />,
  },
];
const AdminPage = () => {
  const [keySelected, setKeySelected] = useState("");
  const handleOnClick = ({ key }) => {
    setKeySelected(key);
  };

  const renderPage = (key) => {
    switch (key) {
      case "user":
        return <AdminUser />;
      case "product":
        return <AdminProduct />;
      default:
        return <></>;
    }
  };
  return (
    <>
      <HeaderComponent isHiddenCart isHiddenSearch />
      <div style={{ display: "flex" }}>
        <Menu
          onClick={handleOnClick}
          style={{
            width: 256,
            boxShadow: "1px 1px 2px #ccc",
            height: "100vh",
          }}
          defaultSelectedKeys={["1"]}
          defaultOpenKeys={["user"]}
          mode="inline"
          items={items}
        />
        <div style={{ flex: 1, padding: "15px" }}>
          {renderPage(keySelected)}
        </div>
      </div>
    </>
  );
};
export default AdminPage;
