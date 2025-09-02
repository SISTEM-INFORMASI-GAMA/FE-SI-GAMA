import { useQuery } from 'react-query';
import { getDetail } from "../../../services/akademik/utils";

export const useSiswaDetail = (id, enabled) => {
  return useQuery(
    ['get-siswa-detail', id],
    () => getDetail(`/api/v1/students/${id}`),
    {
      enabled: !!id && enabled,
    }
  );
};
