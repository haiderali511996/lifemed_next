'use client';

export default function AdminLayout({ tab, onTabChange, children }) {
  const tabs = [
    { key: 'orders', label: 'Orders' },
    { key: 'users', label: 'Users' },
  ];

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <h3>Admin Panel</h3>
        {tabs.map((t) => (
          <button
            key={t.key}
            className={`admin-nav-link ${tab === t.key ? 'active' : ''}`}
            onClick={() => onTabChange(t.key)}
            style={{ border: 'none', background: 'none', width: '100%', textAlign: 'left', cursor: 'pointer' }}
          >
            {t.label}
          </button>
        ))}
      </aside>
      <div className="admin-content">{children}</div>
    </div>
  );
}
