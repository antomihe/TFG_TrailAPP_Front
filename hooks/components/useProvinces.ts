// hooks\components\useProvinces.ts
import { useEffect, useState } from "react";
import api from "@/config/api";
import { ProvinceResponseDto } from "@/types/api";

export interface ProvinceOption {
  label: string;
  value: string;
}

export function useProvinces() {
  const [provinces, setProvinces] = useState<ProvinceOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProvinces = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const { data } = await api().get<ProvinceResponseDto[]>("ubi/provinces");
        const formatted = data.map((prov: ProvinceResponseDto) => ({
          label: prov.name,
          value: prov.name,
        }));
        setProvinces(formatted);
      } catch (err) {
        setError("Error al cargar provincias.");
        console.error("Error fetching provinces:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProvinces();
  }, []);

  return { provinces, isLoading, error };
}
