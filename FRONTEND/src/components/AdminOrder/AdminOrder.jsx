import { Button, Form, Space, Modal } from "antd";
import React, { useState } from "react";
import { WrapperHeader, WrapperUploadFile } from "./style";
import TableComponent from "../TableComponent/TableComponent";
import InputComponent from "../InputComponent/InputComponent";
import DrawerComponent from "../DrawerComponent/DrawerComponent";
import Loading from "../LoadingComponent/Loading";
import ModalComponent from "../ModalComponent/ModalComponent";
import { convertPrice, getBase64 } from "../../utils";
import { useEffect } from "react";
import * as message from "../Message/Message";

import * as OrderService from "../../services/OrderService";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { SearchOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import { orderContant } from "../../contant";
import PieChartComponent from "./PieChart";

const AdminOrder = () => {
  const user = useSelector((state) => state?.user);
  const queryClient = useQueryClient();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const getAllOrder = async () => {
    const res = await OrderService.getAllOrder(user?.access_token);
    return res;
  };

  const queryOrder = useQuery({ queryKey: ["orders"], queryFn: getAllOrder });
  const { isLoading: isLoadingOrders, data: orders } = queryOrder;

  const handleConfirmOrder = async (orderId) => {
    try {
      await OrderService.adminConfirmOrder(orderId, user?.access_token);
      message.success("Xác nhận đơn hàng thành công");
      queryClient.invalidateQueries(["orders"]);
    } catch (error) {
      message.error("Xác nhận đơn hàng thất bại");
    }
  };

  const handleCancelOrder = async (orderId) => {
    try {
      await OrderService.adminCancelOrder(orderId, user?.access_token);
      message.success("Hủy đơn hàng thành công");
      queryClient.invalidateQueries(["orders"]);
    } catch (error) {
      message.error("Hủy đơn hàng thất bại");
    }
  };

  const showModal = (order) => {
    setSelectedOrder(order);
    setIsModalVisible(true);
  };

  const handleOk = () => {
    if (selectedOrder) {
      handleCancelOrder(selectedOrder._id);
    }
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <InputComponent
          placeholder={`Tìm kiếm ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => confirm()}
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => confirm()}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => {
              clearFilters();
              confirm();
            }}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? "#1890ff" : undefined,
        }}
      />
    ),
    onFilter: (value, record) => {
      if (!record[dataIndex]) return false;
      return record[dataIndex]
        .toString()
        .toLowerCase()
        .includes(value.toLowerCase());
    },
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        // setTimeout(() => searchInput.current?.select(), 100);
      }
    },
  });

  const columns = [
    {
      title: "User name",
      dataIndex: "userName",
      sorter: (a, b) => a.userName.localeCompare(b.userName),
      ...getColumnSearchProps("userName"),
    },
    {
      title: "Phone",
      dataIndex: "phone",
      sorter: (a, b) => a.phone.localeCompare(b.phone),
      ...getColumnSearchProps("phone"),
    },
    {
      title: "Address",
      dataIndex: "address",
      sorter: (a, b) => a.address.localeCompare(b.address),
      ...getColumnSearchProps("address"),
    },
    {
      title: "Paided",
      dataIndex: "isPaid",
      sorter: (a, b) => {
        const statusOrder = { "Đã thanh toán": 1, "Chưa thanh toán": 2 };
        return statusOrder[a.isPaid] - statusOrder[b.isPaid];
      },
    },
    {
      title: "Shipped",
      dataIndex: "isDelivered",
      sorter: (a, b) => {
        const statusOrder = {
          "Đã giao hàng": 1,
          "Chưa giao hàng": 2,
          "Đã hủy bởi người bán hàng": 3,
        };
        return statusOrder[a.isDelivered] - statusOrder[b.isDelivered];
      },
    },
    {
      title: "Payment method",
      dataIndex: "paymentMethod",
      sorter: (a, b) => (a.name || "").localeCompare(b.name || "")
    },
    {
      title: "Total price",
      dataIndex: "totalPrice",
      sorter: (a, b) => {
        const priceA = parseFloat(a.totalPrice.replace(/[^0-9.-]+/g, ""));
        const priceB = parseFloat(b.totalPrice.replace(/[^0-9.-]+/g, ""));
        return priceA - priceB;
      },
    },
    {
      title: "Time",
      dataIndex: "createdAt",
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
      render: (text) => new Date(text).toLocaleString("vi-VN"),
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            onClick={() => handleConfirmOrder(record._id)}
            disabled={
              record.isDelivered === "Đã giao hàng" ||
              record.isDelivered === "Đã hủy bởi người bán hàng"
            }
          >
            Xác nhận đơn hàng
          </Button>
          <Button
            danger
            onClick={() => showModal(record)}
            disabled={
              record.isDelivered === "Đã giao hàng" ||
              record.isDelivered === "Đã hủy bởi người bán hàng"
            }
          >
            Hủy đơn hàng
          </Button>
        </Space>
      ),
    },
  ];

  const dataTable =
    orders?.data?.length &&
    orders?.data?.map((order) => {
      const renderPaymentMethod = () => {
        if (order?.paymentMethod === "qr_code") {
          return orderContant.payment[order?.paymentMethod];
        }
        return orderContant.payment[order?.paymentMethod];
      };

      return {
        ...order,
        key: order._id,
        userName: order?.shippingAddress?.fullName,
        phone: order?.shippingAddress?.phone,
        address: order?.shippingAddress?.address,
        paymentMethod: renderPaymentMethod(),
        isPaid: order?.isPaid ? (
          <span style={{ color: "green" }}>Đã thanh toán</span>
        ) : (
          "Chưa thanh toán"
        ),
        isDelivered: order?.isCancelled
          ? "Đã hủy bởi người bán hàng"
          : order?.isDelivered
          ? "Đã giao hàng"
          : "Chưa giao hàng",
        totalPrice: convertPrice(order?.totalPrice),
        createdAt: order?.createdAt,
      };
    });

  return (
    <div>
      <WrapperHeader>Quản lý đơn hàng</WrapperHeader>
      <div style={{ height: 200, width: 200 }}>
        <PieChartComponent data={orders?.data} />
      </div>
      <div style={{ marginTop: "20px" }}>
        <TableComponent
          columns={columns}
          isLoading={isLoadingOrders}
          data={dataTable}
        />
      </div>
      <Modal
        title="Xác nhận hủy đơn hàng"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Đồng ý"
        cancelText="Hủy"
      >
        <p>Bạn có chắc chắn muốn hủy đơn hàng này không?</p>
      </Modal>
    </div>
  );
};

export default AdminOrder;
