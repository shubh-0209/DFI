import React, { memo } from 'react';
import { MoreVertical, Edit2, Trash2, Power, RefreshCw } from 'lucide-react';

const ConfigTable = memo(({ columns, data, loading, onEdit, onDelete, onToggle, onRestore, emptyTitle, emptyDescription, actionLabel }) => {
  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="card" style={{ padding: '1rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div className="skeleton" style={{ width: '40px', height: '40px', borderRadius: '8px', flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <div className="skeleton" style={{ height: '14px', width: '50%', borderRadius: '4px', marginBottom: '0.5rem' }} />
              <div className="skeleton" style={{ height: '10px', width: '30%', borderRadius: '4px' }} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div
        style={{
          textAlign: 'center',
          padding: '3rem 2rem',
          background: 'var(--color-card)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--color-border)',
        }}
      >
        <div style={{ margin: '0 auto 1rem', opacity: 0.4 }}><MoreVertical size={40} /></div>
        <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-base)', fontWeight: 700, color: 'var(--color-heading)', marginBottom: '0.5rem' }}>{emptyTitle || 'No items found'}</h4>
        <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-body)', maxWidth: '400px', margin: '0 auto' }}>{emptyDescription || 'There are no items to display.'}</p>
      </div>
    );
  }

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--text-base)' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid var(--color-border)' }}>
            {columns.map((col) => (
              <th
                key={col.key}
                style={{
                  textAlign: col.align || 'left',
                  padding: '0.75rem 1rem',
                  fontSize: 'var(--text-xs)',
                  fontWeight: 700,
                  color: 'var(--color-body)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  whiteSpace: 'nowrap',
                }}
              >
                {col.label}
              </th>
            ))}
            {(onEdit || onDelete || onToggle || onRestore) && (
              <th style={{ textAlign: 'right', padding: '0.75rem 1rem', fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-body)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Actions</th>
            )}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr
              key={row._id || row.id || idx}
              style={{ borderBottom: '1px solid #F0EDE8', transition: 'var(--transition-fast)' }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(37,99,235,0.02)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
            >
              {columns.map((col) => (
                <td key={col.key} style={{ padding: '0.875rem 1rem', verticalAlign: 'middle' }}>
                  {col.render ? col.render(row[col.key], row) : row[col.key]}
                </td>
              ))}
              {(onEdit || onDelete || onToggle || onRestore) && (
                <td style={{ padding: '0.875rem 1rem', textAlign: 'right', whiteSpace: 'nowrap' }}>
                  <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                    {onEdit && (
                      <button onClick={() => onEdit(row)} aria-label="Edit" style={{ padding: '0.4rem', borderRadius: 'var(--radius-sm)', border: 'none', background: 'transparent', color: 'var(--color-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                        <Edit2 size={16} />
                      </button>
                    )}
                    {onToggle && (
                      <button onClick={() => onToggle(row)} aria-label={row.isActive ? 'Disable' : 'Enable'} style={{ padding: '0.4rem', borderRadius: 'var(--radius-sm)', border: 'none', background: 'transparent', color: row.isActive ? 'var(--color-success)' : 'var(--color-body)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                        <Power size={16} />
                      </button>
                    )}
                    {onRestore && (
                      <button onClick={() => onRestore(row)} aria-label="Restore" style={{ padding: '0.4rem', borderRadius: 'var(--radius-sm)', border: 'none', background: 'transparent', color: 'var(--color-success)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                        <RefreshCw size={16} />
                      </button>
                    )}
                    {onDelete && (
                      <button onClick={() => onDelete(row)} aria-label="Delete" style={{ padding: '0.4rem', borderRadius: 'var(--radius-sm)', border: 'none', background: 'transparent', color: 'var(--color-error)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
});

ConfigTable.displayName = 'ConfigTable';

export default ConfigTable;
