import styled from "styled-components";
import Slider from "react-slick"; // Import Slider từ react-slick

export const WrapperSliderStyle = styled(Slider)`
  width: 100%;
  max-width: 1000px; /* Đặt chiều rộng tối đa cho slider */
  margin: 0 auto;
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
    bottom: -2px !important;
    li {
      button {
        &::before {
          color: rgba(255, 255, 255, 0.5);
        }
      }
    }
    li.slick-active {
      button {
        &::before {
          color: #fff;
        }
      }
    }
    .slick-slide {
      display: flex !important;
      justify-content: center;
    }
  }
`;
