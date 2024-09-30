import { useQuery } from 'react-query';
import { getRegulasi } from '../../services/Regulasi';

export const useRegulasiPagination = (dataTable, keyword) => {
  return useQuery(
    [
      'get-regulasi-pagination',
      dataTable.current_page,
      dataTable.per_page,
      keyword,
    ],
    () =>
      getRegulasi(
        `/api/v1/regulations?page=${dataTable.current_page}&limit=${dataTable.per_page}&keyword=${keyword}`
      )
  );
};
