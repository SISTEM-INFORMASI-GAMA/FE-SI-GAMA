import { useQuery, useMutation, useQueryClient } from 'react-query';
import { getPagination, postJson, patchJson, delJson } from '../../../services/akademik/utils';

// List by classSubject + term
export const useAssessments = (classSubjectId, termId, enabled = true) =>
  useQuery(
    ['assessments', classSubjectId, termId],
    () => getPagination(`/api/v1/class-subjects/${classSubjectId}/assessments?termId=${termId}`),
    { enabled: !!classSubjectId && !!termId && enabled, staleTime: 10_000 }
  );

export const useCreateAssessment = (classSubjectId, termId) => {
  const qc = useQueryClient();
  return useMutation(
    (payload) => postJson(`/api/v1/class-subjects/${classSubjectId}/assessments`, payload),
    { onSuccess: () => qc.invalidateQueries(['assessments', classSubjectId, termId]) }
  );
};

// Tetap: update mengunci ke id tertentu
export const useUpdateAssessment = (assessmentId, invalidateKey) => {
  const qc = useQueryClient();
  return useMutation(
    (payload) => patchJson(`/api/v1/assessments/${assessmentId}`, payload),
    { onSuccess: () => invalidateKey && qc.invalidateQueries(invalidateKey) }
  );
};

// Perbaikan: terima id saat mutate
export const useDeleteAssessment = (invalidateKey) => {
  const qc = useQueryClient();
  return useMutation(
    (id) => delJson(`/api/v1/assessments/${id}`),
    { onSuccess: () => invalidateKey && qc.invalidateQueries(invalidateKey) }
  );
};

export const useLockAssessment = (invalidateKey) => {
  const qc = useQueryClient();
  return useMutation(
    (id) => postJson(`/api/v1/assessments/${id}/lock`, {}),
    { onSuccess: () => invalidateKey && qc.invalidateQueries(invalidateKey) }
  );
};

export const usePublishAssessment = (invalidateKey) => {
  const qc = useQueryClient();
  return useMutation(
    (id) => postJson(`/api/v1/assessments/${id}/publish`, {}),
    { onSuccess: () => invalidateKey && qc.invalidateQueries(invalidateKey) }
  );
};
