import { Form, Input, message, Modal } from "antd";
import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import propTypes from "prop-types";

const EditSubject = ({ data, show, onUpdate, onCancel }) => {
   const [form] = Form.useForm();
   const [loading, setLoading] = useState(false);
   const { VITE_BASE_URL } = import.meta.env;

   useEffect(() => {
      // adaptasi: sesuaikan struktur payload detail BE kamu
      if (data && show) {
         const d = data || data.data; // cover kedua kemungkinan
         form.setFieldsValue({
            code: d.code,
            name: d.name,
         });
      }
   }, [data, form, show]);

   const initialValues = useMemo(() => {
      const d = data?.data?.data || data?.data || {};
      return { code: d.code, name: d.name };
   }, [data]);

   const handleSubmit = async () => {
      try {
         const values = await form.validateFields();

         // cek perubahan
         const changed = Object.keys(values).some((k) => values[k] !== initialValues[k]);
         if (!changed) {
            message.info("Tidak ada perubahan.");
            return;
         }

         setLoading(true);
         await axios.patch(`${VITE_BASE_URL}/api/v1/subjects/${data.id}`, values);

         message.success("Subject berhasil diubah");
         form.resetFields();
         onCancel();
         onUpdate();
      } catch (error) {
         message.error(error?.response?.data?.message || "Fields Error");
      } finally {
         setLoading(false);
      }
   };

   const handleCancel = () => {
      form.resetFields();
      onCancel();
   };

   return (
      <Modal
         open={show}
         title="Edit Subject"
         okText="Simpan"
         cancelText="Batal"
         onOk={handleSubmit}
         onCancel={handleCancel}
         okButtonProps={{ loading }}
         destroyOnClose
      >
         <Form form={form} layout="vertical" className="full-form">
            <div className="first-form">
               <Form.Item
                  name="code"
                  label="Kode"
                  rules={[
                     { required: true, message: "Harap diisi" },
                     { max: 20, message: "Maks. 20 karakter" },
                  ]}
               >
                  <Input placeholder="contoh: MTK-10" />
               </Form.Item>
               <Form.Item
                  name="name"
                  label="Nama Mapel"
                  rules={[
                     { required: true, message: "Harap diisi" },
                     { max: 120, message: "Maks. 120 karakter" },
                  ]}
               >
                  <Input placeholder="contoh: Matematika" />
               </Form.Item>
            </div>
         </Form>
      </Modal>
   );
};

EditSubject.propTypes = {
   show: propTypes.bool.isRequired,
   onCancel: propTypes.func.isRequired,
   onUpdate: propTypes.func.isRequired,
   data: propTypes.object.isRequired,
};

export default EditSubject;
