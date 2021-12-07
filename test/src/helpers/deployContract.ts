import { MsgInstantiateContract, MsgStoreCode } from '@terra-money/terra.js';
import * as fs from 'fs-extra';
import {
  CONTRACT_ADMIN_ADDRESS,
  CONTRACT_SENDER,
  DEPLOY_FEE,
  LOCALTERRA_CLIENT,
} from '../env';

interface Option<InstantiateMsg extends {}> {
  wasmFile: string;
  instantiateMsg: InstantiateMsg;
}

interface Result {
  codeID: string;
  contractAddress: string;
}

export async function deployContract<InstantiateMsg extends {}>({
  wasmFile,
  instantiateMsg,
}: Option<InstantiateMsg>): Promise<Result> {
  const buffer = await fs.readFile(wasmFile);
  const wasmBase64 = buffer.toString('base64');

  const storeCodeTx = await CONTRACT_SENDER.createAndSignTx({
    msgs: [new MsgStoreCode(CONTRACT_SENDER.key.accAddress, wasmBase64)],
    fee: DEPLOY_FEE,
  });

  const storeCodeRes = await LOCALTERRA_CLIENT.tx.broadcast(storeCodeTx);

  const codeID = storeCodeRes.logs[0].events
    .find(({ type }) => type === 'store_code')
    ?.attributes.find(({ key }) => key === 'code_id')?.value;

  if (!codeID) {
    throw new Error(`Can't find codeID`);
  }

  const msg = new MsgInstantiateContract(
    CONTRACT_SENDER.key.accAddress,
    CONTRACT_ADMIN_ADDRESS,
    +codeID,
    instantiateMsg,
  );

  const tx = await CONTRACT_SENDER.createAndSignTx({
    msgs: [msg],
    fee: DEPLOY_FEE,
  });

  const res = await LOCALTERRA_CLIENT.tx.broadcast(tx);

  const contractAddress = res.logs[0].events
    .find(({ type }) => type === 'instantiate_contract')
    ?.attributes.find(({ key }) => key === 'contract_address')?.value;

  if (!contractAddress) {
    throw new Error(`Can't find contractAddress`);
  }

  return {
    codeID,
    contractAddress,
  };
}
