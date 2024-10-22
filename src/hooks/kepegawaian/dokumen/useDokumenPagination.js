import { useQuery } from 'react-query';
import { getDokumen } from '../../../services/kepegawaian/Dokumen';

export const useDokumenPagination = (dataTable, pegawaiId) => {
  return useQuery(
    [
      'get-dokumen-pagination',
      dataTable.current_page,
      dataTable.per_page,
      pegawaiId,
    ],
    () =>
      getDokumen(
        `/api/v1/document?page=${dataTable.current_page}&limit=${dataTable.per_page}&pegawaiId=${pegawaiId}`
      )
  );
};
