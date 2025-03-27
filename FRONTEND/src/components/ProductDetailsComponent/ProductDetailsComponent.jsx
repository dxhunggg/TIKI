import { Col, Row, Image, InputNumber, Button, Rate } from "antd";
import React, { useState } from "react";
import imageProduct from "../../assets/images/ịphone16.webp";
import imageProductSmall from "../../assets/images/smallimage.webp";
import {
  WrapperAddressProduct,
  WrapperInputNumber,
  WrapperPriceProduct,
  WrapperPriceTextProduct,
  WrapperQuanityProduct,
  WrapperStyleColImage,
  WrapperStyleImageSmall,
  WrapperStyleNameProduct,
  WrapperStyleTextSell,
} from "./style";
import { MinusOutlined, PlusOutlined, StarFilled } from "@ant-design/icons";
import ButtonComponent from "../ButtonComponent/ButtonComponent.jsx";
import * as ProductService from "../../services/ProductService";
import { useQuery } from "@tanstack/react-query";
import Loading from "../LoadingComponent/Loading.jsx";
import { render } from "react-dom";
import { convertPrice } from "../../utils.js";
import { useSelector } from "react-redux";

const ProductDetailsComponent = ({ idProduct }) => {
  const [numProduct, setNumProduct] = useState();
  const user = useSelector((state) => state.user);
  const onChange = (value) => {
    setNumProduct(Number(value));
  };

  const fetchGetProductDetails = async (context) => {
    const id = context?.queryKey && context?.queryKey[1];
    if (id) {
      const res = await ProductService.getDetailsProduct(id);
      return res.data;
    }
  };
  const { isLoading, data: productDetails } = useQuery(
    ["products-details", idProduct],
    fetchGetProductDetails,
    {
      enabled: !!idProduct,
    }
  );
  const handleChangeCount = (type) => {
    if (type === "increase") {
      setNumProduct(numProduct + 1);
    } else if (type === "decrease") {
      setNumProduct(numProduct - 1);
    }
  };

  return (
    <Loading isLoading={isLoading}>
      <Row style={{ padding: "16px", background: "#fff", borderRadius: "4px" }}>
        <Col
          span={10}
          style={{ border: "1px solid #e5e5e5", paddingRight: "8px" }}
        >
          <Image
            src={productDetails?.image}
            alt="image product"
            preview={false}
          />
          <Row style={{ paddingTop: "10px", justifyContent: "space-between" }}>
            <WrapperStyleColImage span={4}>
              <WrapperStyleImageSmall
                src={imageProductSmall}
                alt="image small"
                preview={false}
              />
            </WrapperStyleColImage>
            <WrapperStyleColImage span={4}>
              <WrapperStyleImageSmall
                src={imageProductSmall}
                alt="image small"
                preview={false}
              />
            </WrapperStyleColImage>
            <WrapperStyleColImage span={4}>
              <WrapperStyleImageSmall
                src={imageProductSmall}
                alt="image small"
                preview={false}
              />
            </WrapperStyleColImage>
            <WrapperStyleColImage span={4}>
              <WrapperStyleImageSmall
                src={imageProductSmall}
                alt="image small"
                preview={false}
              />
            </WrapperStyleColImage>
            <WrapperStyleColImage span={4}>
              <WrapperStyleImageSmall
                src={imageProductSmall}
                alt="image small"
                preview={false}
              />
            </WrapperStyleColImage>
            <WrapperStyleColImage span={4}>
              <WrapperStyleImageSmall
                src={imageProductSmall}
                alt="image small"
                preview={false}
              />
            </WrapperStyleColImage>
          </Row>
        </Col>
        <Col span={14} style={{ paddingLeft: "10px" }}>
          <WrapperStyleNameProduct>
            {productDetails?.name}
          </WrapperStyleNameProduct>
          <div>
            <Rate
              allowHalf
              defaultValue={productDetails?.rating}
              value={productDetails?.rating}
            />
            <WrapperStyleTextSell> | Đã bán 1000</WrapperStyleTextSell>
          </div>
          <WrapperPriceProduct>
            <WrapperPriceTextProduct>
              {convertPrice(productDetails?.price)}
            </WrapperPriceTextProduct>
          </WrapperPriceProduct>
          <WrapperAddressProduct>
            <span>Giao đến </span>
            <span className="address">{user?.address}</span>
            <span className="change-address"> Đổi địa chỉ</span>
          </WrapperAddressProduct>
          <div
            style={{
              margin: "10px 0 20px",
              padding: "10px 0",
              borderBottom: "1px solid #e5e5e5",
            }}
          >
            <div style={{ marginBottom: "6px" }}>Số lượng</div>
            <div>
              <WrapperQuanityProduct>
                <button
                  style={{
                    border: "none",
                    background: "transparent",
                    cursor: "pointer",
                  }}
                  onClick={() => handleChangeCount("decrease")}
                >
                  <MinusOutlined style={{ color: "#000", fontSize: "20px" }} />
                </button>
                <WrapperInputNumber
                  size="small"
                  onChange={onChange}
                  defaultValue={1}
                  value={numProduct}
                />
                <button
                  style={{
                    border: "none",
                    background: "transparent",
                    cursor: "pointer",
                  }}
                  onClick={() => handleChangeCount("increase")}
                >
                  <PlusOutlined style={{ color: "#000", fontSize: "20px" }} />
                </button>
              </WrapperQuanityProduct>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <ButtonComponent
              size="40"
              styleButton={{
                background: "rgb(255,57,69)",
                height: "48px",
                width: "220px",
                border: "none",
                borderRadius: "4px",
              }}
              textButton={"Chọn mua"}
              styleTextButton={{
                color: "#fff",
                fontSize: "15px",
                fontWeight: "700",
              }}
            ></ButtonComponent>
            <ButtonComponent
              size="40"
              styleButton={{
                background: "#fff",
                height: "48px",
                width: "220px",
                border: "1px solid rgb(13,92,182)",
                borderRadius: "4px",
              }}
              textButton={"Mua trả sau"}
              styleTextButton={{ color: "rgb(13,92,182)", fontSize: "15px" }}
            ></ButtonComponent>
          </div>
        </Col>
      </Row>
    </Loading>
  );
};

export default ProductDetailsComponent;
