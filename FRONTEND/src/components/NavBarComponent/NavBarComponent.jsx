import React, { useEffect, useState } from "react";
import { Checkbox, Col, Rate, Row } from "antd";
import {
  WrapperContent,
  WrapperLabelText,
  WrapperTextPrice,
  WrapperTextValue,
} from "./style";
import * as ProductService from "../../services/ProductService";

const NavBarComponent = () => {
  const [typeProducts, setTypeProducts] = useState([]);
  
  const fetchAllTypeProduct = async () => {
    const res = await ProductService.getAllTypeProduct();
    if (res?.status === "OK") {
      setTypeProducts(res?.data);
    }
  };

  useEffect(() => {
    fetchAllTypeProduct();
  }, []);

  const onChange = () => {};
  const renderContent = (type, options) => {
    switch (type) {
      case "text":
        return options.map((option, index) => {
          return <WrapperTextValue key={index}>{option}</WrapperTextValue>;
        });
      case "checkbox":
        return (
          <Checkbox.Group
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
            onChange={onChange}
          >
            {options.map((option, index) => (
              <Checkbox
                key={index}
                style={{ marginLeft: 0 }}
                value={option.value}
              >
                {option.label}
              </Checkbox>
            ))}
          </Checkbox.Group>
        );
      case "star": {
        return options.map((option, index) => {
          return (
            <div key={index} style={{ display: "flex", gap: "4px" }}>
              <Rate
                style={{ fontSize: "12px" }}
                disabled
                defaultValue={option}
              />
              <span> {`Tu ${option} sao`}</span>
            </div>
          );
        });
      }
      case "price":
        return options.map((option, index) => {
          return <WrapperTextPrice key={index}>{option}</WrapperTextPrice>;
        });

      default:
        return {};
    }
  };
  
  return (
    <div>
      <WrapperLabelText>Danh mục sản phẩm</WrapperLabelText>
      <WrapperContent>
        {renderContent("text", typeProducts)}
      </WrapperContent>
    </div>
  );
};

export default NavBarComponent;
