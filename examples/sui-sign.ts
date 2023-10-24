import StardustCustodialSdk from '../src/stardust/StardustCustodialSDK';
import { getFaucetHost, requestSuiFromFaucetV0 } from '@mysten/sui.js/faucet';
import { TransactionBlock } from '@mysten/sui.js/transactions';

const sui = require('@mysten/sui.js/client');

const main = async () => {
  const client = new sui.SuiClient({ url: sui.getFullnodeUrl('devnet') });

  const apiKey = '';
  const walletId = '';

  const stardust = new StardustCustodialSdk(apiKey);
  const wallet = await stardust.getWallet(walletId);

  // sui supports 3 signing schemes we can pull out the signing scheme from our wallet's keypairs like so
  const ed25519PublicKey = await wallet.keyPairs.ed25519.publicKey();
  //   const secp256k1PublicKey = await wallet.keyPairs.secp256k1.publicKey();
  //   const secp256r1PublicKey = wallet.keyPairs.secp256r1.publicKey(); // unsupported for now

  await requestSuiFromFaucetV0({
    host: getFaucetHost('devnet'),
    recipient: ed25519PublicKey,
  });

  const tx = new TransactionBlock();
  tx.transferObjects(
    ['0xe19739da1a701eadc21683c5b127e62b553e833e8a15a4f292f4f48b4afea3f2'],
    '0x1d20dcdb2bca4f508ea9613994683eb4e76e9c4ed371169677c1be02aaf0b12a'
  );

  const builtTx = await tx.build();

  // lets sign for the built tx
  const ed25519signature = await wallet.keyPairs.ed25519.sign(builtTx);

  // lets now send the tx to the network
  await client.executeTransaction(builtTx, ed25519signature);
};

main();
