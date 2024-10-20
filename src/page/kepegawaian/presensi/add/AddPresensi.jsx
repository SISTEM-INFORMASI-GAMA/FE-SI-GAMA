import { DatePicker, Form, Input, message, Modal, Radio, Select } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import propTypes from "prop-types";
import { statusPresensi } from "../constant";

const AddPresensi = ({ show, onCreate, onCancel }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [pegawaiOptions, setPegawaiOptions] = useState([]);
  const { VITE_BASE_URL } = import.meta.env;
  const format = "YYYY-MM-DD";
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      await axios.post(VITE_BASE_URL + `/api/v1/attendence`, values);
      message.success("Berhasil menambahkan absensi");
      form.resetFields();
      onCreate();
    } catch (error) {
      message.error(error.response.data.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelModal = () => {
    form.resetFields();
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
      title="Tambah User"
    >
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
    </Modal>
  );
};

AddPresensi.propTypes = {
  show: propTypes.bool.isRequired,
  onCreate: propTypes.func.isRequired,
  onCancel: propTypes.func.isRequired,
};

export default AddPresensi;
