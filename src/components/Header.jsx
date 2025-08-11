import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BarChart3, Users, MapPin, Package, TrendingUp, Home, Target } from 'lucide-react';

const Header = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Dashboard', icon: Home, color: 'var(--forest-green)' },
    { path: '/insights', label: 'Insights', icon: Target, color: 'var(--forest-green)' },
    { path: '/clientes', label: 'Curva Cliente', icon: Users, color: 'var(--blue)' },
    { path: '/produtos', label: 'Curva SKU', icon: Package, color: 'var(--orange)' },
    { path: '/cidades', label: 'Curva Cidade', icon: MapPin, color: 'var(--purple)' },
    { path: '/acabamento', label: 'Curva Acabamento', icon: BarChart3, color: 'var(--teal)' },
    { path: '/estoque', label: 'Previsão Estoque', icon: TrendingUp, color: 'var(--magenta)' }
  ];

  return (
    <header className="section-dark">
      <div className="container">
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          padding: 'var(--spacing-lg) 0'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
            <div style={{
              width: '40px',
              height: '40px',
              backgroundColor: 'var(--forest-green)',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <BarChart3 size={24} color="white" />
            </div>
            <h1 style={{ 
              fontSize: '1.5rem', 
              fontWeight: '600',
              color: 'var(--pure-white)'
            }}>
              Análise ABC - Concrem
            </h1>
          </div>

          <nav style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--spacing-xs)',
                    padding: 'var(--spacing-sm) var(--spacing-md)',
                    borderRadius: 'var(--radius-md)',
                    textDecoration: 'none',
                    color: isActive ? 'var(--pure-white)' : '#9ca3af',
                    backgroundColor: isActive ? item.color : 'transparent',
                    transition: 'all 0.2s ease',
                    fontSize: '0.875rem',
                    fontWeight: '500'
                  }}
                >
                  <Icon size={16} />
                  <span style={{ display: 'none', '@media (min-width: 768px)': { display: 'inline' } }}>
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
