import React from "react";
import { motion } from "framer-motion";
import TaskItem from "./TaskItem";
import { Calendar } from "lucide-react";

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

interface TaskListProps {
  tasks: Task[];
  users: { id: number; name: string; role: "etudiant" | "professeur" }[];

  // Les différentes fonctions passées en prop
  toggleStatus: (id: number) => void;
  finishTask: (id: number) => void;
  reopenTask: (id: number) => void;
  deleteTask: (id: number) => void;

  searchTerm: string;
  filter: "all" | "completed" | "pending";
}

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  users,
  toggleStatus,
  finishTask,
  reopenTask,
  deleteTask,
  searchTerm,
  filter,
}) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-4"
    >
      {tasks.length === 0 ? (
        <motion.div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-8 text-center border border-gray-300 dark:border-gray-700 transition-colors duration-300">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
            <Calendar className="h-8 w-8 text-gray-600 dark:text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Aucune tâche trouvée</h3>
          <p className="text-gray-600 dark:text-gray-400">
            {searchTerm
              ? "Aucune tâche ne correspond à votre recherche"
              : filter === "completed"
              ? "Vous n'avez pas encore de tâches terminées"
              : filter === "pending"
              ? "Vous n'avez pas de tâches en cours"
              : "Commencez par ajouter une nouvelle tâche"}
          </p>
        </motion.div>
      ) : (
        tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            users={users}
            toggleStatus={toggleStatus}
            finishTask={finishTask}
            reopenTask={reopenTask}
            deleteTask={deleteTask}
          />
        ))
      )}
    </motion.div>
  );
};

export default TaskList;
