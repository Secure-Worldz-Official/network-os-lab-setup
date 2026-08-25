import React from 'react';
import { CyberPathProvider, useTask } from '@/context/CyberPathContext';

export { useTask };

export function TaskProvider({ children }: { children: React.ReactNode }) {
  return <CyberPathProvider>{children}</CyberPathProvider>;
}
