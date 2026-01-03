import { useEffect, useState } from 'react';
import {
   Form,
   Input,
   Button,
   message,
   Card,
   Row,
   Col,
   Divider,
   DatePicker,
   Radio,
   Skeleton,
   Tag,
   Typography,
} from 'antd';
import { UserOutlined, MailOutlined, PhoneOutlined, HomeOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { useMe } from "../../../hooks/akademik/user/useMe";
import { patchJson } from "../../../services/akademik/utils";

const { Title } = Typography;

const Profile = () => {
   const [form] = Form.useForm();
   const [loading, setLoading] = useState(false);
   const { data: user, isLoading, refetch } = useMe();

   // Load data ke form saat user didapatkan
   useEffect(() => {
      if (user) {
         form.setFieldsValue({
            // PERBAIKAN: Gunakan .User (U Besar) sesuai hasil include backend
            email: user.User?.email || user.email,
            nama: user.nama || user.name,
            tgl_lahir: user.tgl_lahir ? dayjs(user.tgl_lahir) : null,
            jenis_kelamin:  user.jenis_kelamin,
            religion: user.religion,
            city_of_birth: user.city_of_birth,
            alamat: user.alamat,
            nomor_telepon: user.nomor_telepon,
            nip: user.nip,
            nisn: user.nisn,
         });
      }
   }, [user, form]);

   const onFinish = async (values) => {
      setLoading(true);

      // Format data tanggal untuk backend
      const payload = {
         ...values,
         tgl_lahir: values.tgl_lahir ? values.tgl_lahir.format('YYYY-MM-DD') : null,
         // Map kembali field nama agar konsisten saat kirim ke backend
         name: values.nama,
         nama: values.nama,
      };

      const res = await patchJson('/api/v1/users/updateMe', payload);

      if (!res.error) {
         message.success('Profil berhasil diperbarui');
         refetch();
      }
      setLoading(false);
   };

   if (isLoading) return <Skeleton active paragraph={{ rows: 12 }} />;

   const role = user?.User?.role || user?.role;

   return (
      <div style={{ padding: '24px', maxWidth: '1000px', margin: '0 auto' }}>
         <Card bordered={false} className="profile-card">
            <Row justify="space-between" align="middle">
               <Col>
                  <Title level={3} style={{ margin: 0 }}>
                     <UserOutlined /> Pengaturan Profil
                  </Title>
               </Col>
               <Col>
                  <Tag color="geekblue" style={{ fontSize: '14px', padding: '4px 12px' }}>
                     ROLE: {role?.toUpperCase()}
                  </Tag>
               </Col>
            </Row>

            <Divider />

            <Form
               form={form}
               layout="vertical"
               onFinish={onFinish}
            >
               {/* SEKSI 1: AKUN UTAMA */}
               <Divider orientation="left" plain>Informasi Akun</Divider>
               <Row gutter={24}>
                  <Col xs={24} md={12}>
                     <Form.Item label="Email" name="email">
                        <Input prefix={<MailOutlined />} />
                     </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                     <Form.Item
                        label="Nama Lengkap"
                        name="nama"
                        rules={[{ required: true, message: 'Nama wajib diisi' }]}
                     >
                        <Input placeholder="Masukkan nama lengkap" />
                     </Form.Item>
                  </Col>
               </Row>

               {/* SEKSI 2: DETAIL ROLE (DINAMIS) */}
               <Divider orientation="left" plain>Detail Identitas</Divider>
               <Row gutter={24}>
                  {/* Field untuk Guru/Admin */}
                  {(role === 'teacher' || role === 'pegawai' || role === 'admin') && (
                     <>
                        <Col xs={24} md={12}>
                           <Form.Item label="NIP" name="nip">
                              <Input placeholder="NIP (Terintegrasi)" />
                           </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                           <Form.Item label="Nomor Telepon" name="nomor_telepon">
                              <Input prefix={<PhoneOutlined />} placeholder="08xxx" />
                           </Form.Item>
                        </Col>
                        <Col span={24}>
                           <Form.Item label="Alamat Tinggal" name="alamat">
                              <Input.TextArea prefix={<HomeOutlined />} rows={3} />
                           </Form.Item>
                        </Col>
                     </>
                  )}

                  {/* Field untuk Siswa */}
                  {role === 'siswa' && (
                     <>
                        <Col xs={24} md={12}>
                           <Form.Item label="NISN" name="nisn">
                              <Input  />
                           </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                           <Form.Item label="Agama" name="religion">
                              <Input />
                           </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                           <Form.Item label="Kota Kelahiran" name="city_of_birth">
                              <Input />
                           </Form.Item>
                        </Col>
                     </>
                  )}

                  {/* Field Umum (Semua Role) */}
                  <Col xs={24} md={12}>
                     <Form.Item label="Tanggal Lahir" name="tgl_lahir">
                        <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
                     </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                     <Form.Item label="Jenis Kelamin" name="jenis_kelamin">
                        <Radio.Group>
                           <Radio value="Laki-laki">Laki-laki</Radio>
                           <Radio value="Perempuan">Perempuan</Radio>
                        </Radio.Group>
                     </Form.Item>
                  </Col>
               </Row>

               <div style={{ textAlign: 'right', marginTop: '40px' }}>
                  <Button
                     type="primary"
                     htmlType="submit"
                     loading={loading}
                     size="large"
                     style={{ minWidth: '200px' }}
                  >
                     Simpan Perubahan
                  </Button>
               </div>
            </Form>
         </Card>
      </div>
   );
};

export default Profile;