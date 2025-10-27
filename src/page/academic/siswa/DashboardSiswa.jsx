import { Card, Descriptions, Space, Typography, Select, Button } from 'antd';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useStudentMe } from "../../../hooks/akademik/siswa/useStudentMe";
import { getPagination } from "../../../services/akademik/utils";

const { Title, Text } = Typography;

export default function DashboardSiswa() {
  const { data: me } = useStudentMe();
  const navigate = useNavigate();
  const [terms, setTerms] = useState([]);
  const [termId, setTermId] = useState('');
  const [searchParams] = useSearchParams();

  const view = searchParams.get('view') || '';

  useEffect(() => {
    (async () => {
      const res = await getPagination('/api/v1/terms?all=true'); // endpoint listing terms kamu
      const list = res?.data || res?.data?.data || [];
      setTerms(list);
      if (!termId && list.length) setTermId(list[0].id);
    })();
    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    // jika datang dari menu "view=assessments" / "scores" / "reports" → arahkan cepat
    if (termId && view) {
      if (view === 'assessments') {
        navigate(`/dashboard/academic/student/grades?termId=${termId}`);
      } else if (view === 'scores') {
        navigate(`/dashboard/academic/student/grades?termId=${termId}`);
      } else if (view === 'reports') {
        navigate(`/dashboard/academic/studentreport?termId=${termId}`);
      }
    }
     //eslint-disable-next-line
  }, [view, termId]);

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Title level={4}>Dashboard Siswa</Title>
      <Card>
        <Descriptions column={1} title="Profil">
          <Descriptions.Item label="Nama">{me?.data?.name || '-'}</Descriptions.Item>
          <Descriptions.Item label="NIS">{me?.data?.nis || '-'}</Descriptions.Item>
          <Descriptions.Item label="Kelas">{me?.data?.kelas?.name || '-'}</Descriptions.Item>
        </Descriptions>
      </Card>

      <Card title="Akses Cepat">
        <Space>
          <Select
            style={{ minWidth: 220 }}
            value={termId || undefined}
            placeholder="Pilih Term"
            options={terms.map(t => ({ value: t.id, label: `${t.name || t.yearLabel || t.id}` }))}
            onChange={setTermId}
          />
          <Button type="primary" disabled={!termId} onClick={() => navigate(`/dashboard/academic/studentgrades?termId=${termId}`)}>
            Lihat Nilai Saya
          </Button>
          <Button disabled={!termId} onClick={() => navigate(`/dashboard/academic/studentreport?termId=${termId}`)}>
            Cetak Rapor
          </Button>
        </Space>
        <Text type="secondary" style={{ display: 'block', marginTop: 8 }}>
          Pilih term terlebih dahulu untuk melihat nilai dan rapor.
        </Text>
      </Card>
    </Space>
  );
}
