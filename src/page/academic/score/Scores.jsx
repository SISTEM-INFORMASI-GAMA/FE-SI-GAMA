import { Button, Input, InputNumber, Space, Table, Tag, message } from 'antd';
import { SaveOutlined, SearchOutlined } from '@ant-design/icons';
import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDebounce } from 'use-debounce';
import { useScores, useBulkUpsertScores } from '../../../hooks/akademik/score/useScores';

const Scores = () => {
   const { assessmentId } = useParams();
   const [keyword, setKeyword] = useState('');
   const [search] = useDebounce(keyword, 400);

   const [pageState, setPageState] = useState({ current_page: 1, per_page: 25 });

   const { data, isLoading, isFetching } = useScores(assessmentId, pageState, search);
   const bulkMut = useBulkUpsertScores(assessmentId);

   // draft perubahan: { studentId: { score, note } }
   const [draft, setDraft] = useState({});

   const rows = useMemo(() => (data?.data || []).map((x, i) => ({
      ...x,
      key: x.studentId,
      index: (pageState.current_page - 1) * pageState.per_page + (i + 1),
   })), [data, pageState]);

   const totalItems = data?.meta?.total ?? 0;

   const updateDraft = (studentId, patch) => {
      setDraft((prev) => ({ ...prev, [studentId]: { ...(prev[studentId] || {}), ...patch } }));
   };

   const columns = [
      { title: 'No', dataIndex: 'index', width: 60 },
      { title: 'NIS', dataIndex: 'nis', width: 120 },
      { title: 'Nama', dataIndex: 'name' },
      {
         title: 'Nilai',
         dataIndex: 'score',
         width: 120,
         align: 'center',
         render: (v, row) => (
            <InputNumber
               min={0}
               max={100}
               precision={0}
               // biar tidak auto-format saat ketik
               changeOnBlur
               // hilangkan semua selain digit
               parser={(val) => {
                  if (!val) return undefined; // penting: gunakan undefined, bukan null
                  const cleaned = String(val).replace(/[^\d]/g, '');
                  return cleaned === '' ? undefined : Number(cleaned);
               }}
               // jangan tampilkan separator saat mengetik
               formatter={(val) => (val == null ? '' : String(val))}
               allowClear
               controls={false}
               style={{ width: '100%' }}
               // gunakan undefined untuk "kosong"
               value={
                  draft[row.studentId]?.score !== undefined
                     ? draft[row.studentId]?.score
                     : (v ?? undefined)
               }
               onChange={(val) => {
                  // AntD bisa kirim number atau undefined saat clear
                  updateDraft(row.studentId, { score: val === undefined ? undefined : val });
               }}
            />
         ),
      },
      {
         title: 'Catatan',
         dataIndex: 'note',
         render: (v, row) => (
            <Input
               placeholder="opsional"
               value={draft[row.studentId]?.note ?? v ?? ''}
               onChange={(e) => updateDraft(row.studentId, { note: e.target.value })}
            />
         ),
      },
      {
         title: 'Status',
         dataIndex: 'scoreId',
         width: 120,
         align: 'center',
         render: (sid) => sid ? <Tag color="green">Tersimpan</Tag> : <Tag>Baru</Tag>,
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
      // susun hanya yang berubah / terisi
      const items = rows
         .map((r) => {
            const d = draft[r.studentId];
            // kalau tidak ada perubahan, skip
            if (d === undefined) return null;
            const score = d.score ?? r.score ?? null;
            const note = d.note ?? r.note ?? null;
            return { studentId: r.studentId, score, note };
         })
         .filter(Boolean);

      if (!items.length) {
         message.info('Tidak ada perubahan untuk disimpan.');
         return;
      }

      const invalid = items.find((it) => it.score === null || it.score === undefined || Number.isNaN(Number(it.score)));
      if (invalid) {
         message.error('Nilai ada yang kosong/tidak valid.');
         return;
      }

      try {
         await bulkMut.mutateAsync(items);
         message.success('Nilai berhasil disimpan.');
         setDraft({});
      } catch (e) {
         message.error(e?.response?.data?.message || e.message);
      }
   };

   return (
      <>
         <div className="table-header">
            <h1>Input Nilai</h1>
            <Space>
               <Button
                  type="primary"
                  icon={<SaveOutlined />}
                  onClick={handleSave}
                  loading={bulkMut.isLoading}
               >
                  Simpan Perubahan
               </Button>
            </Space>
         </div>

         <Input
            prefix={<SearchOutlined />}
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Cari siswa"
            allowClear
            style={{ border: '1px solid #d9d9d9', margin: '10px 0' }}
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

export default Scores;
