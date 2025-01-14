import { LensClient, development } from '@lens-protocol/client';

async function main() {
  const client = new LensClient({
    environment: development,
  });

  const result = await client.profile.whoActedOnPublication({
    on: '0x0635-0x0f',
  });

  console.log(
    `Result: `,
    result.items.map((i) => ({
      id: i.id,
      handle: i.handle,
    })),
  );
}

main();
