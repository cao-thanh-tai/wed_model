import { NavigationItem } from "../types/navigation";

const navigationItems: NavigationItem[] = [
  { label: "Workspace", path: "/", status: "active" },
  { label: "Models", path: "/models", status: "planned" },
  { label: "Runs", path: "/runs", status: "active" },
];

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="brand-lockup">
        <span className="brand-mark">A</span>
        <span>AI Hub</span>
      </div>

      <nav aria-label="Primary navigation" className="primary-nav">
        {navigationItems.map((item) => (
          <a
            className={`nav-item ${item.status === "active" ? "is-active" : ""}`}
            href={item.status === "active" ? item.path : undefined}
            key={item.path}
            aria-disabled={item.status === "planned"}
          >
            <span>{item.label}</span>
            {item.status === "planned" && <small>soon</small>}
          </a>
        ))}
      </nav>

      <div className="sidebar-footer">
        <span className="status-dot" />
        <span>Local workspace</span>
      </div>
    </aside>
  );
}

export default Sidebar;