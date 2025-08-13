import { useQuery } from 'react-query';
import { getDetailSiswa } from "../../services/akademik/Siswa";

export const useSiswaDetail = (id, enabled) => {
  return useQuery(
    ['get-pegawai-detail', id],
    () => getDetailSiswa(`/api/v1/students/${id}`),
    {
      enabled: !!id && enabled,
    }
  );
};
