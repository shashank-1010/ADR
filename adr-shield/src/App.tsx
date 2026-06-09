import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { LayoutDashboard, Pill, Activity, MessageSquare, FileText, AlertTriangle, Stethoscope, Menu, X } from 'lucide-react';

import Dashboard from './pages/dashboard';
import DrugsList from './pages/drugs';
import DrugDetail from './pages/drug-detail';
import Interactions from './pages/interactions';
import SymptomsPredictor from './pages/symptoms';
import Chatbot from './pages/chatbot';
import AdrReportForm from './pages/adr-report';
import DoctorMode from './pages/doctor';
import NotFound from './pages/not-found';

const App: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Drug Database', href: '/drugs', icon: Pill },
    { name: 'Interaction Checker', href: '/interactions', icon: Activity },
    { name: 'Symptom Predictor', href: '/symptoms', icon: Stethoscope },
    { name: 'Clinical AI', href: '/chatbot', icon: MessageSquare },
    { name: 'ADR Reporting', href: '/reports', icon: FileText },
    { name: 'Doctor Mode', href: '/doctor', icon: AlertTriangle },
  ];

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <div className={`fixed inset-0 z-40 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
          <div className="fixed inset-0 bg-gray-600/75" onClick={() => setSidebarOpen(false)} />
          <div className="relative flex flex-col w-64 bg-white shadow-xl">
            <div className="flex items-center justify-between p-4 border-b">
              <span className="text-xl font-bold text-blue-700">ADR Shield</span>
              <button onClick={() => setSidebarOpen(false)} className="p-1"><X className="w-5 h-5" /></button>
            </div>
            <nav className="flex-1 p-4 space-y-1">
              {navigation.map((item) => (
                <Link key={item.name} to={item.href} onClick={() => setSidebarOpen(false)} className="flex items-center gap-3 px-3 py-2 text-gray-700 rounded-md hover:bg-gray-100">
                  <item.icon className="w-5 h-5" /> {item.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
          <div className="flex flex-col flex-1 bg-white border-r">
            <div className="flex items-center h-16 px-6 border-b"><span className="text-xl font-bold text-blue-700">ADR Shield</span><span className="ml-2 text-xs text-gray-400">Enterprise</span></div>
            <nav className="flex-1 p-4 space-y-1">
              {navigation.map((item) => (
                <Link key={item.name} to={item.href} className="flex items-center gap-3 px-3 py-2 text-gray-700 rounded-md hover:bg-gray-100">
                  <item.icon className="w-5 h-5" /> {item.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        <div className="lg:pl-64">
          <div className="sticky top-0 z-10 bg-white border-b lg:hidden">
            <div className="flex items-center justify-between p-4">
              <span className="text-xl font-bold text-blue-700">ADR Shield</span>
              <button onClick={() => setSidebarOpen(true)} className="p-1"><Menu className="w-6 h-6" /></button>
            </div>
          </div>
          <main className="p-6">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/drugs" element={<DrugsList />} />
              <Route path="/drugs/:id" element={<DrugDetail />} />
              <Route path="/interactions" element={<Interactions />} />
              <Route path="/symptoms" element={<SymptomsPredictor />} />
              <Route path="/chatbot" element={<Chatbot />} />
              <Route path="/reports" element={<AdrReportForm />} />
              <Route path="/doctor" element={<DoctorMode />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
};

export default App;