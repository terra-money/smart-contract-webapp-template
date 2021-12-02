import {
  Fee,
  LCDClient,
  MsgExecuteContract,
  TxInfo,
} from '@terra-money/terra.js';
import { NetworkInfo, useConnectedWallet } from '@terra-money/wallet-provider';
import { useContracts } from 'contexts/contracts';
import React, { useCallback } from 'react';
import { useQueryClient } from 'react-query';

export function Tx() {
  const connectedWallet = useConnectedWallet();
  const { counterAddr } = useContracts();
  const queryClient = useQueryClient();

  const proceed = useCallback(async () => {
    if (!connectedWallet || !counterAddr) {
      return;
    }

    try {
      const { result } = await connectedWallet.post({
        msgs: [
          new MsgExecuteContract(connectedWallet.terraAddress, counterAddr, {
            increment: {},
          }),
        ],
        fee: new Fee(1000000, '200000uusd'),
      });

      const pollResult = await pollTxInfo(
        connectedWallet.network,
        result.txhash,
      );

      if (pollResult.logs && pollResult.logs?.length > 0) {
        await queryClient.invalidateQueries('get_count', {
          refetchActive: true,
          refetchInactive: false,
        });
      }
    } catch (error) {
      console.error(error);
    }
  }, [connectedWallet, counterAddr, queryClient]);

  if (!connectedWallet) {
    return null;
  }

  return (
    <div>
      {connectedWallet && connectedWallet.availablePost && (
        <button onClick={proceed}>Increment</button>
      )}
    </div>
  );
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function pollTxInfo(
  network: NetworkInfo,
  txhash: string,
): Promise<TxInfo> {
  const until = Date.now() + 1000 * 60 * 60;
  const untilInterval = Date.now() + 1000 * 60;

  const lcd = new LCDClient({
    chainID: network.chainID,
    URL: network.lcd,
  });

  while (true) {
    let txInfo;

    try {
      txInfo = await lcd.tx.txInfo(txhash);
    } catch {}

    if (txInfo) {
      return txInfo;
    } else if (Date.now() < untilInterval) {
      await sleep(500);
    } else if (Date.now() < until) {
      await sleep(1000 * 10);
    } else {
      throw new Error(
        `Transaction queued. To verify the status, please check the transaction hash below.`,
      );
    }
  }
}
