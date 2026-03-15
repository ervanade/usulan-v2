import useSWR from "swr";
import { useSelector } from "react-redux";
import {
  getKonfirmasiHeader,
  filterKonfirmasiHeader,
  filterKonfirmasiDetail,
} from "../api/services/konfirmasiService";

export const useKonfirmasiKabupaten = () => {
  const user = useSelector((state) => state.auth.user);
  const { data, error, isLoading, mutate } = useSWR(
    user ? ["konfirmasi-header", user.id] : null,
    getKonfirmasiHeader
  );

  return {
    konfirmasiKabupaten: data,
    isLoading,
    isError: error,
    mutate,
  };
};

export const useKonfirmasiAlkes = (id_kabupaten, id_alkes) => {
  const fetcher = async () => {
    return filterKonfirmasiDetail({
      id_kabupaten: id_kabupaten,
      id_alkes: id_alkes,
    });
  };

  const { data, error, isLoading, mutate } = useSWR(
    id_kabupaten && id_alkes ? ["konfirmasi-detail", id_kabupaten, id_alkes] : null,
    fetcher
  );

  return {
    konfirmasiAlkes: data,
    isLoading,
    isError: error,
    mutate,
  };
};
