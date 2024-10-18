import { Form, Input, message, Modal, Radio, Skeleton } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import propTypes from "prop-types";
import { jenisKelamin } from "../../user/constant";
import { usePegawaiDetail } from "../../../../hooks/kepegawaian/pegawai/usePegawaiDetail";

const EditPegawai = ({ id, onUpdate, onCancel, show }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [newData, setNewData] = useState({});
  const { VITE_BASE_URL } = import.meta.env;

  const { data, isLoading, refetch } = usePegawaiDetail(id, false);

  useEffect(() => {
    if (show) {
      refetch();
    }
  }, [show, refetch]);

  useEffect(() => {
    if (data) {
      form.setFieldsValue({
        nip: data.data.nip,
        nama: data.data.nama,
        tgl_lahir: data.data.tgl_lahir,
        jabatan: data.data.jabatan,
        alamat: data.data.alamat,
        nomor_telepon: data.data.nomor_telepon,
        jenis_kelamin: data.data.jenis_kelamin,
        foto: data.data.foto,
      });
    }
  }, [data, form]);

  console.log(data);

  const handleSubmit = async () => {
    try {
      await form.validateFields();
      setLoading(true);
      if (Object.keys(newData).length === 0) {
        message.error("Nothing has changed");
        return;
      }

      await axios.patch(VITE_BASE_URL + `/api/v1/users/${id}`, {
        ...newData,
      });

      message.success("Pegawai berhasil diubah");
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

  return (
    <Modal
      open={show}
      okText="Simpan"
      cancelText="Batal"
      onOk={handleSubmit}
      onCancel={handleCancelModal}
      okButtonProps={{ loading }}
      title="Edit Users"
    >
      {isLoading && <Skeleton active />}
      {!isLoading && (
        <>
          <Form form={form} layout="vertical" className="full-form">
            <div className="first-form">
              <Form.Item
                name="nama"
                label="Nama"
                rules={[{ required: true, message: "Harap diisi" }]}
                onChange={({ target: { value } }) => (newData["nama"] = value)}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="nip"
                label="NIP"
                rules={[{ required: true, message: "Harap diisi" }]}
                onChange={({ target: { value } }) => (newData["nip"] = value)}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="tgl_lahir"
                label="Tanggal Lahir"
                onChange={({ target: { value } }) =>
                  (newData["tgl_lahir"] = value)
                }
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="jabatan"
                label="Jabatan"
                onChange={({ target: { value } }) =>
                  (newData["jabatan"] = value)
                }
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="alamat"
                label="Alamat"
                onChange={({ target: { value } }) =>
                  (newData["alamat"] = value)
                }
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="nomor_telepon"
                label="Nomor Telepon"
                onChange={({ target: { value } }) =>
                  (newData["nomor_telepon"] = value)
                }
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="jenis_kelamin"
                label="Jenis Kelamin"
                onChange={({ target: { value } }) =>
                  (newData["jenis_kelamin"] = value)
                }
              >
                <Radio.Group options={jenisKelamin} />
              </Form.Item>
              <Form.Item
                name="foto"
                label="Foto Pegawai"
                onChange={({ target: { value } }) => (newData["foto"] = value)}
              >
                <Input />
              </Form.Item>
            </div>
          </Form>
        </>
      )}
    </Modal>
  );
};

EditPegawai.propTypes = {
  show: propTypes.bool.isRequired,
  onCancel: propTypes.func.isRequired,
  onUpdate: propTypes.func.isRequired,
  id: propTypes.string.isRequired,
};

export default EditPegawai;
