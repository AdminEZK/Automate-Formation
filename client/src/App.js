import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import FormationRequestForm from './components/FormationRequestForm';
import FormateursList from './components/FormateursList';
import SessionForm from './components/SessionForm';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<FormationRequestForm />} />
            <Route path="/formateurs" element={<FormateursList />} />
            <Route path="/sessions/new" element={<SessionForm />} />
            <Route path="/sessions/:id/edit" element={<SessionForm isEdit={true} />} />
            <Route path="*" element={<FormationRequestForm />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
