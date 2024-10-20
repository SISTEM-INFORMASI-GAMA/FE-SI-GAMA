import { useQuery } from "react-query";
import { getDetailPresensi } from "../../../services/kepegawaian/Presensi";

export const usePresensiDetail = (id, enabled) => {
  return useQuery(
    ["get-presensi-detail", id],
    () => getDetailPresensi(`/api/v1/attendence/${id}`),
    {
      enabled,
    }
  );
};
