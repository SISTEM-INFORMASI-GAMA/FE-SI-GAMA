import { Button, Popconfirm, Select, Space, Table, Tag, message } from 'antd';
import { PlusOutlined, LockOutlined, CloudUploadOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { useMemo, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { useTermOptions } from '../../../hooks/akademik/term/useTermOptions';
import {
  useCreateTeacherAssessment,
  useDeleteTeacherAssessment,
  useTeacherAssessments,
  useUpdateTeacherAssessment,
} from "../../../hooks/akademik/guru/useTeacherAssessments";
import AddAssessment from "../assessment/components/AddAssessment";
import EditAssessment from "../assessment/components/EditAssessment";
import { useLockAssessment, usePublishAssessment } from "../../../hooks/akademik/assessment/useAssessments";

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
  const updateMut = useUpdateTeacherAssessment(['teacher-assessments', classSubjectId, termId]);
  const delMut = useDeleteTeacherAssessment(['teacher-assessments', classSubjectId, termId]);
  
  // Fitur Lock & Publish untuk Guru
  const lockMut = useLockAssessment(['teacher-assessments', classSubjectId, termId]);
  const pubMut = usePublishAssessment(['teacher-assessments', classSubjectId, termId]);

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
      await updateMut.mutateAsync({ id: editRow?.id, payload });
      message.success('Assessment diubah.');
      setShowEdit(false);
      setEditRow(null);
      refetch();
    } catch (e) {
      message.error(e?.response?.data?.message || e.message);
    }
  };

  const handleCancelEdit = () => {
    setShowEdit(false);
    setEditRow(null);
  }

  const columns = [
    { title: 'No', dataIndex: 'index', width: 60 },
    { title: 'Judul', dataIndex: 'title' },
    { title: 'Tipe', dataIndex: 'type', width: 120, render: (v) => v?.toUpperCase?.() || v },
    { title: 'Bobot', dataIndex: 'weight', width: 80, align: 'center', render: (v) => (v ?? 0) + '%' },
    { title: 'Jatuh Tempo', dataIndex: 'dueDateFmt', width: 120, align: 'center' },
    {
      title: 'Status',
      dataIndex: 'state',
      width: 110,
      align: 'center',
      render: (v) => (
        <Tag color={v === 'published' ? 'green' : v === 'locked' ? 'orange' : 'default'}>
          {(v || 'draft').toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Aksi',
      dataIndex: 'id',
      width: 450, // Diperlebar untuk menampung tombol baru
      align: 'center',
      render: (_, row) => (
        <Space size={2} wrap>
          {/* Input Nilai */}
          <Tag color="blue" style={{ cursor: 'pointer' }}>
            <Link to={`/dashboard/academic/guru/assessments/${row.id}/scores`}>Nilai</Link>
          </Tag>

          {/* Ubah */}
          <Tag
            color="geekblue"
            style={{ cursor: 'pointer' }}
            onClick={() => { setEditRow(row); setShowEdit(true); }}
          >
            Ubah
          </Tag>

          {/* Lock Action */}
          <Tag
            color="orange"
            style={{ cursor: 'pointer', opacity: row.state === 'locked' ? 0.5 : 1 }}
            onClick={() => {
              if (row.state === 'locked') return;
              lockMut.mutateAsync(row.id)
                .then(() => { message.success('Assessment dikunci'); refetch(); })
                .catch(e => message.error(e?.response?.data?.message || e.message));
            }}
          >
            <LockOutlined /> Lock
          </Tag>

          {/* Publish Action */}
          <Tag
            color="green"
            style={{ cursor: 'pointer', opacity: row.state === 'published' ? 0.5 : 1 }}
            onClick={() => {
              if (row.state === 'published') return;
              pubMut.mutateAsync(row.id)
                .then(() => { message.success('Assessment dipublikasi'); refetch(); })
                .catch(e => message.error(e?.response?.data?.message || e.message));
            }}
          >
            <CloudUploadOutlined /> Publish
          </Tag>

          {/* Hapus */}
          <Popconfirm
            title="Hapus assessment?"
            onConfirm={() => {
              delMut.mutateAsync(row.id)
                .then(() => {
                  message.success('Berhasil dihapus');
                  refetch();
                })
                .catch(e => message.error(e?.response?.data?.message || e.message));
            }}
          >
            <Tag color="magenta" style={{ cursor: 'pointer' }}>Hapus</Tag>
          </Popconfirm>
        </Space>
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
            onChange={(v) => setSp({ termId: v }, { replace: true })}
            style={{ minWidth: 240 }}
            showSearch
            filterOption={(i, o) => (o?.label ?? '').toString().toLowerCase().includes(i.toLowerCase())}
          />
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setShowAdd(true)} disabled={!termId}>
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
        scroll={{ y: '60vh', x: 1100 }}
      />

      <AddAssessment
        open={showAdd}
        onClose={() => setShowAdd(false)}
        onSubmit={(payload) => handleCreate({ ...payload, termId })}
      />

      <EditAssessment
        key={editRow?.id || 'new'}
        open={showEdit}
        onClose={handleCancelEdit}
        data={editRow}
        onSubmit={handleUpdate}
      />
    </>
  );
};

export default AssessmentsGuru;