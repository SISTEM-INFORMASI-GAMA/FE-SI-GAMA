import { useQuery } from 'react-query';
import { getDetailIndikator } from '../../services/Indikator';

export const useIndikatorDetail = (id, enabled) => {
  return useQuery(
    ['get-indikator-detail', id],
    () => getDetailIndikator(`/api/v1/indicators/${id}`),
    {
      enabled,
    }
  );
};
