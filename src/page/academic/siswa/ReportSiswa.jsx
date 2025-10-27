import { Card, Typography, Space, Select, Button, message } from 'antd';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Cookies from 'js-cookie';
import { getPagination } from "../../../services/akademik/utils";

const { VITE_BASE_URL } = import.meta.env;
const { Title, Text } = Typography;

export default function ReportSiswa() {
  const [terms, setTerms] = useState([]);
  const [params, setParams] = useSearchParams();
  const termId = params.get('termId') || '';

  useEffect(() => {
    (async () => {
      const res = await getPagination('/api/v1/terms?all=true');
      const list = res?.data || res?.data?.data || [];
      setTerms(list);
      if (!termId && list.length) setParams({ termId: list[0].id });
    })();
    //eslint-disable-next-line
  }, []);

  const downloadXlsx = async () => {
    if (!termId) {
      message.warning('Pilih term dulu');
      return;
    }
    try {
      const token = Cookies.get('token');
      const url = `${VITE_BASE_URL}/api/v1/student/report-card?termId=${termId}&format=xlsx`;
      const resp = await fetch(url, { headers: { Authorization: 'Bearer ' + token } });
      if (!resp.ok) throw new Error('Gagal unduh.');
      const blob = await resp.blob();
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `rapor-${termId}.xlsx`;
      a.click();
      URL.revokeObjectURL(a.href);
    } catch (e) {
      message.error(e.message || 'Gagal unduh rapor');
    }
  };

  return (
    <Card>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Title level={4}>Cetak Rapor</Title>
        <Space>
          <Text>Pilih Term:</Text>
          <Select
            style={{ minWidth: 220 }}
            value={termId || undefined}
            placeholder="Pilih Term"
            options={terms.map(t => ({ value: t.id, label: `${t.name || t.yearLabel || t.id}` }))}
            onChange={(val) => setParams({ termId: val })}
          />
          <Button type="primary" onClick={downloadXlsx} disabled={!termId}>
            Unduh XLSX
          </Button>
        </Space>
      </Space>
    </Card>
  );
}
