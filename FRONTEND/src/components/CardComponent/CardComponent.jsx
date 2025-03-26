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
  } = props;

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
    >
      <StyleNameProduct>{name}</StyleNameProduct>
      <WrapperReportText>
        <span style={{ marginRight: "4px" }}>
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
