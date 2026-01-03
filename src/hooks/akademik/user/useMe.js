import { useQuery } from 'react-query';
import { getDetail } from "../../../services/akademik/utils";

export const useMe = () => {
  return useQuery({
    queryKey: ['me'],
    queryFn: async () => {
      const response = await getDetail('/api/v1/users/me');
      if (response.error) throw new Error(response.message);
      return response.data;
    },
    retry: false,
  });
};