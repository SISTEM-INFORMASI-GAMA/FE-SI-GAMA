import { useQuery } from 'react-query';
import { getPegawai } from '../../../services/kepegawaian/Pegawai';

export const usePegawaiList = () => {
  return useQuery(
    [
      'get-pegawai-list',
    ],
    () =>
      getPegawai(
        `/api/v1/employees?page=${1}&limit=${100000}&keyword=${''}` 
      )
  );
};
