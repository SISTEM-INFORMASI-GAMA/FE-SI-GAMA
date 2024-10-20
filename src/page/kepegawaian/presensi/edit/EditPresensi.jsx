import {
  DatePicker,
  Form,
  Input,
  message,
  Modal,
  Radio,
  Select,
  Skeleton,
} from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import propTypes from "prop-types";
import { statusPresensi } from "../constant";
import { usePresensiDetail } from "../../../../hooks/kepegawaian/presensi/usePresensiDetail";
import dayjs from "dayjs";
import moment from "moment";

const EditPresensi = ({ id, onUpdate, onCancel, show }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [newData, setNewData] = useState({});
  const [pegawaiOptions, setPegawaiOptions] = useState([]);
  const { VITE_BASE_URL } = import.meta.env;
  const format = "YYYY-MM-DD";

  const { data, isLoading, refetch } = usePresensiDetail(id, false);

  useEffect(() => {
    if (show) {
      refetch();
    }
  }, [show, refetch]);

  useEffect(() => {
    if (data) {
      console.log(data);

      form.setFieldsValue({
        nama: data?.data?.pegawaiId,
        tgl_absensi: dayjs(moment(data?.data?.tgl_absensi).format(format)),
        status: data?.data?.status,
        lampiran: data.lampiran,
      });
    }
  }, [data, form]);

  const handleSubmit = async () => {
    try {
      await form.validateFields();
      setLoading(true);
      if (Object.keys(newData).length === 0) {
        message.error("Nothing has changed");
        return;
      }

      await axios.patch(VITE_BASE_URL + `/api/v1/attendence/${id}`, {
        ...newData,
      });

      message.success("Absensi berhasi diubah");
      form.resetFields();
      onUpdate();
    } catch (error) {
      message.error(error.response?.data?.message || "Fields Error");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelModal = () => {
    form.resetFields();
    setNewData({});
    onCancel();
  };

  useEffect(() => {
    const fetchPegawai = async () => {
      try {
        const response = await axios.get(VITE_BASE_URL + "/api/v1/employees");
        const pegawaiData = response.data.data.map((pegawai) => ({
          label: pegawai.nama,
          value: pegawai.id,
        }));
        setPegawaiOptions(pegawaiData);
      } catch (error) {
        message.error(error.response.data.message || error.message);
      }
    };
    fetchPegawai();
  }),
    [VITE_BASE_URL];

  return (
    <Modal
      open={show}
      okText="Simpan"
      cancelText="Batal"
      onOk={handleSubmit}
      onCancel={handleCancelModal}
      okButtonProps={{ loading }}
      title="Edit Presensi Pegawai"
    >
      {isLoading && <Skeleton active />}
      {!isLoading && (
        <>
          <Form form={form} layout="vertical" className="full-form">
            <div className="first-form">
              <Form.Item
                name="pegawaiId"
                label="Nama Pegawai"
                rules={[{ required: true, message: "Harap diisi" }]}
              >
                <Select
                  placeholder="Pilih nama pegawai"
                  options={pegawaiOptions}
                  loading={!pegawaiOptions.length}
                />
              </Form.Item>
              <Form.Item
                name="tgl_absensi"
                label="Tanggal"
                rules={[{ required: true, message: "Harap diisi" }]}
              >
                <DatePicker format={format} />
              </Form.Item>
              <Form.Item name="status" label="Status Absensi">
                <Radio.Group options={statusPresensi} />
              </Form.Item>
              <Form.Item
                name="password"
                label="Password"
                rules={[{ required: false, message: "Harap diisi" }]}
              >
                <Input.Password />
              </Form.Item>
            </div>
          </Form>
        </>
      )}
    </Modal>
  );
};

EditPresensi.propTypes = {
  show: propTypes.bool.isRequired,
  onCancel: propTypes.func.isRequired,
  onUpdate: propTypes.func.isRequired,
  id: propTypes.string.isRequired,
};

export default EditPresensi;
