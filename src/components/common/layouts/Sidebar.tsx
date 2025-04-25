import { NavLink, useLocation } from "react-router-dom";
import { Icons } from "../../../assets/icons";
import { useUserStore } from "../../../stores/tokenStore";

// Define nav items with role-based access
const navItems = [
  {
    to: "/dashboard",
    icon: <Icons.Home className="mr-2" />,
    label: "Dashboard",
    roles: ["Admin", "Doctor", "Patient"],
  },
  {
    to: "/predict",
    icon: <Icons.Stethescope className="mr-2" />,
    label: "Predict Disease",
    roles: ["Patient"],
  },
  {
    to: "/doctors",
    icon: <Icons.Stethescope className="mr-2" />,
    label: "Doctors",
    roles: ["Patient"],
  },
  {
    to: "/consultation",
    icon: <Icons.Calender className="mr-2" />,
    label: "Consultation",
    roles: ["Patient", "Doctor"],
  },
  {
    to: "/chats",
    icon: <Icons.MessageCircle className="mr-2" />,
    label: "Chat",
    roles: ["Patient", "Doctor"],
  },
  {
    to: "/medical-history",
    icon: <Icons.History className="mr-2" />,
    label: "Medical History",
    roles: [],
  },
  {
    to: "/settings",
    icon: <Icons.Settings className="mr-2" />,
    label: "Settings",
    roles: [],
  },
  {
    to: "/logout",
    icon: <Icons.LogOut className="mr-2" />,
    label: "Logout",
    roles: ["Admin", "Doctor", "Patient"],
  },
];

const Sidebar = () => {
  const { userProfile } = useUserStore();
  const location = useLocation();

  const role = userProfile?.role || "user"; // default to 'user' if role not present

  // Filter nav items based on user role
  const filteredNavItems = navItems.filter((item) => item.roles.includes(role));

  return (
    <div className="h-screen w-2/12 bg-primary_bg flex flex-col">
      {/* Header */}
      <div className="p-6">
        <h1 className="text-2xl font-bold text-blue-600 capitalize">{role}</h1>
      </div>

      {/* Navigation List */}
      <ul className="space-y-1">
        {filteredNavItems.map(({ to, icon, label }) => (
          <li key={to}>
            <NavLink
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-3 font-medium hover:bg-blue-100 transition-all ${
                  location.pathname.startsWith(to)
                    ? "bg-blue-50 text-blue-600 font-semibold"
                    : "text-gray-600"
                }`
              }
            >
              {icon} {label}
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
