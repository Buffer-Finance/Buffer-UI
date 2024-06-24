import { NavigateFunction } from 'react-router-dom';

export function navigateToarket(
  navigate: NavigateFunction,
  market: string,
  route: string,
  pool?: string
) {
  if (pool) {
    navigate(`${route}/${market}?pool=${pool}`);
  } else navigate(`${route}/${market}`);
}
