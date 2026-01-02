import { useQuery, useMutation, useQueryClient } from 'react-query';
import { delJson, getPagination, patchJson, postJson } from "../../../services/akademik/utils";

export const useTeacherAssessments = (classSubjectId, termId, enabled = true) =>
  useQuery(
    ['teacher-assessments', classSubjectId, termId],
    () => getPagination(`/api/v1/teacher/class-subjects/${classSubjectId}/assessments?termId=${termId}`),
    { enabled: !!classSubjectId && !!termId && enabled, staleTime: 10_000 }
  );

export const useCreateTeacherAssessment = (classSubjectId, termId) => {
  const qc = useQueryClient();
  return useMutation(
    (payload) => postJson(`/api/v1/teacher/class-subjects/${classSubjectId}/assessments`, payload),
    { onSuccess: () => qc.invalidateQueries(['teacher-assessments', classSubjectId, termId]) }
  );
};

// Menerima object { id, payload } saat mutateAsync
export const useUpdateTeacherAssessment = (invalidateKey) => {
  const qc = useQueryClient();
  return useMutation(
    ({ id, payload }) => patchJson(`/api/v1/teacher/assessments/${id}`, payload),
    { onSuccess: () => invalidateKey && qc.invalidateQueries(invalidateKey) }
  );
};

// Menerima id langsung saat mutateAsync
export const useDeleteTeacherAssessment = (invalidateKey) => {
  const qc = useQueryClient();
  return useMutation(
    (id) => delJson(`/api/v1/teacher/assessments/${id}`),
    { onSuccess: () => invalidateKey && qc.invalidateQueries(invalidateKey) }
  );
};