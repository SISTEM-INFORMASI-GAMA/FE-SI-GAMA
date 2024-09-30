import { message } from 'antd';
import axios from 'axios';
import Cookies from 'js-cookie';

const { VITE_BASE_URL } = import.meta.env;

export const DeleteApi = async ({ url, dataId, refetch }) => {
  try {
    const { data } = await axios.delete(VITE_BASE_URL + url + dataId, {
      headers: { Authorization: 'Bearer ' + Cookies.get('token') },
    });
    const msg = data.message || 'Data berhasil dihapus';
    message.success(msg, 2);
    refetch && refetch();
  } catch (error) {
    message.error(`Gagal menghapus data ( ${error.message} )`);
  }
};
