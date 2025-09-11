import { Button, Empty, Input, Popconfirm, Select, Space, Table, Tag, message } from 'antd';
import { PlusOutlined, SearchOutlined, SettingOutlined } from '@ant-design/icons';
import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDebounce } from 'use-debounce';

import { useClassSubjectsPagination } from '../../../../hooks/akademik/class-subject/useClassSubjectsPagination';
import { useAddClassSubject, useDeleteClassSubject } from '../../../../hooks/akademik/class-subject/useMutationsClassSubject';
import { useSubjectOptions } from '../../../../hooks/akademik/subject/useSubjectOptions';

import PolicyDrawer from '../components/PolicyDrawer';
import propTypes from 'prop-types';

const ClassSubjects = ({ headerExtras }) => {
   const { id: classId } = useParams();
   // search & pagination
   const [keyword, setKeyword] = useState('');
   const [search] = useDebounce(keyword, 400);
   const [pageState, setPageState] = useState({ current_page: 1, per_page: 10 });

   const { data, isLoading, isFetching, refetch } = useClassSubjectsPagination(
      classId,
      pageState,
      search,
      { sortBy: 'subject.name', sortDir: 'ASC' }
   );

   // add subject
   const [subjectSearch, setSubjectSearch] = useState('');
   const { data: subjectResp, isFetching: loadingSubj } = useSubjectOptions(subjectSearch);
   const subjectOptions = useMemo(() => {
      const arr = Array.isArray(subjectResp?.data) ? subjectResp.data : (subjectResp?.rows || []);
      return (arr || []).map((s) => ({ label: `${s.code} — ${s.name}`, value: s.id }));
   }, [subjectResp]).filter((s) => {
      // filter out subjects already in class
      const existing = (data?.data?.rows || []).map((x) => x.subject?.id).filter((x) => !!x);
      return !existing.includes(s.value);
   });
   const [selectedSubjectId, setSelectedSubjectId] = useState();
   const addMut = useAddClassSubject(classId);

   // delete subject
   const delMut = useDeleteClassSubject(classId);

   // grading policy drawer
   const [policyOpen, setPolicyOpen] = useState(false);
   const [activeClassSubjectId, setActiveClassSubjectId] = useState(null);

   const klas = data?.data?.class; // {id, name}
   const rowsRaw = data?.data?.rows || [];
   const rows = rowsRaw.map((x, i) => ({
      key: x.id,
      id: x.id,
      index: (pageState.current_page - 1) * pageState.per_page + (i + 1),
      subjectName: x.subject?.name ?? '-',
      subjectCode: x.subject?.code ?? '-',
   }));

   const totalItems = data?.meta?.total ?? rowsRaw.length ?? 0;

   const columns = [
      { title: 'No', dataIndex: 'index', width: 60 },
      { title: 'Nama Mapel', dataIndex: 'subjectName' },
      { title: 'Kode', dataIndex: 'subjectCode', width: 140 },
      {
         title: 'Aksi',
         dataIndex: 'id',
         width: 260,
         align: 'center',
         render: (id) => (
            <>
               <Tag
                  color="geekblue"
                  icon={<SettingOutlined />}
                  style={{ cursor: 'pointer' }}
                  onClick={() => { setActiveClassSubjectId(id); setPolicyOpen(true); }}
               >
                  Grading Policy
               </Tag>
               <Popconfirm
                  title="Hapus mapel dari kelas?"
                  okText="Hapus"
                  cancelText="Batal"
                  onConfirm={() =>
                     delMut.mutate(id, {
                        onSuccess: () => message.success('Relasi dihapus'),
                        onError: (e) => message.error(e?.response?.data?.message || e.message),
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
   ];

   const pagination = {
      current: pageState.current_page,
      pageSize: pageState.per_page,
      total: totalItems,
      showSizeChanger: true,
      pageSizeOptions: [10, 20, 50, 100],
      onChange: (curr, size) => setPageState({ current_page: curr, per_page: size }),
   };

   const handleAdd = async () => {
      if (!selectedSubjectId) return message.warning('Pilih mapel dulu.');
      addMut.mutate(
         { subjectId: selectedSubjectId },
         {
            onSuccess: () => { message.success('Mapel ditambahkan'); setSelectedSubjectId(undefined); refetch(); },
            onError: (e) => message.error(e?.response?.data?.message || e.message),
         }
      );
   };

   return (
      <>
         <div className="table-header">
            <div className="flex gap-2">
               <h1>Mapel Kelas</h1>
               <div style={{ color: '#666' }}>
                  <b>{klas?.name ?? '-'}</b>
                  {headerExtras ? <> · {headerExtras}</> : null}
               </div>
            </div>

            <Space>
               <Select
                  showSearch allowClear
                  style={{ minWidth: 360 }}
                  placeholder="Cari & pilih mapel untuk ditambahkan"
                  options={subjectOptions}
                  value={selectedSubjectId}
                  onSearch={(v) => setSubjectSearch(v)}
                  onChange={(v) => setSelectedSubjectId(v)}
                  filterOption={false}
                  loading={loadingSubj}
               />
               <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd} loading={addMut.isLoading}>
                  Tambah
               </Button>
            </Space>
         </div>

         <Input
            prefix={<SearchOutlined />}
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Cari (nama/kode mapel)"
            allowClear
            style={{ border: '1px solid #d9d9d9', margin: '10px 0' }}
         />

         <Table
            size="small"
            columns={columns}
            dataSource={rows}
            loading={isLoading || isFetching || delMut.isLoading}
            pagination={pagination}
            locale={{
               emptyText: (
                  <Empty
                     description={
                        <span>
                           Belum ada mapel di kelas ini. <br /> Tambahkan mapel lewat tombol di kanan atas.
                        </span>
                     }
                  />
               ),
            }}
            scroll={{ y: '50vh', x: 800 }}
            rowKey="id"
         />

         <PolicyDrawer
            open={policyOpen}
            onClose={() => { setPolicyOpen(false); setActiveClassSubjectId(null); }}
            classSubjectId={activeClassSubjectId}
         />
      </>
   );
};

ClassSubjects.propTypes = {
   headerExtras: propTypes.string.isRequired,
};

export default ClassSubjects;