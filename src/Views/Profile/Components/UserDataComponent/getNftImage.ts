export const getNftImage = (imgSrc: string) => {
  console.log(`imgSrc: `, imgSrc);
  if (!imgSrc)
    return 'https://a.slack-edge.com/production-standard-emoji-assets/14.0/google-large/1f419@2x.png';
  if (imgSrc.includes('ipfs')) {
    return 'https://gateway.pinata.cloud/ipfs/' + imgSrc.split('://')[1];
  }
  return imgSrc;
};
