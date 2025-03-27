import React from "react";
import ProductDetailsComponent from "../../components/ProductDetailsComponent/ProductDetailsComponent";
import { useNavigate, useParams } from "react-router-dom";

const ProductDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  return (
    <div
      style={{ padding: "0 120px", background: "#efefef", height: "1000px" }}
    >
      <h5>
        <span
          onClick={() => {
            navigate("/");
          }}
          style={{ cursor: "pointer", fontWeight: "bold" }}
        >
          Trang chủ
        </span>{" "}
        - Chi tiết sản phẩm
      </h5>
      <ProductDetailsComponent idProduct={id} />
    </div>
  );
};

export default ProductDetailsPage;
