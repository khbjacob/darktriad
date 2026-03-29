import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import Home from '@/pages/Home';
import Results from '@/pages/Results';
import History from '@/pages/History';
import Compare from '@/pages/Compare';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/results/:id" element={<Results />} />
          <Route path="/history" element={<History />} />
          <Route path="/compare" element={<Compare />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
