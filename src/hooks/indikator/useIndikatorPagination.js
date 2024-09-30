import { useQuery } from 'react-query';
import { getGaleri } from '../../services/Galeri';

export const useIndikatorPagination = (dataTable, keyword) => {
  return useQuery(
    [
      'get-indikator-pagination',
      dataTable.current_page,
      dataTable.per_page,
      keyword,
    ],
    () =>
      getGaleri(
        `/api/v1/indicators?page=${dataTable.current_page}&limit=${dataTable.per_page}&keyword=${keyword}`
      )
  );
};
