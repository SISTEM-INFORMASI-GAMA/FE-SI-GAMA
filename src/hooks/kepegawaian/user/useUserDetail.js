import { useQuery } from "react-query";
import { getDetailUser } from "../../../services/kepegawaian/User";

export const useUserDetail = (id, enabled) => {
  return useQuery(
    ["get-user-detail", id],
    () => getDetailUser(`/api/v1/users/${id}`),
    {
      enabled,
    }
  );
};
