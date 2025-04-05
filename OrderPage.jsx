const calculateShippingFee = () => {
    const totalAmount = calculateTotal();
    if (totalAmount >= 500000) return 0;
    if (totalAmount >= 200000) return 10000;
    return 20000;
}; 