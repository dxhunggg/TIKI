import React, { useState } from "react";
import {
  AppstoreOutlined,
  SettingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Menu } from "antd";
import HeaderComponent from "../../components/HeaderComponent/HeaderComponent";
const items = [
  {
    key: "User",
    label: "Người dùng",
    icon: <UserOutlined />,
    children: [
      {
        key: "1",
        label: "Option 1",
      },
      {
        key: "2",
        label: "Option 2",
      },
    ],
  },
  {
    key: "product",
    label: "Sản phẩm",
    icon: <AppstoreOutlined />,
    children: [
      {
        key: "3",
        label: "Option 3",
      },
      {
        key: "4",
        label: "Option 4",
      },
    ],
  },
  {
    type: "divider",
  },
];
const AdminPage = () => {
  const [keySelected, setKeySelected] = useState("");
  const handleOnClick = (key) => {
    setKeySelected(key);
  };
  return (
    <>
      <HeaderComponent isHiddenCart isHiddenSearch />
        <div style={{ display: "flex" }}>
          <Menu
            onClick={handleOnClick}
            style={{
              width: 256,
            }}
            defaultSelectedKeys={["1"]}
            defaultOpenKeys={["user"]}
            mode="inline"
            items={items}
          />
          <div style={{ flex: 1 }}>
            {keySelected === "1" && <span>Key la 1</span>}
            <span>test</span>
          </div>
        </div>
      
    </>
  );
};
export default AdminPage;
