import { isRelaySuccess } from '@lens-protocol/client';

import { getAuthenticatedClientFromEthersWallet } from '../shared/getAuthenticatedClient';
import { setupWallet } from '../shared/setupWallet';

async function main() {
  const wallet = setupWallet();
  const client = await getAuthenticatedClientFromEthersWallet(wallet);

  const unblockProfilesTypedData = await client.profile.createUnblockProfilesTypedData({
    profiles: ['PROFILE_ID_TO_BLOCK'],
  });

  const data = unblockProfilesTypedData.unwrap();

  const signedTypedData = await wallet._signTypedData(
    data.typedData.domain,
    data.typedData.types,
    data.typedData.value,
  );

  const broadcastResult = await client.transaction.broadcastOnchain({
    id: data.id,
    signature: signedTypedData,
  });

  const broadcastResultValue = broadcastResult.unwrap();

  if (!isRelaySuccess(broadcastResultValue)) {
    console.log(`Something went wrong`, broadcastResultValue);
    return;
  }

  await client.transaction.waitUntilComplete({ forTxId: broadcastResultValue.txId });

  console.log(`Transaction was successfully broadcasted with txId`, broadcastResultValue.txId);
}

main();
