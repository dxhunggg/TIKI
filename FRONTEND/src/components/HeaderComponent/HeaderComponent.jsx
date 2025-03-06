import React, { useEffect, useState } from "react";
import { Badge, Button, Col, Popover, Row } from "antd";
import {
  WrapperContentPopUp,
  WrapperHeader,
  WrapperHeaderAccount,
  WrapperTestHeader,
  WrapperTextHeaderSmall,
} from "./style";
import Search from "antd/es/input/Search";
import {
  UserOutlined,
  CaretDownOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import ButtonInputSearch from "../ButtonInputSearch/ButtonInputSearch";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import * as UserService from "../../services/UserService";
import { resetUser } from "../../redux/userSlide";
import Loading from "../LoadingComponent/Loading";

const HeaderComponent = ({isHiddenSearch = false, isHiddenCart = false}) => {
  const navigate = useNavigate();
  const handleNavigateLogin = () => {
    navigate("/sign-in");
  };
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const handleLogout = async () => {
    await UserService.logoutUser();
    dispatch(resetUser());
    setLoading(false);
  };
  const [userName, setUserName] = useState("");
  const [userAvatar, setUserAvatar] = useState("");

  useEffect(() => {
    setLoading(true);
    setUserName(user.name);
    setUserAvatar(user.avatar);
    setLoading(false);
  }, [user.name, user.avatar]);

  const content = (
    <div>
      <WrapperContentPopUp
        onClick={() => {
          navigate("/profile-user");
        }}
      >
        Thông tin người dùng
      </WrapperContentPopUp>
      {user?.isAdmin && (
        <WrapperContentPopUp
          onClick={() => {
            navigate("/system-admin");
          }}
        >
          Quản lí hệ thống
        </WrapperContentPopUp>
      )}
      <WrapperContentPopUp onClick={handleLogout}>
        Đăng xuất
      </WrapperContentPopUp>
    </div>
  );
  return (
    <div
      style={{
        width: "100%",
        background: "rgb(26,148,255)",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <WrapperHeader
        style={{
          justifyContent:
            isHiddenSearch && isHiddenCart ? "space-between" : "unset",
        }}
      >
        <Col span={5}>
          <WrapperTestHeader>TIKI LAZADA</WrapperTestHeader>
        </Col>

        {!isHiddenSearch && (
          <Col span={13}>
            <ButtonInputSearch
              size="large"
              textButton="Tìm kiếm"
              placeholder="input search text"
              //onSearch={onSearch}
            />
          </Col>
        )}

        <Col
          span={6}
          style={{ display: "flex", gap: "54px", alignItems: "center" }}
        >
          <Loading isLoading={loading}>
            <WrapperHeaderAccount>
              {userAvatar ? (
                <img
                  src={userAvatar}
                  alt="avatar"
                  style={{ height: "30px", width: "30px", borderRadius: "50%" }}
                />
              ) : (
                <UserOutlined style={{ fontSize: "30px", color: "#fff" }} />
              )}
              {user?.access_token ? (
                <>
                  <Popover content={content} trigger="click">
                    <div style={{ cursor: "pointer" }}>
                      {userName.length ? userName : user.email}
                    </div>
                  </Popover>
                </>
              ) : (
                <div
                  onClick={handleNavigateLogin}
                  style={{ cursor: "pointer" }}
                >
                  <WrapperTextHeaderSmall>
                    Đăng nhập/Đăng kí
                  </WrapperTextHeaderSmall>
                  <div>
                    <WrapperTextHeaderSmall>Tài khoản</WrapperTextHeaderSmall>
                    <CaretDownOutlined />
                  </div>
                </div>
              )}
            </WrapperHeaderAccount>
          </Loading>
          {!isHiddenCart && (
            <div>
              <Badge count={4} size="small">
                <ShoppingCartOutlined
                  style={{ fontSize: "30px", color: "#fff" }}
                />
              </Badge>
              <WrapperTextHeaderSmall>Giỏ hàng</WrapperTextHeaderSmall>
            </div>
          )}
        </Col>
      </WrapperHeader>
    </div>
  );
};

export default HeaderComponent;
