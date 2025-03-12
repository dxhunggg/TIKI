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
    autoplaySpeed: 2000,
  };

  return (
    <WrapperSliderStyle {...settings}>
      {arrImages.map((image, index) => (
        <div key={index}>
          <Image
            src={image}
            alt={`Slide ${index + 1}`}
            preview={false}
            width={1000}
            height={274}
          />
        </div>
      ))}
    </WrapperSliderStyle>
  );
};

export default SliderComponent;