export const notificationMapping = {
  migrationPage: {
    body: (
      <>
        <img
          src="/lightning.png"
          alt="lightning"
          className="mr-3 mt-[6px] h-[18px]"
        />
        Note - If your tokens are still unvested, you just have to start vesting
        them on the Arbitrum chain instead of the BNB chain using the same
        wallet address.
      </>
    ),
    shouldClose: false,
  },

  notification: { body: <>MikeChik</>, shouldClose: true },
};
