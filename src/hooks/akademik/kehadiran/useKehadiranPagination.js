import { useQuery } from 'react-query';
import { getPagination } from '../../../services/akademik/utils';

export const useKehadiranPagination = (
  dataTable,
  keyword,
  from = '',
  to = '',
  classId
) => {
  return useQuery(
    [
      'get-kehadiran-pagination',
      dataTable.current_page,
      dataTable.per_page,
      keyword,
      from,
      to,
      classId,
    ],
    () =>
      getPagination(
        `/api/v1/kehadiran/harian?page=${dataTable.current_page}&limit=${dataTable.per_page}&keyword=${keyword}&from=${from}&to=${to}&classId=${classId}`
      )
  );
};
