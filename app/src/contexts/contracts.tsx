import React, {
  createContext,
  useContext,
  Context,
  Consumer,
  ReactNode,
  useMemo,
} from 'react';
import data from '../contracts.json';

export interface ContractsProviderProps {
  children: ReactNode;
}

export interface Contracts {
  counterAddr?: string;
}

// @ts-ignore
const ContractsContext: Context<Contracts> = createContext<Contracts>();

export function ContractsProvider({ children }: ContractsProviderProps) {
  const counterAddr = useMemo(() => {
    return data.find(({ chainID }) => chainID === 'localterra')
      ?.contractAddress;
  }, []);

  const states = useMemo<Contracts>(() => {
    return {
      counterAddr,
    };
  }, [counterAddr]);

  return (
    <ContractsContext.Provider value={states}>
      {children}
    </ContractsContext.Provider>
  );
}

export function useContracts(): Contracts {
  return useContext(ContractsContext);
}

export const ContractsConsumer: Consumer<Contracts> = ContractsContext.Consumer;
