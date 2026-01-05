import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from '@/routes';
import { Toaster } from '@/components/common/Sonner/Sonner';

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
      <Toaster />
    </BrowserRouter>
  );
}

export default App;
