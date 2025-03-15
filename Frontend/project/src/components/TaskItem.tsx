import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  MoreVertical,
  Trash2,
  Calendar,
  Check,
  RotateCcw,
} from "lucide-react";

interface Task {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  dueDate: string;
  priority: "low" | "medium" | "high";
  category: string;
  projectId: number;
  assignedUserId: number;
}

interface UserType {
  id: number;
  name: string;
  role: "etudiant" | "professeur";
}

interface TaskItemProps {
  task: Task;
  users: UserType[];
  toggleStatus: (id: number) => void;
  finishTask: (id: number) => void;
  reopenTask: (id: number) => void;
  deleteTask: (id: number) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({
  task,
  users,
  toggleStatus,
  finishTask,
  reopenTask,
  deleteTask,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case "high":
        return "Haute";
      case "medium":
        return "Moyenne";
      case "low":
        return "Basse";
      default:
        return priority;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-500 bg-red-500/10 dark:bg-red-500/20 dark:text-red-400";
      case "medium":
        return "text-yellow-500 bg-yellow-500/10 dark:bg-yellow-500/20 dark:text-yellow-400";
      case "low":
        return "text-green-500 bg-green-500/10 dark:bg-green-500/20 dark:text-green-400";
      default:
        return "text-blue-500 bg-blue-500/10 dark:bg-blue-500/20 dark:text-blue-400";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "École":
        return "text-blue-500 bg-blue-500/10 dark:bg-blue-500/20 dark:text-blue-400";
      case "Lecture":
        return "text-purple-500 bg-purple-500/10 dark:bg-purple-500/20 dark:text-purple-400";
      case "Personnel":
        return "text-green-500 bg-green-500/10 dark:bg-green-500/20 dark:text-green-400";
      default:
        return "text-gray-500 bg-gray-500/10 dark:bg-gray-500/20 dark:text-gray-400";
    }
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString("fr-FR", options);
  };

  const assignedUser = users.find((u) => u.id === task.assignedUserId);

  useEffect(() => {
    if (!showMenu) return;
    const handleClickOutside = () => setShowMenu(false);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [showMenu]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-300 dark:border-gray-700 overflow-hidden transition-all duration-300 ${
        task.completed ? "opacity-70" : ""
      }`}
    >
      <div className="p-4 md:p-6">
        <div className="flex items-start gap-3">
          <button
            onClick={() => {}}
            className={`mt-1 flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
              task.completed
                ? "bg-blue-500 dark:bg-blue-600 border-blue-500 dark:border-blue-600 text-white"
                : "border-gray-300 dark:border-gray-400 hover:border-blue-400 dark:hover:border-blue-500"
            }`}
          >
            {task.completed && <CheckCircle2 className="h-4 w-4" />}
          </button>

          <div className="flex-1">
            <div className="flex items-start justify-between">
              <h3
                className={`text-lg font-medium ${
                  task.completed
                    ? "line-through text-gray-600 dark:text-gray-400"
                    : ""
                }`}
              >
                {task.title}
              </h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setExpanded(!expanded)}
                  className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-800"
                >
                  {expanded ? (
                    <ChevronUp className="h-5 w-5" />
                  ) : (
                    <ChevronDown className="h-5 w-5" />
                  )}
                </button>
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowMenu(!showMenu);
                    }}
                    className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-800"
                  >
                    <MoreVertical className="h-5 w-5" />
                  </button>
                  {showMenu && (
                    <div className="absolute right-0 mt-1 w-48 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-lg border border-gray-300 dark:border-gray-700 z-10">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteTask(task.id);
                          setShowMenu(false);
                        }}
                        className="w-full text-left px-4 py-2 flex items-center gap-2 text-red-500 dark:text-red-400 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg"
                      >
                        <Trash2 className="h-4 w-4" />
                        Supprimer
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              <span
                className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(
                  task.priority
                )}`}
              >
                {getPriorityLabel(task.priority)}
              </span>
              <span
                className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(
                  task.category
                )}`}
              >
                {task.category}
              </span>
              <span className="text-xs px-2 py-1 rounded-full bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-400 flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {formatDate(task.dueDate)}
              </span>
              {assignedUser && (
                <span className="text-xs px-2 py-1 rounded-full bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                  Assigné à : {assignedUser.name}
                </span>
              )}
            </div>

            {/* Boutons d'action */}
            <div className="mt-3 flex gap-2">
              {!task.completed && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => finishTask(task.id)}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-3 py-1 rounded text-xs font-medium shadow-sm hover:shadow transition-all duration-200 flex items-center gap-1"
                >
                  <Check className="h-3 w-3" />
                  Terminer
                </motion.button>
              )}

              {/* 2) Bouton "Toggle" local, ou "Réouvrir" (selon statut) */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() =>
                  task.completed ? reopenTask(task.id) : toggleStatus(task.id)
                }
                className={`${
                  task.completed
                    ? "bg-gradient-to-r from-amber-500 to-orange-600"
                    : "bg-gradient-to-r from-blue-500 to-indigo-600"
                } text-white px-3 py-1 rounded text-xs font-medium shadow-sm hover:shadow transition-all duration-200 flex items-center gap-1`}
              >
                {task.completed ? (
                  <>
                    <RotateCcw className="h-3 w-3" />
                    Réouvrir
                  </>
                ) : (
                  <>
                    <Check className="h-3 w-3" />
                    Toggle
                  </>
                )}
              </motion.button>
            </div>

            {/* Description */}
            <AnimatePresence>
              {expanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-4 overflow-hidden"
                >
                  <p className="text-gray-600 dark:text-gray-400">
                    {task.description || "Aucune description fournie."}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TaskItem;
