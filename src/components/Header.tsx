import React from 'react';
import './Header.css';

interface HeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: { label: string; href?: string }[];
}

const Header: React.FC<HeaderProps> = ({ title, subtitle, breadcrumbs }) => {
  return (
    <div className="header">
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="breadcrumbs">
          {breadcrumbs.map((crumb, index) => (
            <span key={index} className="breadcrumb-item">
              {crumb.href ? (
                <a href={crumb.href}>{crumb.label}</a>
              ) : (
                <span>{crumb.label}</span>
              )}
              {index < breadcrumbs.length - 1 && (
                <span className="breadcrumb-separator">&gt;</span>
              )}
            </span>
          ))}
        </nav>
      )}
      <h1 className="header-title">{title}</h1>
      {subtitle && <p className="header-subtitle">{subtitle}</p>}
    </div>
  );
};

export default Header;
