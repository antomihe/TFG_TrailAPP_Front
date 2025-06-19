// hooks\components\useLocations.ts
import { useEffect, useState } from "react";
import api from "@/config/api";
import { LocationResponseDto } from "@/types/api";

export interface LocationOption {
  label: string;
  value: string;
}

export function useLocations(province: string) {
  const [locations, setLocations] = useState<LocationOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    const getLocations = async () => {
      if (!province) {
        setLocations([]);
        setIsLoading(false); 
        return;
      }

      setIsLoading(true);
      setFetchError(null);

      try {
        const response = await api().get<LocationResponseDto[]>('ubi/locations', {
          params: { provinceName: province },
        });
        const result = Array.isArray(response.data)
          ? response.data.map((loc) => ({
            label: loc.name,
            value: loc.name,
          }))
          : [];
        setLocations(result);
      } catch (error) {
        console.error("Error fetching locations:", error);
        setFetchError("Error al cargar localidades.");
        setLocations([]);
      } finally {
        setIsLoading(false);
      }
    };

    getLocations();
  }, [province]);

  return { locations, isLoading, fetchError };
}