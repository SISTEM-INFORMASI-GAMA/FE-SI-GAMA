import { Button, Input, Space, Table, Tag, Popconfirm } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useCallback, useMemo, useState } from 'react';
import { useDebounce } from 'use-debounce';
import dayjs from 'dayjs';
import { useTermPagination } from '../../../../hooks/akademik/term/useTermPagination';
import AddTerm from '../add/AddTerm';
import EditTerm from '../edit/EditTerm';
import { DeleteApi } from '../../../../services/DeleteApi';

const isActive = (startDate, endDate) => {
   const now = dayjs().startOf('day');
   const s = dayjs(startDate);
   const e = dayjs(endDate);
   return (now.isAfter(s, 'day') || now.isSame(s, 'day')) &&
      (now.isBefore(e, 'day') || now.isSame(e, 'day'));
};

const Term = () => {
   const [dataId, setDataId] = useState('');
   const [showAdd, setShowAdd] = useState(false);
   const [showEdit, setShowEdit] = useState(false);

   const [tableState, setTableState] = useState({
      current_page: 1,
      per_page: 15,
      total: 0,
   });

   const [keyword, setKeyword] = useState('');
   const [search] = useDebounce(keyword, 500);

   const { data, isLoading, isFetching, refetch } = useTermPagination(
      tableState,
      search,
      { sortBy: 'startDate', sortDir: 'ASC' }
   );

   const onCreate = useCallback(() => {
      setShowAdd(false);
      refetch();
   }, [refetch]);

   const onUpdate = useCallback(() => {
      setShowEdit(false);
      refetch();
   }, [refetch]);

   const onCancel = () => {
      setShowAdd(false);
      setShowEdit(false);
      setDataId('');
   };

   const columns = useMemo(() => ([
      {
         title: 'No',
         dataIndex: 'index',
         align: 'left',
         width: window.innerWidth > 800 ? 70 : 50,
         fixed: 'left',
      },
      {
         title: 'Nama',
         dataIndex: 'name',
         align: 'left',
         width: 160,
      },
      {
         title: 'Tahun Ajar',
         dataIndex: 'yearLabel',
         align: 'left',
         width: 120,
      },
      {
         title: 'Mulai',
         dataIndex: 'startDate',
         align: 'center',
         width: 110,
         render: (v) => dayjs(v).format('YYYY-MM-DD'),
      },
      {
         title: 'Selesai',
         dataIndex: 'endDate',
         align: 'center',
         width: 110,
         render: (v) => dayjs(v).format('YYYY-MM-DD'),
      },
      {
         title: 'Status',
         dataIndex: 'status',
         align: 'center',
         width: 110,
         render: (_, row) =>
            isActive(row.startDate, row.endDate) ? (
               <Tag color="green" className="tag-round">Aktif</Tag>
            ) : (
               <Tag color="default" className="tag-round">Nonaktif</Tag>
            ),
      },
      {
         title: 'Aksi',
         dataIndex: 'id',
         align: 'center',
         width: window.innerWidth > 800 ? 260 : 200,
         render: (id) => (
            <>
               <Tag
                  color="orange"
                  style={{ cursor: 'pointer' }}
                  onClick={() => { setDataId(id); setShowEdit(true); }}
               >
                  Ubah
               </Tag>
               <Popconfirm
                  title="Yakin ingin menghapus term ini?"
                  okText="Hapus"
                  cancelText="Batal"
                  onConfirm={() =>
                     DeleteApi({
                        url: '/api/v1/terms/',
                        dataId: id,
                        refetch,
                     })
                  }
               >
                  <Tag color="magenta" style={{ cursor: 'pointer' }}>
                     Hapus
                  </Tag>
               </Popconfirm>
            </>
         ),
      },
   ]), [refetch]);

   // Backend mengirim array rows & meta pagination
   const rows = useMemo(() => {
      // data.data bisa array langsung, atau data.data: rows
      const list = Array.isArray(data?.data) ? data?.data : data?.data ?? [];
      return list.slice(0, tableState.per_page).map((x, i) => ({
         ...x,
         key: x.id,
         index: (tableState.current_page - 1) * tableState.per_page + (i + 1),
      }));
   }, [data, tableState]);

   const totalItems = useMemo(() => {
      return data?.meta?.total ?? data?.data?.total ?? data?.total ?? 0;
   }, [data]);

   const pagination = {
      current: tableState.current_page,
      pageSize: tableState.per_page,
      total: totalItems,
      showSizeChanger: true,
      pageSizeOptions: [15, 20, 50, 100],
      onChange: (curr, size) => setTableState((prev) => ({
         ...prev, current_page: curr, per_page: size,
      })),
   };

   return (
      <>
         <div className="table-header">
            <h1>Daftar Semester</h1>
            <Space>
               <Button type="primary" onClick={() => setShowAdd(true)}>
                  Tambah Semester
               </Button>
            </Space>
         </div>

         <Input
            prefix={<SearchOutlined />}
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Cari Semester (nama/tahun ajar)"
            className="search-input-billings"
            style={{ border: '1px solid #d9d9d9', marginBottom: 10, marginTop: 10 }}
            allowClear
         />

         <Table
            size="small"
            tableLayout="auto"
            columns={columns}
            loading={isLoading || isFetching}
            dataSource={rows}
            pagination={pagination}
            scroll={{ y: '50vh', x: 900 }}
            rowKey="id"
         />

         <AddTerm show={showAdd} onCreate={onCreate} onCancel={onCancel} />
         <EditTerm id={dataId} show={showEdit} onUpdate={onUpdate} onCancel={onCancel} />
      </>
   );
};

export default Term;
