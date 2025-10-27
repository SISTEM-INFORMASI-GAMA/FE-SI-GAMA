import { useQuery } from 'react-query';
import { getDetail } from "../../../services/akademik/utils";

export const useStudentGrades = (termId) => {
  return useQuery(
    ['student-grades', termId],
    () => getDetail(`/api/v1/student/grades?termId=${termId}`),
    { enabled: !!termId }
  );
};
