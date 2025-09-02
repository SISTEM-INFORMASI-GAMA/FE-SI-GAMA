import { Button, DatePicker, Form, Input, Select, Space, Table } from 'antd';
import { Tag } from 'antd';
import { useCallback, useState } from 'react';
import EditKelas from "../edit/EditKelas";
import { useKelasList } from "../../../../hooks/akademik/kelas/useKelasList";
import dayjs from "dayjs";
import moment from "moment";
import { useKehadiranPagination } from "../../../../hooks/akademik/kehadiran/useKehadiranPagination";
import { useNavigate } from "react-router-dom";

export const Kehadiran = () => {
  const [dataId, setDataId] = useState('');
  const [showEditKelas, setShowEditKelas] = useState(false);
  const [dataTable, setDataTable] = useState({
    current_page: 1,
    per_page: 15,
    total: 0,
  });
  const [keyword, setKeyword] = useState('');
  const [classId, setClassId] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');

  const [form] = Form.useForm();
  const navigate = useNavigate();

  const { data, isLoading, isFetching, refetch } = useKehadiranPagination(
    dataTable,
    keyword,
    from,
    to,
    classId
  );

  const { data: dataKelas , isLoading : isLoadingKelas} = useKelasList(
    dataTable,
    keyword
  );

  const onUpdate = useCallback(() => {
    setShowEditKelas(false);
    refetch();
  }, [refetch]);

  const onCancel = () => {
    setShowEditKelas(false);
    setDataId('');
  };

  const statusMap = {
    present: { text: "Hadir", color: "green" },
    sick: { text: "Sakit", color: "orange" },
    excused: { text: "Izin", color: "purple" },
    absent: { text: "Alpa", color: "red" },
  };

  const getStatusTag = (status) => {
    const { text, color } = statusMap[status] || {
      text: status,
      color: "gray",
    };
    return <Tag color={color}>{text}</Tag>;
  };

  const columns = [
    {
      title: 'No',
      dataIndex: 'index',
      align: 'left',
      width: window.innerWidth > 800 ? 70 : 50,
    },
    {
      title: 'Nama',
      dataIndex: 'name',
      align: 'left',
    },
    {
      title: "Kelas",
      dataIndex: 'kelas',
      align: 'left',
    },
    {
      title: 'Tanggal',
      dataIndex: 'date',
      align: 'left',
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      align: "left",
      render: (status) => getStatusTag(status),
    },
    {
      title: "Deskripsi",
      dataIndex: "note",
      key: "note",
      align: "left",
    },
    {
      title: 'Aksi',
      dataIndex: 'id',
      align: 'center',
      width: window.innerWidth > 800 ? 300 : 200,
      render: (id) => {
        return (
          <>
            <Tag
              color="orange"
              style={{ cursor: 'pointer' }}
              onClick={() => {
                setDataId(id);
                setShowEditKelas(true);
              }}
            >
              Ubah
            </Tag>
          </>
        );
      },
    },
  ];

  const dataSource = data?.data.rows
    .slice(0, dataTable.per_page)
    .map((x, i) => {
      return {
        ...x,
        key: x.id,
        index: i + 1,
        name: x.siswa?.name,
        kelas: x.kelas?.name
      };
    });

  const pagination = {
    current: dataTable.current_page,
    pageSize: dataTable.per_page,
    total: data?.data?.total,
    showSizeChanger: true,
    pageSizeOptions: [15, 20, 50, 100],
    onChange: (curr, size) => {
      setDataTable((prev) => {
        return {
          ...prev,
          current_page: curr,
          per_page: size,
        };
      });
    },
  };

  const handleSearch = (param) => {
    setKeyword(param.target.value);
  };

  return (
    <>
      <div className="table-header">
        <h1>Daftar Absensi</h1>
        <Space>
          <Button type="primary" onClick={() => navigate('/dashboard/academic/kehadiran/add')}>
            Tambah Absensi
          </Button>
        </Space>
      </div>
      <Form form={form} layout="vertical">
        <div className="search-wrapper filter-wrapper">
          <Form.Item
            name="classId"
            label="Kelas"
            className="form-item-kehadiran"
            style={{ width: "100%", marginBottom: 0 }}
          >
            <Select
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.toLowerCase().includes(input.toLowerCase())
              }
              onChange={(value) => setClassId(value)}
              disabled={isLoadingKelas}
            >
              <Select.Option value={""}>Semua kelas</Select.Option>
              {dataKelas?.data?.map((kelas) => (
                <Select.Option key={kelas.id} value={kelas.id}>
                  {kelas.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Nama" style={{ width: "100%", marginBottom: 0 }}>
            <Input
              value={keyword}
              onChange={handleSearch}
              placeholder="cari nama murid"
            />
          </Form.Item>
          <Form.Item
            name="date_in"
            label="Tanggal mulai"
            className="form-item-kehadiran"
            initialValue={dayjs(moment(new Date()).format("YYYY-MM-DD"))}
            style={{ width: "100%", marginBottom: 0 }}
          >
            <DatePicker
              style={{ padding: 4 }}
              format="DD/MM/YYYY"
              onChange={(value) => setFrom(dayjs(value).format("YYYY-MM-DD"))}
            />
          </Form.Item>

          <Form.Item
            name="date_out"
            label="Tanggal akhir"
            className="form-item-kehadiran"
            initialValue={dayjs(moment(new Date()).format("YYYY-MM-DD"))}
            style={{ width: "100%", marginBottom: 0 }}
          >
            <DatePicker
              style={{ padding: 4 }}
              format="DD/MM/YYYY"
              onChange={(value) =>
                setTo(dayjs(value).format("YYYY-MM-DD"))
              }
            />
          </Form.Item>
        </div>
      </Form>
      <Table
        size="small"
        tableLayout="auto"
        columns={columns}
        loading={isLoading || isFetching}
        dataSource={dataSource}
        pagination={pagination}
        scroll={{
          y: '50vh',
          x: 800,
        }}
      />
      <EditKelas
        id={dataId}
        onUpdate={onUpdate}
        onCancel={onCancel}
        show={showEditKelas}
      />
    </>
  );
};
