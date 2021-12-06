import { LCDClient } from '@terra-money/terra.js';
import { NetworkInfo, useConnectedWallet } from '@terra-money/wallet-provider';
import { useContracts } from 'contexts/contracts';
import { QUERY_KEYS } from 'env';
import React from 'react';
import { QueryFunctionContext, useQuery } from 'react-query';

export function Query() {
  const connectedWallet = useConnectedWallet();
  const { counterAddr } = useContracts();

  const { data, isLoading } = useQuery(
    [QUERY_KEYS.GET_COUNT, connectedWallet?.network, counterAddr],
    fn,
    {
      refetchInterval: 1000 * 60 * 5,
      keepPreviousData: true,
    },
  );

  return (
    <div>
      {isLoading && <span>[loading...]</span>}
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
    </div>
  );
}

function createQueryFn<T extends any[], R>(
  fn: (...args: T) => Promise<R>,
): (ctx: QueryFunctionContext<[string, ...T]>) => Promise<R> {
  return ({ queryKey: [, ...args] }) => {
    return fn(...(args as T));
  };
}

const fn = createQueryFn(
  async (network: NetworkInfo | undefined, counterAddr: string | undefined) => {
    if (!network || !counterAddr) {
      return null;
    }

    const lcd = new LCDClient({
      chainID: network.chainID,
      URL: network.lcd,
    });

    return lcd.wasm.contractQuery(counterAddr, { get_count: {} });
  },
);
