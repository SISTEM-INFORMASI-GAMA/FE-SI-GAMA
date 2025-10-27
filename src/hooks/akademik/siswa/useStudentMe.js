import { useQuery } from 'react-query';
import { getDetail } from "../../../services/akademik/utils";

export const useStudentMe = () => {
  return useQuery(['student-me'], () => getDetail('/api/v1/student/me'));
};
