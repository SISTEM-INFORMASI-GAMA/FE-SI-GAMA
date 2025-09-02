import { useQuery } from 'react-query';
import { getPagination } from "../../../services/akademik/utils";

export const useKelasList = () => {
  return useQuery(
    [
      'get-kelas-list-pagination',
    ],
    () =>
      getPagination(
        `/api/v1/classes?page=${1}&limit=${10000}&keyword=`
      )
  );
};
