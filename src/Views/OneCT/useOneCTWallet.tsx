import secureLocalStorage from 'react-secure-storage';

const useOneCTWallet = () => {
  return {
    loadOrCreate: () => {
      console.log('onect wallet loaded');
    },
  };
};

export { useOneCTWallet };
