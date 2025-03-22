import React, { useEffect, useRef, useState } from "react";
import TypeProduct from "../../components/TypeProduct/TypeProduct";
import {
  WrapperButtonMore,
  WrapperProducts,
  WrapperTypeProduct,
} from "./style";
import SliderComponent from "../../components/SliderComponent/SliderComponent";
import slide1 from "../../assets/images/slide1.png";
import slide2 from "../../assets/images/slide2.png";
import slide3 from "../../assets/images/slide3.png";
import CardComponent from "../../components/CardComponent/CardComponent";
import { useQuery } from "@tanstack/react-query";
import * as ProductService from "../../services/ProductService";
import { useSelector } from "react-redux";
import { useDebounce } from "../../hooks/useDebounce";
import Loading from "../../components/LoadingComponent/Loading";
const HomePage = () => {
  const searchProduct = useSelector((state) => state?.product?.search);
  const searchDebounce = useDebounce(searchProduct, 1000);
  const refSearch = useRef();
  const [stateProduct, setStateProduct] = useState("");
  const [loading, setLoading] = useState(false);
  const arr = ["TV", "Tủ lạnh", "Laptop"];
  const fetchProductAll = async (search) => {
    try {
      const res = await ProductService.getAllProduct(search);
      return res;
    } catch (error) {
      console.error("Error fetching products:", error);
      return { data: [] };
    }
  };
  useEffect(() => {
    if (refSearch.current) {
      setLoading(true);
      const fetchSearch = async () => {
        const res = await fetchProductAll(searchDebounce);
        setStateProduct(res?.data || []);
        setLoading(false);
      };
      fetchSearch();
    }
    refSearch.current = true;
  }, [searchDebounce]);
  const { isLoading, data: products } = useQuery({
    queryKey: ["product"],
    queryFn: () => fetchProductAll(),
    retry: 3,
    retryDelay: 1000,
  });
  useEffect(() => {
    if (products?.data?.length > 0) {
      setStateProduct(products?.data);
    }
  }, [products]);
  return (
    <Loading isLoading={loading}>
      <div style={{ width: "1270px", margin: "0 auto" }}>
        <WrapperTypeProduct>
          {arr.map((item) => {
            return <TypeProduct key={item} name={item} />;
          })}
        </WrapperTypeProduct>
      </div>
      <div
        className="body"
        style={{ width: "100%", backgroundColor: "#efefef" }}
      >
        <div
          id="container"
          style={{
            width: "1270px",
            margin: "0 auto",
          }}
        >
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              marginTop: "20px",
              marginBottom: "20px",
            }}
          >
            <SliderComponent arrImages={[slide1, slide2, slide3]} />
          </div>
          <WrapperProducts>
            {products?.data?.map((product, index) => {
              return (
                <CardComponent
                  key={product.id || index}
                  countInStock={product.countInStock}
                  description={product.description}
                  image={product.image}
                  name={product.name}
                  price={product.price}
                  rating={product.rating}
                  type={product.type}
                  sold={product.sold}
                  discount={product.discount}
                />
              );
            })}
          </WrapperProducts>
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              marginTop: "10px",
            }}
          >
            <WrapperButtonMore
              textButton="Xem thêm"
              type="ouline"
              styleButton={{
                border: "1px solid rgb(11,116,239)",
                color: "rgb(11,116,239) ",
                width: "240px",
                height: "38px",
                borderRadius: "4px",
              }}
              styleTextButton={{ fontWeight: 500 }}
            />
          </div>
        </div>
      </div>
    </Loading>
  );
};

export default HomePage;
