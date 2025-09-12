import { Button, Select, Space, message } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { useEffect, useMemo, useState } from 'react';
import { useDebounce } from 'use-debounce';
import { useKelasOptions } from '../../../hooks/akademik/kelas/useKelasOptions';
import { useTermOptions } from '../../../hooks/akademik/term/useTermOptions';
import { buildQS, downloadFile } from '../../../services/akademik/utils';

const ReportCard = () => {
  const [kelasKeyword, setKelasKeyword] = useState('');
  const [search] = useDebounce(kelasKeyword, 400);
  const { data: kelasResp, isFetching: kelasLoading } = useKelasOptions(search, 1, 20);

  const kelasOptions = useMemo(() => {
    const arr = Array.isArray(kelasResp?.data?.data) ? kelasResp.data.data : (kelasResp?.data || []);
    return (arr || []).map((k) => ({ label: k.name, value: k.id }));
  }, [kelasResp]);

  const { data: termResp, isFetching: termLoading } = useTermOptions();
  const termOptions = useMemo(() => {
    const arr = (termResp?.data || termResp?.rows || []);
    return arr.map((t) => ({ label: t.name || t.yearLabel || t.year || t.id, value: t.id }));
  }, [termResp]);

  const [classId, setClassId] = useState();
  const [termId, setTermId] = useState();

  useEffect(() => {
    // reset classId jika keyword berubah drastis dan opsi kosong
    if (!kelasLoading && kelasOptions.length === 0) setClassId(undefined);
  }, [kelasOptions, kelasLoading]);

  const handleDownload = async () => {
    if (!classId || !termId) {
      message.warning('Pilih kelas dan term terlebih dahulu.');
      return;
    }
    const qs = buildQS({ classId, termId, format: 'xlsx' });
    await downloadFile('get', `/api/v1/academic/reports/report-card${qs}`, {}, `rapor-${classId}-${termId}.xlsx`);
  };

  return (
    <>
      <div className="table-header">
        <h1>Cetak Rapor Siswa</h1>
        <Space>
          <Button
            type="primary"
            icon={<DownloadOutlined />}
            onClick={handleDownload}
          >
            Unduh XLSX
          </Button>
        </Space>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: 12, marginTop: 12 }}>
        <Select
          showSearch
          allowClear
          placeholder="Pilih Kelas"
          options={kelasOptions}
          loading={kelasLoading}
          value={classId}
          onSearch={(v) => setKelasKeyword(v)}
          onChange={(v) => setClassId(v)}
          filterOption={false}
        />
        <Select
          showSearch
          allowClear
          placeholder="Pilih Term"
          options={termOptions}
          loading={termLoading}
          value={termId}
          onChange={(v) => setTermId(v)}
          filterOption={(i, o) => (o?.label ?? '').toString().toLowerCase().includes(i.toLowerCase())}
        />
        <Button type="default" onClick={handleDownload} icon={<DownloadOutlined />}>
          Unduh
        </Button>
      </div>
    </>
  );
};

export default ReportCard;
