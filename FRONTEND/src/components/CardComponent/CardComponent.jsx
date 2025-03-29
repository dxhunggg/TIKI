import React from "react";
import {
  StyleNameProduct,
  WrapperCardStyle,
  WrapperDiscountText,
  WrapperPriceText,
  WrapperReportText,
  WrapperStyleTextSell,
} from "./style";
import { StarFilled } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const CardComponent = (props) => {
  const {
    countInStock,
    description,
    image,
    name,
    price = 0,
    rating,
    type,
    sold,
    discount,
    id,
  } = props;
  const navigate = useNavigate();
  const handleDetailsProduct = (id) => {
    navigate(`/product-details/${id}`);
  };
  return (
    <WrapperCardStyle
      hoverable
      style={{
        width: 200,
      }}
      styles={{
        header: { width: "200px", height: "200px" },
        body: { padding: "10px" },
      }}
      cover={<img alt="example" src={image} />}
      onClick={() => handleDetailsProduct(id)}
    >
      <StyleNameProduct>{name}</StyleNameProduct>
      <WrapperReportText>
        <span
          style={{ display: "flex", alignItems: "center", marginRight: "4px" }}
        >
          <span>{rating}</span>
          <StarFilled style={{ fontSize: "12px", color: "yellow" }} />
        </span>
        <WrapperStyleTextSell> | Đã bán {sold || 1000}</WrapperStyleTextSell>
      </WrapperReportText>
      <WrapperPriceText>
        <span style={{ marginRight: "8px" }}>
          {price ? price.toLocaleString() : "Liên hệ"}
        </span>
        <WrapperDiscountText>- {discount || 5}%</WrapperDiscountText>
      </WrapperPriceText>
    </WrapperCardStyle>
  );
};

export default CardComponent;
