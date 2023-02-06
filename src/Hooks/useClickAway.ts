import { useEffect } from 'react';

export const useClickAway = (
  ref: React.MutableRefObject<any> | null,
  handleClick: (event: MouseEvent) => void
) => {
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref && ref.current && !ref.current.contains(event.target)) {
        handleClick(event);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref]);
};
