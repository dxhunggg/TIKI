import React, { useEffect, useState } from "react";
import { Button, Form, Input, Modal } from "antd";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { WrapperHeader } from "../AdminUser/style";
import ProductTable from "../TableComponent/ProductTable";
import { WrapperUploadFile } from "./style";
import { getBase64 } from "../../utils";
import * as ProductService from "../../services/ProductService";
import { useMutationHooks } from "../../hooks/useMutationHook";
import Loading from "../LoadingComponent/Loading";
import * as message from "../../components/Message/Message.jsx";
import { useQuery } from "@tanstack/react-query";
const AdminProduct = () => {
  const mutation = useMutationHooks((data) => {
    const { name, price, description, image, countInStock, rating, type } =
      data;
    const res = ProductService.createProduct({
      name,
      price,
      description,
      image,
      countInStock,
      rating,
      type,
    });
    return res;
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [stateProduct, setStateProduct] = useState({
    name: "",
    price: "",
    description: "",
    image: "",
    countInStock: "",
    rating: "",
    type: "",
  });
  const [form] = Form.useForm();
  const { data, isLoading = false, isSuccess, isError } = mutation;

  const getAllProducts = async (data) => {
    const res = await ProductService.getAllProduct();
    return res;
  };
  const { isLoading: isLoadingProducts, data: products } = useQuery({
    queryKey: ["products"],
    queryFn: getAllProducts,
  });
  const renderAction = () => {
    return (
      <div>
        <DeleteOutlined
          style={{ color: "red", fontSize: "30px", cursor: "pointer" }}
        >
          Xóa
        </DeleteOutlined>
        <EditOutlined
          style={{ color: "orange", fontSize: "30px", cursor: "pointer" }}
        >
          Sửa
        </EditOutlined>
      </div>
    );
  };
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Price",
      dataIndex: "price",
    },
    {
      title: "Rating",
      dataIndex: "rating",
    },
    {
      title: "Type",
      dataIndex: "type",
    },
    {
      title: "Action",
      dataIndex: "action",
      render: renderAction,
    },
  ];
  const dataTable =
    products?.data?.length &&
    products?.data.map((product) => {
      return { ...product, key: product._id };
    });
  useEffect(() => {
    if (isSuccess && data?.status === "OK") {
      message.success("Thêm sản phẩm thành công!");
      handleCancel();
    } else if (isError) {
      message.error("Thêm sản phẩm thất bại!");
    }
  }, [isSuccess]);

  const handleCancel = () => {
    setIsModalOpen(false);
    setStateProduct({
      name: "",
      price: "",
      description: "",
      image: "",
      countInStock: "",
      rating: "",
      type: "",
    });
    form.resetFields();
  };
  const onFinish = () => {
    const isAnyFieldEmpty = Object.values(stateProduct).some(
      (value) => value === ""
    );
    if (isAnyFieldEmpty) {
      message.error("Vui lòng điền đầy đủ thông tin!");
      return;
    }
    mutation.mutate(stateProduct);
  };
  const handleOnChange = (e) => {
    setStateProduct({ ...stateProduct, [e.target.name]: e.target.value });
  };
  const handleOnChangeAvatar = async ({ fileList }) => {
    const file = fileList[0];
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setStateProduct({ ...stateProduct, image: file.preview });
  };
  return (
    <div>
      <WrapperHeader>Quản lý sản phẩm</WrapperHeader>
      <div style={{ marginTop: "10px" }}>
        <Button
          style={{
            height: "150px",
            width: "150px",
            borderRadius: "6px",
            borderStyle: "dashed",
          }}
          onClick={() => setIsModalOpen(true)}
        >
          <PlusOutlined style={{ fontSize: "60px" }} />
        </Button>
      </div>
      <div style={{ marginTop: "20px" }}>
        <ProductTable
          columns={columns}
          isLoading={isLoadingProducts}
          data={dataTable}
        />
      </div>
      <Modal
        title="Tạo sản phẩm"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
      >
        <Loading isLoading={isLoading}>
          <Form
            name="basic"
            labelCol={{
              span: 6,
            }}
            wrapperCol={{
              span: 18,
            }}
            style={{
              maxWidth: 600,
            }}
            onFinish={onFinish}
            autoComplete="off"
            form={form}
          >
            <Form.Item
              label="Name"
              name="name"
              rules={[
                {
                  required: true,
                  message: "Please input your name!",
                },
              ]}
            >
              <Input
                value={stateProduct.name}
                onChange={handleOnChange}
                name="name"
              />
            </Form.Item>

            <Form.Item
              label="Type"
              name="type"
              rules={[
                {
                  required: true,
                  message: "Please input your type!",
                },
              ]}
            >
              <Input
                value={stateProduct.type}
                onChange={handleOnChange}
                name="type"
              />
            </Form.Item>

            <Form.Item
              label="Count in stock"
              name="countInStock"
              rules={[
                {
                  required: true,
                  message: "Please input your Count in stock!",
                },
              ]}
            >
              <Input
                value={stateProduct.countInStock}
                onChange={handleOnChange}
                name="countInStock"
              />
            </Form.Item>

            <Form.Item
              label="Price"
              name="price"
              rules={[
                {
                  required: true,
                  message: "Please input your price!",
                },
              ]}
            >
              <Input
                value={stateProduct.price}
                onChange={handleOnChange}
                name="price"
              />
            </Form.Item>
            <Form.Item
              label="Description"
              name="description"
              rules={[
                {
                  required: true,
                  message: "Please input your description!",
                },
              ]}
            >
              <Input
                value={stateProduct.description}
                onChange={handleOnChange}
                name="description"
              />
            </Form.Item>
            <Form.Item
              label="Rating"
              name="rating"
              rules={[
                {
                  required: true,
                  message: "Please input your rating!",
                },
              ]}
            >
              <Input
                value={stateProduct.rating}
                onChange={handleOnChange}
                name="rating"
              />
            </Form.Item>
            <Form.Item
              label="Image"
              name="image"
              rules={[
                {
                  required: true,
                  message: "Please input your image!",
                },
              ]}
            >
              <WrapperUploadFile onChange={handleOnChangeAvatar} maxCount={1}>
                <Button>Select File</Button>
                {stateProduct.image && (
                  <img
                    src={stateProduct?.image}
                    style={{
                      height: "60px",
                      width: "60px",
                      borderRadius: "50%",
                      objectFit: "cover",
                      marginLeft: "10px",
                    }}
                    alt="avatar"
                  />
                )}
              </WrapperUploadFile>
            </Form.Item>

            <Form.Item label={null} wrapperCol={{ offset: 20, span: 16 }}>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form>
        </Loading>
      </Modal>
    </div>
  );
};

export default AdminProduct;
