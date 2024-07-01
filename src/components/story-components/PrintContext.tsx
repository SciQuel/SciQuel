"use client";

import {
  createContext,
  useState,
  type Dispatch,
  type PropsWithChildren,
  type SetStateAction,
} from "react";

type toggleContext = Dispatch<SetStateAction<boolean>> | null;

export const PrintContext = createContext(false);
export const PrintToggleContext = createContext<toggleContext>(null);

export function PrintModeProvider({ children }: PropsWithChildren) {
  const [printMode, setPrintMode] = useState(false);

  return (
    <PrintContext.Provider value={printMode}>
      <PrintToggleContext.Provider value={setPrintMode}>
        {children}
      </PrintToggleContext.Provider>
    </PrintContext.Provider>
  );
}
