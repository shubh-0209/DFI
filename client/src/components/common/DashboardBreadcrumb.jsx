import React from 'react';
import { useLocation, Link } from 'react-router-dom';

const DashboardBreadcrumb = ({ style = {} }) => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  if (pathnames.length === 0) {
    return null;
  }

  const breadcrumbItems = [];
  const isAdmin = pathnames[0] === 'admin' || pathnames[0] === 'super-admin';

  if (isAdmin) {
    breadcrumbItems.push({
      name: pathnames[0] === 'admin' ? 'Admin' : 'Super Admin',
      path: `/${pathnames[0]}/dashboard`
    });
    pathnames.slice(1).forEach((value, index) => {
      const path = `/${pathnames.slice(0, index + 2).join('/')}`;
      const name = value.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
      breadcrumbItems.push({ name, path });
    });
  } else {
    // Check if the current route is a standalone volunteer route that shouldn't be prefixed with "Volunteer"
    // Actually, to match the prompt exactly: "Volunteer / Marketplace"
    // We always prefix with "Volunteer" for non-admin dashboard pages.
    breadcrumbItems.push({ name: 'Volunteer', path: '/dashboard' });
    
    // Some paths like `/dashboard` itself would result in "Volunteer / Dashboard"
    pathnames.forEach((value, index) => {
      const path = `/${pathnames.slice(0, index + 1).join('/')}`;
      const name = value.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
      breadcrumbItems.push({ name, path });
    });
  }

  return (
    <nav aria-label="Breadcrumb" style={{ marginBottom: '10px', ...style }}>
      <ol style={{
        display: 'flex',
        alignItems: 'center',
        listStyle: 'none',
        padding: 0,
        margin: 0,
        flexWrap: 'wrap' }}>
        {breadcrumbItems.map((item, index) => {
          const isLast = index === breadcrumbItems.length - 1;

          return (
            <li key={item.path} style={{ display: 'flex', alignItems: 'center' }}>
              {isLast ? (
                <span style={{ color: '#374151' }}>
                  {item.name}
                </span>
              ) : (
                <Link
                  to={item.path}
                  style={{
                    color: '#6B7280',
                    textDecoration: 'none',
                    transition: 'color 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.target.style.color = '#374151'}
                  onMouseLeave={(e) => e.target.style.color = '#6B7280'}
                >
                  {item.name}
                </Link>
              )}

              {!isLast && (
                <span style={{ color: '#9CA3AF', margin: '0 8px' }}>
                  /
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default DashboardBreadcrumb;
