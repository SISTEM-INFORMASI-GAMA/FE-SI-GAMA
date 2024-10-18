import { message } from 'antd';
import axios from 'axios';

const { VITE_BASE_URL } = import.meta.env;

export const uploadImage = async (imageFile) => {
  const formData = new FormData();
  formData.append('image', imageFile);

  try {
    const { data } = await axios.post(
      VITE_BASE_URL + '/api/v1/image',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return data;
  } catch (error) {
    message.error(`Gagal mengunggah gambar ( ${error.message} )`, 3);
    return error;
  }
};
