import dotenv from 'dotenv';
import EvmStardustSigner from 'src/stardust/Signers/evm/EvmStardustSigner';

dotenv.config();

// eslint-disable-next-line consistent-return
async function main() {
  try {
    const evm = new EvmStardustSigner('walletId', 'apiKey');
    const prefixedMessage = await evm.createPrefixedMessage(
      'Only sign this request if you’ve initiated an action with Immutable X.'
    );
    console.log(prefixedMessage);
  } catch (error) {
    console.error(`Error: ${JSON.stringify(error)}`);
  }
}

main();
