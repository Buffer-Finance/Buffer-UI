const getHashUrlQueryParam = (url: string) => {
  if (!url.includes('#')) return;
  const [hash, query] = url.split('#')[1].split('?');
  const params = Object.fromEntries(new URLSearchParams(query));
  console.log(`params: `, params);
  return params;
};

export { getHashUrlQueryParam };
