import { useQuery } from "react-query";
import { getPresensi } from "../../../services/kepegawaian/Presensi";

export const usePresensiPagination = (dataTable, keyword) => {
  return useQuery(
    [
      "get-presensi-pagination",
      dataTable.current_page,
      dataTable.per_page,
      keyword,
    ],
    () =>
      getPresensi(
        `/api/v1/attendence?page=${dataTable.current_page}&limit=${dataTable.per_page}&search=${keyword}`
      )
  );
};
