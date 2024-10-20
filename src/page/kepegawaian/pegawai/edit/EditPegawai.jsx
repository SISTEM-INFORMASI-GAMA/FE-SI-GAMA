import {
  DatePicker,
  Form,
  Input,
  message,
  Modal,
  Radio,
  Skeleton,
  Upload,
} from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import propTypes from "prop-types";
import { jenisKelamin } from "../../user/constant";
import { usePegawaiDetail } from "../../../../hooks/kepegawaian/pegawai/usePegawaiDetail";
import dayjs from "dayjs";
import moment from "moment";
const format = "YYYY-MM-DD";
import { PlusOutlined } from "@ant-design/icons";

const EditPegawai = ({ id, onUpdate, onCancel, show }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [newData, setNewData] = useState({});
  const [fileList, setFileList] = useState([]);
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
        tgl_lahir: dayjs(moment(data?.data?.tgl_lahir).format(format)),
        jabatan: data.data.jabatan,
        alamat: data.data.alamat,
        nomor_telepon: data.data.nomor_telepon,
        jenis_kelamin: data.data.jenis_kelamin,
      });
    }

    if (data?.data?.foto) {
      setFileList([
        {
          uid: "-1",
          name: data?.data?.foto,
          status: "done",
          url: data?.data?.foto,
        },
      ]);
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

      if (newData.image) {
        const formData = new FormData();
        console.log(newData.image);
        formData.append("image", newData.image);
        const { data } = await axios.post(
          VITE_BASE_URL + "/api/v1/image",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        newData.foto = data?.data?.image;
      }

      await axios.patch(VITE_BASE_URL + `/api/v1/employees/${id}`, {
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

  const handleChange = ({ fileList: newFileList }) => {
    if (newFileList.length > 0) {
      const isLt2M = newFileList[0].size / 1024 / 1024 < 2;
      if (!isLt2M) {
        return;
      }
    }
    setFileList(newFileList);
    setNewData({ ...newData, image: newFileList[0]?.originFileObj });
  };

  const beforeUpload = (file) => {
    if (!isImage(file)) {
      message.error(
        "hanya bisa upload file gambar (.jpeg, .jpg, .png) atau pdf"
      );
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
    setNewData({ ...newData, image: null });
    form.setFieldValue("file", null);
  };

  const propsUpload = {
    onRemove: handleRemove,
    beforeUpload,
    fileList,
    onChange: handleChange,
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
                rules={[{ required: true, message: "harap diisi" }]}
              >
                <DatePicker
                  format={format}
                  placeholder="Pilih Tanggal"
                  onChange={(e) => {
                    newData.tgl_lahir = dayjs(e).format(format);
                  }}
                />
              </Form.Item>
              <Form.Item
                name="jabatan"
                label="Jabatan"
                rules={[{ required: true, message: "Harap diisi" }]}
                onChange={({ target: { value } }) =>
                  (newData["jabatan"] = value)
                }
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="alamat"
                label="Alamat"
                rules={[{ required: true, message: "Harap diisi" }]}
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
                rules={[{ required: true, message: "Harap diisi" }]}
                onChange={({ target: { value } }) =>
                  (newData["jenis_kelamin"] = value)
                }
              >
                <Radio.Group options={jenisKelamin} />
              </Form.Item>
              <Form.Item
                name="foto"
                label="Foto(optional)"
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
                    </div>
                  </div>
                </Upload>
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
