import React, { useEffect } from "react";
import {
  WrapperItemOrder,
  WrapperListOrder,
  WrapperHeaderItem,
  WrapperFooterItem,
  WrapperContainer,
  WrapperStatus,
} from "./style";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import { convertPrice } from "../../utils";
import Loading from "../../components/LoadingComponent/Loading";
import { useQuery } from "@tanstack/react-query";
import * as OrderService from "../../services/OrderService";
import { useMutationHooks } from "../../hooks/useMutationHook";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import * as message from "../../components/Message/Message";

const MyOrderPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector((state) => state.user);

  const fetchMyOrder = async () => {
    if (!user?.id || !user?.access_token) {
      return [];
    }
    const res = await OrderService.getOrderByUserId(
      user?.id,
      user?.access_token
    );
    return res.data;
  };

  const queryOrder = useQuery({
    queryKey: ["orders", user?.id],
    queryFn: fetchMyOrder,
    enabled: !!user?.id && !!user?.access_token,
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    if (user?.id && user?.access_token) {
      queryOrder.refetch();
    }
  }, [user?.id, user?.access_token]);

  const { isLoading, data = [] } = queryOrder;
  const handleDetailsOrder = (id) => {
    navigate(`/details-order/${id}`, {
      state: {
        token: user?.access_token,
      },
    });
  };
  const mutation = useMutationHooks(async (data) => {
    const { id, token } = data;
    const res = await OrderService.cancelOrder(id, token);
    return res;
  });

  const {
    data: dataCancel,
    isPending: isLoadingCancel,
    isSuccess,
    isError,
  } = mutation;

  const handleCancelOrder = (order) => {
    if (!user?.access_token) {
      message.error("Vui lòng đăng nhập để thực hiện chức năng này");
      return;
    }

    if (order.isDelivered || order.isCancelled) {
      message.error("Không thể hủy đơn hàng đã giao hoặc đã bị hủy");
      return;
    }

    mutation.mutate(
      {
        id: order._id,
        token: user?.access_token,
      },
      {
        onSuccess: (data) => {
          if (data.status === "OK") {
            message.success(data.message);
            queryOrder.refetch();
          } else {
            message.error(data.message);
          }
        },
        onError: () => {
          message.error("Hủy đơn hàng thất bại");
        },
      }
    );
  };

  useEffect(() => {
    if (isSuccess && dataCancel?.status === "OK") {
      queryOrder.refetch();
    } else if (isSuccess && dataCancel?.status === "ERR") {
      message.error(dataCancel?.message);
    } else if (isError) {
      message.error("Hủy đơn hàng thất bại");
    }
  }, [isError, isSuccess, dataCancel]);
  const renderProduct = (data) => {
    return data?.map((order) => {
      return (
        <WrapperHeaderItem key={order?._id}>
          <img
            src={order?.image}
            style={{
              width: "70px",
              height: "70px",
              objectFit: "cover",
              border: "1px solid rgb(238, 238, 238)",
              padding: "2px",
            }}
          />
          <div
            style={{
              width: 260,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              marginLeft: "10px",
            }}
          >
            {order?.name}
          </div>
          <span
            style={{ fontSize: "13px", color: "#242424", marginLeft: "auto" }}
          >
            {convertPrice(order?.price)}
          </span>
        </WrapperHeaderItem>
      );
    });
  };
  return (
    <Loading isLoading={isLoading || isLoadingCancel}>
      <WrapperContainer>
        <div style={{ height: "100%", width: "1270px", margin: "0 auto" }}>
          <h4>Đơn hàng của tôi</h4>
          <WrapperListOrder>
            {Array.isArray(data) && data.length > 0 ? (
              data.map((order) => {
                return (
                  <WrapperItemOrder key={order?._id}>
                    <WrapperStatus>
                      <span style={{ fontSize: "14px", fontWeight: "bold" }}>
                        Trạng thái
                      </span>
                      <div>
                        <span style={{ color: "rgb(255, 66, 78)" }}>
                          Giao hàng:{" "}
                        </span>
                        <span
                          style={{
                            color: order.isCancelled
                              ? "rgb(255, 66, 78)"
                              : "rgb(90, 32, 193)",
                            fontWeight: "bold",
                          }}
                        >{`${
                          order.isCancelled
                            ? "Đã hủy bởi người bán hàng"
                            : order.isDelivered
                            ? "Đã giao hàng"
                            : "Chưa giao hàng"
                        }`}</span>
                      </div>
                      <div>
                        <span style={{ color: "rgb(255, 66, 78)" }}>
                          Thanh toán:{" "}
                        </span>
                        <span
                          style={{
                            color: "rgb(90, 32, 193)",
                            fontWeight: "bold",
                          }}
                        >{`${
                          order.isPaid ? "Đã thanh toán" : "Chưa thanh toán"
                        }`}</span>
                      </div>
                    </WrapperStatus>
                    {renderProduct(order?.orderItems)}
                    <WrapperFooterItem>
                      <div>
                        <span style={{ color: "rgb(255, 66, 78)" }}>
                          Tổng tiền:{" "}
                        </span>
                        <span
                          style={{
                            fontSize: "13px",
                            color: "rgb(56, 56, 61)",
                            fontWeight: 700,
                          }}
                        >
                          {convertPrice(order?.totalPrice)}
                        </span>
                      </div>
                      <div style={{ display: "flex", gap: "10px" }}>
                        <ButtonComponent
                          onClick={() => handleCancelOrder(order)}
                          size={40}
                          styleButton={{
                            height: "36px",
                            border: "1px solid rgb(26,148,255)",
                            borderRadius: "4px",
                            opacity:
                              order.isDelivered || order.isCancelled
                                ? "0.5"
                                : "1",
                            cursor:
                              order.isDelivered || order.isCancelled
                                ? "not-allowed"
                                : "pointer",
                          }}
                          textButton={"Hủy đơn hàng"}
                          styleTextButton={{
                            color: "rgb(26,148,255)",
                            fontSize: "14px",
                          }}
                          disabled={order.isDelivered || order.isCancelled}
                        ></ButtonComponent>
                        <ButtonComponent
                          onClick={() => handleDetailsOrder(order?._id)}
                          size={40}
                          styleButton={{
                            height: "36px",
                            border: "1px solid rgb(26,148,255)",
                            borderRadius: "4px",
                          }}
                          textButton={"Xem chi tiết"}
                          styleTextButton={{
                            color: "rgb(26,148,255)",
                            fontSize: "14px",
                          }}
                        ></ButtonComponent>
                      </div>
                    </WrapperFooterItem>
                  </WrapperItemOrder>
                );
              })
            ) : (
              <div style={{ textAlign: "center", padding: "20px" }}>
                Không có đơn hàng nào
              </div>
            )}
          </WrapperListOrder>
        </div>
      </WrapperContainer>
    </Loading>
  );
};

export default MyOrderPage;
