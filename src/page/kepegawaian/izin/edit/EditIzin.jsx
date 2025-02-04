import { DatePicker, Form, Input, message, Modal, Radio, Skeleton } from 'antd';
import axios from 'axios';
import { useEffect, useState } from 'react';
import propTypes from 'prop-types';
import { jenis } from '../constant';
import { useIzinDetail } from '../../../../hooks/kepegawaian/izin/useIzinDetail';
import { usePegawaiDetail } from '../../../../hooks/kepegawaian/pegawai/usePegawaiDetail';
import Cookies from 'js-cookie';
import moment from 'moment';
import dayjs from 'dayjs';
import Dragger from 'antd/es/upload/Dragger';
import { FaFilePdf } from 'react-icons/fa';
import { InboxOutlined } from '@ant-design/icons';

const EditIzin = ({ id, onUpdate, onCancel, show }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [newData, setNewData] = useState({});
  const [fileListPdf, setFileListPdf] = useState([]);
  const [uploading, setUploading] = useState(false);

  const { VITE_BASE_URL } = import.meta.env;
  const format = 'YYYY-MM-DD';

  const { data, isLoading, refetch } = useIzinDetail(id, false);

  const pegawai = Cookies.get('user') && JSON.parse(Cookies.get('user'));
  const pegawai_id = pegawai?.pegawaiId;
  const { data: dataPegawai } = usePegawaiDetail(pegawai_id, true);

  useEffect(() => {
    if (show) {
      refetch();
    }
  }, [show, refetch]);

  useEffect(() => {
    if (data) {
      form.setFieldsValue({
        tgl_mulai: dayjs(moment(data?.data?.tgl_mulai).format(format)),
        tgl_selesai: dayjs(moment(data?.data?.tgl_selesai).format(format)),
        jenis: data?.data?.jenis,
        alasan: data?.data?.alasan,
      });
    }
  }, [data, form]);

  const handleSubmit = async () => {
    setUploading(true);
    try {
      await form.validateFields();
      setLoading(true);

      if (newData.filePdf) {
        const formData = new FormData();
        formData.append('file', newData.filePdf);
        const { data } = await axios.post(
          VITE_BASE_URL + '/api/v1/file',
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );

        newData.lampiran = data?.data?.file;
      }

      if (Object.keys(newData).length === 0) {
        message.error('Nothing has changed');
        return;
      }

      await axios.patch(VITE_BASE_URL + `/api/v1/permissions/${id}`, {
        ...newData,
      });

      message.success('izin berhasil diubah');
      form.resetFields();
      onUpdate();
      setFileListPdf([]);
    } catch (error) {
      message.error(error.response?.data?.message || 'Fields Error');
    } finally {
      setUploading(false);
      setLoading(false);
    }
  };

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

  const handleChange = ({ fileList: newFileList }) => {
    if (newFileList.length > 0) {
      const isLt2M = newFileList[0].size / 1024 / 1024 < 2;
      if (!isLt2M) {
        return;
      }
    }
    setFileListPdf(newFileList);
    setNewData({ ...newData, filePdf: newFileList[0]?.originFileObj });
  };

  const propsUploadPdf = {
    onRemove: (file) => handleRemove(file, setFileListPdf, fileListPdf),
    beforeUpload: (file) =>
      beforeUpload(file, isPdf, setFileListPdf, fileListPdf),
    onDrop: (e) => onDrop(e, isPdf),
    fileList: fileListPdf,
    onChange: handleChange,
  };

  const handleRemove = (file, setFileListFunc, fileList) => {
    const newFileList = fileList.filter((f) => f.uid !== file.uid);
    setFileListFunc(newFileList);
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
      title="Edit Izin"
      width="95%"
      style={{
        maxWidth: '600px',
        margin: '0 auto',
        top: 20,
      }}
      bodyStyle={{
        maxHeight: 'calc(100vh - 200px)',
        overflowY: 'auto',
      }}
    >
      {isLoading && <Skeleton active />}
      {!isLoading && (
        <>
          <Form form={form} layout="vertical" className="full-form">
            <div className="first-form">
              <div className="pegawai-info">
                <div>
                  <p>Nama </p>
                  <p>NIP </p>
                  <p>Jabatan </p>
                </div>
                <div>
                  <p>{dataPegawai?.data?.nama}</p>
                  <p>{dataPegawai?.data?.nip}</p>
                  <p>{dataPegawai?.data?.jabatan}</p>
                </div>
              </div>
              <Form.Item
                name="tgl_mulai"
                label="Tanggal Mulai"
                rules={[{ required: true, message: 'Harap diisi' }]}
              >
                <DatePicker
                  format={format}
                  onChange={(date, dateString) =>
                    (newData['tgl_mulai'] = dateString)
                  }
                />
              </Form.Item>
              <Form.Item
                name="tgl_selesai"
                label="Tanggal Selesai"
                rules={[{ required: true, message: 'Harap diisi' }]}
              >
                <DatePicker
                  format={format}
                  onChange={(date, dateString) =>
                    (newData['tgl_selesai'] = dateString)
                  }
                />
              </Form.Item>
              <Form.Item
                name="jenis"
                label="Jenis Izin"
                rules={[{ required: true, message: 'Harap diisi' }]}
                onChange={({ target: { value } }) => (newData['jenis'] = value)}
              >
                <Radio.Group options={jenis} />
              </Form.Item>
              <Form.Item
                name="alasan"
                label="Alasan"
                rules={[{ required: true, message: 'Harap diisi' }]}
                onChange={({ target: { value } }) =>
                  (newData['alasan'] = value)
                }
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
        </>
      )}
    </Modal>
  );
};

EditIzin.propTypes = {
  show: propTypes.bool.isRequired,
  onCancel: propTypes.func.isRequired,
  onUpdate: propTypes.func.isRequired,
  id: propTypes.func.isRequired,
};

export default EditIzin;
