import { NavLink } from "react-router-dom";
import { NavigationItem } from "../types/navigation";

const navigationItems: NavigationItem[] = [
  { label: "Workspace", path: "/", status: "active" },
  { label: "Models", path: "/models", status: "planned" },
  { label: "Runs", path: "/runs", status: "active" },
];

function Sidebar() {
  return (
    <aside className="sidebar">
      <NavLink className="brand-lockup" to="/" aria-label="Go to AI Hub home">
        <span className="brand-mark">A</span>
        <span>AI Hub</span>
      </NavLink>

      <nav aria-label="Primary navigation" className="primary-nav">
        {navigationItems.map((item) => (
          <NavLink
            className={({ isActive }) => `nav-item ${isActive ? "is-active" : ""}`}
            to={item.path}
            key={item.path}
            end={item.path === "/"}
            aria-disabled={item.status === "planned"}
            onClick={(event) => {
              if (item.status === "planned") event.preventDefault();
            }}
          >
            <span>{item.label}</span>
            {item.status === "planned" && <small>soon</small>}
          </NavLink>
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