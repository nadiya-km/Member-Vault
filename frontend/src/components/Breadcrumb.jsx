import { Link, useLocation } from "react-router-dom";

const nameMap = {
  admin: "Home",
  dashboard: "Dashboard",
  members: "Members",
  trainers: "Trainers",
  payments: "Payments",
  plans: "Plans",
};

const Breadcrumb = () => {
  const location = useLocation();
  const paths = location.pathname.split("/").filter(Boolean);

  return (
    <nav className="mb-3">
      <small className="text-muted">
        {paths.map((path, index) => {
          const to = "/" + paths.slice(0, index + 1).join("/");
          const label = nameMap[path] || path;

          return (
            <span key={to}>
              {index > 0 && " / "}
              <Link to={to} className="text-decoration-none">
                {label}
              </Link>
            </span>
          );
        })}
      </small>
    </nav>
  );
};

export default Breadcrumb;