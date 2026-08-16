import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDayId(moduleId: string, dayId: number): string {
  return `${moduleId}-day-${dayId}`;
}

export function parseProgress(raw: string | null): Set<string> {
  try {
    const arr = JSON.parse(raw ?? '[]');
    return new Set<string>(Array.isArray(arr) ? arr : []);
  } catch {
    return new Set<string>();
  }
}
