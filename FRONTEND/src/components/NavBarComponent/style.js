import styled from "styled-components";

export const WrapperLabelText = styled.h4`
  color: #333333;
  font-size: 14px;
  font-weight: 500;
`;

export const WrapperTextValue = styled.span`
  color: #666666;
  font-size: 12px;
  font-weight: 400;
`;

export const WrapperContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px 0;
`;

export const WrapperTextPrice = styled.div`
  padding: 4px;
  border-radius: 10px;
  color: #666666;
  background-color: #f5f5f5;
  width: fit-content;
`;

export const WrapperTypeProduct = styled.div`
  color: ${(props) => (props.active === 'true' ? '#333333' : '#666666')};
  font-size: 12px;
  font-weight: ${(props) => (props.active === 'true' ? '500' : '400')};
  cursor: pointer;
  padding: 10px 12px;
  border-radius: 6px;
  background-color: ${(props) => (props.active === 'true' ? '#f0f0f0' : 'transparent')};
  transition: all 0.2s ease;
  &:hover {
    color: #333333;
    background-color: #f5f5f5;
  }
`;
