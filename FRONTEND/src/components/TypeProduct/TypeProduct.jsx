import React from "react";
import { useNavigate } from "react-router-dom";
import { WrapperType } from "./style";

const TypeProduct = ({ name }) => {
  const navigate = useNavigate();
  const handleNavigateType = (type) => {
    navigate(
      `/product/${type
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        ?.replace(/ /g, "_")}`,
      { state: type }
    );
  };
  return (
    <WrapperType onClick={() => handleNavigateType(name)}>{name}</WrapperType>
  );
};

export default TypeProduct;
