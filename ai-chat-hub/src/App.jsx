import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import ChatInterface from './pages/ChatInterface';
import About from './pages/About';
import AssistantChat from './pages/AssistantChat';
import CreativeChat from './pages/CreativeChat';
import TechnicalChat from './pages/TechnicalChat';
import FriendlyChat from './pages/FriendlyChat';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/chat" element={<ChatInterface />} />
        <Route path="/chat/assistant" element={<AssistantChat />} />
        <Route path="/chat/creative" element={<CreativeChat />} />
        <Route path="/chat/technical" element={<TechnicalChat />} />
        <Route path="/chat/friendly" element={<FriendlyChat />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Router>
  );
};

export default App;
