import React, { useEffect, useRef, useState } from "react";
import { Button, Form, Input, Modal, Space } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { WrapperHeader } from "../AdminUser/style";
import TableComponent from "../TableComponent/TableComponent.jsx";
import { WrapperUploadFile } from "./style";
import { getBase64 } from "../../utils";
import * as ProductService from "../../services/ProductService";
import { useMutationHooks } from "../../hooks/useMutationHook";
import Loading from "../LoadingComponent/Loading";
import * as message from "../../components/Message/Message.jsx";
import { useQuery } from "@tanstack/react-query";
import DrawerComponent from "../DrawerComponent/DrawerComponent.jsx";
import { useSelector } from "react-redux";
import ModalComponent from "../ModalComponent/ModalComponent.jsx";
const AdminProduct = () => {
  const [rowSelected, setRowSelected] = useState("");
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
  const [stateProduct, setStateProduct] = useState({
    name: "",
    price: "",
    description: "",
    image: "",
    countInStock: "",
    rating: "",
    type: "",
  });
  const [stateProductDetails, setStateProductDetails] = useState({
    name: "",
    price: "",
    description: "",
    image: "",
    countInStock: "",
    rating: "",
    type: "",
  });
  const searchInput = useRef(null);
  const user = useSelector((state) => state?.user);
  const [form] = Form.useForm();
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
  const mutationUpdate = useMutationHooks((data) => {
    const { id, token, ...rests } = data;
    const res = ProductService.updateProduct(id, token, { ...rests });
    return res;
  });
  const mutationDelete = useMutationHooks((data) => {
    const { id, token } = data;
    const res = ProductService.deleteProduct(id, token);
    return res;
  });
  const mutationDeleteMany = useMutationHooks((data) => {
    const { token, ...ids } = data;
    const res = ProductService.deleteManyProducts(ids, token);
    return res;
  });

  const { data, isLoading = false, isSuccess, isError } = mutation;
  const {
    data: dataUpdated,
    isLoading: isLoadingUpdated = false,
    isSuccess: isSuccessUpdated,
    isError: isErrorUpdated,
  } = mutationUpdate;
  const {
    data: dataDeleted,
    isLoading: isLoadingDeleted = false,
    isSuccess: isSuccessDeleted,
    isError: isErrorDeleted,
  } = mutationDelete;
  const {
    data: dataDeletedMany,
    isLoading: isLoadingDeletedMany = false,
    isSuccess: isSuccessDeletedMany,
    isError: isErrorDeletedMany,
  } = mutationDeleteMany;

  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
  const getAllProducts = async (data) => {
    const res = await ProductService.getAllProduct();
    return res;
  };
  const queryProduct = useQuery({
    queryKey: ["products"],
    queryFn: getAllProducts,
  });
  const { isLoading: isLoadingProducts, data: products } = queryProduct;
  const fetchGetProductDetails = async (rowSelected) => {
    const res = await ProductService.getDetailsProduct(rowSelected);
    if (res?.data) {
      setStateProductDetails({
        name: res?.data?.name,
        price: res?.data?.price,
        description: res?.data?.description,
        image: res?.data?.image,
        countInStock: res?.data?.countInStock,
        rating: res?.data?.rating,
        type: res?.data?.type,
      });
    }
    setIsLoadingUpdate(false);
    return res;
  };
  useEffect(() => {
    if (stateProductDetails && Object.keys(stateProductDetails).length > 0) {
      form.setFieldsValue(stateProductDetails);
    }
  }, [stateProductDetails]);

  useEffect(() => {
    if (rowSelected && isOpenDrawer) {
      setIsLoadingUpdate(true);
      fetchGetProductDetails(rowSelected);
    }
  }, [rowSelected, isOpenDrawer]);

  const handleEditProduct = () => {
    setIsOpenDrawer(true);
  };
  const renderAction = () => {
    return (
      <div>
        <DeleteOutlined
          style={{ color: "red", fontSize: "30px", cursor: "pointer" }}
          onClick={() => setIsModalOpenDelete(true)}
        >
          Xóa
        </DeleteOutlined>
        <EditOutlined
          style={{ color: "orange", fontSize: "30px", cursor: "pointer" }}
          onClick={handleEditProduct}
        >
          Sửa
        </EditOutlined>
      </div>
    );
  };
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
  };
  const handleReset = (clearFilters) => {
    clearFilters();
  };
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            Close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
  });
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      sorter: (a, b) => a.name.length - b.name.length,
      ...getColumnSearchProps("name"),
    },
    {
      title: "Price",
      dataIndex: "price",
      sorter: (a, b) => a.price - b.price,
      filters: [
        {
          text: ">= 50",
          value: ">=",
        },
        {
          text: "<= 50",
          value: "<=",
        },
      ],
      onFilter: (value, record) => {
        if (value === "<=") {
          return record.price <= 50;
        } else if (value === ">=") {
          return record.price >= 50;
        }
      },
    },
    {
      title: "Rating",
      dataIndex: "rating",
      sorter: (a, b) => a.rating - b.rating,
      filters: [
        {
          text: "4 - 5 sao",
          value: "4-5",
        },
        {
          text: "3 - 4 sao",
          value: "3-4",
        },
        {
          text: "2 - 3 sao",
          value: "2-3",
        },
        {
          text: "1 - 2 sao",
          value: "1-2",
        },
        {
          text: "Dưới 1 sao",
          value: "<1",
        },
      ],
      onFilter: (value, record) => {
        if (value === "<1") {
          return record.rating < 1;
        }
        const [min, max] = value.split("-").map(Number);
        return record.rating >= min && record.rating <= max;
      },
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
    products?.data?.map((product) => {
      return { ...product, key: product._id };
    });
  useEffect(() => {
    if (isSuccess && data?.status === "OK") {
      message.success("Thêm sản phẩm thành công!");
      handleCancel();
    } else if (isError) {
      message.error("Thêm sản phẩm thất bại!");
    }
  }, [isSuccess, isError]);
  useEffect(() => {
    if (isSuccessUpdated && dataUpdated?.status === "OK") {
      message.success("Cập nhật sản phẩm thành công");
      handleCloseDrawer();
    } else if (isErrorUpdated) {
      message.error("Cập nhật sản phẩm thất bại");
    }
  }, [isSuccessUpdated, isErrorUpdated]);
  useEffect(() => {
    if (isSuccessDeleted && dataDeleted?.status === "OK") {
      message.success("Xóa sản phẩm thành công!");
      handleCancelDelete();
    } else if (isErrorDeleted) {
      message.error("Xóa sản phẩm thất bại!");
    }
  }, [isSuccessDeleted, isErrorDeleted]);
  useEffect(() => {
    if (isSuccessDeletedMany && dataDeletedMany?.status === "OK") {
      message.success("Xóa sản phẩm thành công!");
    } else if (isErrorDeletedMany) {
      message.error("Xóa sản phẩm thất bại!");
    }
  }, [isSuccessDeletedMany, isErrorDeletedMany]);
  const handleCancelDelete = () => {
    setIsModalOpenDelete(false);
  };
  const handleDeleteProduct = () => {
    mutationDelete.mutate(
      { id: rowSelected, token: user?.access_token },
      {
        onSettled: () => {
          queryProduct.refetch();
        },
      }
    );
  };
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
    mutation.mutate(stateProduct, {
      onSettled: () => {
        queryProduct.refetch();
      },
    });
  };
  const handleOnChange = (e) => {
    setStateProduct({ ...stateProduct, [e.target.name]: e.target.value });
  };
  const handleOnChangeDetails = (e) => {
    setStateProductDetails({
      ...stateProductDetails,
      [e.target.name]: e.target.value,
    });
  };
  const [imageLoading, setImageLoading] = useState(false);
  const handleOnChangeAvatar = async ({ fileList }) => {
    try {
      setImageLoading(true);
      const file = fileList[0];
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj);
      }
      setStateProduct({ ...stateProduct, image: file.preview });
    } catch (error) {
      message.error("Lỗi khi tải ảnh");
    } finally {
      setImageLoading(false);
    }
  };
  const handleOnChangeAvatarDetails = async ({ fileList }) => {
    const file = fileList[0];
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setStateProductDetails({ ...stateProductDetails, image: file.preview });
  };

  const onUpdateProduct = () => {
    if (!user?.access_token) {
      message.error("Vui lòng đăng nhập lại");
      return;
    }
    mutationUpdate.mutate(
      {
        id: rowSelected,
        token: user?.access_token,
        ...stateProductDetails,
      },
      {
        onSettled: () => {
          queryProduct.refetch();
        },
        onError: (error) => {
          message.error(
            `Lỗi cập nhật: ${
              error.response?.data?.message || "Lỗi không xác định"
            }`
          );
        },
      }
    );
  };

  const handleCloseDrawer = () => {
    setIsOpenDrawer(false);
    setIsLoadingUpdate(false);
    form.resetFields();
    setStateProductDetails({
      name: "",
      price: "",
      description: "",
      image: "",
      countInStock: "",
      rating: "",
      type: "",
    });
  };
  const handleDeleteManyProducts = (ids) => {
    mutationDeleteMany.mutate(
      { ids: ids, token: user?.access_token },
      {
        onSettled: () => {
          queryProduct.refetch();
        },
      }
    );
  };

  useEffect(() => {
    if (!isOpenDrawer) {
      setIsLoadingUpdate(false);
    }
  }, [isOpenDrawer]);
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
        <TableComponent
          handleDeleteMany={handleDeleteManyProducts}
          columns={columns}
          isLoading={isLoadingProducts}
          data={dataTable}
          onRow={(record, rowIndex) => {
            return {
              onClick: (event) => {
                setRowSelected(record._id);
              },
            };
          }}
        />
      </div>
      <ModalComponent
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
                  message: "Vui lòng nhập giá!",
                },
                {
                  type: "number",
                  message: "Giá phải là số!",
                  transform: (value) => Number(value),
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
              <WrapperUploadFile
                fileList={
                  stateProduct.image ? [{ url: stateProduct.image }] : []
                }
                onChange={handleOnChangeAvatar}
                maxCount={1}
              >
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
      </ModalComponent>
      <DrawerComponent
        title="Chi tiết sản phẩm"
        isOpen={isOpenDrawer}
        onClose={handleCloseDrawer}
        width="90%"
      >
        <Loading isLoading={isLoadingUpdate || isLoadingUpdated}>
          <Form
            name="basic"
            labelCol={{
              span: 2,
            }}
            wrapperCol={{
              span: 22,
            }}
            onFinish={onUpdateProduct}
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
                value={stateProductDetails.name}
                onChange={handleOnChangeDetails}
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
                value={stateProductDetails.type}
                onChange={handleOnChangeDetails}
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
                value={stateProductDetails.countInStock}
                onChange={handleOnChangeDetails}
                name="countInStock"
              />
            </Form.Item>

            <Form.Item
              label="Price"
              name="price"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập giá!",
                },
                {
                  type: "number",
                  message: "Giá phải là số!",
                  transform: (value) => Number(value),
                },
              ]}
            >
              <Input
                value={stateProductDetails.price}
                onChange={handleOnChangeDetails}
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
                value={stateProductDetails.description}
                onChange={handleOnChangeDetails}
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
                value={stateProductDetails.rating}
                onChange={handleOnChangeDetails}
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
              <WrapperUploadFile
                fileList={
                  stateProductDetails.image
                    ? [{ url: stateProductDetails.image }]
                    : []
                }
                onChange={handleOnChangeAvatarDetails}
                maxCount={1}
              >
                <Button>Select File</Button>
                {stateProductDetails.image && (
                  <img
                    src={stateProductDetails?.image}
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
                Update
              </Button>
            </Form.Item>
          </Form>
        </Loading>
      </DrawerComponent>
      <ModalComponent
        title="Xóa sản phẩm"
        open={isModalOpenDelete}
        onCancel={handleCancelDelete}
        onOk={handleDeleteProduct}
      >
        <Loading isLoading={isLoadingDeleted}>
          <div>Bạn có chắc xóa sản phẩm này không?</div>
        </Loading>
      </ModalComponent>
    </div>
  );
};

export default AdminProduct;
