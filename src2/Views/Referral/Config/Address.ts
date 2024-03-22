import { useActiveChain } from '@Hooks/useActiveChain';

export function getContract() {
  const { configContracts } = useActiveChain();
  return configContracts.referral_storage;
}
