import { useQuery } from 'react-query';
import { getUser } from '../../services/User';

export const useUserPagination = (dataTable, keyword) => {
  return useQuery(
    [
      'get-user-pagination',
      dataTable.current_page,
      dataTable.per_page,
      keyword,
    ],
    () =>
      getUser(
        `/api/v1/users?page=${dataTable.current_page}&limit=${dataTable.per_page}&search=${keyword}`
      )
  );
};
