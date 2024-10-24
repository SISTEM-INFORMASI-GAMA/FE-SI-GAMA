import { Form, Input, message, Modal, Radio, Select, Skeleton } from 'antd';
import axios from 'axios';
import { useEffect, useState } from 'react';
import propTypes from 'prop-types';
import { userRoles } from '../constant';
import { useUserDetail } from '../../../../hooks/kepegawaian/user/useUserDetail';
import { usePegawaiPagination } from '../../../../hooks/kepegawaian/pegawai/usePegawaiPagination';

const EditUser = ({ id, onUpdate, onCancel, show }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [newData, setNewData] = useState({});
  const { VITE_BASE_URL } = import.meta.env;

  const { data, isLoading, refetch } = useUserDetail(id, false);

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
        email: data.data.email,
        pegawaiId: data.data.username,
        role: data.data.role,
      });
    }
  }, [data, form]);

  const handleSubmit = async () => {
    try {
      await form.validateFields();
      setLoading(true);

      newData.username = dataPegawai.data.find(
        (x) => x.id === newData.pegawaiId
      ).nama;

      if (Object.keys(newData).length === 0) {
        message.error('Nothing has changed');
        return;
      }
      await axios.patch(VITE_BASE_URL + `/api/v1/users/${id}`, {
        ...newData,
      });

      message.success('user berhasil diubah');
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
      title="Edit Users"
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
                  onChange={(value) =>
                    setNewData({ ...newData, pegawaiId: value })
                  }
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
                name="email"
                label="Email"
                rules={[{ required: true, message: 'Harap diisi' }]}
                onChange={({ target: { value } }) => (newData['email'] = value)}
              >
                <Input placeholder="Masukan Email" />
              </Form.Item>
              <Form.Item
                name="role"
                label="Role"
                rules={[{ required: true, message: 'Harap diisi' }]}
                onChange={({ target: { value } }) => (newData['role'] = value)}
              >
                <Radio.Group
                  options={userRoles}
                  // onChange={(e) =>
                  //   setNewData({ ...newData, role: e.target.value })
                  // }
                />
              </Form.Item>
            </div>
          </Form>
        </>
      )}
    </Modal>
  );
};

EditUser.propTypes = {
  show: propTypes.bool.isRequired,
  onCancel: propTypes.func.isRequired,
  onUpdate: propTypes.func.isRequired,
  id: propTypes.string.isRequired,
};

export default EditUser;
