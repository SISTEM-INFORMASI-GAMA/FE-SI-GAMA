import { DatePicker, Form, message, Button, Space, Divider } from 'antd';
import axios from 'axios';
import { useState, useRef } from 'react';
import SignaturePad from 'react-signature-canvas';
import propTypes from 'prop-types';
import Cookies from 'js-cookie';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';

const AddPresensi = () => {
  const [form] = Form.useForm();
  const sigCanvas = useRef(null);
  const [loading, setLoading] = useState(false);
  const { VITE_BASE_URL } = import.meta.env;
  const format = 'YYYY-MM-DD';
  const navigate = useNavigate();

  const pegawai = Cookies.get('user') && JSON.parse(Cookies.get('user'));
  const pegawai_id = pegawai?.pegawaiId;

  const signatureToBlob = (dataURL) => {
    try {
      const splitDataURL = dataURL.split(',');
      const byteString = atob(splitDataURL[1]);

      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);

      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      return new Blob([ab], { type: 'image/png' });
    } catch (error) {
      throw new Error('Failed to convert signature');
    }
  };

  const uploadSignature = async (signatureDataURL) => {
    try {
      const formData = new FormData();
      const signatureBlob = signatureToBlob(signatureDataURL);

      formData.append('image', signatureBlob, 'signature.png');

      const response = await axios.post(
        VITE_BASE_URL + '/api/v1/image',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Accept: 'application/json',
          },
        }
      );

      return response.data.data.image;
    } catch (error) {
      throw new Error(
        `Error uploading signature: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  };

  const handleSubmit = async (values) => {
    if (sigCanvas.current.isEmpty()) {
      message.error('Tanda tangan diperlukan!');
      return;
    }

    setLoading(true);
    try {
      const signatureDataURL = sigCanvas.current.toDataURL('image/png');
      const signatureUrl = await uploadSignature(signatureDataURL);

      const attendanceData = {
        pegawaiId: pegawai_id,
        tgl_absensi: dayjs(values['attendanceDate']).format(format),
        status: 'Hadir',
        lampiran: signatureUrl,
      };

      await axios.post(VITE_BASE_URL + '/api/v1/attendence', attendanceData);

      message.success('Absensi berhasil disimpan!');
      form.resetFields();
      sigCanvas.current.clear();
      navigate('/dashboard/hr/home');
    } catch (error) {
      message.error(`${error?.response?.data?.message}`, 3);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Divider orientation="center" plain="true">
        Presensi Harian
      </Divider>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        style={{ maxWidth: 600, margin: '0 auto' }}
      >
        <Form.Item
          label="Tanggal Presensi"
          name="attendanceDate"
          rules={[{ required: true, message: 'Tanggal presensi harus diisi!' }]}
        >
          <DatePicker format={format} placeholder="Masukkan Tanggal Presensi" />
        </Form.Item>

        <p>Silahkan Tanda Tangan Di bawah ini</p>
        <div
          style={{ border: '1px solid #d9d9d9', padding: 10, marginBottom: 20 }}
        >
          <SignaturePad
            ref={sigCanvas}
            canvasProps={{ width: 500, height: 200, className: 'sigCanvas' }}
          />
          <Space style={{ marginTop: 10 }}>
            <Button onClick={() => sigCanvas.current.clear()}>Bersihkan</Button>
          </Space>
        </div>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Simpan Presensi
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

AddPresensi.propTypes = {
  show: propTypes.bool.isRequired,
  onCreate: propTypes.func.isRequired,
  onCancel: propTypes.func.isRequired,
};

export default AddPresensi;
