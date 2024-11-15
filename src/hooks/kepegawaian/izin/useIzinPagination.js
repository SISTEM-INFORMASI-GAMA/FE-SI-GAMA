import { useQuery } from 'react-query';
import { getIzin } from '../../../services/kepegawaian/Izin';

export const useIzinPagination = (dataTable, keyword) => {
  return useQuery(
    [
      'get-izin-pagination',
      dataTable.current_page,
      dataTable.per_page,
      keyword,
    ],
    () =>
      getIzin(
        `/api/v1/permissions?page=${dataTable.current_page}&limit=${dataTable.per_page}&keyword=${keyword}`
      )
  );
};
