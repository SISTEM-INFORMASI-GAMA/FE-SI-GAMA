import {
  DatePicker,
  Form,
  Input,
  message,
  Modal,
  Radio,
  Skeleton,
} from 'antd';
import axios from 'axios';
import { useEffect, useState } from 'react';
import propTypes from 'prop-types';
import { jenisKelamin } from '../constant';
const format = 'YYYY-MM-DD';
import moment from "moment";
import dayjs from "dayjs";
import { useSiswaDetail } from "../../../../hooks/akademik/siswa/useSiswaDetail";

const EditSiswa = ({ id, onUpdate, onCancel, show }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [newData, setNewData] = useState({});
  const { VITE_BASE_URL } = import.meta.env;

  const { data, isLoading, refetch } = useSiswaDetail(id, false);

  useEffect(() => {
    if (show) {
      refetch();
    }
  }, [show, refetch]);


  useEffect(() => {
    if (data) {
      const { data: dataSiswa } = data;
      form.setFieldsValue({
        name: dataSiswa.name,
        gender: dataSiswa.gender,
        religion: dataSiswa.religion,
        nis: dataSiswa.nis,
        nisn: dataSiswa.nisn,
        nik: dataSiswa.nik,
        tgl_lahir: dataSiswa.tgl_lahir ? dayjs(moment(dataSiswa?.tgl_lahir).format(format)) : null,
        city_of_birth: dataSiswa.city_of_birth,
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

      await axios.patch(VITE_BASE_URL + `/api/v1/students/${id}`, {
        ...newData,
      });

      message.success('Siswa berhasil diubah');
      form.resetFields();
      setNewData({});
      onCancel();
      onUpdate();
    } catch (error) {
      message.error(error.response?.data?.message || 'Fields Error');
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
      title="Edit Siswa"
    >
      {isLoading && <Skeleton active />}
      {!isLoading && (
        <>
          <Form form={form} layout="vertical" className="full-form">
            <div className="first-form">
              <Form.Item
                name="name"
                label="Nama"
                rules={[{ required: true, message: 'Harap diisi' }]}
                onChange={({ target: { value } }) =>
                  (newData['name'] = value)
                }
              >
                <Input
                />
              </Form.Item>
              <Form.Item
                name="gender"
                label="Jenis Kelamin"
                onChange={({ target: { value } }) =>
                  (newData['gender'] = value)
                }
              >
                <Radio.Group options={jenisKelamin} />
              </Form.Item>
              <Form.Item
                name="religion"
                label="Agama"
                onChange={({ target: { value } }) =>
                  (newData['religion'] = value)
                }
              >
                <Input />
              </Form.Item>
              <Form.Item name="nis" label="NIS"
                onChange={({ target: { value } }) =>
                  (newData['nis'] = value)
                }
              >
                <Input />
              </Form.Item>
              <Form.Item name="nisn" label="NISN"
                onChange={({ target: { value } }) =>
                  (newData['nisn'] = value)
                }
              >
                <Input />
              </Form.Item>
              <Form.Item name="nik" label="NIK"
                onChange={({ target: { value } }) =>
                  (newData['nik'] = value)
                }
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="tgl_lahir"
                label="Tanggal Lahir"
              >
                <DatePicker format={format}
                  onChange={(e) => {
                    newData.tgl_lahir = dayjs(e).format(format);
                  }}
                />
              </Form.Item>
              <Form.Item
                name="city_of_birth"
                label="Kota Lahir"
                onChange={({ target: { value } }) =>
                  (newData['city_of_birth'] = value)
                }
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

EditSiswa.propTypes = {
  show: propTypes.bool.isRequired,
  onCancel: propTypes.func.isRequired,
  onUpdate: propTypes.func.isRequired,
  id: propTypes.string.isRequired,
};

export default EditSiswa;
