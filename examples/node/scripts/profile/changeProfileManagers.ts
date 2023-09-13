import { ChangeProfileManagerActionType, isRelaySuccess } from '@lens-protocol/client';

import { getAuthenticatedClientFromEthersWallet } from '../shared/getAuthenticatedClient';
import { setupWallet } from '../shared/setupWallet';

async function main() {
  const wallet = setupWallet();
  const lensClient = await getAuthenticatedClientFromEthersWallet(wallet);

  const typedDataResult = await lensClient.profile.createChangeProfileManagersTypedData({
    approveLensManager: true,
    changeManagers: [
      {
        action: ChangeProfileManagerActionType.Add,
        address: '0x0000000000',
      },
    ],
  });

  const { id, typedData } = typedDataResult.unwrap();

  // sign with the wallet
  const signedTypedData = await wallet._signTypedData(
    typedData.domain,
    typedData.types,
    typedData.value,
  );

  // broadcast onchain
  const broadcastOnchainResult = await lensClient.transaction.broadcastOnChain({
    id,
    signature: signedTypedData,
  });

  const onchainRelayResult = broadcastOnchainResult.unwrap();

  if (!isRelaySuccess(onchainRelayResult)) {
    console.log(`Something went wrong`, onchainRelayResult);
    return;
  }

  console.log(
    `Successfully changed profile managers with transaction with id ${onchainRelayResult.txId}, txHash: ${onchainRelayResult.txHash}`,
  );
}

main();
