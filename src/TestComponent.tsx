const TestComponent: React.FC<any> = ({}) => {
  return (
    <div>
      <iframe
        style={{ width: '100vw', height: '100vh' }}
        src="https://testnet-buffer-finance-git-iframe-tut-bufferfinance.vercel.app/#/binary/BTC-USD?bg-2=161618&bg-1=29292c&bg-signature=ffb313&hide=true&bg-0=111111&img=app.level.finance/assets/logo-4d8fd6f5.svg"
      ></iframe>
    </div>
  );
};

export { TestComponent };
