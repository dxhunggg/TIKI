import React, { useEffect, useState } from "react";
import { Badge, Button, Col, Popover, Row } from "antd";
import {
  WrapperContentPopUp,
  WrapperHeader,
  WrapperHeaderAccount,
  WrapperTextHeader,
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
import { resetUser } from "../../redux/slides/userSlide";
import Loading from "../LoadingComponent/Loading";
import { searchProduct } from "../../redux/slides/productSlide";

const HeaderComponent = ({ isHiddenSearch = false, isHiddenCart = false }) => {
  const navigate = useNavigate();
  const handleNavigateLogin = () => {
    navigate("/sign-in");
  };
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const handleLogout = async () => {
    await UserService.logoutUser();
    dispatch(resetUser());
    setLoading(false);
  };
  const [userName, setUserName] = useState("");
  const [userAvatar, setUserAvatar] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [isOpenPopup, setIsOpenPopup] = useState(false);
  const order = useSelector((state) => state.order);
  useEffect(() => {
    setLoading(true);
    setUserName(user.name);
    setUserAvatar(user.avatar);
    setLoading(false);
  }, [user.name, user.avatar]);

  const content = (
    <div>
      <div>
        <WrapperContentPopUp onClick={() => handleClickNavigate("profile")}>
          Thông tin người dùng
        </WrapperContentPopUp>
        {user?.isAdmin && (
          <WrapperContentPopUp onClick={() => handleClickNavigate("admin")}>
            Quản lí hệ thống
          </WrapperContentPopUp>
        )}
        <WrapperContentPopUp onClick={() => handleClickNavigate(`my-order`)}>
          Đơn hàng của tôi
        </WrapperContentPopUp>
        <WrapperContentPopUp onClick={() => handleClickNavigate()}>
          Đăng xuất
        </WrapperContentPopUp>
      </div>
    </div>
  );
  const handleClickNavigate = (type) => {
    if (type === "profile") {
      navigate("/profile-user");
    } else if (type === "admin") {
      navigate("/system-admin");
    } else if (type === "my-order") {
      navigate("/my-order", {
        state: {
          id: user?.id,
          token: user?.access_token,
        },
      });
    } else {
      handleLogout();
    }
    setIsOpenPopup(false);
  };
  const onSearch = (e) => {
    setSearch(e.target.value);
    dispatch(searchProduct(e.target.value));
  };
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
          <WrapperTextHeader to="/">BÁCH HÓA XANH</WrapperTextHeader>
        </Col>

        {!isHiddenSearch && (
          <Col span={13}>
            <ButtonInputSearch
              size="large"
              textButton="Tìm kiếm"
              placeholder="input search text"
              onChange={onSearch}
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
                  <Popover content={content} trigger="click" open={isOpenPopup}>
                    <div
                      style={{
                        cursor: "pointer",
                        maxWidth: 100,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                      onClick={() => setIsOpenPopup((prev) => !prev)}
                    >
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
            <div
              onClick={() => navigate("/order")}
              style={{ cursor: "pointer" }}
            >
              <Badge count={order?.orderItems?.length} size="small">
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
