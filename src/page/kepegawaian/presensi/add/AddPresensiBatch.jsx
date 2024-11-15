import { Button, DatePicker, Form, message, Table, Tag } from 'antd';
import { useEffect, useState } from 'react';
import { usePegawaiPagination } from '../../../../hooks/kepegawaian/pegawai/usePegawaiPagination';
import dayjs from 'dayjs';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddPresensiBatch = () => {
  const [form] = Form.useForm();
  const format = 'YYYY-MM-DD';
  const [dataTable] = useState({
    current_page: 1,
    per_page: 100000,
    total: 0,
  });
  const [dataSource, setDataSource] = useState([]);
  const [posting, setPosting] = useState(false);

  const { data, isLoading, isFetching } = usePegawaiPagination(dataTable, '');

  const navigate = useNavigate();

  const { VITE_BASE_URL } = import.meta.env;

  useEffect(() => {
    if (data) {
      const sortedEmployee = data?.data?.sort((a, b) =>
        a.nama.localeCompare(b.nama)
      );
      setDataSource(
        sortedEmployee.map((student, index) => {
          return {
            ...student,
            index: index + 1,
            status: 'Hadir',
            key: student.id,
          };
        })
      );
    }
  }, [data]);

  const handleStatusChange = (employeeId, status) => {
    form.setFieldsValue({ [employeeId]: status });
    // update the dataSource
    setDataSource((prevDataSource) => {
      const newDataSource = prevDataSource.map((employee) => {
        if (employee.id === employeeId) {
          return { ...employee, status };
        }
        return employee;
      });
      return newDataSource;
    });
  };

  const handleSubmit = async () => {
    try {
      setPosting(true);

      await form.validateFields();
      const values = await form.getFieldsValue();
      const attendanceData = data?.data?.map((employee) => {
        return {
          tgl_absensi: dayjs(values['tgl_absensi']).format('YYYY-MM-DD'),
          status: values[employee.id] || 'Hadir',
          pegawaiId: employee.id,
        };
      });
      await axios.post(VITE_BASE_URL + '/api/v1/attendence', attendanceData);
      message.success('berhasil tambah presensi harian');
      form.resetFields();
      setDataSource([]);
      navigate('/dashboard/hr/presensi');
    } catch (error) {
      message.error(`${error?.response?.data?.message}`, 3);
    } finally {
      setPosting(false);
    }
  };

  const columns = [
    {
      title: 'Nama',
      dataIndex: 'nama',
      align: 'left',
    },
    {
      title: 'status',
      dataIndex: 'status',
      align: 'left',
      key: 'present',
      render: (text, record) => (
        <Form.Item name={record.id} initialValue="Hadir">
          <div className="tag-list">
            <Tag
              color={record.status === 'Hadir' ? '#2ECC71' : 'default'}
              onClick={() => handleStatusChange(record.id, 'Hadir')}
              style={
                posting ? { cursor: 'not-allowed' } : { cursor: 'pointer' }
              }
            >
              Hadir
            </Tag>
            <Tag
              color={record.status === 'Sakit' ? '#F1C40F' : 'default'}
              onClick={() => handleStatusChange(record.id, 'Sakit')}
              style={
                posting ? { cursor: 'not-allowed' } : { cursor: 'pointer' }
              }
            >
              Sakit
            </Tag>
            <Tag
              color={record.status === 'Izin' ? '#3498DB' : 'default'}
              onClick={() => handleStatusChange(record.id, 'Izin')}
              style={
                posting ? { cursor: 'not-allowed' } : { cursor: 'pointer' }
              }
            >
              Izin
            </Tag>
            <Tag
              color={record.status === 'Alpa' ? '#E74C3C' : 'default'}
              onClick={() => handleStatusChange(record.id, 'Alpa')}
              style={
                posting ? { cursor: 'not-allowed' } : { cursor: 'pointer' }
              }
            >
              Alpa
            </Tag>
          </div>
        </Form.Item>
      ),
    },
  ];

  return (
    <div>
      <div className="table-header">
        <h1>Form Absensi harian</h1>
      </div>
      <Form
        form={form}
        layout="vertical"
        className="full-form"
        onFinish={handleSubmit}
      >
        <div>
          <div className="first-form">
            <Form.Item
              name="tgl_absensi"
              label="Tanggal"
              rules={[{ required: true, message: 'Harap diisi' }]}
            >
              <DatePicker format={format} />
            </Form.Item>
          </div>
          <Table
            style={{ marginBottom: 20 }}
            size={window.innerWidth > 1600 ? 'middle' : 'small'}
            pagination={false}
            tableLayout="auto"
            dataSource={dataSource}
            columns={columns}
            loading={isLoading || isFetching}
            scroll={
              window.innerHeight < 690
                ? { y: '52vh', x: 900 }
                : { y: '55vh', x: 900 }
            }
          />
          <div className="button-container">
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </div>
        </div>
      </Form>
    </div>
  );
};

export default AddPresensiBatch;
