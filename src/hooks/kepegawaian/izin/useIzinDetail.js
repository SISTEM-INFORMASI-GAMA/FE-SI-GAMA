import { useQuery } from "react-query";
import { getDetailIzin } from "../../../services/kepegawaian/Izin";

export const useIzinDetail = (id, enabled) => {
  return useQuery(
    ["get-izin-detail", id],
    () => getDetailIzin(`/api/v1/permissions/${id}`),
    {
      enabled,
    }
  );
};
