import { DatePicker, Form, Input, Upload, message, Modal, Radio } from 'antd';
import axios from 'axios';
import { useState } from 'react';
import propTypes from 'prop-types';
import { jenis } from '../constant';
const { Dragger } = Upload;
import { FaFilePdf } from 'react-icons/fa';
import { InboxOutlined } from '@ant-design/icons';

const AddIzin = ({ show, onCreate, onCancel }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fileListPdf, setFileListPdf] = useState([]);
  const [uploading, setUploading] = useState(false);
  const { VITE_BASE_URL } = import.meta.env;
  const format = 'YYYY-MM-DD';

  const isExcel = (file) => {
    const excelTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
      'application/vnd.ms-excel.sheet.macroEnabled.12',
      'application/vnd.ms-excel.template.macroEnabled.12',
      'application/vnd.ms-excel.addin.macroEnabled.12',
      'application/vnd.ms-excel.sheet.binary.macroEnabled.12',
      'text/csv',
    ];
    return excelTypes.includes(file.type);
  };

  const isPdf = (file) => file.type === 'application/pdf';

  const uploadFile = async (upload) => {
    const formData = new FormData();
    formData.append('file', upload);
    const { data } = await axios.post(
      VITE_BASE_URL + '/api/v1/file',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return data;
  };

  const handleSubmit = async () => {
    setUploading(true);
    try {
      const values = await form.validateFields();
      setLoading(true);

      if (!values.filePdf || values?.filePdf?.fileList.length === 0) {
        message.error('upload salah satu file pdf');
        return;
      }

      const data = await uploadFile(values.filePdf.file);
      if (data) {
        values.lampiran = data?.data?.file;
      }

      await axios.post(VITE_BASE_URL + `/api/v1/permissions`, values);
      message.success('Izin Berhasil Dibuat');
      form.resetFields();
      onCreate();
    } catch (error) {
      message.error(error.response.data.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = (file, setFileListFunc, fileList) => {
    const newFileList = fileList.filter((f) => f.uid !== file.uid);
    setFileListFunc(newFileList);
  };

  const beforeUpload = (file, isFileType, setFileListFunc, fileList) => {
    if (!isFileType(file)) {
      message.error(
        `You can only upload ${isFileType === isExcel ? 'Excel' : 'PDF'} files!`
      );
    }
    if (!isFileType(file) && fileList.length > 0) {
      setFileListFunc([...fileList]);
      return false;
    }
    setFileListFunc(isFileType(file) ? [file] : []);
    return false;
  };

  const onDrop = (e, isFileType) => {
    const droppedFiles = e.dataTransfer.files;
    if (!isFileType(droppedFiles[0])) {
      message.error(
        `You can only upload ${isFileType === isExcel ? 'Excel' : 'PDF'} files!`
      );
      return;
    }
    message.success('File dropped');
  };

  const propsUploadPdf = {
    onRemove: (file) => handleRemove(file, setFileListPdf, fileListPdf),
    beforeUpload: (file) =>
      beforeUpload(file, isPdf, setFileListPdf, fileListPdf),
    onDrop: (e) => onDrop(e, isPdf),
    fileList: fileListPdf,
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
      title="Tambah Pengajuan Izin"
    >
      <Form form={form} layout="vertical" className="full-form">
        <div className="first-form">
          <Form.Item
            name="tgl_mulai"
            label="Tanggal Mulai"
            rules={[{ required: true, message: 'Harap diisi' }]}
          >
            <DatePicker format={format} />
          </Form.Item>
          <Form.Item
            name="tgl_selesai"
            label="Tanggal Selesai"
            rules={[{ required: true, message: 'Harap diisi' }]}
          >
            <DatePicker format={format} />
          </Form.Item>
          <Form.Item
            name="jenis"
            label="Jenis Izin"
            rules={[{ required: true, message: 'Harap diisi' }]}
          >
            <Radio.Group options={jenis} />
          </Form.Item>
          <Form.Item
            name="alasan"
            label="Alasan"
            rules={[{ required: true, message: 'Harap diisi' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="filePdf" label="Lampiran">
            <Dragger
              name="filePdf"
              accept=".pdf"
              listType="picture"
              disabled={uploading}
              iconRender={(file) => {
                if (file.type === 'application/pdf') {
                  return <FaFilePdf size={45} color="red" />;
                }
                return <InboxOutlined />;
              }}
              {...propsUploadPdf}
            >
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">
                Click or drag file to this area to upload
              </p>
              <p className="ant-upload-hint">Support for PDF file.</p>
            </Dragger>
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
};

AddIzin.propTypes = {
  show: propTypes.bool.isRequired,
  onCreate: propTypes.func.isRequired,
  onCancel: propTypes.func.isRequired,
};

export default AddIzin;
