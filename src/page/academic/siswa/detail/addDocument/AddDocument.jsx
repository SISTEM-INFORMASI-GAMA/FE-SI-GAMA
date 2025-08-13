import { InboxOutlined } from "@ant-design/icons";
import { Form, Input, Modal, Upload } from "antd";
import { FaFilePdf } from "react-icons/fa";
import { message } from "antd";
import axios from "axios";
import { useState } from "react";
import propTypes from "prop-types";
const { Dragger } = Upload;

const AddDocument = ({ show, onCreate, onCancel, id }) => {
   const [form] = Form.useForm();
   const [fileListPdf, setFileListPdf] = useState([]);
   const [uploading, setUploading] = useState(false);
   const { VITE_BASE_URL } = import.meta.env;

   const isExcel = (file) => {
      const excelTypes = [
         "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
         "application/vnd.ms-excel",
         "application/vnd.ms-excel.sheet.macroEnabled.12",
         "application/vnd.ms-excel.template.macroEnabled.12",
         "application/vnd.ms-excel.addin.macroEnabled.12",
         "application/vnd.ms-excel.sheet.binary.macroEnabled.12",
         "text/csv"
      ];
      return excelTypes.includes(file.type);
   };

   const isPdf = (file) => file.type === "application/pdf";

   const uploadFile = async (upload) => {
      const formData = new FormData();
      formData.append("file", upload);
      const { data } = await axios.post(
         VITE_BASE_URL + "/api/v1/file",
         formData,
         {
            headers: {
               "Content-Type": "multipart/form-data",
            },
         }
      );
      return data;
   };

   const handleUpload = async () => {
      setUploading(true);
      try {
         const values = await form.validateFields();
         if ((!values.filePdf || values?.filePdf?.fileList.length === 0)) {
            message.error("upload salah satu file pdf");
            return;
         }
         const data = await uploadFile(values.filePdf.file);
         if (data) {
            values.file = data?.data?.file;
         }
         await axios.post(VITE_BASE_URL + `/api/v1/document`, {
            nama_file: values.nama_file,
            file: values.file,
            pegawaiId: id,
         });
         setFileListPdf([]);
         form.resetFields();
         onCreate();
      } catch (error) {
         message.error(error.response.data.message || error.message);
      } finally {
         setUploading(false);
      }
   };

   const handleRemove = (file, setFileListFunc, fileList) => {
      const newFileList = fileList.filter((f) => f.uid !== file.uid);
      setFileListFunc(newFileList);
   };

   const beforeUpload = (file, isFileType, setFileListFunc, fileList) => {
      if (!isFileType(file)) {
         message.error(
            `You can only upload ${isFileType === isExcel ? "Excel" : "PDF"} files!`
         );
      }
      if (!isFileType(file) && fileList.length > 0) {
         setFileListFunc([...fileList]);
         return false;
      }
      setFileListFunc(isFileType(file) ? [file] : []);
      return false;
   };

   const onDrop = (e, isFileType) => {
      const droppedFiles = e.dataTransfer.files;
      if (!isFileType(droppedFiles[0])) {
         message.error(
            `You can only upload ${isFileType === isExcel ? "Excel" : "PDF"} files!`
         );
         return;
      }
      message.success("File dropped");
   };


   const propsUploadPdf = {
      onRemove: (file) => handleRemove(file, setFileListPdf, fileListPdf),
      beforeUpload: (file) => beforeUpload(file, isPdf, setFileListPdf, fileListPdf),
      onDrop: (e) => onDrop(e, isPdf),
      fileList: fileListPdf,
   };

   return (
      <Modal
         okText="Simpan"
         cancelText="Batal"
         onOk={handleUpload}
         open={show}
         onCancel={onCancel}
         okButtonProps={{ loading: uploading }}
         cancelButtonProps={{ disabled: uploading }}
         title="Tambah Dokumen pegawai"
      >

         <Form form={form} layout="vertical">
            <Form.Item
               name="nama_file"
               label="Nama File"
               rules={[{ required: true, message: "Harap diisi" }]}
            >
               <Input />
            </Form.Item>
            {/* pdf */}
            <Form.Item
               name='filePdf'
               label='File'
            >
               <Dragger
                  name='filePdf'
                  accept='.pdf'
                  listType='picture'
                  disabled={uploading}
                  iconRender={(file) => {
                     if (file.type === 'application/pdf') {
                        return <FaFilePdf size={45} color='red' />;
                     }
                     return <InboxOutlined />;
                  }}
                  {...propsUploadPdf}
               >
                  <p className='ant-upload-drag-icon'>
                     <InboxOutlined />
                  </p>
                  <p className='ant-upload-text'>
                     Click or drag file to this area to upload
                  </p>
                  <p className='ant-upload-hint'>Support for PDF file.</p>
               </Dragger>
            </Form.Item>
         </Form>
      </Modal>
   );
};

// create props validation
AddDocument.propTypes = {
   show: propTypes.bool.isRequired,
   onCreate: propTypes.func.isRequired,
   onCancel: propTypes.func.isRequired,
   id: propTypes.string.isRequired,
};

export default AddDocument;
