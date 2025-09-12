import { useQuery, useMutation, useQueryClient } from 'react-query';
import { getPagination, postJson, patchJson } from '../../../services/akademik/utils';

// GET /assessments/:id/scores
export const useScores = (assessmentId, pageState, keyword = '') =>
  useQuery(
    ['scores', assessmentId, pageState.current_page, pageState.per_page, keyword],
    () =>
      getPagination(
        `/api/v1/assessments/${assessmentId}/scores?page=${pageState.current_page}&limit=${pageState.per_page}&keyword=${encodeURIComponent(
          keyword
        )}`
      ),
    { enabled: !!assessmentId, keepPreviousData: true, staleTime: 5_000 }
  );

// POST bulk upsert
export const useBulkUpsertScores = (assessmentId) => {
  const qc = useQueryClient();
  return useMutation(
    (items) => postJson(`/api/v1/assessments/${assessmentId}/scores`, { items }),
    {
      onSuccess: () => {
        qc.invalidateQueries({
          predicate: (q) => Array.isArray(q.queryKey) && q.queryKey[0] === 'scores',
        });
      },
    }
  );
};

// PATCH single (opsional kalau mau simpan satuan)
export const usePatchScore = (scoreId, invalidateKey) => {
  const qc = useQueryClient();
  return useMutation(
    (payload) => patchJson(`/api/v1/scores/${scoreId}`, payload),
    { onSuccess: () => invalidateKey && qc.invalidateQueries(invalidateKey) }
  );
};
