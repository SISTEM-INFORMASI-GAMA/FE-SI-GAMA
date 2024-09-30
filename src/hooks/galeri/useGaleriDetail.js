import { useQuery } from 'react-query';
import { getDetailGaleri } from '../../services/Galeri';

export const useGaleriDetail = (id, enabled) => {
  return useQuery(
    ['get-article-detail', id],
    () => getDetailGaleri(`/api/v1/galeris/${id}`),
    {
      enabled,
    }
  );
};
