/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardLayout from './pages/DashboardLayout';
import DashboardHome from './pages/DashboardHome';
import Tasks from './pages/Tasks';
import Planner from './pages/Planner';
import Email from './pages/Email';
import Reminders from './pages/Reminders';
import Analytics from './pages/Analytics';
import Notes from './pages/Notes';
import Settings from './pages/Settings';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardHome />} />
          <Route path="tasks" element={<Tasks />} />
          <Route path="planner" element={<Planner />} />
          <Route path="email" element={<Email />} />
          <Route path="reminders" element={<Reminders />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="notes" element={<Notes />} />
          <Route path="settings" element={<Settings />} />
        </Route>
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
