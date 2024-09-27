import { createPublicClient, createWalletClient, http, custom } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { arbitrum, arbitrumGoerli } from 'wagmi/chains';
import { MockConnector } from 'wagmi/connectors/mock';

const testClient = createPublicClient({
  transport: http('http://localhost:8545'),
  chain: arbitrumGoerli,
});

export const mockConnector = [
  new MockConnector({
    chains: [arbitrum, arbitrumGoerli],
    options: {
      flags: {
        isAuthorized: true,
      },
      walletClient: createWalletClient({
        transport: custom(testClient),
        chain: arbitrumGoerli,
        account: privateKeyToAccount(
          '0x2bb545e93a2b27557e40b54f39def6a190fa3ce56b34bcfc80d8709cf60fe0a2'
        ),
      }),
    },
  }),
];
