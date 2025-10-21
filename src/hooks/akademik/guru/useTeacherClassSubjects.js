import { useQuery } from 'react-query';
import { buildQS, getPagination } from "../../../services/akademik/utils";

export const useTeacherClassSubjects = (termId) => {
  const qs = buildQS({ termId });
  return useQuery(
    ['teacher-class-subjects', termId],
    () => getPagination(`/api/v1/teacher/class-subjects${qs}`),
    { staleTime: 10_000 }
  );
};
