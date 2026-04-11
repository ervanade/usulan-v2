import useSWR from "swr";
import { getPuskesmasRelokasiList } from "../api/services/puskesmasRelokasiService";

export const usePuskesmasRelokasi = () => {
  const { data, error, isLoading, mutate } = useSWR(
    "puskesmas-relokasi",
    getPuskesmasRelokasiList
  );
  return { data, isLoading, isError: error, mutate };
};
