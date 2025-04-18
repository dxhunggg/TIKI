import { Form, Input, Radio } from "antd";
import React, { useEffect, useMemo, useState } from "react";
import {
  Label,
  WrapperInfo,
  WrapperLeft,
  WrapperRadio,
  WrapperRight,
  WrapperTotal,
} from "./style";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import { convertPrice } from "../../utils";
import ModalComponent from "../../components/ModalComponent/ModalComponent";
import Loading from "../../components/LoadingComponent/Loading";
import { useDispatch, useSelector } from "react-redux";
import { removeAllOrderProduct } from "../../redux/slides/orderSlide";
import { useNavigate } from "react-router-dom";
import { useMutationHooks } from "../../hooks/useMutationHook";
import * as UserService from "../../services/UserService";
import { updateUser } from "../../redux/slides/userSlide";
import * as message from "../../components/Message/Message";
import * as OrderService from "../../services/OrderService";
import QRPaymentComponent from "../../components/QRPaymentComponent/QRPaymentComponent";

const PaymentPage = () => {
  const order = useSelector((state) => state.order);
  const user = useSelector((state) => state.user);
  const [delivery, setDelivery] = useState("fast");
  const [payment, setPayment] = useState("later_money");
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);

  const [isOpenModalUpdateInfo, setIsOpenModalUpdateInfo] = useState(false);
  const [stateUserDetails, setStateUserDetails] = useState({
    name: "",
    phone: "",
    address: "",
  });
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const handleAddOrder = () => {
    if (payment === "qr_code") {
      setIsQRModalOpen(true);
      return;
    }

    if (
      user?.access_token &&
      order?.orderItemsSelected &&
      order?.orderItemsSelected.length > 0 &&
      user?.name &&
      user?.address &&
      user?.phone &&
      priceMemo &&
      user?.id
    ) {
      try {
        const formattedOrderItems = order?.orderItemsSelected.map((item) => ({
          name: item.name || "Sản phẩm",
          amount: item.amount || 1,
          image: item.image || "",
          price: item.price || 0,
          product: item.product,
          discount: item.discount || 0,
        }));

        const orderData = {
          orderItems: formattedOrderItems,
          fullName: user?.name,
          address: user?.address,
          phone: user?.phone,
          paymentMethod: payment,
          itemsPrice: priceMemo,
          shippingPrice: deliveryPriceMemo,
          totalPrice: totalPriceMemo,
          user: user?.id,
          email: user?.email,
        };
        mutationAddOrder.mutate({
          token: user?.access_token,
          ...orderData,
        });
      } catch (error) {
        message.error(
          "Đặt hàng thất bại: " + (error.message || "Lỗi không xác định")
        );
      }
    } else {
      message.error("Vui lòng điền đầy đủ thông tin và chọn sản phẩm");
    }
  };

  const mutationUpdate = useMutationHooks((data) => {
    const { id, token, ...rests } = data;
    const res = UserService.updateUser(id, token, { ...rests });
    return res;
  });
  const mutationAddOrder = useMutationHooks((data) => {
    const { token, ...rests } = data;
    const res = OrderService.createOrder({ ...rests }, token);
    return res;
  });
  const { isPending: isLoading, data } = mutationUpdate;
  const {
    data: dataAdd,
    isPending: isLoadingAddOrder,
    isSuccess,
    isError,
  } = mutationAddOrder;
  useEffect(() => {
    if (isSuccess && dataAdd?.status === "OK") {
      const arrayOrdered = [];
      order?.orderItemsSelected?.forEach((element) => {
        arrayOrdered.push(element.product);
      });
      dispatch(removeAllOrderProduct({ listChecked: arrayOrdered }));
      message.success("Đặt hàng thành công");
      navigate("/orderSuccess", {
        state: {
          delivery,
          payment,
          orders: order?.orderItemsSelected,
          totalPriceMemo: totalPriceMemo,
        },
      });
    } else if (isError || (dataAdd && dataAdd.status === "ERROR")) {
      message.error(dataAdd?.message || "Đặt hàng không thành công");
    }
  }, [isSuccess, isError, dataAdd]);
  const handleCancelUpdate = () => {
    setStateUserDetails({
      name: "",
      email: "",
      phone: "",
      isAdmin: false,
    });
    form.resetFields();
    setIsOpenModalUpdateInfo(false);
  };
  const handleUpdateInfoUser = () => {
    const { name, address, phone } = stateUserDetails;
    if (name && address && phone) {
      mutationUpdate.mutate(
        { id: user?.id, token: user?.access_token, ...stateUserDetails },
        {
          onSuccess: () => {
            dispatch(updateUser({ name, address, phone }));
            setIsOpenModalUpdateInfo(false);
          },
        }
      );
    }
  };
  const handleOnChangeDetails = (e) => {
    setStateUserDetails({
      ...stateUserDetails,
      [e.target.name]: e.target.value,
    });
  };
  const handleDelivery = (e) => {
    setDelivery(e.target.value);
  };
  const handlePayment = (e) => {
    setPayment(e.target.value);
  };

  useEffect(() => {
    form.setFieldsValue(stateUserDetails);
  }, [form, stateUserDetails]);

  useEffect(() => {
    if (isOpenModalUpdateInfo) {
      setStateUserDetails({
        name: user?.name,
        address: user?.address,
        phone: user?.phone,
      });
    }
  }, [isOpenModalUpdateInfo]);
  const handleChangeAddress = () => {
    setIsOpenModalUpdateInfo(true);
  };
  const priceMemo = useMemo(() => {
    const result = order?.orderItemsSelected?.reduce((total, cur) => {
      return total + cur.price * cur.amount;
    }, 0);
    return result;
  }, [order]);
  const priceDiscountMemo = useMemo(() => {
    const result = order?.orderItemsSelected?.reduce((total, cur) => {
      const totalDiscount = cur.discount ? cur.discount : 0;
      return total + (cur.price * cur.amount * totalDiscount) / 100;
    }, 0);
    return result > 0 ? result : 0;
  }, [order]);

  const deliveryPriceMemo = useMemo(() => {
    if (priceMemo >= 20000 && priceMemo < 500000) {
      return 10000;
    } else if (priceMemo >= 500000 || order?.orderItemsSelected?.length === 0) {
      return 0;
    } else {
      return 20000;
    }
  }, [priceMemo]);
  const totalPriceMemo = useMemo(() => {
    return (
      Number(priceMemo) - Number(priceDiscountMemo) + Number(deliveryPriceMemo)
    );
  }, [priceMemo, priceDiscountMemo, deliveryPriceMemo]);

  const handleQRPaymentSuccess = () => {
    setIsQRModalOpen(false);
    if (
      user?.access_token &&
      order?.orderItemsSelected &&
      order?.orderItemsSelected.length > 0 &&
      user?.name &&
      user?.address &&
      user?.phone &&
      priceMemo &&
      user?.id
    ) {
      try {
        const formattedOrderItems = order?.orderItemsSelected.map((item) => ({
          name: item.name || "Sản phẩm",
          amount: item.amount || 1,
          image: item.image || "",
          price: item.price || 0,
          product: item.product,
          discount: item.discount || 0,
        }));

        const orderData = {
          orderItems: formattedOrderItems,
          fullName: user?.name,
          address: user?.address,
          phone: user?.phone,
          paymentMethod: payment,
          itemsPrice: priceMemo,
          shippingPrice: deliveryPriceMemo,
          totalPrice: totalPriceMemo,
          user: user?.id,
          email: user?.email,
          isPaid: true,
          paidAt: new Date().toISOString(),
        };
        mutationAddOrder.mutate({
          token: user?.access_token,
          ...orderData,
        });
      } catch (error) {
        message.error(
          "Đặt hàng thất bại: " + (error.message || "Lỗi không xác định")
        );
      }
    }
  };

  return (
    <div style={{ background: "#f5f5fa", with: "100%", height: "100vh" }}>
      <Loading isLoading={isLoadingAddOrder}>
        <div style={{ height: "100%", width: "1270px", margin: "0 auto" }}>
          <h3 style={{ fontWeight: "bold" }}>Thanh toán</h3>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <WrapperLeft>
              <WrapperInfo>
                <div>
                  <Label>Chọn phương thức giao hàng</Label>
                  <WrapperRadio onChange={handleDelivery} value={delivery}>
                    <Radio value="fast">
                      <span style={{ color: "#ea8500", fontWeight: "bold" }}>
                        FAST
                      </span>{" "}
                      Giao hàng tiết kiệm
                    </Radio>
                    <Radio value="gojek">
                      <span style={{ color: "#ea8500", fontWeight: "bold" }}>
                        GO_JEK
                      </span>{" "}
                      Giao hàng tiết kiệm
                    </Radio>
                  </WrapperRadio>
                  <div style={{ marginTop: "10px", color: "#ea8500", fontWeight: "bold" }}>
                    Thời gian giao hàng dự kiến: {new Date(new Date().getTime() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString("vi-VN")}
                  </div>
                </div>
              </WrapperInfo>
              <WrapperInfo>
                <div>
                  <Label>Chọn phương thức thanh toán</Label>
                  <WrapperRadio onChange={handlePayment} value={payment}>
                    <Radio value="later_money">
                      {" "}
                      Thanh toán tiền mặt khi nhận hàng
                    </Radio>
                    <Radio value="qr_code"> Thanh toán qua QR Code</Radio>
                  </WrapperRadio>
                </div>
              </WrapperInfo>
            </WrapperLeft>
            <WrapperRight>
              <div style={{ width: "100%" }}>
                <WrapperInfo>
                  <div>
                    <span>Địa chỉ: </span>
                    <span style={{ fontWeight: "bold" }}>
                      {`${user?.address} `}
                    </span>
                    <span
                      onClick={handleChangeAddress}
                      style={{
                        color: "red",
                        cursor: "pointer",
                        textDecoration: "underline",
                      }}
                    >
                      Thay đổi
                    </span>
                  </div>
                </WrapperInfo>
                <WrapperInfo>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <span>Tạm tính</span>
                    <span
                      style={{
                        color: "#000",
                        fontSize: "14px",
                        fontWeight: "bold",
                      }}
                    >
                      {convertPrice(priceMemo)}
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <span>Giảm giá</span>
                    <span
                      style={{
                        color: "#000",
                        fontSize: "14px",
                        fontWeight: "bold",
                      }}
                    >
                      {convertPrice(priceDiscountMemo)}
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <span>Phí giao hàng</span>
                    <span
                      style={{
                        color: "#000",
                        fontSize: "14px",
                        fontWeight: "bold",
                      }}
                    >
                      {convertPrice(deliveryPriceMemo)}
                    </span>
                  </div>
                </WrapperInfo>
                <WrapperTotal>
                  <span>Tổng tiền</span>
                  <span style={{ display: "flex", flexDirection: "column" }}>
                    <span
                      style={{
                        color: "rgb(254, 56, 52)",
                        fontSize: "24px",
                        fontWeight: "bold",
                      }}
                    >
                      {convertPrice(totalPriceMemo)}
                    </span>
                    <span style={{ color: "#000", fontSize: "11px" }}>
                      (Đã bao gồm VAT nếu có)
                    </span>
                  </span>
                </WrapperTotal>
              </div>
              <ButtonComponent
                onClick={() => handleAddOrder()}
                size={40}
                styleButton={{
                  background: "rgb(255, 57, 69)",
                  height: "48px",
                  width: "320px",
                  border: "none",
                  borderRadius: "4px",
                }}
                textButton={"Đặt hàng"}
                styleTextButton={{
                  color: "#fff",
                  fontSize: "15px",
                  fontWeight: "700",
                }}
              />
            </WrapperRight>
          </div>
        </div>
        <ModalComponent
          title="Cập nhật thông tin giao hàng"
          open={isOpenModalUpdateInfo}
          onCancel={handleCancelUpdate}
          onOk={handleUpdateInfoUser}
        >
          <Loading isLoading={isLoading}>
            <Form
              name="basic"
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 20 }}
              // onFinish={onUpdateUser}
              autoComplete="on"
              form={form}
            >
              <Form.Item
                label="Name"
                name="name"
                rules={[{ required: true, message: "Please input your name!" }]}
              >
                <Input
                  value={stateUserDetails["name"]}
                  onChange={handleOnChangeDetails}
                  name="name"
                />
              </Form.Item>
              <Form.Item
                label="Phone"
                name="phone"
                rules={[
                  { required: true, message: "Please input your  phone!" },
                ]}
              >
                <Input
                  value={stateUserDetails.phone}
                  onChange={handleOnChangeDetails}
                  name="phone"
                />
              </Form.Item>

              <Form.Item
                label="Address"
                name="address"
                rules={[
                  { required: true, message: "Please input your  address!" },
                ]}
              >
                <Input
                  value={stateUserDetails.address}
                  onChange={handleOnChangeDetails}
                  name="address"
                />
              </Form.Item>
            </Form>
          </Loading>
        </ModalComponent>
      </Loading>
      <QRPaymentComponent
        isOpen={isQRModalOpen}
        onClose={() => setIsQRModalOpen(false)}
        totalAmount={totalPriceMemo}
        onSuccess={handleQRPaymentSuccess}
      />
    </div>
  );
};

export default PaymentPage;
