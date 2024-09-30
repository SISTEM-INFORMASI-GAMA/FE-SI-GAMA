import { DatePicker, Form, Input, message, Modal, Skeleton, Upload } from 'antd';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import propTypes from 'prop-types';
import { PlusOutlined } from '@ant-design/icons';
import { useGaleriDetail } from "../../../hooks/galeri/useGaleriDetail";
import dayjs from "dayjs";

const format = 'MM-DD-YYYY';


const EditArticle = ({ id, onUpdate, onCancel, show }) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newData, setNewData] = useState({});
  const { VITE_BASE_URL } = import.meta.env;

  const { data, refetch, isLoading } = useGaleriDetail(id, false);

  const handleChange = ({ fileList: newFileList }) => {
    setFileList(newFileList)
    setNewData({ ...newData, image: newFileList[0].originFileObj })
  };


  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
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
          style={{ width: '100%' }}
          src={file.url || file.preview}
        />
      ),
    });
  };
  useEffect(() => {
    if (show) refetch();
  }, [show, refetch]);

  useEffect(() => {
    if (data) {
      form.setFieldsValue({
        nama: data?.data?.nama,
        tanggal: dayjs(data?.data?.tanggal),
      });
      if (data?.data?.gambarGaleri) {
        setFileList([
          {
            uid: '-1',
            name: 'image.png',
            status: 'done',
            url: data?.data?.gambarGaleri,
            thumbUrl: data?.data?.gambarGaleri
          },
        ]);
      }

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
        const { data } = await axios.post(VITE_BASE_URL + "/api/v1/image", {
          image: fileList[0].originFileObj
        }, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        newData.gambarGaleri = data?.data?.image?.image;
        newData.image = undefined;
      }

      await axios.patch(
        VITE_BASE_URL + `/api/v1/galeris/${id}`,
        {
          ...newData,
        },
        {
          headers: {
            Authorization: 'Bearer ' + Cookies.get('token')
          },
        }
      );

      message.success("Update Kegiatan Berhasil");
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
                name='nama'
                label='Judul'
                rules={[{ required: true, message: 'Harap diisi' }]}
              >
                <Input onChange={({ target: { value } }) => (newData["title"] = value)} />
              </Form.Item>
              <Form.Item
                name='tanggal'
                label='Tanggal'
                rules={[{ required: true, message: 'Harap diisi' }]}
              >
                <DatePicker format={format}
                  onChange={(e) => {
                    // change this to dateTime format sequelize
                    newData.tanggal = e.format(format);
                  }} />
              </Form.Item>
              <Form.Item name="gambarGaleri" label="Gambar"
              >
                <Upload
                  name="avatar"
                  listType="picture-card"
                  className="avatar-uploader"
                  showUploadList={true}
                  beforeUpload={() => false}
                  onChange={handleChange}
                  onPreview={handlePreview}
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

EditArticle.propTypes = {
  show: propTypes.bool.isRequired,
  onCancel: propTypes.func.isRequired,
  onUpdate: propTypes.func.isRequired,
  id: propTypes.string.isRequired,
};

export default EditArticle;
