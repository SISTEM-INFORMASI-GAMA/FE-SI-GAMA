import { useQuery } from 'react-query';
import { getDetail } from '../../../services/akademik/utils';

export const useKelasDetail = (id, datatable, keyword = "", enabled = true) => {
  return useQuery(
    [
      'get-kelas-detail',
      id,
      datatable.current_page,
      datatable.per_page,
      keyword || ""
    ],
    () =>
      getDetail(
        `/api/v1/classes/${id}?page=${datatable.current_page}&limit=${datatable.per_page}&keyword=${keyword}`
      ),
    {
      enabled: !!id && enabled,
    }
  );
};
