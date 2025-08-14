import { useQuery } from 'react-query';
import { getDetailSiswa } from "../../../services/akademik/Siswa";

export const useKelasDetail = (id, enabled) => {
  return useQuery(
    ['get-kelas-detail', id],
    () => getDetailSiswa(`/api/v1/classes/${id}`),
    {
      enabled: !!id && enabled,
    }
  );
};
