import { message } from 'antd';
import axios from 'axios';
import Cookies from 'js-cookie';

const { VITE_BASE_URL } = import.meta.env;

export const getDokumen = async (url) => {
  try {
    const { data } = await axios.get(VITE_BASE_URL + url, {
      headers: { Authorization: 'Bearer ' + Cookies.get('token') },
    });
    return data;
  } catch (error) {
    const isNotFound =
      error.response?.status === 404 &&
      error.response?.data?.message ===
        'No documents found related to the given ID';

    if (!isNotFound) {
      message.error(`Gagal mengambil data ( ${error.message} )`, 3);
    }

    return error;
  }
};
