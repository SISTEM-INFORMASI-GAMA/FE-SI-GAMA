import { Button, Select, Space, Table, Tag } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTermOptions } from "../../../hooks/akademik/term/useTermOptions";
import { useTeacherClassSubjects } from "../../../hooks/akademik/guru/useTeacherClassSubjects";

const DashboardGuru = () => {
   const navigate = useNavigate();
   const [termId, setTermId] = useState();

   const { data: termResp, isFetching: termLoading } = useTermOptions();
   const termOptions = useMemo(() => {
      const arr = termResp?.data || termResp?.rows || [];
      return arr.map(t => ({ label: t.name || t.yearLabel || t.year || t.id, value: t.id }));
   }, [termResp]);


   // default termId is active term
   useEffect(() => {
      if (termOptions.length > 0 && !termId) {
         const activeTerm = termOptions.find((t) => t.isActive);
         setTermId(activeTerm?.value || termOptions[0].value);
      }
   }, [termOptions, termId]);

   const { data, isFetching } = useTeacherClassSubjects(termId);
   const rows = (data?.data || []).map((x, i) => ({
      key: x.id,
      index: i + 1,
      className: x.class?.name ?? '-',
      subjectName: x.subject?.name ?? '-',
      termId: x.termId || termId || null,
      id: x.id
   }));

   const columns = [
      { title: 'No', dataIndex: 'index', width: 60 },
      { title: 'Kelas', dataIndex: 'className' },
      { title: 'Mapel', dataIndex: 'subjectName' },
      {
         title: 'Aksi',
         dataIndex: 'id',
         width: 260,
         align: 'center',
         render: (_, row) => (
            <>
               <Tag
                  color="processing"
                  style={{ cursor: 'pointer' }}
                  onClick={() => navigate(`/dashboard/academic/guru/class-subjects/${row.id}/assessments?termId=${row.termId || ''}`)}
               >
                  Assessments
               </Tag>
            </>
         ),
      },
   ];

   return (
      <>
         <div className="table-header">
            <h1>Dashboard Guru</h1>
            <Space>
               <Select
                  placeholder="Pilih Term"
                  options={termOptions}
                  loading={termLoading}
                  value={termId}
                  onChange={setTermId}
                  style={{ minWidth: 240 }}
                  showSearch
                  filterOption={(i, o) => (o?.label ?? '').toString().toLowerCase().includes(i.toLowerCase())}
               />
               <Button onClick={() => window.location.reload()}>Refresh</Button>
            </Space>
         </div>

         <Table
            size="small"
            columns={columns}
            dataSource={rows}
            loading={isFetching}
            pagination={false}
            rowKey="id"
            scroll={{ y: '60vh', x: 900 }}
         />
      </>
   );
};

export default DashboardGuru;
