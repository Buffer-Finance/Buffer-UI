import { generateApprovalSignature } from './generateTradeSignature';

export async function generateApprovalSignatureWrapper(
  nonce: number,
  amount: string,
  userMainAccount: string,
  tokenAddress: string,
  routerAddress: string,
  deadline: string,
  activeChainId: any,
  signMethod: any
) {
  const res = await generateApprovalSignature(
    nonce,
    amount,
    userMainAccount,
    tokenAddress,
    routerAddress,
    deadline,
    activeChainId,
    signMethod
  );
  return { res, nonce };
}
