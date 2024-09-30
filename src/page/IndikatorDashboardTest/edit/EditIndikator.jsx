import { Form, Input, message, Modal, Skeleton } from 'antd';
import axios from 'axios';
import { useEffect, useState } from 'react';
import propTypes from 'prop-types';
import { useIndikatorDetail } from "../../../hooks/indikator/useIndikatorDetail";

const EditArticle = ({ id, onUpdate, onCancel, show }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [newData, setNewData] = useState({});
  const { VITE_BASE_URL } = import.meta.env;

  const { data, refetch, isLoading } = useIndikatorDetail(id, false);

  useEffect(() => {
    if (show) refetch();
  }, [show, refetch]);

  useEffect(() => {
    if (data) {
      form.setFieldsValue({
        aspek: data?.data?.aspek,
        indikator: data?.data?.indikator,
        nama: data?.data?.nama,
        penanggungJawab: data?.data?.penanggungJawab,
        penjelasan: data?.data?.penjelasan,
        dataPendukung: data?.data?.dataPendukung,
        tingkatKematangan: data?.data?.tingkatKematangan,
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

      await axios.patch(
        VITE_BASE_URL + `/api/v1/indicators/${id}`,
        {
          ...newData,
        }
      );

      message.success("Update indikator Berhasil");
      form.resetFields();
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
                name="aspek"
                label="Aspek"
                rules={[{ required: true, message: "Harap diisi" }]}
              >
                <Input
                  onChange={({ target: { value } }) => (newData["aspek"] = value)}
                />
              </Form.Item>
              <Form.Item
                name="indikator"
                label="Indikator"
                rules={[{ required: true, message: "Harap diisi" }]}
              >
                <Input onChange={({ target: { value } }) => (newData["Indikator"] = value)} />
              </Form.Item>
              <Form.Item
                name="nama"
                label="Nama Kebijakan"
                rules={[{ required: true, message: "Harap diisi" }]}
              >
                <Input
                  onChange={({ target: { value } }) => (newData["nama"] = value)}
                />
              </Form.Item>
              <Form.Item
                name="penanggungJawab"
                label="Penanggung Jawab"
                rules={[{ required: true, message: "Harap diisi" }]}
              >
                <Input onChange={({ target: { value } }) => (newData["penanggungJawab"] = value)} />
              </Form.Item>
              <Form.Item
                name="penjelasan"
                label="Penjelasan"
                rules={[{ required: true, message: "Harap diisi" }]}
              >
                <Input onChange={({ target: { value } }) => (newData["penjelasan"] = value)} />
              </Form.Item>
              <Form.Item
                name="dataPendukung"
                label="Data Pendukung"
                rules={[{ required: true, message: "Harap diisi" }]}
              >
                <Input onChange={({ target: { value } }) => (newData["dataPendukung"] = value)} />
              </Form.Item>
              <Form.Item
                name="tingkatKematangan"
                label="Tingkat Kematangan"
                rules={[{ required: true, message: "Harap diisi" }]}
              >
                <Input onChange={({ target: { value } }) => (newData["tingkatKematangan"] = value)} />
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
