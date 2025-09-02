import {
  Badge,
  Button,
  Card,
  DatePicker,
  Form,
  Input,
  message,
  Select,
  Table,
  Tag,
} from "antd";
import dayjs from "dayjs";
import moment from "moment";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useKelasList } from "../../../../hooks/akademik/kelas/useKelasList";
import { useKelasDetail } from "../../../../hooks/akademik/kelas/useKelasDetail";
import Cookies from 'js-cookie';
import { getPagination } from "../../../../services/akademik/utils";


const AddKehadiran = () => {
  const [form] = Form.useForm();
  const [classId, setClassId] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [posting, setPosting] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const { VITE_HOST_API } = import.meta.env;
  const { data: dataClass, refetch } = useKelasList(false);
  const [filteredDataSource, setFilteredDataSource] = useState(dataSource);
  const navigate = useNavigate();


  const navigateToRecap = () => {
    navigate("/academic/PresenceDaily");
  };

  const {
    data,
    isLoading,
    isFetching,
    refetch: fetchClassDetail,
  } = useKelasDetail(classId, {
    current_page: 1,
    per_page: 10000,
  });

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  useEffect(() => {
    const filteredDataSource = dataSource.filter((item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredDataSource(filteredDataSource);
  }, [dataSource, searchQuery]);

  const handleStatusChange = (studentId, status) => {
    form.setFieldsValue({ [studentId]: status });
    // update the dataSource
    setDataSource((prevDataSource) => {
      const newDataSource = prevDataSource.map((student) => {
        if (student.id === studentId) {
          return { ...student, status };
        }
        return student;
      });
      return newDataSource;
    });
  };

  const columns = [
    {
      title: "No",
      dataIndex: "index",
      fixed: "left",
      width: window.innerWidth > 800 ? 70 : 50,
      responsive: ["md"],
    },
    {
      title: "Nama",
      dataIndex: "name",
      key: "name",
      width: window.innerWidth > 800 ? 200 : 65,
      fixed: "left",
    },
    {
      title: "status",
      dataIndex: "status",
      align: "left",
      key: "present",
      render: (text, record) => (
        <Form.Item name={record.id} initialValue="present">
          <div className="tag-list">
            <Tag
              color={record.status === "present" ? "green" : "default"}
              onClick={() => handleStatusChange(record.id, "present")}
              style={
                posting ? { cursor: "not-allowed" } : { cursor: "pointer" }
              }
            >
              Hadir
            </Tag>
            <Tag
              color={record.status === "sick" ? "orange" : "default"}
              onClick={() => handleStatusChange(record.id, "sick")}
              style={
                posting ? { cursor: "not-allowed" } : { cursor: "pointer" }
              }
            >
              Sakit
            </Tag>
            <Tag
              color={record.status === "permission" ? "purple" : "default"}
              onClick={() => handleStatusChange(record.id, "permission")}
              style={
                posting ? { cursor: "not-allowed" } : { cursor: "pointer" }
              }
            >
              Izin
            </Tag>
            <Tag
              color={record.status === "absent" ? "red" : "default"}
              onClick={() => handleStatusChange(record.id, "absent")}
              style={
                posting ? { cursor: "not-allowed" } : { cursor: "pointer" }
              }
            >
              Alpa
            </Tag>
          </div>
        </Form.Item>
      ),
    },
    {
      title: "Deskripsi",
      dataIndex: "description",
      key: "description",
      render: (text, record) => (
        <Form.Item name={`description_${record.id}`}>
          <Input placeholder="Description" disabled={posting} />
        </Form.Item>
      ),
    },
  ];

  useEffect(() => {
    refetch();
  }, [refetch]);

  // dev ---
  const [dateIn, setDateIn] = useState();
  const [isFillToday, setIsFillToday] = useState(false);

  useEffect(() => {
    if (classId !== "") {
      fetchClassDetail();

      // checkToday ---

      if (!dateIn) {
        const today = dayjs().format("YYYY-MM-DD");
        setDateIn(today);
      }

      const checkToday = async () => {
        const dateConvert = dayjs(dateIn).format("YYYY-MM-DD");

        const { data } = await getPagination(`/api/v1/kehadiran/harian?page=1&limit=1000&classId=${classId}&from=${dateConvert}&to=${dateConvert}`);

        const result = data.rows;

        if (result.length !== 0) {
          setIsFillToday(true);
        } else {
          setIsFillToday(false);
        }
      };

      checkToday();
    }
  }, [classId, fetchClassDetail, dateIn, VITE_HOST_API]);

  useEffect(() => {
    if (data) {
      const sortedStudents = data?.data.students.rows.sort((a, b) =>
        a.name.localeCompare(b.name)
      );
      setDataSource(
        sortedStudents.map((student, index) => {
          return {
            ...student,
            index: index + 1,
            status: "present",
            key: student.id,
          };
        })
      );
    }
  }, [data]);

  const handleSubmit = async () => {
    try {
      if (data?.data.students.length === 0)
        return message.error("Tidak ada data siswa");
      setSearchQuery("");
      await form.validateFields();
      const values = await form.getFieldsValue();
      const attendanceData = data?.data.students.map((student) => {
        return {
          classId,
          date_in: dayjs(values["date_in"]).format("YYYY-MM-DD HH:mm:ss"),
          date_out: values["date_out"]
            ? dayjs(values["date_out"]).format("YYYY-MM-DD HH:mm:ss")
            : null,
          status: values[student.id] || "present",
          description: values[`description_${student.id}`] || "",
          studentId: student.id,
        };
      });
      setPosting(true);
      const { data: dataSubmit } = await axios.post(
        VITE_HOST_API + `/academics/daily-attendances`,
        { dailyAttendance: attendanceData },
        { headers: { Authorization: 'Bearer ' + Cookies.get('token') } }
      );
      message.success(dataSubmit.message);
      form.resetFields();
      setClassId("");
      setDataSource([]);
      navigateToRecap();
    } catch (error) {
      console.log("error", error);
      alert(error?.response?.data?.error);
    } finally {
      setPosting(false);
    }
  };

  return (
    <div>
      <div className="table-header">
        <h1>Form Absensi harian</h1>
      </div>
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <div className="search-wrapper filter-wrapper">
          <Form.Item
            name="classId"
            label="Kelas"
            rules={[{ required: true, message: "Harap diisi" }]}
            className="form-item-kehadiran"
            style={{ width: "100%", marginBottom: 0 }}
          >
            <Select
              disabled={posting}
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.toLowerCase().includes(input.toLowerCase())
              }
              onChange={(value) => setClassId(value)}
            >
              {dataClass?.data?.map((kelas) => (
                <Select.Option key={kelas.id} value={kelas.id}>
                  {kelas.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="Nama" style={{ width: "100%", marginBottom: 0 }}>
            <Input
              value={searchQuery}
              onChange={handleSearch}
              placeholder=" cari nama murid"
              disabled={posting}
            />
          </Form.Item>
          <Form.Item
            name="date_in"
            label="Waktu masuk"
            initialValue={dayjs(
              moment(new Date()).format("YYYY-MM-DD HH:mm:ss")
            )}
            rules={[{ required: true, message: "Harap diisi" }]}
            className="form-item-kehadiran"
            style={{ width: "100%", marginBottom: 0 }}
          >
            <DatePicker
              disabled={posting}
              showTime
              format="YYYY-MM-DD HH:mm:ss"
              onChange={(value) => setDateIn(value)}
              style={{ padding: 4 }}
            />
          </Form.Item>
          <Form.Item
            name="date_out"
            label="Waktu keluar"
            className="form-item-kehadiran"
            style={{ width: "100%", marginBottom: 0 }}
          >
            <DatePicker
              disabled={posting}
              showTime
              format="YYYY-MM-DD HH:mm:ss"
              style={{ padding: 4 }}
            />
          </Form.Item>
        </div>
        {isFillToday ? (
          <>
            <Badge.Ribbon text="Information">
              <Card
                // title="Message"
                size="small"
                style={{ textAlign: "center" }}
                className="card-info"
              >
                🕵🏻 <strong> Tidak dapat melakukan absensi.</strong>
                <br /> kelas yang anda pilih dihari ini sudah melakukan absensi.
                silahkan periksa di menu presence daily
              </Card>
            </Badge.Ribbon>
          </>
        ) : (
          <Table
            style={{ marginBottom: 20 }}
            size={window.innerWidth > 1600 ? "middle" : "small"}
            pagination={false}
            tableLayout="auto"
            dataSource={filteredDataSource}
            columns={columns}
            loading={isLoading || isFetching}
            scroll={
              window.innerHeight < 690
                ? { y: "52vh", x: 900 }
                : { y: "55vh", x: 900 }
            }
          />
        )}

        <div className="button-container">
          <Button
            disabled={isFillToday}
            type="primary"
            htmlType="submit"
            loading={posting}
            style={{
              width: "100%"
            }}
          >
            Submit
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default AddKehadiran;
