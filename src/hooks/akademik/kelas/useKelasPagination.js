import { useQuery } from 'react-query';
import { getSiswa } from "../../../services/akademik/Siswa";

export const useKelasPagination = (dataTable, keyword) => {
  return useQuery(
    [
      'get-kelas-pagination',
      dataTable.current_page,
      dataTable.per_page,
      keyword,
    ],
    () =>
      getSiswa(
        `/api/v1/classes?page=${dataTable.current_page}&limit=${dataTable.per_page}&keyword=${keyword}`
      )
  );
};
