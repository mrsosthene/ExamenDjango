import React from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";

interface AddProjectModalProps {
  newProjectName: string;
  newProjectDescription: string;
  setNewProjectName: (name: string) => void;
  setNewProjectDescription: (desc: string) => void;
  handleAddProject: () => void;
  onCancel: () => void;
}

const AddProjectModal: React.FC<AddProjectModalProps> = ({
  newProjectName,
  newProjectDescription,
  setNewProjectName,
  setNewProjectDescription,
  handleAddProject,
  onCancel,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
    >
      <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 w-80 border border-gray-300 dark:border-gray-700">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Nouveau projet</h3>
          <button
            onClick={onCancel}
            className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="space-y-4">
          <input
            type="text"
            value={newProjectName}
            onChange={(e) => setNewProjectName(e.target.value)}
            placeholder="Nom du projet"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-blue-300 outline-none transition-all"
          />
          <textarea
            value={newProjectDescription}
            onChange={(e) => setNewProjectDescription(e.target.value)}
            placeholder="Description du projet"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-blue-300 outline-none transition-all min-h-[80px]"
          />
          <div className="flex justify-end">
            <button
              onClick={handleAddProject}
              className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-200"
            >
              Ajouter le projet
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AddProjectModal;
