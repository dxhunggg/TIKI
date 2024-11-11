import React from "react";
import { Image } from "antd";
import { WrapperSliderStyle } from "./style";
const SliderComponent = ({ arrImages }) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 1000,
  };

  return (
    <WrapperSliderStyle {...settings}>
      {arrImages.map((image, index) => (
        <Image
          key={index}
          src={image}
          alt={`Slide ${index + 1}`}
          preview={false}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      ))}
    </WrapperSliderStyle>
  );
};

export default SliderComponent;
