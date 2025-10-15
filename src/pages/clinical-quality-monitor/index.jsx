import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import QualityControlPanel from './components/QualityControlPanel';
import QualityKPICard from './components/QualityKPICard';
import QualityTrendsChart from './components/QualityTrendsChart';
import IncidentSeverityChart from './components/IncidentSeverityChart';
import RecentIncidentsList from './components/RecentIncidentsList';
import QualityMetricsTable from './components/QualityMetricsTable';
import Icon from '../../components/AppIcon';
import Layout from './Layout'; // ← Importación agregada

const ClinicalQualityMonitor = () => {
  const navigate = useNavigate();
  const [selectedFacility, setSelectedFacility] = useState('all');
  const [selectedPeriod, setSelectedPeriod] = useState('last_30_days');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedMetrics, setSelectedMetrics] = useState(['infectionRate', 'medicationErrors', 'patientFalls', 'qualityScore']);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date()?.toISOString());

  // ... (todo tu código anterior sin cambios) ...

  return (
    <Layout> {/* ← Envuelto con Layout */}
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* ... (todo tu JSX interno sin cambios) ... */}
          </div>
        </main>
      </div>
    </Layout> // ← Cierre de Layout
  );
};

export default ClinicalQualityMonitor;