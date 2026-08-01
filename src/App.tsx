/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import DashboardLayout from './pages/DashboardLayout';
import DashboardHome from './pages/DashboardHome';
import AiAssistant from './pages/AiAssistant';
import Tasks from './pages/Tasks';
import Planner from './pages/Planner';
import Email from './pages/Email';
import Meetings from './pages/Meetings';
import Reminders from './pages/Reminders';
import Analytics from './pages/Analytics';
import Recommendations from './pages/Recommendations';
import Notes from './pages/Notes';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardHome />} />
          <Route path="assistant" element={<AiAssistant />} />
          <Route path="tasks" element={<Tasks />} />
          <Route path="planner" element={<Planner />} />
          <Route path="email" element={<Email />} />
          <Route path="meetings" element={<Meetings />} />
          <Route path="reminders" element={<Reminders />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="recommendations" element={<Recommendations />} />
          <Route path="notes" element={<Notes />} />
        </Route>
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
