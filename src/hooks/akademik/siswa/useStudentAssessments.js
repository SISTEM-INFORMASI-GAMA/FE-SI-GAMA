import { useQuery } from 'react-query';
import { getDetail } from "../../../services/akademik/utils";

export const useStudentAssessments = (classSubjectId, termId) => {
  return useQuery(
    ['student-assessments', classSubjectId, termId],
    () => getDetail(`/api/v1/student/assessments?classSubjectId=${classSubjectId}&termId=${termId}`),
    { enabled: !!classSubjectId && !!termId }
  );
};
