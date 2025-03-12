import styled from "styled-components";
import Slider from "react-slick";

export const WrapperSliderStyle = styled(Slider)`
  width: 1000px;

  .slick-slide {
    width: 1000px;
    
    img {
      width: 1000px;
      height: 274px;
      margin: 0 auto;
    }
  }
  
  & .slick-arrow.slick-prev {
    left: 12px;
    top: 50%;
    z-index: 10;
    &::before {
      font-size: 40px;
      color: #fff;
    }
  }
  & .slick-arrow.slick-next {
    right: 28px;
    top: 50%;
    z-index: 10;
    &::before {
      font-size: 40px;
      color: #fff;
    }
  }
  & .slick-dots {
    z-index: 10;
    bottom: 10px !important;
    li {
      button {
        &::before {
          color: white !important;
        }
      }
    }
    li.slick-active {
      button {
        &::before {
          color: #fff !important;
        }
      }
    }
  }
`;