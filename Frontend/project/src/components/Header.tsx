import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Search, X, Moon, Sun, LogOut, User } from "lucide-react";
import { Link } from "react-router-dom";

function getAvatarURL(avatarPath?: string | null): string | null {
  if (!avatarPath) return null;
  return avatarPath.startsWith("http")
    ? avatarPath
    : `http://127.0.0.1:8000${avatarPath}`;
}

interface HeaderProps {
  theme: "light" | "dark";
  toggleTheme: () => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  userAvatar?: string | null;
}

const Header: React.FC<HeaderProps> = ({
  theme,
  toggleTheme,
  searchTerm,
  setSearchTerm,
  userAvatar,
}) => {
  const avatarURL = getAvatarURL(userAvatar);

  return (
    <header className="bg-gray-200 dark:bg-gray-800 border-b border-gray-300 dark:border-gray-700 sticky top-0 z-50 transition-colors duration-300">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo / Titre */}
        <div className="flex items-center gap-2">
          <motion.div
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{
              duration: 2,
              ease: "easeInOut",
              repeat: Infinity,
              repeatType: "reverse",
            }}
            className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center"
          >
            <CheckCircle2 className="h-5 w-5 text-white" />
          </motion.div>
          <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">
            TaskMaster
          </h1>
        </div>

        {/* Barre de recherche & Actions */}
        <div className="flex items-center gap-4">
          {/* Recherche */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-600 dark:text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 rounded-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:border-blue-300 focus:ring-2 focus:ring-blue-100 outline-none transition-all duration-300 w-40 md:w-60"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Boutons d'actions (theme, settings, logout, avatar) */}
          <div className="flex items-center gap-1">
            {/* Changement de thème */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-300 dark:hover:bg-gray-800 transition-colors"
              aria-label={
                theme === "dark"
                  ? "Switch to light mode"
                  : "Switch to dark mode"
              }
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>
            {/* Logout */}
            <Link
              to="/login"
              className="p-2 rounded-full hover:bg-gray-300 dark:hover:bg-gray-800 transition-colors"
            >
              <LogOut className="h-5 w-5" />
            </Link>

            {/* Bouton Profil = Avatar ou icône */}
            <Link
              to="/profil"
              className="w-8 h-8 rounded-full overflow-hidden bg-gray-300 dark:bg-gray-700 flex items-center justify-center hover:opacity-90 transition-opacity"
            >
              {avatarURL ? (
                <img
                  src={avatarURL}
                  alt="Mon Profil"
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="h-4 w-4 text-white" />
              )}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
