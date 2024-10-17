import { useQuery } from "react-query";
import { getDetailPegawai } from "../../../services/kepegawaian/Pegawai";

export const usePegawaiDetail = (id, enabled) => {
  return useQuery(
    ["get-pegawai-detail", id],
    () => getDetailPegawai(`/api/v1/employees/${id}`),
    {
      enabled,
    }
  );
};
