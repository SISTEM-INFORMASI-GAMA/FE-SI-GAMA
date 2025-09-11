import { useQuery, useMutation, useQueryClient } from 'react-query';
import { getDetail, putJson } from '../../../services/akademik/utils';

export const useGradingPolicy = (classSubjectId, termId, enabled = true) =>
  useQuery(
    ['grading-policy', classSubjectId, termId],
    () => getDetail(`/api/v1/class-subjects/${classSubjectId}/grading-policy?termId=${termId}`),
    { enabled: !!classSubjectId && !!termId && enabled, retry: false }
  );

export const useUpsertGradingPolicy = (classSubjectId) => {
  const qc = useQueryClient();
  return useMutation(
    (payload) => putJson(`/api/v1/class-subjects/${classSubjectId}/grading-policy`, payload),
    {
      onSuccess: (_, vars) => {
        const termId = vars?.termId;
        if (termId) qc.invalidateQueries(['grading-policy', classSubjectId, termId]);
      },
    }
  );
};
