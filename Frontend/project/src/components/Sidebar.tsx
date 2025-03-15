import React, { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Calendar, Clock, CheckCircle2, Trash2 } from "lucide-react";

interface Project {
  id: number;
  name: string;
}

interface SidebarProps {
  projects: Project[];
  selectedProject: number;
  setSelectedProject: (id: number) => void;
  onAddProject: () => void;
  filter: "all" | "completed" | "pending";
  setFilter: (filter: "all" | "completed" | "pending") => void;
  onDeleteProject: (projectId: number) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  projects,
  selectedProject,
  setSelectedProject,
  onAddProject,
  filter,
  setFilter,
  onDeleteProject,
}) => {
  const [hoveredProjectId, setHoveredProjectId] = useState<number | null>(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
  };
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  return (
    <div className="w-full md:w-64 space-y-6">
      {/* Section Projets */}
      <div className="bg-gray-200 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl p-4 transition-colors duration-300">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Projets</h2>
          <button
            onClick={onAddProject}
            className="p-1 rounded hover:bg-gray-300 dark:hover:bg-gray-800 transition-colors"
          >
            <Plus className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-2">
          {projects.map((proj) => (
            <div
              key={proj.id}
              className="relative group"
              onMouseEnter={() => setHoveredProjectId(proj.id)}
              onMouseLeave={() => setHoveredProjectId(null)}
            >
              <button
                onClick={() => setSelectedProject(proj.id)}
                className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                  selectedProject === proj.id
                    ? "bg-blue-500/10 text-blue-500 dark:bg-blue-500/20 dark:text-blue-400"
                    : "hover:bg-gray-200 dark:hover:bg-gray-800"
                }`}
              >
                {proj.name}
              </button>

              {/* Bouton poubelle : visible seulement quand on survole le projet */}
              {hoveredProjectId === proj.id && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteProject(proj.id);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Section Filtres */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="bg-gray-200 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl p-4 transition-colors duration-300"
      >
        <motion.div variants={itemVariants} className="mb-6">
          <h2 className="text-lg font-semibold mb-4">Filtres</h2>
          <div className="space-y-2">
            <button
              onClick={() => setFilter("all")}
              className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                filter === "all"
                  ? "bg-blue-500/10 text-blue-500 dark:bg-blue-500/20 dark:text-blue-400"
                  : "hover:bg-gray-200 dark:hover:bg-gray-800"
              }`}
            >
              <Calendar className="h-4 w-4 inline mr-2" />
              Toutes les tâches
            </button>
            <button
              onClick={() => setFilter("pending")}
              className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                filter === "pending"
                  ? "bg-blue-500/10 text-blue-500 dark:bg-blue-500/20 dark:text-blue-400"
                  : "hover:bg-gray-200 dark:hover:bg-gray-800"
              }`}
            >
              <Clock className="h-4 w-4 inline mr-2" />
              En cours
            </button>
            <button
              onClick={() => setFilter("completed")}
              className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                filter === "completed"
                  ? "bg-blue-500/10 text-blue-500 dark:bg-blue-500/20 dark:text-blue-400"
                  : "hover:bg-gray-200 dark:hover:bg-gray-800"
              }`}
            >
              <CheckCircle2 className="h-4 w-4 inline mr-2" />
              Terminées
            </button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Sidebar;
