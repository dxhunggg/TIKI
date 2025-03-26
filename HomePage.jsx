import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import axios from 'axios';

const HomePage = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['product'],
    queryFn: async () => {
      try {
        const response = await axios.get('/api/products');
        return response.data;
      } catch (error) {
        console.error('Error fetching products:', error);
        return [];
      }
    },
  });

  if (isLoading) {
    return <div>Đang tải...</div>;
  }

  if (!data) {
    return <div>Không có dữ liệu</div>;
  }

  return (
    <div>
      {/* Render your component content here */}
    </div>
  );
};

export default HomePage; 