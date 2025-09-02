import { useQuery } from 'react-query';
import { getDetail } from '../../../services/akademik/utils';

export const useStudentNotInClass = (
  id,
  datatable,
  keyword,
  enabled = true
) => {
  return useQuery(
    [
      'get-siswa-list-not-in-class-detail',
      id,
      datatable.current_page,
      datatable.per_page,
      keyword,
    ],
    () =>
      getDetail(
        `/api/v1/classes/${id}/students/not-in?page=${datatable.current_page}&limit=${datatable.per_page}&keyword=${keyword}`
      ),
    {
      enabled: !!id && enabled,
    }
  );
};
