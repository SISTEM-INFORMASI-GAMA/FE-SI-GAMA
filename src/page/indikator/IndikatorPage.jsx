import { useState } from "react";
import { useIndikatorPagination } from "../../hooks/indikator/useIndikatorPagination";
import { Table } from "antd";
import './IndikatorPage.css'; 

const IndikatorPage = () => {
   const [dataTable, setDataTable] = useState({
      current_page: 1,
      per_page: 15,
      total: 0,
   });

   const { data, isLoading, isFetching } = useIndikatorPagination(dataTable, '');

   const columns = [
      { title: 'No', dataIndex: 'index', align: 'left', width: 60 },
      { title: 'Aspek', dataIndex: 'aspek', align: 'left', width: 70 },
      { title: 'Indikator', dataIndex: 'indikator', align: 'left', width: 80 },
      { title: 'Nama Indikator Domain Kebijakan SPBE', dataIndex: 'nama', align: 'left', width: 150 },
      { title: 'Penanggung Jawab', dataIndex: 'penanggungJawab', align: 'left' },
      { title: 'Penjelasan', dataIndex: 'penjelasan', align: 'left' },
      { title: 'Data Pendukung', dataIndex: 'dataPendukung', align: 'left' },
      { title: 'Tingkat Kematangan', dataIndex: 'tingkatKematangan', align: 'left' },
   ];

   const dataSource = data?.data?.slice(0, dataTable.per_page).map((x, i) => ({
      ...x,
      key: x._id,
      index: i + 1,
   }));

   const pagination = {
      current: dataTable.current_page,
      pageSize: dataTable.per_page,
      total: data?.data?.total,
      showSizeChanger: true,
      pageSizeOptions: [15, 20, 50, 100],
      onChange: (curr, size) => setDataTable(prev => ({
         ...prev,
         current_page: curr,
         per_page: size,
      })),
   };

   return (
      <div>
         <Table
            size='small'
            tableLayout='auto'
            columns={columns}
            loading={isLoading || isFetching}
            dataSource={dataSource}
            pagination={pagination}
            scroll={{ y: '50vh', x: 800 }}
            style={{ height: 'fit-content' }}
         />
         <div className="keterangan-container">
            <h2>KETERANGAN</h2>
            <hr />
            <div className="domain">
               <h3>Domain 1 : Kebijakan SPBE </h3>
               <p>1. Aspek 1 : Kebijakan Internal Tata Kelola SPBE;</p>
            </div>
            <div className="domain">
               <h3>Domain 2 : Tata Kelola SPBE</h3>
               <p>1. Aspek 2 : Perencanaan Strategis SPBE;</p>
               <p>2. Aspek 3 : Teknologi Informasi dan Komunikasi;</p>
               <p>3. Aspek 4 : Penyelenggara SPBE;</p>
            </div>
            <div className="domain">
               <h3>Domain 3 : Manajemen SPBE</h3>
               <p>1. Aspek 5 : Penerapan Manajemen SPBE</p>
               <p>2. Aspek 6 : Pelaksanaan Audit TIK</p>
            </div>
            <div className="domain">
               <h3>Domain 4 : Layanan SPBE</h3>
               <p>1. Aspek 7 : Layanan Administrasi Pemerintahan Berbasis Elektronik</p>
               <p>2. Aspek 8 : Layanan Publik Berbasis Elektronik</p>
            </div>
         </div>
      </div>
   );
}

export default IndikatorPage;
