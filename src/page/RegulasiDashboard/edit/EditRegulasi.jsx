import { Form, Input, message, Modal, Skeleton, Upload } from 'antd';
import axios from 'axios';
import { useEffect, useState } from 'react';
import propTypes from 'prop-types';
import { PlusOutlined } from '@ant-design/icons';
import { useRegulasiDetail } from "../../../hooks/regulasi/useRegulasiDetail";


const EditRegulasi = ({ id, onUpdate, onCancel, show }) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newData, setNewData] = useState({});
  const { VITE_BASE_URL } = import.meta.env;

  const { data, refetch, isLoading } = useRegulasiDetail(id, false);

  const handleChange = ({ fileList: newFileList }) => {
    setFileList(newFileList)
    setNewData({ ...newData, image: newFileList[0].originFileObj })
  };

  useEffect(() => {
    if (show) refetch();
  }, [show, refetch]);

  useEffect(() => {
    if (data) {
      form.setFieldsValue({
        title: data?.data?.title,
        kategori: data?.data?.kategori,
        content: data?.data?.content
      });
    }
  }, [data, form]);

  const handleSubmit = async () => {
    try {
      await form.validateFields();
      setLoading(true);
      if (Object.keys(newData).length === 0) {
        message.error('Nothing has changed');
        return;
      }
      // jika ada gambar image upload gambar
      if (fileList.length > 0) {
        // upload gambar only url api/v1/image
        const { data } = await axios.post(VITE_BASE_URL + "/api/v1/file", {
          file: fileList[0].originFileObj
        }, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        newData.file = data?.data?.file?.file;
        newData.image = undefined;
      }

      await axios.patch(
        VITE_BASE_URL + `/api/v1/regulations/${id}`,
        {
          ...newData,
        },
      );

      message.success("Update regulasi Berhasil");
      form.resetFields();
      setFileList([]);
      onUpdate();
    } catch (error) {
      message.error(error.response?.data?.message || 'Fields Error');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelModal = () => {
    setNewData({});
    onCancel();
  };

  return (
    <Modal
      open={show}
      okText='Simpan'
      cancelText='Batal'
      onOk={handleSubmit}
      onCancel={handleCancelModal}
      okButtonProps={{ loading }}
      title='Tambah Artikel'
    >
      {isLoading && <Skeleton active />}
      {!isLoading && (
        <>
          <Form form={form} layout='vertical' className='full-form'>
            <div className='first-form'>
              <Form.Item
                name="title"
                label="Judul"
                rules={[{ required: true, message: "Harap diisi" }]}
              >
                <Input
                  onChange={({ target: { value } }) => (newData["title"] = value)}
                />
              </Form.Item>
              <Form.Item
                name="kategori"
                label="Kategori"
                rules={[{ required: true, message: "Harap diisi" }]}
              >
                <Input
                  onChange={({ target: { value } }) => (newData["kategori"] = value)}
                />
              </Form.Item>
              <Form.Item
                name="content"
                label="Content"
                rules={[{ required: true, message: "Harap diisi" }]}
              >
                <Input
                  onChange={({ target: { value } }) => (newData["content"] = value)}
                />
              </Form.Item>
              <Form.Item name="image" label="File"
              >
                <Upload
                  name="avatar"
                  accept=".pdf"
                  listType="picture-card"
                  className="avatar-uploader"
                  showUploadList={true}
                  beforeUpload={() => false}
                  onChange={handleChange}
                  maxCount={1}
                  fileList={fileList}
                >
                  <div>
                    <PlusOutlined />
                    <div style={{ marginTop: 8 }}>upload</div>
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

EditRegulasi.propTypes = {
  show: propTypes.bool.isRequired,
  onCancel: propTypes.func.isRequired,
  onUpdate: propTypes.func.isRequired,
  id: propTypes.string.isRequired,
};

export default EditRegulasi;
