import {
  Fee,
  LCDClient,
  MsgExecuteContract,
  TxInfo,
} from '@terra-money/terra.js';
import { NetworkInfo, useConnectedWallet } from '@terra-money/wallet-provider';
import { useContracts } from 'contexts/contracts';
import { counter } from 'contract';
import { TX_KEYS, TX_REFETCH_MAP } from 'env';
import React, { useCallback } from 'react';
import { useQueryClient } from 'react-query';

export function Tx() {
  const connectedWallet = useConnectedWallet();
  const { counterAddr } = useContracts();
  const queryClient = useQueryClient();

  const postTx = useCallback(
    async <T extends {}>(txKey: TX_KEYS, executeMsg: T) => {
      if (!connectedWallet || !counterAddr) {
        return;
      }

      try {
        const { result } = await connectedWallet.post({
          msgs: [
            new MsgExecuteContract(
              connectedWallet.terraAddress,
              counterAddr,
              executeMsg,
            ),
          ],
          fee: new Fee(1000000, '200000uusd'),
        });

        const pollResult = await pollTxInfo(
          connectedWallet.network,
          result.txhash,
        );

        if (pollResult.logs && pollResult.logs?.length > 0) {
          await Promise.all(
            TX_REFETCH_MAP[txKey].map((queryKey) => {
              return queryClient.invalidateQueries(queryKey, {
                refetchActive: true,
                refetchInactive: false,
              });
            }),
          );
        }
      } catch (error) {
        console.error(error);
      }
    },
    [connectedWallet, counterAddr, queryClient],
  );

  const increment = useCallback(() => {
    postTx<counter.ExecuteMsg.Increment>(TX_KEYS.INCREMENT, {
      increment: {},
    });
  }, [postTx]);

  const decrement = useCallback(() => {
    postTx<counter.ExecuteMsg.Decrement>(TX_KEYS.DECREMENT, {
      decrement: {},
    });
  }, [postTx]);

  if (!connectedWallet || !connectedWallet.availablePost) {
    return null;
  }

  return (
    <div>
      <button onClick={increment}>Increment</button>
      <button onClick={decrement}>Decrement</button>
    </div>
  );
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function pollTxInfo(
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
