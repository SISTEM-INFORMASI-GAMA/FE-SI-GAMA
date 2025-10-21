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

export const useUpdateTeacherAssessment = (assessmentId, invalidateKey) => {
  const qc = useQueryClient();
  return useMutation(
    (payload) => patchJson(`/api/v1/teacher/assessments/${assessmentId}`, payload),
    { onSuccess: () => invalidateKey && qc.invalidateQueries(invalidateKey) }
  );
};

export const useDeleteTeacherAssessment = (assessmentId, invalidateKey) => {
  const qc = useQueryClient();
  return useMutation(
    () => delJson(`/api/v1/teacher/assessments/${assessmentId}`),
    { onSuccess: () => invalidateKey && qc.invalidateQueries(invalidateKey) }
  );
};
