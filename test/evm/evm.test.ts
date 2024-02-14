import EvmStardustSigner from '../../src/stardust/Signers/evm/EvmStardustSigner';
import { convertToHex } from '../../src/utils';
import HexString from '../../src/utils/HexString';
import { MOCKED_EIP191_MESSAGE, MOCKED_ADRESS, MOCKED_MESSAGE } from './constants';
jest.mock('../../src/stardust/Signers/StardustSignerAPI', () => {
  return jest.fn().mockImplementation((apiKey: string) => {
    return {
      getAddress: jest.fn().mockResolvedValue(MOCKED_ADRESS),
      signMessage: jest.fn().mockResolvedValue('mockedSignature'),
      getPublicKey: jest.fn().mockResolvedValue('mockedPublicKey'),
      signTransaction: jest.fn().mockResolvedValue('mockedSignedTransaction'),
      walletId: 'mockedWalletId',
    };
  });
});

describe('EvmStardustSigner', () => {
  const mockWalletId = 'mock-wallet-id';
  const mockApiKey = 'mock-api-key';
  let evmStardustSigner: EvmStardustSigner;

  beforeEach(() => {
    evmStardustSigner = new EvmStardustSigner(mockWalletId, mockApiKey);
  });

  it('should have chainType evm', () => {
    expect(evmStardustSigner.chainType).toBe('evm');
  });

  it('should signRaw digest', async () => {
    const digest = 'mock-digest';
    const mockedRawSignature = await evmStardustSigner.signRaw(digest);
    expect(mockedRawSignature).toBe('mockedSignature');
    expect(evmStardustSigner.api.signMessage).toHaveBeenCalledWith({
      walletId: mockWalletId,
      chainType: 'evm',
      message: digest,
    });
  });

  it('should convert a uint8array into a hex encoded string and sign that', async () => {
    const digest = new Uint8Array([1, 2, 3]);
    const mockedRawSignature = await evmStardustSigner.signRaw(digest);
    expect(mockedRawSignature).toBe('mockedSignature');
    expect(evmStardustSigner.api.signMessage).toHaveBeenCalledWith({
      walletId: mockWalletId,
      chainType: 'evm',
      message: '0x010203',
    });
  });

  it('should return the address', async () => {
    const mockedAddress = await evmStardustSigner.getAddress();
    expect(mockedAddress).toBe(MOCKED_ADRESS);
    expect(evmStardustSigner.api.getAddress).toHaveBeenCalledWith({
      walletId: mockWalletId,
      chainType: 'evm',
    });
  });

  it('should return the public key', async () => {
    const mockedPublicKey = await evmStardustSigner.getPublicKey();
    expect(mockedPublicKey).toBe('mockedPublicKey');
    expect(evmStardustSigner.api.getPublicKey).toHaveBeenCalledWith({
      walletId: mockWalletId,
      chainType: 'evm',
    });
  });

  it('should sign an EIP 191 prefixed message', async () => {
    const mockedSignature = await evmStardustSigner.signMessage(MOCKED_MESSAGE);
    expect(mockedSignature).toBe('mockedSignature');
    expect(evmStardustSigner.api.signMessage).toHaveBeenCalledWith({
      walletId: mockWalletId,
      chainType: 'evm',
      message: MOCKED_EIP191_MESSAGE,
    });
  });

  it('should sign an EIP 191 prefixed message if the message is a Uint8Array', async () => {
    const mockedMessage = new Uint8Array(Buffer.from(MOCKED_MESSAGE, 'utf8'));
    const mockedSignature = await evmStardustSigner.signMessage(mockedMessage);
    expect(mockedSignature).toBe('mockedSignature');
    expect(evmStardustSigner.api.signMessage).toHaveBeenCalledWith({
      walletId: mockWalletId,
      chainType: 'evm',
      message: MOCKED_EIP191_MESSAGE,
    });
  });

  it('should sign an EIP 191 prefixed message if the message is already hex encoded', async () => {
    const mockedMessage = String(new HexString(Buffer.from(MOCKED_MESSAGE, 'utf8')));
    const mockedSignature = await evmStardustSigner.signMessage(mockedMessage);
    expect(mockedSignature).toBe('mockedSignature');
    expect(evmStardustSigner.api.signMessage).toHaveBeenCalledWith({
      walletId: mockWalletId,
      chainType: 'evm',
      message: MOCKED_EIP191_MESSAGE,
    });
  });

  it('should sign a message for imx', async () => {
    const digest = `Only sign this request if you’ve initiated an action with Immutable X.`;

    const mockedRawSignature = await evmStardustSigner.signMessage(digest);
    expect(evmStardustSigner.api.signMessage).toHaveBeenCalledWith({
      walletId: mockWalletId,
      chainType: 'evm',
      message:
        '0x19457468657265756d205369676e6564204d6573736167653a0a37324f6e6c79207369676e2074686973207265717565737420696620796f75e28099766520696e6974696174656420616e20616374696f6e207769746820496d6d757461626c6520582e',
    });
  });

  it('should sign a message for imx with unicode characters', async () => {
    const digest = `Only sign this request if you\u2019ve initiated an action with Immutable X.`;
    const mockedRawSignature = await evmStardustSigner.signMessage(digest);
    expect(evmStardustSigner.api.signMessage).toHaveBeenCalledWith({
      walletId: mockWalletId,
      chainType: 'evm',
      message:
        '0x19457468657265756d205369676e6564204d6573736167653a0a37324f6e6c79207369676e2074686973207265717565737420696620796f75e28099766520696e6974696174656420616e20616374696f6e207769746820496d6d757461626c6520582e',
    });
  });
});
