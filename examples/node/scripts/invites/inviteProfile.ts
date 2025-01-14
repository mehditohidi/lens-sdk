import { getAuthenticatedClientFromEthersWallet } from '../shared/getAuthenticatedClient';
import { setupWallet } from '../shared/setupWallet';

async function main() {
  const wallet = setupWallet();
  const client = await getAuthenticatedClientFromEthersWallet(wallet);

  const result = await client.invites.inviteProfile({
    invites: ['0x1234567890123456789012345678901234567890'],
    secret: 'secret',
  });

  console.log(`Result: `, result.unwrap());
}

main();
