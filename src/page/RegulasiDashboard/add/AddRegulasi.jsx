import {
   Form,
   Input,
   message,
   Modal,
   Upload,
} from "antd";
import axios from "axios";
import { useState } from "react";
import propTypes from "prop-types";

const AddRegulasi = ({ show, onCreate, onCancel }) => {
   const [form] = Form.useForm();
   const [fileList, setFileList] = useState([]);
   const [loading, setLoading] = useState(false);
   const { VITE_BASE_URL } = import.meta.env;

   const handleSubmit = async () => {
      try {
         const values = await form.validateFields();
         setLoading(true);
         // jika ada image upload gambar
         if (fileList.length > 0) {
            // upload gambar only url api/v1/image
            const { data } = await axios.post(VITE_BASE_URL + "/api/v1/file", {
               file: fileList[0]
            }, {
               headers: {
                  "Content-Type": "multipart/form-data",
               },
            });
            values.file = data?.data?.file?.file;
         }

         await axios.post(
            VITE_BASE_URL + `/api/v1/regulations`,
            {
               ...values,
            },
         );

         message.success("Kegiatan Berhasil Ditambahkan");
         form.resetFields();
         setFileList([]);
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
      setFileList([]);
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
         title="Tambah Regulasi"
      >
         <Form form={form} layout="vertical" className="full-form">
            <div className="first-form">
               <Form.Item
                  name="title"
                  label="Judul"
                  rules={[{ required: true, message: "Harap diisi" }]}
               >
                  <Input />
               </Form.Item>
               <Form.Item
                  name="kategori"
                  label="Kategori"
                  rules={[{ required: true, message: "Harap diisi" }]}
               >
                  <Input />
               </Form.Item>
               <Form.Item
                  name="content"
                  label="Content"
                  rules={[{ required: true, message: "Harap diisi" }]}
               >
                  <Input />
               </Form.Item>
               <Form.Item
                  label="File"
                  rules={[{ required: true, message: "Harap diisi" }]}
               >
                  <Upload
                     accept=".pdf"
                     listType="picture-card"
                     beforeUpload={(file) => {
                        if (file.size > 2000000) {
                           message.error("Maks File 2MB");
                           return false;
                        }
                        if (fileList.length > 1) {
                           message.error("Allowed only 1 file");
                        }
                        if (file.size <= 2000000) {
                           setFileList([file]);
                           return false;
                        }
                     }}
                     onRemove={(file) => {
                        const index = fileList.indexOf(file);
                        const newFileList = fileList.slice();
                        newFileList.splice(index, 1);
                        setFileList(newFileList);
                     }}
                  >
                     {fileList.length > 0 ? null : "+ Upload"}
                  </Upload>
               </Form.Item>
            </div>
         </Form>
      </Modal>
   );
};

AddRegulasi.propTypes = {
   show: propTypes.bool.isRequired,
   onCreate: propTypes.func.isRequired,
   onCancel: propTypes.func.isRequired,
};


export default AddRegulasi;
