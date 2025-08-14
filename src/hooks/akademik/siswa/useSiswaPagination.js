import { useQuery } from 'react-query';
import { getSiswa } from "../../../services/akademik/Siswa";

export const useSiswaPagination = (dataTable, keyword) => {
  return useQuery(
    [
      'get-siswa-pagination',
      dataTable.current_page,
      dataTable.per_page,
      keyword,
    ],
    () =>
      getSiswa(
        `/api/v1/students?page=${dataTable.current_page}&limit=${dataTable.per_page}&keyword=${keyword}`
      )
  );
};
