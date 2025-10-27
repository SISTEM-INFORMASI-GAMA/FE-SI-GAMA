import { Card, Table, Typography, Select, Space, Tag } from 'antd';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useEffect, useState, useMemo } from 'react';
import { useStudentGrades } from "../../../hooks/akademik/siswa/useStudentGrades";
import { getPagination } from "../../../services/akademik/utils";

const { Title } = Typography;

export default function GradesSiswa() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [terms, setTerms] = useState([]);
  const termId = searchParams.get('termId') || '';

  const { data, isFetching } = useStudentGrades(termId);

  useEffect(() => {
    (async () => {
      const res = await getPagination('/api/v1/terms?all=true');
      const list = res?.data || res?.data?.data || [];
      setTerms(list);
      if (!termId && list.length) {
        setSearchParams({ termId: list[0].id });
      }
    })();
     //eslint-disable-next-line
  }, []);

  const columns = useMemo(() => ([
    {
      title: 'Mapel',
      dataIndex: ['subject', 'name'],
      key: 'subject',
      render: (value, row) => value || row?.subject?.code || '-',
    },
    {
      title: 'Komponen',
      key: 'components',
      render: (_, row) => {
        const comps = row.components || {};
        const entries = Object.entries(comps);
        if (entries.length === 0) return <span>-</span>;
        return (
          <Space wrap>
            {entries.map(([k, v]) => (
              <Tag key={k}>{k.toUpperCase()}: {v}</Tag>
            ))}
          </Space>
        );
      },
    },
    { title: 'Final', dataIndex: 'final', align: 'right', width: 100 },
    { title: 'KKM', dataIndex: 'kkm', align: 'right', width: 90 },
    {
      title: 'Status',
      dataIndex: 'status',
      align: 'center',
      width: 120,
      render: (val) => (
        <Tag color={val === 'Tuntas' ? 'green' : 'volcano'}>{val}</Tag>
      ),
    },
    {
      title: 'Aksi',
      key: 'action',
      align: 'center',
      width: 140,
      render: (_, row) => (
        <a onClick={() => navigate(`/dashboard/academic/student/assessments?classSubjectId=${row.classSubjectId}&termId=${termId}`)}>
          Lihat Penilaian
        </a>
      ),
    },
     //eslint-disable-next-line
  ]), [termId]);

  return (
    <Card>
      <Space style={{ width: '100%', marginBottom: 16 }} align="center" justify="space-between">
        <Title style={{ margin: 0 }} level={4}>Nilai Saya</Title>
        <Select
          style={{ minWidth: 220 }}
          value={termId || undefined}
          placeholder="Pilih Term"
          options={terms.map(t => ({ value: t.id, label: `${t.name || t.yearLabel || t.id}` }))}
          onChange={(val) => setSearchParams({ termId: val })}
        />
      </Space>

      <Table
        rowKey={(r) => r.classSubjectId}
        columns={columns}
        dataSource={data?.data || []}
        loading={isFetching}
        pagination={false}
      />
    </Card>
  );
}
