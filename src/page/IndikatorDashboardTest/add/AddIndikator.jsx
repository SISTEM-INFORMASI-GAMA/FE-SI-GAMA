import {
   Form,
   Input,
   message,
   Modal,
} from "antd";
import axios from "axios";
import { useState } from "react";
import propTypes from "prop-types";


const AddGaleri = ({ show, onCreate, onCancel }) => {
   const [form] = Form.useForm();
   const [loading, setLoading] = useState(false);
   const { VITE_BASE_URL } = import.meta.env;

   const handleSubmit = async () => {
      try {
         const values = await form.validateFields();
         setLoading(true);
         await axios.post(
            VITE_BASE_URL + `/api/v1/indicators`,
            {
               ...values,
            },
         );

         message.success("Indikator Berhasil Ditambahkan");
         form.resetFields();
         onCreate();
      } catch (error) {
         const msg = error?.response?.data?.message || error.message || "Fields Error";
         message.error(msg);
      } finally {
         setLoading(false);
      }
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
         title="Tambah Kegiatan"
      >
         <Form form={form} layout="vertical" className="full-form">
            <div className="first-form">
               <Form.Item
                  name="aspek"
                  label="Aspek"
                  rules={[{ required: true, message: "Harap diisi" }]}
               >
                  <Input />
               </Form.Item>
               <Form.Item
                  name="indikator"
                  label="Indikator"
                  rules={[{ required: true, message: "Harap diisi" }]}
               >
                  <Input />
               </Form.Item>
               <Form.Item
                  name="nama"
                  label="Nama Kebijakan"
                  rules={[{ required: true, message: "Harap diisi" }]}
               >
                  <Input />
               </Form.Item>
               <Form.Item
                  name="penanggungJawab"
                  label="Penanggung Jawab"
                  rules={[{ required: true, message: "Harap diisi" }]}
               >
                  <Input />
               </Form.Item>
               <Form.Item
                  name="penjelasan"
                  label="Penjelasan"
                  rules={[{ required: true, message: "Harap diisi" }]}
               >
                  <Input />
               </Form.Item>
               <Form.Item
                  name="dataPendukung"
                  label="Data Pendukung"
                  rules={[{ required: true, message: "Harap diisi" }]}
               >
                  <Input />
               </Form.Item>
               <Form.Item
                  name="tingkatKematangan"
                  label="Tingkat Kematangan"
                  rules={[{ required: true, message: "Harap diisi" }]}
               >
                  <Input />
               </Form.Item>
            </div>
         </Form>
      </Modal>
   );
};

AddGaleri.propTypes = {
   show: propTypes.bool.isRequired,
   onCreate: propTypes.func.isRequired,
   onCancel: propTypes.func.isRequired,
};


export default AddGaleri;
