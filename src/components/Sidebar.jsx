import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  PlusCircle, 
  Users, 
  Award, 
  BarChart3,
  HelpCircle,
  Settings
} from 'lucide-react';

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-heading">Management</div>
      <NavLink to="/admin/dashboard" end className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
        <LayoutDashboard size={18} /> Dashboard
      </NavLink>
      <NavLink to="/admin/exams" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
        <FileText size={18} /> Manage Exams
      </NavLink>
      <NavLink to="/admin/exams/create" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
        <PlusCircle size={18} /> Create Exam
      </NavLink>
      
      <div className="sidebar-heading">Records & Analytics</div>
      <NavLink to="/admin/students" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
        <Users size={18} /> Students
      </NavLink>
      <NavLink to="/admin/results" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
        <Award size={18} /> Exam Results
      </NavLink>
      <NavLink to="/admin/statistics" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
        <BarChart3 size={18} /> Analytics & Stats
      </NavLink>
    </aside>
  );
}
