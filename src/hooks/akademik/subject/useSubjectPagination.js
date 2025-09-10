import { useQuery } from 'react-query';
import { getPagination } from '../../../services/akademik/utils';

/**
 * Pagination hook untuk Subject
 * @param {{current_page:number, per_page:number}} dataTable
 * @param {string} keyword
 * @param {{ sortBy?: string, sortDir?: 'ASC'|'DESC', extra?: Record<string,any> }} options
 */
export const useSubjectPagination = (dataTable, keyword = '', options = {}) => {
  const { sortBy = 'name', sortDir = 'ASC', extra = {} } = options;

  const qs = new URLSearchParams({
    page: String(dataTable.current_page || 1),
    limit: String(dataTable.per_page || 15),
    q: (keyword || '').trim(),   // samain dengan pola hook siswa kamu
    sortBy,
    sortDir,
    ...Object.fromEntries(
      Object.entries(extra).map(([k, v]) => [k, String(v)])
    ),
  }).toString();

  return useQuery(
    ['get-subject-pagination', dataTable.current_page, dataTable.per_page, keyword, sortBy, sortDir, extra],
    () => getPagination(`/api/v1/subjects?${qs}`),
    {
      keepPreviousData: true,
      staleTime: 15_000,   // biar UX lebih halus saat pindah page
    }
  );
};
