import { useQuery } from 'react-query';
import { getDetail } from '../../../services/akademik/utils';

export const useTermDetail = (id, enabled = true) => {
  return useQuery(
    ['get-term-detail', id],
    () => getDetail(`/api/v1/terms/${id}`),
    {
      enabled: !!id && enabled,
      staleTime: 15_000,
    }
  );
};
