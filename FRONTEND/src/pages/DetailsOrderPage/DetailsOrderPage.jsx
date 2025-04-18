import React, { useEffect, useState } from "react";
import {
  WrapperAllPrice,
  WrapperContentInfo,
  WrapperHeaderUser,
  WrapperInfoUser,
  WrapperItem,
  WrapperItemLabel,
  WrapperLabel,
  WrapperNameProduct,
  WrapperProduct,
  WrapperStyleContent,
} from "./style";
import { useLocation, useParams } from "react-router-dom";
import * as OrderService from "../../services/OrderService";
import * as ProductService from "../../services/ProductService";
import { useQuery } from "@tanstack/react-query";
import { orderContant } from "../../contant";
import { convertPrice } from "../../utils";
import { useMemo } from "react";
import Loading from "../../components/LoadingComponent/Loading";

const DetailsOrderPage = () => {
  const params = useParams();
  const location = useLocation();
  const { state } = location;
  const { id } = params;
  const [productDiscounts, setProductDiscounts] = useState({});

  const fetchDetailsOrder = async () => {
    const res = await OrderService.getDetailsOrder(id, state?.token);
    return res.data;
  };

  const queryOrder = useQuery({
    queryKey: ["orders-details", id],
    queryFn: fetchDetailsOrder,
    enabled: !!id
  });
  const { isLoading, data } = queryOrder;

  useEffect(() => {
    const fetchProductDiscounts = async () => {
      if (data?.orderItems?.length > 0) {
        const productIds = data.orderItems.map((item) => item.product);
        const discounts = {};

        for (const productId of productIds) {
          try {
            const productRes = await ProductService.getDetailsProduct(
              productId
            );
            if (productRes?.data) {
              discounts[productId] = productRes.data.discount || 0;
            }
          } catch (error) {
            discounts[productId] = 0;
          }
        }

        setProductDiscounts(discounts);
      }
    };

    fetchProductDiscounts();
  }, [data]);

  const priceMemo = useMemo(() => {
    const result = data?.orderItems?.reduce((total, cur) => {
      return total + cur.price * cur.amount;
    }, 0);
    return result;
  }, [data]);

  return (
    <Loading isLoading={isLoading}>
      <div style={{ width: "100%", height: "100vh", background: "#f5f5fa" }}>
        <div
          style={{
            width: "1270px",
            margin: "0 auto",
          }}
        >
          <h4>Chi tiết đơn hàng</h4>
          <WrapperHeaderUser>
            <WrapperInfoUser>
              <WrapperLabel>Địa chỉ người nhận</WrapperLabel>
              <WrapperContentInfo>
                <div className="name-info">
                  {data?.shippingAddress?.fullName}
                </div>
                <div className="address-info">
                  <span>Địa chỉ: </span> {`${data?.shippingAddress?.address} `}
                </div>
                <div className="phone-info">
                  <span>Điện thoại: </span> {data?.shippingAddress?.phone}
                </div>
              </WrapperContentInfo>
            </WrapperInfoUser>
            <WrapperInfoUser>
              <WrapperLabel>Phương thức thanh toán</WrapperLabel>
              <WrapperContentInfo>
                <div className="payment-info">
                  {orderContant.payment[data?.paymentMethod]}
                  {data?.paymentMethod === 'qr_code' && data?.isPaid && (
                    <div style={{ color: 'green', marginTop: '5px' }}>
                      Đơn hàng đã được thanh toán
                    </div>
                  )}
                </div>
              </WrapperContentInfo>
            </WrapperInfoUser>
            <WrapperInfoUser>
              <WrapperLabel>Phương thức giao hàng</WrapperLabel>
              <WrapperContentInfo>
                <div className="delivery-info">
                  <span style={{ color: "#ea8500", fontWeight: "bold" }}>
                    {orderContant.delivery[data?.deliveryMethod]}{" "}
                  </span>
                  Giao hàng tiết kiệm
                </div>
                <div style={{ marginTop: "10px" }}>
                  <span style={{ color: "#ea8500", fontWeight: "bold" }}>
                    Thời gian giao hàng dự kiến:{" "}
                  </span>
                  {new Date(new Date(data?.createdAt).getTime() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString("vi-VN")}
                </div>
              </WrapperContentInfo>
            </WrapperInfoUser>
          </WrapperHeaderUser>
          <WrapperStyleContent>
            <div
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div
                style={{
                  width: "670px",
                  fontSize: "14px",
                  fontWeight: "normal",
                  textAlign: "center",
                }}
              >
                Sản phẩm
              </div>
              <WrapperItemLabel>Giá</WrapperItemLabel>
              <WrapperItemLabel>Số lượng</WrapperItemLabel>
              <WrapperItemLabel>Giảm giá</WrapperItemLabel>
            </div>
            {data?.orderItems?.map((order) => {
              const productDiscount = productDiscounts[order.product] || 0;
              return (
                <WrapperProduct>
                  <WrapperNameProduct>
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
                        height: "70px",
                      }}
                    >
                      {order?.name}
                    </div>
                  </WrapperNameProduct>
                  <WrapperItem>{convertPrice(order?.price)}</WrapperItem>
                  <WrapperItem>{order?.amount}</WrapperItem>
                  <WrapperItem>
                    {productDiscount
                      ? convertPrice(
                          (order.price * order.amount * productDiscount) / 100
                        )
                      : "0 VND"}
                  </WrapperItem>
                </WrapperProduct>
              );
            })}

            <WrapperAllPrice>
              <WrapperItemLabel>Tạm tính</WrapperItemLabel>
              <WrapperItem>{convertPrice(priceMemo)}</WrapperItem>
            </WrapperAllPrice>
            <WrapperAllPrice>
              <WrapperItemLabel>Phí vận chuyển</WrapperItemLabel>
              <WrapperItem>{convertPrice(data?.shippingPrice)}</WrapperItem>
            </WrapperAllPrice>
            <WrapperAllPrice>
              <WrapperItemLabel>Tổng cộng</WrapperItemLabel>
              <WrapperItem>
                <WrapperItem>{convertPrice(data?.totalPrice)}</WrapperItem>
              </WrapperItem>
            </WrapperAllPrice>
          </WrapperStyleContent>
        </div>
      </div>
    </Loading>
  );
};

export default DetailsOrderPage;
