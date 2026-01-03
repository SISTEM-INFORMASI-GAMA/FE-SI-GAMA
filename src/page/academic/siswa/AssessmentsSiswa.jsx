import { Card, Table, Typography, Space, Descriptions } from 'antd';
import { useSearchParams } from 'react-router-dom';
import { useStudentAssessments } from "../../../hooks/akademik/siswa/useStudentAssessments";

const { Title } = Typography;

export default function AssessmentsSiswa() {
  const [params] = useSearchParams();
  const classSubjectId = params.get('classSubjectId') || '';
  const termId = params.get('termId') || '';

  const { data, isFetching } = useStudentAssessments(classSubjectId, termId);
  const rows = data?.data || [];
  const ctx = data?.context || {};

  const columns = [
    { title: 'Judul', dataIndex: 'title' },
    { title: 'Tipe', dataIndex: 'type', width: 120 },
    { title: 'Due Date', dataIndex: 'dueDate', width: 140 },
    { title: 'Nilai', dataIndex: 'score', width: 100, align: 'right' },
    { title: 'Catatan', dataIndex: 'note' },
    { title: 'Status', dataIndex: 'state', width: 120 },
  ];

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Title level={4}>Penilaian — {ctx?.subject || '-'}</Title>
      <Card>
        <Descriptions size="small" column={3}>
          <Descriptions.Item label="Mapel">{ctx?.subject || '-'}</Descriptions.Item>
          <Descriptions.Item label="Kelas">{ctx?.class || '-'}</Descriptions.Item>
          <Descriptions.Item label="Semester">{ctx?.term?.name || '-'}</Descriptions.Item>
        </Descriptions>
      </Card>

      <Card>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={rows}
          loading={isFetching}
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </Space>
  );
}
