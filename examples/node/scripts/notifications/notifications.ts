import { getAuthenticatedClientFromEthersWallet } from '../shared/getAuthenticatedClient';
import { setupWallet } from '../shared/setupWallet';

async function main() {
  const wallet = setupWallet();
  const client = await getAuthenticatedClientFromEthersWallet(wallet);

  const result = await client.notifications.fetch();

  const value = result.unwrap();

  console.log(
    `All notifications: `,
    value.items.map((item) => ({
      id: item.id,
    })),
  );
}

main();
