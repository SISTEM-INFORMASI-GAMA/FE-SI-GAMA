import { Button, Popconfirm, Select, Space, Table, Tag, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { useMemo, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { useTermOptions } from '../../../hooks/akademik/term/useTermOptions';
import { useCreateTeacherAssessment, useDeleteTeacherAssessment, useTeacherAssessments, useUpdateTeacherAssessment } from "../../../hooks/akademik/guru/useTeacherAssessments";
import AddAssessment from "../assessment/components/AddAssessment";
import EditAssessment from "../assessment/components/EditAssessment";


const AssessmentsGuru = () => {
  const { id: classSubjectId } = useParams();
  const [sp, setSp] = useSearchParams();
  const termId = sp.get('termId') || undefined;

  const { data: termResp, isFetching: termLoading } = useTermOptions();
  const termOptions = useMemo(() => {
    const arr = termResp?.data || termResp?.rows || [];
    return arr.map((t) => ({ label: t.name || t.yearLabel || t.year || t.id, value: t.id }));
  }, [termResp]);

  const { data, isLoading, refetch } = useTeacherAssessments(classSubjectId, termId, !!termId);
  const rows = (data?.data || []).map((x, i) => ({
    ...x, key: x.id, index: i + 1, dueDateFmt: x.dueDate ? dayjs(x.dueDate).format('YYYY-MM-DD') : '-',
  }));

  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [editRow, setEditRow] = useState(null);

  const createMut = useCreateTeacherAssessment(classSubjectId, termId);
  const updateMut = useUpdateTeacherAssessment(editRow?.id, ['teacher-assessments', classSubjectId, termId]);
  const delMut = useDeleteTeacherAssessment(null, ['teacher-assessments', classSubjectId, termId]);

  const handleCreate = async (payload) => {
    try {
      await createMut.mutateAsync(payload);
      message.success('Assessment dibuat.');
      setShowAdd(false);
      refetch();
    } catch (e) {
      message.error(e?.response?.data?.message || e.message);
    }
  };

  const handleUpdate = async (payload) => {
    try {
      await updateMut.mutateAsync(payload);
      message.success('Assessment diubah.');
      setShowEdit(false); setEditRow(null);
    } catch (e) {
      message.error(e?.response?.data?.message || e.message);
    }
  };

  const columns = [
    { title: 'No', dataIndex: 'index', width: 60 },
    { title: 'Judul', dataIndex: 'title' },
    { title: 'Tipe', dataIndex: 'type', width: 120, render:(v)=> v?.toUpperCase?.() || v },
    { title: 'Bobot', dataIndex: 'weight', width: 100, align:'center', render:(v)=> (v ?? 0) + '%' },
    { title: 'Jatuh Tempo', dataIndex: 'dueDateFmt', width: 140, align:'center' },
    {
      title: 'Aksi', dataIndex: 'id', width: 300, align:'center',
      render: (_, row) => (
        <>
          <Tag color="blue">
            <Link to={`/dashboard/academic/guru/assessments/${row.id}/scores`}>Input Nilai</Link>
          </Tag>
          <Tag color="geekblue" style={{ cursor:'pointer' }} onClick={()=> { setEditRow(row); setShowEdit(true); }}>Ubah</Tag>
          <Popconfirm title="Hapus assessment?" onConfirm={() => delMut.mutateAsync(row.id).catch(e => message.error(e?.response?.data?.message || e.message))}>
            <Tag color="magenta" style={{ cursor:'pointer' }}>Hapus</Tag>
          </Popconfirm>
        </>
      )
    }
  ];

  return (
    <>
      <div className="table-header">
        <h1>Assessments (Guru)</h1>
        <Space>
          <Select
            placeholder="Pilih Term"
            options={termOptions}
            loading={termLoading}
            value={termId}
            onChange={(v)=> setSp({ termId: v }, { replace: true })}
            style={{ minWidth: 240 }}
            showSearch
            filterOption={(i,o)=> (o?.label ?? '').toString().toLowerCase().includes(i.toLowerCase())}
          />
          <Button type="primary" icon={<PlusOutlined />} onClick={()=> setShowAdd(true)} disabled={!termId}>
            Tambah
          </Button>
        </Space>
      </div>

      <Table
        size="small"
        columns={columns}
        dataSource={rows}
        loading={isLoading}
        pagination={false}
        rowKey="id"
        scroll={{ y: '60vh', x: 1000 }}
      />

      <AddAssessment
        open={showAdd}
        onClose={()=> setShowAdd(false)}
        onSubmit={(payload)=> handleCreate({ ...payload, termId })}
      />
      <EditAssessment
        open={showEdit}
        onClose={(ok)=> { setShowEdit(false); if (ok) refetch(); }}
        data={editRow}
        onSubmit={handleUpdate}
      />
    </>
  );
};

export default AssessmentsGuru;
