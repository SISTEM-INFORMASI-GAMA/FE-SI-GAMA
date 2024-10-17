import {
   Form,
   Input,
   message,
   Modal,
   Radio,
} from "antd";
import axios from "axios";
import { useState } from "react";
import propTypes from "prop-types";
import { userRoles } from "../constant";



const AddUser = ({ show, onCreate, onCancel }) => {
   const [form] = Form.useForm();
   const [loading, setLoading] = useState(false);
   const { VITE_BASE_URL } = import.meta.env;


   const handleSubmit = async () => {
      try {
         const values = await form.validateFields();
         setLoading(true);

         await axios.post(
            VITE_BASE_URL + `/api/v1/users/signup`, values,
         );
         message.success("User Berhasil Dibuat");
         form.resetFields();
         onCreate();
      } catch (error) {
         message.error(error.response.data.message || error.message);
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
         title="Tambah User"
      >
         <Form form={form} layout="vertical" className="full-form">
            <div className="first-form">
               <Form.Item
                  name="email"
                  label="Email"
                  rules={[{ required: true, message: "Harap diisi" }]}
               >
                  <Input />
               </Form.Item>
               <Form.Item
                  name="password"
                  label="Password"
                  rules={[{ required: true, message: "Harap diisi" }]}
               >
                  <Input.Password />
               </Form.Item>
               <Form.Item
                  name="name"
                  label="Nama"
                  rules={[{ required: true, message: "Harap diisi" }]}
               >
                  <Input />
               </Form.Item>
               <Form.Item
                  name="role"
                  label="Role"
               >
                  <Radio.Group options={userRoles} />
               </Form.Item>
            </div>
         </Form>
      </Modal>
   );
};

AddUser.propTypes = {
   show: propTypes.bool.isRequired,
   onCreate: propTypes.func.isRequired,
   onCancel: propTypes.func.isRequired,
};


export default AddUser;
