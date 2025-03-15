import React from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import axios, { AxiosError } from "axios";

interface Task {
  title: string;
  description: string;
  completed: boolean;
  dueDate: string;
  priority: "low" | "medium" | "high";
  category: string;
  projectId: number;
  assignedUserId: number;
}

interface AllowedAssignee {
  id: number;
  name: string;
  role: "etudiant" | "professeur";
}

interface AddTaskModalProps {
  newTask: Task;
  setNewTask: (task: Task) => void;
  onCancel: () => void;
  allowedAssignees: AllowedAssignee[];
  onTaskAdded: (task: Task) => void;
}

const AddTaskModal: React.FC<AddTaskModalProps> = ({
  newTask,
  setNewTask,
  onCancel,
  allowedAssignees,
  onTaskAdded,
}) => {
  const handleAddTask = async () => {
    console.log(
      "[handleAddTask] newTask (avant construction payload) =",
      newTask
    );

    // 1) Construire le payload à envoyer au backend
    const payload = {
      titre: newTask.title,
      description: newTask.description,
      projet_id: newTask.projectId,
      assigne_a_id: newTask.assignedUserId,
      date_limite: new Date(newTask.dueDate).toISOString(),
      terminee: false,
    };
    console.log("[handleAddTask] payload =", payload);

    // 2) Configurer les headers et le token JWT
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    console.log("[handleAddTask] token =", token);

    try {
      // 3) Appel POST à l’URL
      const response = await axios.post(
        "http://127.0.0.1:8000/api/ajouter-tache/",
        payload,
        config
      );
      console.log(
        "[handleAddTask] Réponse du serveur (succès) =",
        response.data
      );

      // 4) Notifier le parent que la tâche est créée
      onTaskAdded(response.data);

      // 5) Réinitialiser le formulaire
      setNewTask({
        title: "",
        description: "",
        completed: false,
        dueDate: new Date().toISOString().split("T")[0],
        priority: "medium",
        category: "École",
        projectId: newTask.projectId,
        assignedUserId: allowedAssignees.length ? allowedAssignees[0].id : 0,
      });
      onCancel();
    } catch (error: unknown) {
      // 6) Gestion des erreurs
      if (error instanceof AxiosError) {
        console.error(
          "[handleAddTask] Erreur (AxiosError) =",
          error.response?.data || error
        );
      } else {
        console.error("[handleAddTask] Erreur (autre) =", error);
      }
      alert("Erreur lors de l'ajout de la tâche.");
    }
  };

  return (
    <div className="my-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 border border-gray-300 dark:border-gray-700 transition-colors duration-300"
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Nouvelle tâche</h3>
          <button
            onClick={onCancel}
            className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
          {/* Titre */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-1">
              Titre
            </label>
            <input
              id="title"
              type="text"
              value={newTask.title}
              onChange={(e) =>
                setNewTask({ ...newTask, title: e.target.value })
              }
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-blue-300 outline-none transition-all"
              placeholder="Titre de la tâche"
            />
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium mb-1"
            >
              Description
            </label>
            <textarea
              id="description"
              value={newTask.description}
              onChange={(e) =>
                setNewTask({ ...newTask, description: e.target.value })
              }
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-blue-300 outline-none transition-all min-h-[80px]"
              placeholder="Description de la tâche"
            />
          </div>

          {/* Date, priorité, catégorie */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label
                htmlFor="dueDate"
                className="block text-sm font-medium mb-1"
              >
                Date d'échéance
              </label>
              <input
                id="dueDate"
                type="date"
                value={newTask.dueDate}
                onChange={(e) =>
                  setNewTask({ ...newTask, dueDate: e.target.value })
                }
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-blue-300 outline-none transition-all"
              />
            </div>

            <div>
              <label
                htmlFor="priority"
                className="block text-sm font-medium mb-1"
              >
                Priorité
              </label>
              <select
                id="priority"
                value={newTask.priority}
                onChange={(e) =>
                  setNewTask({
                    ...newTask,
                    priority: e.target.value as "low" | "medium" | "high",
                  })
                }
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-blue-300 outline-none transition-all"
              >
                <option value="low">Basse</option>
                <option value="medium">Moyenne</option>
                <option value="high">Haute</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium mb-1"
              >
                Catégorie
              </label>
              <select
                id="category"
                value={newTask.category}
                onChange={(e) =>
                  setNewTask({ ...newTask, category: e.target.value })
                }
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-blue-300 outline-none transition-all"
              >
                <option value="École">École</option>
                <option value="Lecture">Lecture</option>
                <option value="Personnel">Personnel</option>
              </select>
            </div>
          </div>

          {/* Assigné à */}
          <div>
            <label
              htmlFor="assignedUser"
              className="block text-sm font-medium mb-1"
            >
              Assigné à
            </label>
            <select
              id="assignedUser"
              value={newTask.assignedUserId}
              onChange={(e) =>
                setNewTask({
                  ...newTask,
                  assignedUserId: Number(e.target.value),
                })
              }
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-blue-300 outline-none transition-all"
            >
              {allowedAssignees.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name} ({u.role})
                </option>
              ))}
            </select>
          </div>

          {/* Boutons */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={onCancel}
              className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors font-medium"
            >
              Annuler
            </button>
            <button
              onClick={handleAddTask}
              className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-200"
            >
              Ajouter la tâche
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AddTaskModal;
