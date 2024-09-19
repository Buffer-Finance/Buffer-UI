import Gravatar from 'react-gravatar';
const AddressGravatar: React.FC<{
  account?: string;
  address?: string;
  size?: number;
}> = ({ account, address, size }) => {
  const email = (account || address || 'default') + '@bffer.finance';
  return (
    <Gravatar
      email={email}
      size={size || 20}
      className="rounded-full object-contain border-grav"
      default="retro"
      rating="pg"
    />
  );
};

export { AddressGravatar };
