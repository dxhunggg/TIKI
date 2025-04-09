import styled from "styled-components";

export const WrapperHeaderUser = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const WrapperInfoUser = styled.div`
  .name-info {
    font-size: 13px;
    color: rgb(36, 36, 36);
    font-weight: bold;
    text-transform: uppercase;
  }
  .address,
  .phone-info,
  .delivery-info,
  .delivery-fee,
  .payment-info {
    color: rgba(0, 0, 0, 0.65);
    font-size: 13px;
    margin-top: 8px;
  }
  .name-delivery {
    color: rgb(234, 133, 0);
    font-weight: bold;
    text-transform: uppercase;
  }
  .status-payment {
    margin-top: 8px;
    color: rgb(234, 133, 0);
  }
`;

export const WrapperLabel = styled.div`
  color: rgb(36, 36, 36);
  font-size: 13px;
  text-transform: uppercase;
  margin-bottom: 15px;
`;

export const WrapperContentInfo = styled.div`
  height: 118px;
  width: 320px;
  background-color: #fff;
  border-radius: 6px;
  padding: 10px;
`;

export const WrapperStyleContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 20px;
`;

export const WrapperProduct = styled.div`
  display: flex;
  align-items: flex-start;
  margin-top: 10px;
  gap: 20px;
`;

export const WrapperNameProduct = styled.div`
  display: flex;
  align-items: center;
  width: 670px;

  img {
    width: 70px;
    height: 70px;
    object-fit: cover;
    margin-right: 10px;
    border: 1px solid #ccc;
  }

  .name {
    font-size: 14px;
  }
`;

export const WrapperItem = styled.div`
  width: 200px;
  font-size: 14px;
  font-weight: bold;
  text-align: center;

  &:last-child {
    color: red;
  }
`;

export const WrapperItemLabel = styled.div`
  width: 200px;
  font-size: 14px;
  font-weight: normal;
  text-align: center;

  &:last-child {
    font-weight: bold;
    color: red;
  }
`;

export const WrapperAllPrice = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  margin-top: 20px;

  .price-row {
    font-size: 14px;
    font-weight: bold;
    color: red;
    margin-top: 8px;
  }
`;
