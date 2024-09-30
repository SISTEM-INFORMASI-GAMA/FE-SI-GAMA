import { useState } from "react";
import { useRegulasiPagination } from "../../hooks/regulasi/useRegulasiPagination";
import { Table } from "antd";
import './RegulasiPage.css';

const RegulasiPage = () => {
   const [dataTable, setDataTable] = useState({
      current_page: 1,
      per_page: 15,
      total: 0,
   });

   const { data, isLoading, isFetching } = useRegulasiPagination(
      dataTable,
      ''
   );

   const columns = [
      {
         title: 'No',
         dataIndex: 'index',
         align: 'left',
         width: 60,
      },
      {
         title: 'Kategori', dataIndex: 'kategori', align: 'left',
      },
      { title: 'Title', dataIndex: 'title', align: 'left' },
      { title: 'Content', dataIndex: 'content', align: 'left' },
      {
         title: 'File', dataIndex: 'file', align: 'left',
         render: (text, record) => (
            // download button
            <a className="download-button" href={record.file} download>Download</a>
         )
      },
   ];

   const dataSource = data?.data?.slice(0, dataTable.per_page).map((x, i) => {
      return {
         ...x,
         key: x._id,
         index: i + 1,
      };
   });

   const pagination = {
      current: dataTable.current_page,
      pageSize: dataTable.per_page,
      total: data?.data?.total,
      showSizeChanger: true,
      pageSizeOptions: [15, 20, 50, 100],
      onChange: (curr, size) => {
         setDataTable((prev) => {
            return {
               ...prev,
               current_page: curr,
               per_page: size,
            };
         });
      },
   };
   return (
      <div>
         <div>
            <Table
               size='small'
               tableLayout='auto'
               columns={columns}
               loading={isLoading || isFetching}
               dataSource={dataSource}
               pagination={pagination}
               scroll={{
                  y: '50vh',
                  x: 800,
               }}
               style={{
                  height: 'fit-content',
               }}
            />
         </div>
      </div>
   )
}

export default RegulasiPage