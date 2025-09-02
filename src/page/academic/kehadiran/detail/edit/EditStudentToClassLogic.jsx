import { Form, message } from "antd";
import axios from "axios";
import { decryptCookies } from "components/Helper/CookiesHelper";
import { useClassList } from "hooks/classes-hook/useClassList";
import { useEffect, useState } from "react";

const EditStudentToClassLogic = (props) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const { VITE_HOST_API } = import.meta.env;
  const { show, onUpdate, onCancel, className, selectedIds } = props;

  // fetch class list
  const { data, isLoading: skeleton, refetch } = useClassList(false);
  const dataClasses = data?.data
    .sort((a, b) => a.name.localeCompare(b.name))
    .filter((x) => x.name !== className);

  useEffect(() => {
    if (show) refetch();
  }, [show, refetch]);

  const onSubmit = () => {
    form
      .validateFields()
      .then(async (fieldsValue) => {
        setLoading(true);
        try {
          const { data } = await axios.put(
            VITE_HOST_API +
              `/academics/mutating-many-students/${fieldsValue.class_id}`,
            selectedIds.map((id) => {
              return {
                student_id: id,
              };
            }),
            { headers: { Authorization: "Bearer " + decryptCookies("token") } }
          );

          message.success(data.message);
          form.resetFields();
          onUpdate();
        } catch (error) {
          alert(error.message);
        }
        setLoading(false);
      })
      .catch(() => alert("Input Field Error"));
  };

  const onCancelModal = () => {
    form.resetFields();
    onCancel();
  };

  return {
    form,
    loading,
    skeleton,
    dataClasses,
    onSubmit,
    onCancelModal,
  };
};

export default EditStudentToClassLogic;
