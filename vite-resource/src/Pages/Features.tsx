// src/pages/Features.tsx
import React from 'react';

const features = [
  {
    title: 'Project Management',
    description: 'Organize, schedule, and monitor construction projects with real-time updates and collaboration tools.',
  },
  {
    title: 'Inventory Tracking',
    description: 'Manage construction materials, tools, and equipment efficiently with automated stock alerts.',
  },
  {
    title: 'Financial Reporting',
    description: 'Generate invoices, manage budgets, and track expenses to keep your projects profitable.',
  },
  {
    title: 'HR & Workforce Management',
    description: 'Handle employee records, timesheets, and payroll for construction workers and staff.',
  },
  {
    title: 'Compliance & Safety',
    description: 'Ensure projects meet regulatory standards and manage safety protocols easily.',
  },
  {
    title: 'Client Management',
    description: 'Track client information, project history, and communications in one centralized system.',
  },
  {
    title: 'Equipment Maintenance',
    description: 'Schedule regular maintenance for machinery and equipment to minimize downtime and repairs.',
  },
  {
    title: 'Site Reporting & Analytics',
    description: 'Get actionable insights from site data, daily reports, and workforce productivity metrics.',
  },
  {
    title: 'Document Management',
    description: 'Store blueprints, contracts, permits, and project documentation securely in the cloud.',
  },
];

const Features: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-12 text-gray-800">
          Features
        </h1>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white shadow-md rounded-2xl p-6 hover:shadow-lg transition-all"
            >
              <h2 className="text-2xl font-semibold text-indigo-600 mb-4">
                {feature.title}
              </h2>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
      <div className="text-center text-gray-400 text-sm mt-8 pt-4">
                &copy; {new Date().getFullYear()} ERP Building Construction. All rights reserved.
            </div>

    </div>
  );
};







export default Features
