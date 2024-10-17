import { message } from 'antd';
import axios from 'axios';
import Cookies from 'js-cookie';

const { VITE_BASE_URL } = import.meta.env;

export const getUser = async (url) => {
  try {
    const { data } = await axios.get(VITE_BASE_URL + url, {
      headers: { Authorization: 'Bearer ' + Cookies.get('token') },
    });
    return data;
  } catch (error) {
    message.error(`Gagal mengambil data ( ${error.message} )`, 3);
    // harus return error juga
    return error;
  }
};

export const getDetailUser = async (url) => {
  try {
    const { data } = await axios.get(VITE_BASE_URL + url, {
      headers: { Authorization: 'Bearer ' + Cookies.get('token') },
    });
    return data;
  } catch (error) {
    message.error(`Gagal mengambil data ( ${error.message} )`, 3);
    return error;
  }
};
