import ReactDOM from 'react-dom/client';

import { inject } from '@vercel/analytics';
inject();
console.log('deb-env import.meta.env.VITE_PROD', import.meta.env.VITE_PROD);
console.log('deb-env import.meta.env.VITE_DEV', import.meta.env.VITE_DEV);
console.log('deb-env import.meta.env.VITE_PRE', import.meta.env.VITE_PRE);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <div>Hye i am main branch</div>
);
