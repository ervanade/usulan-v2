import useSWR from "swr";
import { useSelector } from "react-redux";
import { getUsulanList, getUsulanDetail, getKriteria, getPeriode, getLimbah, getLimbahDetail } from "../api/services/usulanService";

export const useUsulan = () => {
  const user = useSelector((state) => state.auth.user);
  const { data, error, isLoading, mutate } = useSWR(
    user ? ["usulan-list", user.id] : null,
    getUsulanList
  );

  return {
    usulan: data,
    isLoading,
    isError: error,
    mutate,
  };
};

export const useUsulanDetail = (id, periodeId = null) => {
  const user = useSelector((state) => state.auth.user);
  const { data, error, isLoading, mutate } = useSWR(
    id && user ? ["usulan-detail", id, periodeId, user.id] : null,
    () => getUsulanDetail(id, periodeId)
  );

  return {
    usulan: data,
    isLoading,
    isError: error,
    mutate,
  };
};

export const useKriteria = () => {
  const { data, error, isLoading } = useSWR("kriteria", getKriteria);

  return {
    kriteria: data,
    isLoading,
    isError: error,
  };
};

export const usePeriode = () => {
  const { data, error, isLoading } = useSWR("periode", getPeriode);

  return {
    periode: data,
    isLoading,
    isError: error,
  };
};

export const useLimbah = () => {
  const user = useSelector((state) => state.auth.user);
  const { data, error, isLoading, mutate } = useSWR(
    user ? ["limbah", user.id] : null,
    getLimbah
  );

  return {
    limbah: data,
    isLoading,
    isError: error,
    mutate,
  };
};

export const useLimbahDetail = (id) => {
  const user = useSelector((state) => state.auth.user);
  const { data, error, isLoading, mutate } = useSWR(
    id && user ? ["limbah-detail", id, user.id] : null,
    () => getLimbahDetail(id)
  );

  return {
    limbah: data,
    isLoading,
    isError: error,
    mutate,
  };
};
