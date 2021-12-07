import { MsgExecuteContract } from '@terra-money/terra.js';
import { counter } from 'contract';
import { deployContract } from 'helpers/deployContract';
import path from 'path';
import { ARTIFACTS, CONTRACT_TESTER, LOCALTERRA_CLIENT, POST_FEE } from './env';
import CountResponse = counter.CountResponse;

describe('counter', () => {
  test('basic test', async () => {
    const RANDOM = Math.floor(Math.random() * 20);

    // deploy
    const { contractAddress } = await deployContract({
      wasmFile: path.resolve(ARTIFACTS, 'counter.wasm'),
      instantiateMsg: {
        count: RANDOM,
      } as counter.InstantiateMsg,
    });

    const { count: countAfterDeploy }: CountResponse =
      await LOCALTERRA_CLIENT.wasm.contractQuery(contractAddress, {
        get_count: {},
      } as counter.QueryMsg.GetCount);

    expect(countAfterDeploy).toBe(RANDOM);

    // increment
    const increment = await CONTRACT_TESTER.createAndSignTx({
      msgs: [
        new MsgExecuteContract(
          CONTRACT_TESTER.key.accAddress,
          contractAddress,
          {
            increment: {},
          } as counter.ExecuteMsg.Increment,
        ),
      ],
      fee: POST_FEE,
    });

    await LOCALTERRA_CLIENT.tx.broadcast(increment);

    const { count: countAfterIncrement }: CountResponse =
      await LOCALTERRA_CLIENT.wasm.contractQuery(contractAddress, {
        get_count: {},
      } as counter.QueryMsg.GetCount);

    expect(countAfterIncrement).toBe(RANDOM + 1);

    // decrement
    const decrement = await CONTRACT_TESTER.createAndSignTx({
      msgs: [
        new MsgExecuteContract(
          CONTRACT_TESTER.key.accAddress,
          contractAddress,
          {
            decrement: {},
          } as counter.ExecuteMsg.Decrement,
        ),
      ],
      fee: POST_FEE,
    });

    await LOCALTERRA_CLIENT.tx.broadcast(decrement);

    const { count: countAfterDecrement }: CountResponse =
      await LOCALTERRA_CLIENT.wasm.contractQuery(contractAddress, {
        get_count: {},
      } as counter.QueryMsg.GetCount);

    expect(countAfterDecrement).toBe(RANDOM);
  });
});
