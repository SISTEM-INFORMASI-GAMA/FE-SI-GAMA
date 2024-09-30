import { useQuery } from 'react-query';
import { getGaleri } from '../../services/Galeri';

export const useGaleriPagination = (dataTable, keyword) => {
  return useQuery(
    [
      'get-galeri-pagination',
      dataTable.current_page,
      dataTable.per_page,
      keyword,
    ],
    () =>
      getGaleri(
        `/api/v1/galeris?page=${dataTable.current_page}&limit=${dataTable.per_page}&keyword=${keyword}`
      )
  );
};
