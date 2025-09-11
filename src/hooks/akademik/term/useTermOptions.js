import { useQuery } from 'react-query';
import { getPagination } from '../../../services/akademik/utils';

/** Ambil term untuk dropdown policy. Sesuaikan endpoint kalau beda. */
export const useTermOptions = () =>
  useQuery(
    ['term-options'],
    () => getPagination(`/api/v1/terms?all=true`), // fallback kalau pakai controller lain
    { staleTime: 60_000 }
  );
