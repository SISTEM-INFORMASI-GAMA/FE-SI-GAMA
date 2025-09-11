import { useQuery } from 'react-query';
import { getPagination } from '../../../services/akademik/utils';

/** Cari subject untuk Select (server search by q) */
export const useSubjectOptions = (keyword = '') =>
  useQuery(
    ['subject-options', keyword],
    () => getPagination(`/api/v1/subjects?q=${encodeURIComponent(keyword || '')}`),
    { staleTime: 10_000 }
  );
