import React from "react";
import { Modal, Typography, Image, Divider, Button } from "antd";
import QRImage from '../../assets/images/QR.jpg';
import { QRWrapper, BankInfo, ButtonWrapper } from './style';

const { Title, Text } = Typography;

const QRPaymentComponent = ({ isOpen, onClose, totalAmount, onSuccess }) => {
  return (
    <Modal
      title="Thanh toán qua QR Code"
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={400}
    >
      <QRWrapper>
        <Title level={4}>Quét mã QR để thanh toán</Title>
        <Image
          width={200}
          src={QRImage}
          preview={false}
        />
        <BankInfo>
          <Text strong>Ngân hàng: Vietcombank</Text>
          <br />
          <Text>Số tài khoản: 9976504270</Text>
          <br />
          <Text>Tên tài khoản: DINH XUAN HUNG</Text>
          <Divider />
          <Text strong>Số tiền: {totalAmount} VNĐ</Text>
          <br />
          <Text type="secondary">(Vui lòng chuyển đúng số tiền)</Text>
        </BankInfo>
        <ButtonWrapper>
          <Button type="primary" onClick={onSuccess}>
            Tôi đã chuyển khoản
          </Button>
          <Button onClick={onClose}>Hủy</Button>
        </ButtonWrapper>
      </QRWrapper>
    </Modal>
  );
};

export default QRPaymentComponent;
