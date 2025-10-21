import { Button, Input, InputNumber, Space, Table, Tag, message } from 'antd';
import { SaveOutlined, SearchOutlined } from '@ant-design/icons';
import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDebounce } from 'use-debounce';
import { useBulkUpsertTeacherScores, useTeacherScores } from "../../../hooks/akademik/guru/useTeacherScores";

const ScoresGuru = () => {
  const { id: assessmentId } = useParams();
  const [keyword, setKeyword] = useState('');
  const [search] = useDebounce(keyword, 400);
  const [pageState, setPageState] = useState({ current_page: 1, per_page: 25 });

  const { data, isLoading, isFetching } = useTeacherScores(assessmentId, pageState, search);
  const bulkMut = useBulkUpsertTeacherScores(assessmentId);

  const [draft, setDraft] = useState({});
  const rows = useMemo(() => (data?.data || []).map((x, i) => ({
    ...x, key: x.studentId, index: (pageState.current_page-1)*pageState.per_page + (i+1),
  })), [data, pageState]);

  const totalItems = data?.meta?.total ?? 0;

  const updateDraft = (studentId, patch) => {
    setDraft((prev) => ({ ...prev, [studentId]: { ...(prev[studentId] || {}), ...patch } }));
  };

  const columns = [
    { title: '#', dataIndex: 'index', width: 60 },
    { title: 'NIS', dataIndex: 'nis', width: 120 },
    { title: 'Nama', dataIndex: 'name' },
    {
      title: 'Nilai', dataIndex: 'score', width: 120, align: 'center',
      render: (v, row) => (
        <InputNumber
          min={0} max={100} style={{ width:'100%' }}
          value={(draft[row.studentId]?.score ?? v) ?? null}
          onChange={(val)=> updateDraft(row.studentId, { score: val })}
        />
      ),
    },
    {
      title: 'Catatan', dataIndex: 'note',
      render: (v, row) => (
        <Input
          placeholder="opsional"
          value={draft[row.studentId]?.note ?? v ?? ''}
          onChange={(e)=> updateDraft(row.studentId, { note: e.target.value })}
        />
      ),
    },
    {
      title: 'Status', dataIndex: 'scoreId', width: 120, align:'center',
      render: (sid)=> sid ? <Tag color="green">Tersimpan</Tag> : <Tag>Baru</Tag>
    },
  ];

  const pagination = {
    current: pageState.current_page,
    pageSize: pageState.per_page,
    total: totalItems,
    showSizeChanger: true,
    pageSizeOptions: [10, 25, 50, 100],
    onChange: (curr, size) => setPageState({ current_page: curr, per_page: size }),
  };

  const handleSave = async () => {
    const items = rows
      .map((r) => {
        const d = draft[r.studentId];
        if (d === undefined) return null;
        const score = d.score ?? r.score ?? null;
        const note = d.note ?? r.note ?? null;
        return { studentId: r.studentId, score, note };
      })
      .filter(Boolean);

    if (!items.length) return message.info('Tidak ada perubahan.');

    const invalid = items.find(it => it.score === null || it.score === undefined || Number.isNaN(Number(it.score)));
    if (invalid) return message.error('Nilai ada yang kosong/tidak valid.');

    try {
      await bulkMut.mutateAsync(items);
      message.success('Nilai disimpan.');
      setDraft({});
    } catch (e) {
      message.error(e?.response?.data?.message || e.message);
    }
  };

  return (
    <>
      <div className="table-header">
        <h1>Input Nilai (Guru)</h1>
        <Space>
          <Button type="primary" icon={<SaveOutlined />} onClick={handleSave} loading={bulkMut.isLoading}>
            Simpan Semua
          </Button>
        </Space>
      </div>

      <Input
        prefix={<SearchOutlined />} value={keyword}
        onChange={(e)=> setKeyword(e.target.value)}
        placeholder="Cari siswa"
        allowClear
        style={{ border:'1px solid #d9d9d9', margin:'10px 0' }}
      />

      <Table
        size="small"
        columns={columns}
        dataSource={rows}
        loading={isLoading || isFetching}
        pagination={pagination}
        scroll={{ y: '55vh', x: 900 }}
        rowKey="studentId"
      />
    </>
  );
};

export default ScoresGuru;
