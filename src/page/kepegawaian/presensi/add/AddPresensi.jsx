import { DatePicker, Form, Upload, message, Modal, Radio, Select } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import axios from "axios";
import { useState } from "react";
import propTypes from "prop-types";
import { statusPresensi } from "../constant";
import { usePegawaiPagination } from "../../../../hooks/kepegawaian/pegawai/usePegawaiPagination";
const { Dragger } = Upload;
import { FaFilePdf } from "react-icons/fa";

const AddPresensi = ({ show, onCreate, onCancel }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fileListPdf, setFileListPdf] = useState([]);
  const [uploading, setUploading] = useState(false);
  const { VITE_BASE_URL } = import.meta.env;
  const format = "YYYY-MM-DD";

  const isExcel = (file) => {
    const excelTypes = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
      "application/vnd.ms-excel.sheet.macroEnabled.12",
      "application/vnd.ms-excel.template.macroEnabled.12",
      "application/vnd.ms-excel.addin.macroEnabled.12",
      "application/vnd.ms-excel.sheet.binary.macroEnabled.12",
      "text/csv",
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

  const [dataTable] = useState({
    current_page: 1,
    per_page: 1000,
    total: 0,
  });

  const {
    data: dataPegawai,
    isLoading,
    isFetching,
  } = usePegawaiPagination(dataTable, "");

  const handleSubmit = async () => {
    setUploading(true);
    try {
      const values = await form.validateFields();

      setLoading(true);

      values.nama = dataPegawai.data.find(
        (x) => x.id === values.pegawaiId
      ).nama;

      if (!values.filePdf || values?.filePdf?.fileList.length === 0) {
        message.error("upload salah satu file pdf");
        return;
      }

      const data = await uploadFile(values.filePdf.file);
      if (data) {
        values.lampiran = data?.data?.file;
      }

      await axios.post(VITE_BASE_URL + `/api/v1/attendence`, values);
      message.success("Berhasil menambahkan absensi");
      setFileListPdf([]);
      form.resetFields();
      onCreate();
    } catch (error) {
      message.error(error.response.data.message || error.message);
    } finally {
      setLoading(false);
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
    beforeUpload: (file) =>
      beforeUpload(file, isPdf, setFileListPdf, fileListPdf),
    onDrop: (e) => onDrop(e, isPdf),
    fileList: fileListPdf,
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
      title="Tambah Presensi Pegawai"
    >
      <Form form={form} layout="vertical" className="full-form">
        <div className="first-form">
          <Form.Item
            name="pegawaiId"
            label="Nama Pegawai"
            rules={[{ required: true, message: "Harap diisi" }]}
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
            rules={[{ required: true, message: "Harap diisi" }]}
          >
            <DatePicker format={format} />
          </Form.Item>
          <Form.Item
            name="status"
            label="Status Absensi"
            rules={[{ required: true, message: "Harap diisi" }]}
          >
            <Radio.Group options={statusPresensi} />
          </Form.Item>
          <Form.Item name="filePdf" label="Lampiran">
            <Dragger
              name="filePdf"
              accept=".pdf"
              listType="picture"
              disabled={uploading}
              iconRender={(file) => {
                if (file.type === "application/pdf") {
                  return <FaFilePdf size={45} color="red" />;
                }
                return <InboxOutlined />;
              }}
              {...propsUploadPdf}
            >
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">
                Click or drag file to this area to upload
              </p>
              <p className="ant-upload-hint">Support for PDF file.</p>
            </Dragger>
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
};

AddPresensi.propTypes = {
  show: propTypes.bool.isRequired,
  onCreate: propTypes.func.isRequired,
  onCancel: propTypes.func.isRequired,
};

export default AddPresensi;
