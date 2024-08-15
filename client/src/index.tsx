import { createRoot } from 'react-dom/client'

import 'semantic-ui-css/semantic.min.css';
import 'react-toastify/dist/ReactToastify.min.css';
import '@/assets/css/styles.css';
import { store, StoreContext } from '@/stores/store';
import { RouterProvider } from 'react-router-dom';
import { router } from '@/routes/Routes';

createRoot(document.getElementById('root')!).render(
  <StoreContext.Provider value={store}>
  <RouterProvider router={router} />
</StoreContext.Provider>
)
