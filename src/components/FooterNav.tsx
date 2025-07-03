import { NavLink } from "react-router-dom";

const FooterNav = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-20 bg-white/90 backdrop-blur-md border-t border-gray-200">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="flex justify-around items-center py-3">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `flex flex-col items-center px-3 py-2 text-sm rounded-lg transition-all duration-200 ${
                isActive
                  ? "text-eco-green-600 font-medium"
                  : "text-gray-500 hover:text-eco-green-500"
              }`
            }
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-house h-6 w-6 mb-1"
            >
              <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"></path>
              <path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            </svg>
            <span>Início</span>
          </NavLink>

          <NavLink
            to="/transactions"
            className={({ isActive }) =>
              `flex flex-col items-center px-3 py-2 text-sm rounded-lg transition-all duration-200 ${
                isActive
                  ? "text-eco-green-600 font-medium"
                  : "text-gray-500 hover:text-eco-green-500"
              }`
            }
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-history h-6 w-6 mb-1"
            >
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
              <path d="M3 3v5h5"></path>
              <path d="M12 7v5l4 2"></path>
            </svg>
            <span>Transações</span>
          </NavLink>

          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `flex flex-col items-center px-3 py-2 text-sm rounded-lg transition-all duration-200 ${
                isActive
                  ? "text-eco-green-600 font-medium"
                  : "text-gray-500 hover:text-eco-green-500"
              }`
            }
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-user h-6 w-6 mb-1"
            >
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            <span>Perfil</span>
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default FooterNav;
