// lib\utils.ts
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function dateToText(date: Date | string): string {
  return new Date(date).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}

export function dateFormatter(date: Date | string): string {
  return new Date(date).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

export function timeFormatter(date: Date | string): string {
  return new Date(date).toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
}

export function chatDateFormatter(date: Date | string): string {
  if (new Date(date).toLocaleDateString() === new Date().toLocaleDateString()) {
    return timeFormatter(date);
  } else {
    return `${dateFormatter(date)} a las ${timeFormatter(date)}`;
  }
}

export function normalizeString(str: string): string {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

export function customDateSort(a: Date | string, b: Date | string): number {
  const dateA = new Date(a);
  const dateB = new Date(b);
  
  if (dateA < dateB) return -1;
  if (dateA > dateB) return 1;
  return 0;
}

export const formatDateInput = (value: string): string => {
    const date = value.replace(/[^\d]/g, '');
    const length = date.length;

    if (length <= 2) return date;
    if (length <= 4) return `${date.slice(0, 2)}/${date.slice(2)}`;
    return `${date.slice(0, 2)}/${date.slice(2, 4)}/${date.slice(4, 8)}`;
};
