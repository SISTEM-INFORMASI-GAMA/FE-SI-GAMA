import { useQuery } from 'react-query';
import { getRecap } from '../../../services/kepegawaian/Presensi';

export const usePresensiRecap = (dataTable, keyword, date) => {
  return useQuery(
    [
      'get-presensi-recap-pagination',
      dataTable.current_page,
      dataTable.per_page,
      keyword,
      date.from || '',
      date.to || '',
    ],
    () =>
      getRecap(
        `/api/v1/attendence/recap?page=${dataTable.current_page}&limit=${dataTable.per_page}&keyword=${keyword}&tanggalMulai=${date.from}&tanggalAkhir=${date.to}`
      )
  );
};
