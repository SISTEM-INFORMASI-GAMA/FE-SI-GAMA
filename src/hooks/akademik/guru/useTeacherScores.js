import { useQuery, useMutation, useQueryClient } from 'react-query';
import { getPagination, patchJson, postJson } from "../../../services/akademik/utils";

export const useTeacherScores = (assessmentId, pageState, keyword = '') =>
  useQuery(
    ['teacher-scores', assessmentId, pageState.current_page, pageState.per_page, keyword],
    () => getPagination(
      `/api/v1/teacher/assessments/${assessmentId}/scores?keyword=${encodeURIComponent(keyword)}&page=${pageState.current_page}&limit=${pageState.per_page}`
    ),
    { enabled: !!assessmentId, keepPreviousData: true, staleTime: 5_000 }
  );

export const useBulkUpsertTeacherScores = (assessmentId) => {
  const qc = useQueryClient();
  return useMutation(
    (items) => postJson(`/api/v1/teacher/assessments/${assessmentId}/scores`, { items }),
    { onSuccess: () => qc.invalidateQueries({ predicate: q => (q.queryKey||[])[0] === 'teacher-scores' }) }
  );
};

// opsional kalau mau simpan per baris
export const usePatchTeacherScore = (scoreId, invalidateKey) => {
  const qc = useQueryClient();
  return useMutation(
    (payload) => patchJson(`/api/v1/academic/scores/${scoreId}`, payload), // endpoint sama
    { onSuccess: () => invalidateKey && qc.invalidateQueries(invalidateKey) }
  );
};
