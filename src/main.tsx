import ReactDOM from 'react-dom/client';

import { inject } from '@vercel/analytics';
inject();
console.log('deb-envproductionenv', import.meta.env.Production);
console.log('deb-envpreviewenv', import.meta.env.Preview);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <div>Hye i am main branch</div>
);
