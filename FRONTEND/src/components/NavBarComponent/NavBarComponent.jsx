import React, { useEffect, useState } from "react";
import { Checkbox, Col, Rate, Row } from "antd";
import {
  WrapperContent,
  WrapperLabelText,
  WrapperTextPrice,
  WrapperTextValue,
  WrapperTypeProduct,
} from "./style";
import * as ProductService from "../../services/ProductService";
import { useLocation, useNavigate } from "react-router-dom";

const NavBarComponent = () => {
  const [typeProducts, setTypeProducts] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const currentType = location.state;
  
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
  
  const handleTypeClick = (type) => {
    navigate(`/product/${type}`, { state: type });
  };
  
  const renderContent = (type, options) => {
    switch (type) {
      case "text":
        return options.map((option, index) => {
          return (
            <WrapperTypeProduct 
              key={index} 
              active={currentType === option ? 'true' : 'false'}
              onClick={() => handleTypeClick(option)}
            >
              {option}
            </WrapperTypeProduct>
          );
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
