import { DatePicker, Form, Input, message, Modal, Radio, Upload } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import axios from "axios";
import { useState } from "react";
import propTypes from "prop-types";
import { jenisKelamin } from "../constant";
const format = "YYYY-MM-DD";

const AddPegawai = ({ show, onCreate, onCancel }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);
  const { VITE_BASE_URL } = import.meta.env;

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      // const uploadImage = async uploadImage
      if (fileList.length > 0) {
        const formData = new FormData();
        formData.append("image", fileList[0].originFileObj);
        const { data } = await axios.post(
          VITE_BASE_URL + "/api/v1/image",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        values.foto = data?.data?.image;
      }

      await axios.post(VITE_BASE_URL + `/api/v1/employees`, values);
      message.success("Pegawai Berhasil Dimasukkan");
      form.resetFields();
      onCreate();
    } catch (error) {
      message.error(error.response.data.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      // Set the preview property if it's not already set
      file.preview = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
      });
    }

    // Show preview modal
    Modal.info({
      title: file.name,
      content: (
        <img
          alt="preview"
          style={{ width: "100%" }}
          src={file.url || file.preview}
        />
      ),
    });
  };
  const isImage = (file) => {
    return (
      file.type === "image/jpeg" ||
      file.type === "image/png" ||
      file.type === "image/jpg"
    );
  };

  const beforeUpload = (file) => {
    if (!isImage(file)) {
      message.error("hanya bisa upload file gambar (.jpeg, .jpg, .png)");
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("gambar ukurannya harus kurang dari 2MB!");
      return false;
    }
    if (!isImage(file) && fileList.length > 0) {
      setFileList([...fileList]);
      return false;
    }
    setFileList(isImage(file) ? [file] : []);
    return false;
  };

  const handleRemove = (file) => {
    const newFileList = fileList.filter((f) => f.uid !== file.uid);
    setFileList(newFileList);
    form.setFieldValue("file", null);
  };

  const handleChange = ({ fileList: newFileList }) => {
    if (newFileList.length > 0) {
      const isLt2M = newFileList[0].size / 1024 / 1024 < 2;
      if (!isLt2M) {
        return;
      }
    }
    setFileList(newFileList);
  };

  const propsUpload = {
    onRemove: handleRemove,
    beforeUpload,
    fileList,
    onChange: handleChange,
  };

  const handleCancelModal = () => {
    form.resetFields();
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
      title="Tambah Pegawai"
    >
      <Form form={form} layout="vertical" className="full-form">
        <div className="first-form">
          <Form.Item
            name="nama"
            label="Nama"
            rules={[{ required: true, message: "Harap diisi" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="nip"
            label="NIP"
            rules={[{ required: true, message: "Harap diisi" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="tgl_lahir"
            label="Tanggal Lahir"
            rules={[{ required: true, message: "Harap diisi" }]}
          >
            <DatePicker format={format} />
          </Form.Item>
          <Form.Item
            name="jabatan"
            label="Jabatan"
            rules={[{ required: true, message: "Harap diisi" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="alamat"
            label="Alamat"
            rules={[{ required: true, message: "Harap diisi" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="nomor_telepon"
            label="Nomor Telepon"
            rules={[{ required: false }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="jenis_kelamin"
            label="Jenis Kelamin"
            rules={[{ required: true }]}
          >
            <Radio.Group options={jenisKelamin} />
          </Form.Item>
          <Form.Item
            name="foto"
            label="Gambar(optional)"
            rules={[
              {
                validator: (_, value) => {
                  const file = value?.fileList[0];
                  if (!file) {
                    return Promise.resolve();
                  }
                  if (!isImage(file)) {
                    return Promise.reject(
                      new Error("Please upload an image file")
                    );
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <Upload
              name="file"
              accept=".jpg,.jpeg,.png"
              listType="picture-card"
              showUploadList={true}
              onPreview={handlePreview}
              {...propsUpload}
              disabled={loading}
            >
              <div>
                <PlusOutlined />
                <div
                  style={{
                    marginTop: 8,
                  }}
                >
                  {fileList.length === 0 ? (
                    <span style={{ fontSize: "12px" }}>
                      Upload <br />
                      (max 2 mb)
                    </span>
                  ) : (
                    "Ganti"
                  )}
                  {fileList.length === 0 ? "" : ""}
                </div>
              </div>
            </Upload>
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
};

AddPegawai.propTypes = {
  show: propTypes.bool.isRequired,
  onCreate: propTypes.func.isRequired,
  onCancel: propTypes.func.isRequired,
};

export default AddPegawai;
