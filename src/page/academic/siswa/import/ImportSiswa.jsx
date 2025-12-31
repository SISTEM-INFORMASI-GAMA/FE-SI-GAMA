import { Modal, Upload, Button, message, Alert, Space, Typography } from 'antd';
import { UploadOutlined, FileExcelOutlined } from '@ant-design/icons';
import { useState } from 'react';
import axios from 'axios';
import propTypes from 'prop-types';
import Cookies from 'js-cookie';

const { Text } = Typography;

const ImportSiswa = ({ show, onImportSuccess, onCancel }) => {
  const [fileList, setFileList] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [importSummary, setImportSummary] = useState(null);
  const { VITE_BASE_URL } = import.meta.env;

  const handleUpload = async () => {
    if (fileList.length === 0) {
      return message.error('Silahkan pilih file terlebih dahulu');
    }

    const formData = new FormData();
    formData.append('file', fileList[0]);

    setUploading(true);
    setImportSummary(null);

    try {
      const token = Cookies.get('token')
      const res = await axios.post(`${VITE_BASE_URL}/api/v1/students/import`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      message.success('Proses import berhasil diselesaikan');
      setImportSummary(res.data.data); // Simpan summary (success, skipped, errors)
      
      // Jika ingin otomatis refresh tabel setelah upload
      if (res.data.data.success > 0) {
        onImportSuccess();
      }
    } catch (error) {
      message.error(error.response?.data?.message || 'Gagal mengupload file');
    } finally {
      setUploading(false);
    }
  };

  const propsUpload = {
    onRemove: () => setFileList([]),
    beforeUpload: (file) => {
      const isExcel = 
        file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || 
        file.name.endsWith('.xlsx') || 
        file.name.endsWith('.xls');
      
      if (!isExcel) {
        message.error(`${file.name} bukan file excel yang valid`);
        return Upload.LIST_IGNORE;
      }
      
      setFileList([file]);
      return false; // Mencegah upload otomatis
    },
    fileList,
    maxCount: 1,
  };

  const handleClose = () => {
    setFileList([]);
    setImportSummary(null);
    onCancel();
  };

  return (
    <Modal
      open={show}
      title="Import Data Siswa via Excel"
      onCancel={handleClose}
      footer={[
        <Button key="back" onClick={handleClose}>
          Tutup
        </Button>,
        <Button
          key="submit"
          type="primary"
          icon={<UploadOutlined />}
          loading={uploading}
          onClick={handleUpload}
          disabled={fileList.length === 0}
        >
          Mulai Import
        </Button>,
      ]}
    >
      <Space direction="vertical" style={{ width: '100%' }} size="middle">
        <Alert
          message="Informasi Format"
          description={
            <ul style={{ paddingLeft: '20px' }}>
              <li>Gunakan file format .xlsx atau .xls</li>
              <li>Header wajib: <b>nama, email, nisn, nama_kelas</b></li>
              <li>Jika email kosong, sistem akan menggunakan format <b>nisn@temporary.id</b></li>
            </ul>
          }
          type="info"
          showIcon
        />

        <Upload {...propsUpload}>
          <Button icon={<FileExcelOutlined />}>Pilih File Excel</Button>
        </Upload>

        {importSummary && (
          <Alert
            message="Hasil Import"
            type={importSummary.errors.length > 0 ? "warning" : "success"}
            description={
              <div>
                <Text success>Berhasil: {importSummary.success}</Text> <br />
                <Text type="danger">Gagal/Skip: {importSummary.skipped}</Text>
                {importSummary.errors.length > 0 && (
                  <div style={{ marginTop: '10px', maxHeight: '100px', overflowY: 'auto' }}>
                    <Text strong>Detail Error:</Text>
                    {importSummary.errors.map((err, i) => (
                      <div key={i} style={{ fontSize: '12px', color: 'red' }}>- {err}</div>
                    ))}
                  </div>
                )}
              </div>
            }
          />
        )}
      </Space>
    </Modal>
  );
};

ImportSiswa.propTypes = {
  show: propTypes.bool.isRequired,
  onImportSuccess: propTypes.func.isRequired,
  onCancel: propTypes.func.isRequired,
};

export default ImportSiswa;