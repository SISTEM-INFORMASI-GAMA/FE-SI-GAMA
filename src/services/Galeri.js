import { message } from 'antd';
import axios from 'axios';

const { VITE_BASE_URL } = import.meta.env;

export const getGaleri = async (url) => {
  try {
    const { data } = await axios.get(VITE_BASE_URL + url);
    return data;
  } catch (error) {
    message.error(`Gagal mengambil data ( ${error.message} )`, 3);
    // harus return error juga
    return error;
  }
};

export const deleteGaleri = async (url) => {
  try {
    const { data } = await axios.delete(VITE_BASE_URL + url);
    return data;
  } catch (error) {
    message.error(`Gagal menghapus data ( ${error.message} )`, 3);
    return error;
  }
};

export const getDetailGaleri = async (url) => {
  try {
    const { data } = await axios.get(VITE_BASE_URL + url);
    return data;
  } catch (error) {
    message.error(`Gagal mengambil data ( ${error.message} )`, 3);
    return error;
  }
};
