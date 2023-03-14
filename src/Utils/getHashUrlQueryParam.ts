const getHashUrlQueryParam = (url: string) => {
  const [hash, query] = url.split('#')[1].split('?');
  const params = Object.fromEntries(new URLSearchParams(query));
  return params;
};

export { getHashUrlQueryParam };
