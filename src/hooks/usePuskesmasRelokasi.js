import useSWR from "swr";
import { getPuskesmasRelokasiList, getPuskesmasList } from "../api/services/puskesmasRelokasiService";

export const usePuskesmasRelokasi = () => {
  const { data, error, isLoading, mutate } = useSWR(
    "puskesmas-relokasi",
    getPuskesmasRelokasiList
  );
  return { data, isLoading, isError: error, mutate };
};

export const usePuskesmasListRelokasi = () => {
  const { data, error, isLoading } = useSWR(
    "puskesmas-list-relokasi",
    getPuskesmasList
  );
  return { data, isLoading, isError: error };
};
