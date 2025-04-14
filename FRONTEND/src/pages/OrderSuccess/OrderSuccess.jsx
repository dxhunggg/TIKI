import React from "react";
import {
  Label,
  WrapperContainer,
  WrapperInfo,
  WrapperItemOrder,
  WrapperItemOrderInfo,
  WrapperValue,
} from "./style";
import { Link } from "react-router-dom";
import { convertPrice } from "../../utils";
import Loading from "../../components/LoadingComponent/Loading";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { orderContant } from "../../contant";

const OrderSuccess = () => {
  const order = useSelector((state) => state.order);
  const location = useLocation();
  const { state } = location;

  return (
    <div style={{ background: "#f5f5fa", with: "100%", height: "100vh" }}>
      <Loading isLoading={false}>
        <div style={{ height: "100%", width: "1270px", margin: "0 auto" }}>
          <h3 style={{ fontWeight: "bold" }}>Đơn hàng đặt thành công</h3>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <WrapperContainer>
              <WrapperInfo>
                <div>
                  <Label>Phương thức giao hàng</Label>
                  <WrapperValue>
                    <span style={{ color: "#ea8500", fontWeight: "bold" }}>
                      {orderContant.delivery[state?.delivery]}{" "}
                    </span>
                    Giao hàng tiết kiệm
                  </WrapperValue>
                </div>
              </WrapperInfo>
              <WrapperInfo>
                <div>
                  <Label>Phương thức thanh toán</Label>
                  <WrapperValue>
                    {state?.payment === 'qr_code' ? (
                      <div>
                        <div>{orderContant.payment[state?.payment]}</div>
                        <div style={{ color: 'green', marginTop: '5px' }}>
                          Đơn hàng đã được thanh toán
                        </div>
                      </div>
                    ) : (
                      orderContant.payment[state?.payment]
                    )}
                  </WrapperValue>
                </div>
              </WrapperInfo>
              <WrapperItemOrderInfo>
                {state.orders?.map((order) => {
                  return (
                    <WrapperItemOrder key={order?.name}>
                      <div
                        style={{
                          width: "100%",
                          display: "flex",
                          alignItems: "center",
                          gap: 4,
                          marginBottom: "10px"
                        }}
                      >
                        <img
                          src={order.image}
                          style={{
                            width: "77px",
                            height: "79px",
                            objectFit: "cover",
                          }}
                        />
                        <div
                          style={{
                            width: "100%",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {order?.name}
                        </div>
                      </div>
                      <div
                        style={{
                          width: "100%",
                          display: "flex",
                          flexDirection: "column",
                          gap: "10px",
                        }}
                      >
                        <span>
                          <span style={{ fontSize: "13px", color: "#242424" }}>
                            Giá tiền: {convertPrice(order?.price)}
                          </span>
                        </span>
                        <span>
                          <span style={{ fontSize: "13px", color: "#242424" }}>
                            Số lượng: {order?.amount}
                          </span>
                        </span>
                      </div>
                    </WrapperItemOrder>
                  );
                })}
              </WrapperItemOrderInfo>
              <div>
                <span style={{ fontSize: "16px", color: "red" }}>
                  Tổng tiền: {convertPrice(state?.totalPriceMemo)}
                </span>
              </div>
              <div style={{ 
                position: "fixed",
                bottom: "20px",
                right: "20px",
                display: "flex",
                gap: "20px"
              }}>
                <Link to="/" style={{ textDecoration: "none" }}>
                  <button
                    style={{
                      padding: "10px 20px",
                      backgroundColor: "white",
                      color: "#1890ff",
                      border: "1px solid #1890ff",
                      borderRadius: "4px",
                      cursor: "pointer",
                      fontSize: "16px",
                      transition: "all 0.3s ease",
                      ":hover": {
                        backgroundColor: "#e6f7ff",
                        borderColor: "#40a9ff"
                      }
                    }}
                  >
                    Trang chủ
                  </button>
                </Link>
                <Link to="/my-order" style={{ textDecoration: "none" }}>
                  <button
                    style={{
                      padding: "10px 20px",
                      backgroundColor: "#FF4D4F",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                      fontSize: "16px",
                      transition: "all 0.3s ease",
                      ":hover": {
                        backgroundColor: "#CF1322"
                      }
                    }}
                  >
                    Đến đơn hàng của tôi
                  </button>
                </Link>
              </div>
            </WrapperContainer>
          </div>
        </div>
      </Loading>
    </div>
  );
};

export default OrderSuccess;
