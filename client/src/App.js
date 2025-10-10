import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import FormationRequestForm from './components/FormationRequestForm';
import Dashboard from './components/Dashboard';
import DocumentSender from './components/DocumentSender';
import EntrepriseManager from './components/EntrepriseManager';
import SessionManager from './components/SessionManager';
import SessionDetail from './components/SessionDetail';
import SessionCreate from './components/SessionCreate';
import SessionEdit from './components/SessionEdit';
import NotFound from './components/NotFound';
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
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/documents" element={<DocumentSender />} />
            <Route path="/entreprises" element={<EntrepriseManager />} />
            <Route path="/sessions" element={<SessionManager />} />
            <Route path="/sessions/new" element={<SessionCreate />} />
            <Route path="/sessions/:id/edit" element={<SessionEdit />} />
            <Route path="/sessions/:id" element={<SessionDetail />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
