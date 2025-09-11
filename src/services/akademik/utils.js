import axios from 'axios';
import Cookies from 'js-cookie';
import { message } from 'antd';

const { VITE_BASE_URL } = import.meta.env;

/** ========================
 *  AXIOS INSTANCE + AUTH
 *  ======================== */
export const api = axios.create({
  baseURL: VITE_BASE_URL,
  timeout: 25_000,
});

// inject Authorization header setiap request
api.interceptors.request.use((config) => {
  const token = Cookies.get('token');
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/** Ambil pesan error paling berguna dari server/axios */
const extractErrorMessage = (error) => {
  const serverMsg =
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.response?.data?.msg;
  return serverMsg || error?.message || 'Terjadi kesalahan.';
};

/** Bentuk error terstruktur (tetap konsisten mengembalikan object, bukan throw) */
const shapeError = (error) => ({
  error: true,
  status: error?.response?.status ?? null,
  message: extractErrorMessage(error),
  raw: error,
});

/** Helper: tampilkan error dengan AntD message (opsional durasi) */
const showError = (err, duration = 3) => {
  message.error(err?.message || extractErrorMessage(err), duration);
};

/** ========================
 *  QS BUILDER (opsional)
 *  ======================== */
/**
 * Build querystring dari object, auto-skip null/undefined/''.
 * @param {Record<string, any>} params
 * @returns string (diawali '?' jika ada isi)
 */
export const buildQS = (params = {}) => {
  const sp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v === null || v === undefined) return;
    const val = typeof v === 'string' ? v.trim() : v;
    if (val !== '') sp.append(k, String(val));
  });
  const s = sp.toString();
  return s ? `?${s}` : '';
};

/** ========================
 *  GETTERS
 *  ======================== */
/**
 * GET untuk data list/pagination.
 * Tetap return `data` bila berhasil; kalau error -> tampilkan toast & return error object.
 */
export const getPagination = async (url, params) => {
  try {
    const { data } = await api.get(url, { params });
    return data;
  } catch (error) {
    const shaped = shapeError(error);
    showError(shaped);
    return shaped;
  }
};

/** GET detail by path (bisa pakai params juga) */
export const getDetail = async (url, params) => {
  try {
    const { data } = await api.get(url, { params });
    return data;
  } catch (error) {
    const shaped = shapeError(error);
    showError(shaped);
    return shaped;
  }
};

/** ========================
 *  MUTATIONS JSON
 *  ======================== */
export const postJson = async (url, body = {}, opts = {}) => {
  try {
    const { data } = await api.post(url, body, opts);
    return data;
  } catch (error) {
    const shaped = shapeError(error);
    showError(shaped);
    return shaped;
  }
};

export const putJson = async (url, body = {}, opts = {}) => {
  try {
    const { data } = await api.put(url, body, opts);
    return data;
  } catch (error) {
    const shaped = shapeError(error);
    showError(shaped);
    return shaped;
  }
};

export const patchJson = async (url, body = {}, opts = {}) => {
  try {
    const { data } = await api.patch(url, body, opts);
    return data;
  } catch (error) {
    const shaped = shapeError(error);
    showError(shaped);
    return shaped;
  }
};

export const delJson = async (url, opts = {}) => {
  try {
    const { data } = await api.delete(url, opts);
    return data ?? { status: 'success' };
  } catch (error) {
    const shaped = shapeError(error);
    showError(shaped);
    return shaped;
  }
};

/** ========================
 *  DOWNLOAD FILE (blob)
 *  ======================== */
/**
 * Download file dari endpoint (GET/POST) sebagai blob.
 * @param {'get'|'post'} method
 * @param {string} url
 * @param {object} body - hanya untuk POST
 * @param {string} filename
 */
export const downloadFile = async (method, url, body = {}, filename = 'download') => {
  try {
    const config = { responseType: 'blob' };
    const resp =
      method === 'post'
        ? await api.post(url, body, config)
        : await api.get(url, config);

    const blob = new Blob([resp.data]);
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);

    message.success('File berhasil diunduh.');
    return { ok: true };
  } catch (error) {
    const shaped = shapeError(error);
    showError(shaped);
    return shaped;
  }
};

/** ========================
 *  OPTIONAL: WRAPPER KHUSUS
 *  ======================== */
/**
 * Wrapper aman untuk dipakai di react-query kalau kamu ingin THROW agar onError terpanggil.
 * (Tidak dipakai default, karena hook kamu saat ini expect fungsi mengembalikan data/objek error)
 */
export const rqThrow = {
  get: async (url, params) => {
    const res = await api.get(url, { params });
    return res.data;
  },
  post: async (url, body = {}, opts = {}) => {
    const res = await api.post(url, body, opts);
    return res.data;
  },
  put: async (url, body = {}, opts = {}) => {
    const res = await api.put(url, body, opts);
    return res.data;
  },
  patch: async (url, body = {}, opts = {}) => {
    const res = await api.patch(url, body, opts);
    return res.data;
  },
  delete: async (url, opts = {}) => {
    const res = await api.delete(url, opts);
    return res.data;
  },
};
