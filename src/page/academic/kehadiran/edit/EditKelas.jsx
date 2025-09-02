import {
  Form,
  Input,
  message,
  Modal,
  Select,
  Skeleton,
} from 'antd';
import axios from 'axios';
import { useEffect, useState } from 'react';
import propTypes from 'prop-types';
import { usePegawaiList } from "../../../../hooks/akademik/wali-kelas/usePegawaiList";
import { useKelasDetail } from "../../../../hooks/akademik/kelas/useKelasDetail";

const EditKelas = ({ id, onUpdate, onCancel, show }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [newData, setNewData] = useState({});
  const { VITE_BASE_URL } = import.meta.env;

  const {
    data: dataEmployee,
    isFetching,
  } = usePegawaiList();

  const { data, isLoading, refetch } = useKelasDetail(id, false);

  useEffect(() => {
    if (show) {
      refetch();
    }
  }, [show, refetch]);

  useEffect(() => {
    if (data) {
      form.setFieldsValue({
        name: data.data.name,
        grade: data.data.grade,
        pegawaiId: data.data.pegawaiId,
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

      await axios.patch(VITE_BASE_URL + `/api/v1/classes/${id}`, {
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
                onChange={(e) => (newData['name'] = e.target.value)}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="grade"
                label="Tingkat"
                onChange={(e) => (newData['grade'] = e.target.value)}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="pegawaiId"
                label="Wali Kelas"
                rules={[{ required: true, message: "Harap diisi" }]}
              >
                <Select
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children.toLowerCase().includes(input.toLowerCase())
                  }
                  onChange={(val) => (newData["pegawaiId"] = val)}
                  disabled={isFetching}
                >
                  {dataEmployee?.data?.map((employee) => (
                    <Select.Option key={employee.id} value={employee.id}>
                      {employee.nama}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </div>
          </Form>
        </>
      )}
    </Modal>
  );
};

EditKelas.propTypes = {
  show: propTypes.bool.isRequired,
  onCancel: propTypes.func.isRequired,
  onUpdate: propTypes.func.isRequired,
  id: propTypes.string.isRequired,
};

export default EditKelas;
