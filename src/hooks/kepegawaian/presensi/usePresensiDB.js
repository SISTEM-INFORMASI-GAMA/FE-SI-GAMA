import { useQuery } from 'react-query';
import { getPresensiDB } from '../../../services/kepegawaian/Presensi';

export const usePresensiDB = () => {
  return useQuery(['get-presensi-dashboard-pagination'], () =>
    getPresensiDB(`/api/v1/attendence/dashboard`)
  );
};
