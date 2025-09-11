import { useMutation, useQueryClient } from 'react-query';
import { postJson, delJson } from '../../../services/akademik/utils';

export const useAddClassSubject = (classId) => {
  const qc = useQueryClient();
  return useMutation(
    (payload) => postJson(`/api/v1/classes/${classId}/subjects`, payload),
    {
      onSuccess: () => qc.invalidateQueries({ queryKey: ['class-subjects', classId] }),
    }
  );
};

export const useDeleteClassSubject = (classId) => {
  const qc = useQueryClient();
  return useMutation(
    (id) => delJson(`/api/v1/class-subjects/${id}`),
    {
      onSuccess: () => qc.invalidateQueries({ queryKey: ['class-subjects', classId] }),
    }
  );
};
