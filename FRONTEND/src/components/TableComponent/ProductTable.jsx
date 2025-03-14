import { Divider, Radio, Table } from "antd";
import React, { useState } from "react";
import Loading from "../LoadingComponent/Loading";

const ProductTable = (props) => {
  const {
    selectionType = "checkbox",
    data = [],
    isLoading = false,
    columns = [],
  } = props;

  
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(
        `selectedRowKeys: ${selectedRowKeys}`,
        "selectedRows: ",
        selectedRows
      );
    },
    getCheckboxProps: (record) => ({
      disabled: record.name === "Disabled User",
      name: record.name,
    }),
  };
  return (
    <Loading isLoading={isLoading}>
      <Table
        rowSelection={{ type: selectionType, ...rowSelection }}
        columns={columns}
        dataSource={data}
      />
    </Loading>
  );
};

export default ProductTable;
