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
  const [limit, setLimit] = useState(6);
  const [loading, setLoading] = useState(false);
  const [typeProducts, setTypeProducts] = useState([]);
  const fetchProductAll = async (context) => {
    const limit = context?.queryKey && context?.queryKey[1];
    const search = context?.queryKey && context?.queryKey[2];

    const res = await ProductService.getAllProduct(search, limit);

    return res;
  };

  const {
    isLoading,
    data: products,
    isPreviousData,
  } = useQuery({
    queryKey: ["products", limit, searchDebounce],
    queryFn: fetchProductAll,
    retry: 3,
    retryDelay: 1000,
    keepPreviousData: true,
  });

  const fetchAllTypeProduct = async () => {
    const res = await ProductService.getAllTypeProduct();
    if (res?.status === "OK") {
      setTypeProducts(res?.data);
    }
  };
  useEffect(() => {
    fetchAllTypeProduct();
  }, []);
  return (
    <Loading isLoading={loading}>
      <div style={{ width: "1270px", margin: "0 auto" }}>
        <WrapperTypeProduct>
          {typeProducts.map((item) => {
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
                  key={product._id || index}
                  countInStock={product.countInStock}
                  description={product.description}
                  image={product.image}
                  name={product.name}
                  price={product.price}
                  rating={product.rating}
                  type={product.type}
                  sold={product.sold}
                  discount={product.discount}
                  id={product._id}
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
              onClick={() => setLimit((prev) => prev + 6)}
              textButton={isPreviousData ? "Load more" : "Xem thêm"}
              type="outline"
              styleButton={{
                border: `1px solid ${
                  products?.totalProducts === products?.data?.length
                    ? "#ccc"
                    : "rgb(11,116,229)"
                }`,
                color: `${
                  products?.totalProducts === products?.data?.length
                    ? "#ccc"
                    : "rgb(11,116,229)"
                }`,
                width: "240px",
                height: "38px",
                borderRadius: "4px",
              }}
              disabled={
                products?.totalProducts === products?.data?.length ||
                products?.totalPages === 1
              }
              styleTextButton={{
                fontWeight: 500,
                color:
                  products?.totalProducts === products?.data?.length
                    ? "#fff"
                    : "rgb(11,116,229)",
              }}
            />
          </div>
        </div>
      </div>
    </Loading>
  );
};

export default HomePage;
