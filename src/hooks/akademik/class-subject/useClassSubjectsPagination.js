import { useQuery } from 'react-query';
import { getPagination } from '../../../services/akademik/utils';

/**
 * Pagination untuk class-subject
 * BE support: q, page, limit, sortBy, sortDir, all
 */
export const useClassSubjectsPagination = (
  classId,
  pageState,
  keyword = '',
  options = {}
) => {
  const { sortBy = 'subject.name', sortDir = 'ASC', all = false } = options;
  const qs = new URLSearchParams({
    q: (keyword || '').trim(),
    page: String(pageState.current_page || 1),
    limit: String(pageState.per_page || 10),
    sortBy,
    sortDir,
    all: String(all),
  }).toString();

  return useQuery(
    ['class-subjects', classId, pageState.current_page, pageState.per_page, keyword, sortBy, sortDir, all],
    () => getPagination(`/api/v1/classes/${classId}/subjects?${qs}`),
    { enabled: !!classId, keepPreviousData: true, staleTime: 10_000 }
  );
};
