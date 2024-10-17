import { useQuery } from "react-query";
import { getPegawai } from "../../../services/kepegawaian/Pegawai";

export const usePegawaiPagination = (dataTable, keyword) => {
  return useQuery(
    [
      "get-pegawai-pagination",
      dataTable.current_page,
      dataTable.per_page,
      keyword,
    ],
    () =>
      getPegawai(
        `/api/v1/employees?page=${dataTable.current_page}&limit=${dataTable.per_page}&search=${keyword}`
      )
  );
};
