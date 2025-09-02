import { useQuery } from 'react-query';
import { getPagination } from "../../../services/akademik/utils";

export const useKelasPagination = (dataTable, keyword) => {
  return useQuery(
    [
      'get-kelas-pagination',
      dataTable.current_page,
      dataTable.per_page,
      keyword,
    ],
    () =>
      getPagination(
        `/api/v1/classes?page=${dataTable.current_page}&limit=${dataTable.per_page}&keyword=${keyword}`
      )
  );
};
