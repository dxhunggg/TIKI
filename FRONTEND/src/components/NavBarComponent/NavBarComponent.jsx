import React from "react";
import { Checkbox, Col, Rate, Row } from "antd";
import {
  WrapperContent,
  WrapperLabelText,
  WrapperTextPrice,
  WrapperTextValue,
} from "./style";

const NavBarComponent = () => {
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
              <Checkbox key={index} style={{ marginLeft: 0 }} value={option.value}>
                {option.lable}
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
      <WrapperLabelText>Label</WrapperLabelText>
      <WrapperContent>
        {renderContent("text", ["Tu lanh", "TV", "May giat"])}
      </WrapperContent>
    </div>
  );
};

export default NavBarComponent;
