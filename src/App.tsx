
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Panel from './pages/Panel';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/familia" element={<Home showBus={false} />} />
        <Route path="/panel" element={<Panel />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
