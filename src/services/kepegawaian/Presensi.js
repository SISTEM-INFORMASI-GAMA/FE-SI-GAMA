import { message } from 'antd';
import axios from 'axios';
import Cookies from 'js-cookie';

const { VITE_BASE_URL } = import.meta.env;

export const getPresensi = async (url) => {
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

export const getDetailPresensi = async (url) => {
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

export const getRecap = async (url) => {
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

export const getPresensiDB = async (url) => {
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
