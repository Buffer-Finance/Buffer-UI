import { NavigateFunction } from 'react-router-dom';

export function navigateToarket(
  navigate: NavigateFunction,
  market: string,
  route: string
) {
  navigate(`${route}/${market}`);
}
