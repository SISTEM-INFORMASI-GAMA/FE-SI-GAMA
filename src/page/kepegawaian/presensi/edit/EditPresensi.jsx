import {
  DatePicker,
  Form,
  Input,
  message,
  Modal,
  Radio,
  Select,
  Skeleton,
} from 'antd';
import axios from 'axios';
import { useEffect, useState } from 'react';
import propTypes from 'prop-types';
import { statusPresensi } from '../constant';
import { usePresensiDetail } from '../../../../hooks/kepegawaian/presensi/usePresensiDetail';
import dayjs from 'dayjs';
import moment from 'moment';
import { usePegawaiPagination } from '../../../../hooks/kepegawaian/pegawai/usePegawaiPagination';

const EditPresensi = ({ id, onUpdate, onCancel, show }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [newData, setNewData] = useState({});
  const { VITE_BASE_URL } = import.meta.env;
  const format = 'YYYY-MM-DD';

  const { data, isLoading, refetch } = usePresensiDetail(id, false);

  const [dataTable] = useState({
    current_page: 1,
    per_page: 1000,
    total: 0,
  });

  const { data: dataPegawai, isFetching } = usePegawaiPagination(dataTable, '');

  useEffect(() => {
    if (show) {
      refetch();
    }
  }, [show, refetch]);

  useEffect(() => {
    if (data) {
      form.setFieldsValue({
        pegawaiId: data?.data?.nama,
        tgl_absensi: dayjs(moment(data?.data?.tgl_absensi).format(format)),
        status: data?.data?.status,
        lampiran: data?.data?.lampiran,
      });
    }
  }, [data, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      const selectedPegawai = dataPegawai?.data?.find(
        (x) => x.id === values.pegawaiId
      );

      const updatedData = {
        pegawaiId: values.pegawaiId || data?.data?.pegawaiId,
        tgl_absensi: values.tgl_absensi || data?.data?.tgl_absensi,
        status: values.status || data?.data?.status,
        lampiran: values.lampiran || data?.data?.lampiran,
        nama: selectedPegawai?.nama || data?.data?.nama,
      };

      if (Object.keys(updatedData).length === 0) {
        message.error('Nothing has changed');
        return;
      }

      await axios.patch(
        VITE_BASE_URL + `/api/v1/attendence/${id}`,
        updatedData
      );

      message.success('Absensi berhasi diubah');
      form.resetFields();
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
      title="Edit Presensi Pegawai"
    >
      {isLoading && <Skeleton active />}
      {!isLoading && (
        <>
          <Form form={form} layout="vertical" className="full-form">
            <div className="first-form">
              <Form.Item
                name="pegawaiId"
                label="Nama Pegawai"
                rules={[{ required: true, message: 'Harap diisi' }]}
              >
                <Select
                  placeholder="Pilih Pegawai"
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children.toLowerCase().includes(input.toLowerCase())
                  }
                  disabled={isFetching || isLoading}
                >
                  {dataPegawai?.data?.map((x) => (
                    <Select.Option
                      key={x.id}
                      value={x.id}
                      className="select-option-foundation"
                    >
                      {x.nama}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                name="tgl_absensi"
                label="Tanggal"
                rules={[{ required: true, message: 'Harap diisi' }]}
              >
                <DatePicker format={format} />
              </Form.Item>
              <Form.Item
                name="status"
                label="Status Absensi"
                rules={[{ required: true, message: 'Harap diisi' }]}
              >
                <Radio.Group options={statusPresensi} />
              </Form.Item>
              <Form.Item
                name="password"
                label="Password"
                rules={[{ required: false, message: 'Harap diisi' }]}
              >
                <Input.Password />
              </Form.Item>
            </div>
          </Form>
        </>
      )}
    </Modal>
  );
};

EditPresensi.propTypes = {
  show: propTypes.bool.isRequired,
  onCancel: propTypes.func.isRequired,
  onUpdate: propTypes.func.isRequired,
  id: propTypes.string.isRequired,
};

export default EditPresensi;
