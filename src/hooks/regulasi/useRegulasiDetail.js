import { useQuery } from 'react-query';
import { getDetailRegulasi } from '../../services/Regulasi';

export const useRegulasiDetail = (id, enabled) => {
  return useQuery(
    ['get-regulasi-detail', id],
    () => getDetailRegulasi(`/api/v1/regulations/${id}`),
    {
      enabled,
    }
  );
};
