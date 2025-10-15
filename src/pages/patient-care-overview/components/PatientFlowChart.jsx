import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Icon from '../../../components/AppIcon';
import Select from '../../../components/ui/Select';

// ----  GENERADOR SÍNCRONO  ----
const generateMockData = (timeframe) => {
  const now = new Date();
  let intervals, intervalSize, labelFormat;

  switch (timeframe) {
    case '24h':
      intervals = 24;
      intervalSize = 60 * 60 * 1000;
      labelFormat = (date) => date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
      break;
    case '7d':
      intervals = 7;
      intervalSize = 24 * 60 * 60 * 1000;
      labelFormat = (date) => date.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric' });
      break;
    case '30d':
      intervals = 30;
      intervalSize = 24 * 60 * 60 * 1000;
      labelFormat = (date) => date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
      break;
    default:
      intervals = 24;
      intervalSize = 60 * 60 * 1000;
      labelFormat = (date) => date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  }

  const data = [];
  for (let i = intervals - 1; i >= 0; i--) {
    const timestamp = new Date(now.getTime() - (i * intervalSize));
    const admissions = Math.floor(Math.random() * 8) + 2;
    const discharges = Math.floor(Math.random() * 6) + 1;
    const transfers = Math.floor(Math.random() * 4) + 1;

    data.push({
      time: labelFormat(timestamp),
      timestamp: timestamp.toISOString(),
      admissions,
      discharges,
      transfers,
      netFlow: admissions - discharges
    });
  }
  return data;
};

const PatientFlowChart = () => {
  const [timeframe, setTimeframe] = useState('24h');

  // 🔥 DATOS CALCULADOS ANTES DEL PRIMER RENDER → SIN FLICKER
  const [chartData] = useState(() => generateMockData(timeframe));

  const totals = chartData.reduce((acc, item) => ({
    totalAdmissions: acc.totalAdmissions + item.admissions,
    totalDischarges: acc.totalDischarges + item.discharges,
    totalTransfers: acc.totalTransfers + item.transfers
  }), { totalAdmissions: 0, totalDischarges: 0, totalTransfers: 0 });

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="bg-popover border border-border rounded-lg p-3 shadow-lg">
        <p className="font-medium text-sm mb-2">{label}</p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2 text-xs">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></div>
            <span className="capitalize">
              {entry.dataKey === 'admissions' ? 'Ingresos' :
               entry.dataKey === 'discharges' ? 'Altas' :
               entry.dataKey === 'transfers' ? 'Traslados' : entry.dataKey}:
            </span>
            <span className="font-medium">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Icon name="trending-up" size={20} />
          Flujo de Pacientes
        </h3>
        <Select
          options={[
            { value: '24h', label: 'Últimas 24 horas' },
            { value: '7d', label: 'Últimos 7 días' },
            { value: '30d', label: 'Últimos 30 días' }
          ]}
          value={timeframe}
          onChange={setTimeframe}
          className="min-w-[160px]"
        />
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="user-plus" size={16} className="text-primary" />
            <span className="text-sm font-medium text-primary">Ingresos</span>
          </div>
          <div className="text-2xl font-bold text-primary">{totals.totalAdmissions}</div>
        </div>
        <div className="bg-success/10 border border-success/20 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="user-check" size={16} className="text-success" />
            <span className="text-sm font-medium text-success">Altas</span>
          </div>
          <div className="text-2xl font-bold text-success">{totals.totalDischarges}</div>
        </div>
        <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="arrow-right-left" size={16} className="text-warning" />
            <span className="text-sm font-medium text-warning">Traslados</span>
          </div>
          <div className="text-2xl font-bold text-warning">{totals.totalTransfers}</div>
        </div>
        <div className="bg-muted border border-border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="activity" size={16} className="text-foreground" />
            <span className="text-sm font-medium text-foreground">Flujo Neto</span>
          </div>
          <div className={`text-2xl font-bold ${totals.totalAdmissions - totals.totalDischarges > 0 ? 'text-primary' : 'text-success'}`}>
            {totals.totalAdmissions - totals.totalDischarges > 0 ? '+' : ''}
            {totals.totalAdmissions - totals.totalDischarges}
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="admissions" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="discharges" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-success)" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="var(--color-success)" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="transfers" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-warning)" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="var(--color-warning)" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis dataKey="time" stroke="var(--color-muted-foreground)" fontSize={12} />
            <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
            <Tooltip content={<CustomTooltip />} />
            <Legend formatter={(value) =>
              value === 'admissions' ? 'Ingresos' :
              value === 'discharges' ? 'Altas' :
              value === 'transfers' ? 'Traslados' : value
            } />
            <Area type="monotone" dataKey="admissions" stackId="1" stroke="var(--color-primary)" fill="url(#admissions)" strokeWidth={2} />
            <Area type="monotone" dataKey="discharges" stackId="1" stroke="var(--color-success)" fill="url(#discharges)" strokeWidth={2} />
            <Area type="monotone" dataKey="transfers" stackId="1" stroke="var(--color-warning)" fill="url(#transfers)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Additional Insights */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Icon name="trending-up" size={14} className="text-primary" />
            <span className="text-muted-foreground">Pico de ingresos:</span>
            <span className="font-medium">
              {chartData.reduce((max, item) => item.admissions > max.admissions ? item : max, { admissions: 0, time: '' })?.time}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Icon name="trending-down" size={14} className="text-success" />
            <span className="text-muted-foreground">Pico de altas:</span>
            <span className="font-medium">
              {chartData.reduce((max, item) => item.discharges > max.discharges ? item : max, { discharges: 0, time: '' })?.time}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Icon name="activity" size={14} className="text-warning" />
            <span className="text-muted-foreground">Promedio traslados:</span>
            <span className="font-medium">
              {chartData.length > 0 ? (totals.totalTransfers / chartData.length).toFixed(1) : 0} por período
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientFlowChart;