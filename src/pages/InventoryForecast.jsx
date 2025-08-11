import React, { useState, useEffect } from 'react';
import { TrendingUp, Search, Download, Calendar, BarChart3 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { fetchConcremData } from '../lib/supabase';
import { calculateInventoryForecast, formatNumber } from '../utils/abcAnalysis';

const InventoryForecast = () => {
  const [data, setData] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [productFilter, setProductFilter] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const rawData = await fetchConcremData();
        setData(rawData);
        const forecastData = calculateInventoryForecast(rawData, selectedProduct);
        setForecast(forecastData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [selectedProduct]);

  // Get unique products for filter
  const uniqueProducts = data ? [...new Set(data.map(item => item.DESCRICAO).filter(Boolean))] : [];

  const filteredProducts = uniqueProducts.filter(product =>
    product.toLowerCase().includes(productFilter.toLowerCase())
  );

  const exportToCSV = () => {
    if (!forecast) return;

    const headers = ['Mês', 'Vendas'];
    const csvContent = [
      headers.join(','),
      ...forecast.monthlyData.map(item => [
        item.month,
        item.sales
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'previsao_estoque.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="section">
        <div className="container">
          <div className="loading">
            <div className="spinner"></div>
            <span style={{ marginLeft: 'var(--spacing-md)' }}>Carregando previsão de estoque...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="section">
        <div className="container">
          <div className="card" style={{ textAlign: 'center', color: '#EF4444' }}>
            <h3>Erro ao carregar dados</h3>
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!forecast) return null;

  return (
    <div className="section">
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: 'var(--spacing-2xl)' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 'var(--spacing-md)' }}>
            <div style={{
              width: '48px',
              height: '48px',
              backgroundColor: 'var(--magenta)',
              borderRadius: 'var(--radius-lg)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 'var(--spacing-md)'
            }}>
              <TrendingUp size={24} color="white" />
            </div>
            <div>
              <h1 style={{ 
                fontSize: '2.5rem', 
                fontWeight: '700', 
                color: 'var(--charcoal-black)',
                margin: 0
              }}>
                Previsão de Estoque
              </h1>
              <p style={{ 
                fontSize: '1.125rem', 
                color: '#6B7280',
                margin: 0
              }}>
                Análise de vendas e recomendações de estoque
              </p>
            </div>
          </div>

          {/* Product Filter */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: 'var(--spacing-xl)'
          }}>
            <div style={{ display: 'flex', gap: 'var(--spacing-md)', alignItems: 'center' }}>
              <div style={{ position: 'relative' }}>
                <Search size={20} style={{
                  position: 'absolute',
                  left: 'var(--spacing-sm)',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#9CA3AF'
                }} />
                <input
                  type="text"
                  placeholder="Buscar produto..."
                  value={productFilter}
                  onChange={(e) => setProductFilter(e.target.value)}
                  style={{
                    width: '300px',
                    padding: 'var(--spacing-sm) var(--spacing-sm) var(--spacing-sm) 2.5rem',
                    border: '1px solid #D1D5DB',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.875rem',
                    outline: 'none'
                  }}
                />
              </div>
              <select
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(e.target.value)}
                style={{
                  padding: 'var(--spacing-sm)',
                  border: '1px solid #D1D5DB',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.875rem',
                  outline: 'none',
                  minWidth: '200px'
                }}
              >
                <option value="">Todos os produtos</option>
                {filteredProducts.map((product, index) => (
                  <option key={index} value={product}>
                    {product}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={exportToCSV}
              className="btn btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}
            >
              <Download size={16} />
              Exportar CSV
            </button>
          </div>

          {/* Summary Cards */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 'var(--spacing-lg)',
            marginBottom: 'var(--spacing-xl)'
          }}>
            <div className="card" style={{ textAlign: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 'var(--spacing-sm)' }}>
                <Calendar size={20} color="#86EFAC" />
              </div>
              <h3 style={{ 
                fontSize: '2rem', 
                fontWeight: '700',
                color: '#2D5A3D',
                margin: '0 0 var(--spacing-xs) 0'
              }}>
                {formatNumber(forecast.averageTotal)}
              </h3>
              <p style={{ margin: 0, color: '#6B7280' }}>Média Mensal</p>
            </div>
            <div className="card" style={{ textAlign: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 'var(--spacing-sm)' }}>
                <BarChart3 size={20} color="#FDE68A" />
              </div>
              <h3 style={{ 
                fontSize: '2rem', 
                fontWeight: '700',
                color: '#D2691E',
                margin: '0 0 var(--spacing-xs) 0'
              }}>
                {formatNumber(forecast.recommendation)}
              </h3>
              <p style={{ margin: 0, color: '#6B7280' }}>Recomendação</p>
            </div>
            <div className="card" style={{ textAlign: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 'var(--spacing-sm)' }}>
                <TrendingUp size={20} color="#FCA5A5" />
              </div>
              <h3 style={{ 
                fontSize: '2rem', 
                fontWeight: '700',
                color: '#B8336A',
                margin: '0 0 var(--spacing-xs) 0'
              }}>
                {formatNumber(forecast.maxSales)}
              </h3>
              <p style={{ margin: 0, color: '#6B7280' }}>Venda Máxima</p>
            </div>
            <div className="card" style={{ textAlign: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 'var(--spacing-sm)' }}>
                <Calendar size={20} color="var(--forest-green)" />
              </div>
              <h3 style={{ 
                fontSize: '2rem', 
                fontWeight: '700',
                color: 'var(--forest-green)',
                margin: '0 0 var(--spacing-xs) 0'
              }}>
                {formatNumber(forecast.minSales)}
              </h3>
              <p style={{ margin: 0, color: '#6B7280' }}>Venda Mínima</p>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-xl)', marginBottom: 'var(--spacing-2xl)' }}>
          {/* Monthly Sales Chart */}
          <div className="card">
            <h3 style={{ marginBottom: 'var(--spacing-lg)', color: 'var(--charcoal-black)' }}>
              Vendas Mensais
            </h3>
            <div style={{ height: '300px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={forecast.monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="month" 
                    fontSize={12}
                  />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="sales" 
                    stroke="#2D5A3D" 
                    strokeWidth={2}
                    dot={{ fill: '#2D5A3D', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Safety Margins Chart */}
          <div className="card">
            <h3 style={{ marginBottom: 'var(--spacing-lg)', color: 'var(--charcoal-black)' }}>
              Margens de Segurança
            </h3>
            <div style={{ height: '300px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[
                  { name: 'Baixa', value: forecast.safetyMargins.low, color: '#10B981' },
                  { name: 'Média', value: forecast.safetyMargins.medium, color: '#F59E0B' },
                  { name: 'Crítica', value: forecast.safetyMargins.critical, color: '#EF4444' }
                ]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#2D5A3D" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Safety Margins Table */}
        <div className="card">
          <h3 style={{ marginBottom: 'var(--spacing-lg)', color: 'var(--charcoal-black)' }}>
            Recomendações de Estoque
          </h3>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: 'var(--spacing-lg)'
          }}>
            <div style={{
              padding: 'var(--spacing-lg)',
              borderRadius: 'var(--radius-md)',
              backgroundColor: '#2D5A3D',
              color: 'white',
              textAlign: 'center'
            }}>
              <h4 style={{ margin: '0 0 var(--spacing-sm) 0', fontSize: '1.25rem' }}>
                Margem Baixa
              </h4>
              <p style={{ margin: '0 0 var(--spacing-sm) 0', fontSize: '2rem', fontWeight: '700' }}>
                {formatNumber(forecast.safetyMargins.low)}
              </p>
              <p style={{ margin: 0, fontSize: '0.875rem', opacity: 0.9 }}>
                110% da média mensal
              </p>
            </div>
            <div style={{
              padding: 'var(--spacing-lg)',
              borderRadius: 'var(--radius-md)',
              backgroundColor: '#D2691E',
              color: 'white',
              textAlign: 'center'
            }}>
              <h4 style={{ margin: '0 0 var(--spacing-sm) 0', fontSize: '1.25rem' }}>
                Margem Média
              </h4>
              <p style={{ margin: '0 0 var(--spacing-sm) 0', fontSize: '2rem', fontWeight: '700' }}>
                {formatNumber(forecast.safetyMargins.medium)}
              </p>
              <p style={{ margin: 0, fontSize: '0.875rem', opacity: 0.9 }}>
                130% da média mensal
              </p>
            </div>
            <div style={{
              padding: 'var(--spacing-lg)',
              borderRadius: 'var(--radius-md)',
              backgroundColor: '#B8336A',
              color: 'white',
              textAlign: 'center'
            }}>
              <h4 style={{ margin: '0 0 var(--spacing-sm) 0', fontSize: '1.25rem' }}>
                Margem Crítica
              </h4>
              <p style={{ margin: '0 0 var(--spacing-sm) 0', fontSize: '2rem', fontWeight: '700' }}>
                {formatNumber(forecast.safetyMargins.critical)}
              </p>
              <p style={{ margin: 0, fontSize: '0.875rem', opacity: 0.9 }}>
                150% da média mensal
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryForecast;