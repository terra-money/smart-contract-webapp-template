import { createQueryFn } from '@libs/react-query-utils';
import { LCDClient } from '@terra-money/terra.js';
import { NetworkInfo, useConnectedWallet } from '@terra-money/wallet-provider';
import { useContracts } from 'contexts/contracts';
import React from 'react';
import { useQuery } from 'react-query';

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

export function Query() {
  const connectedWallet = useConnectedWallet();
  const { counterAddr } = useContracts();

  const { data, isLoading } = useQuery(
    ['get_count', connectedWallet?.network, counterAddr],
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
