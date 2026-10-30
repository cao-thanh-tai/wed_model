import { NavLink } from "react-router-dom";
import { NavigationItem } from "../types/navigation";
import { ModelMetadata } from "../services/api";

const navigationItems: NavigationItem[] = [
  { label: "Workspace", path: "/", status: "active" },
  { label: "Models", path: "/models", status: "planned" },
  { label: "Runs", path: "/runs", status: "active" },
];

type SidebarProps = {
  isVisible: boolean;
  models: ModelMetadata[];
  search: string;
  onSearchChange: (value: string) => void;
};

function Sidebar({ isVisible, models, search, onSearchChange }: SidebarProps) {
  return (
    <header className={`top-nav ${isVisible ? "is-visible" : "is-hidden"}`}>
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

      <div className="nav-model-tools">
        <label className="model-search">
          <span aria-hidden="true">⌕</span>
          <input
            type="search"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search models"
            aria-label="Search models"
          />
          <kbd>/</kbd>
        </label>
        <div className="model-shortcuts" aria-label="Quick model filters">
          {models.slice(0, 4).map((model) => (
            <button type="button" key={model.id} onClick={() => onSearchChange(model.name)}>
              {model.name}
            </button>
          ))}
        </div>
      </div>

      <div className="top-nav-footer">
        <span className="status-dot" />
        <span>Local workspace</span>
      </div>
    </header>
  );
}

export default Sidebar;