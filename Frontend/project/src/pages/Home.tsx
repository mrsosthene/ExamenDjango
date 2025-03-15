import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import TaskList from "../components/TaskList";
import AddTaskModal from "../components/AddTaskModal";
import AddProjectModal from "../components/AddProjectModal";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import api from "../services/api";

/** Types pour le backend */
interface UserAPI {
  id: number;
  username: string;
  role: "etudiant" | "professeur";
  avatar?: string | null;
}
interface ProjectAPI {
  id: number;
  titre: string;
}
interface TacheAPI {
  id: number;
  titre: string;
  description: string;
  date_limite: string;
  terminee: boolean;
  projet: {
    id: number;
    titre: string;
  } | null;
  assigne_a: {
    id: number;
    username: string;
    role: string;
  } | null;
}

/** Types pour le frontend */
interface UserType {
  id: number;
  name: string;
  role: "etudiant" | "professeur";
  avatar?: string | null;
}
interface Project {
  id: number;
  name: string;
}
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

const Home: React.FC = () => {
  // ------------------------------------------------------
  // 1) GESTION DU THÈME
  // ------------------------------------------------------
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark" || savedTheme === "light") return savedTheme;
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });

  useEffect(() => {
    localStorage.setItem("theme", theme);
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  // ------------------------------------------------------
  // 2) STATES : users, currentUser, projects, tasks
  // ------------------------------------------------------
  const [users, setUsers] = useState<UserType[]>([]);
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);

  // ------------------------------------------------------
  // 3) useEffect : on charge profil, users, projects, tasks
  // ------------------------------------------------------
  useEffect(() => {
    const fetchData = async () => {
      try {
        // A) Récupérer L'UTILISATEUR CONNECTÉ (profil)
        const meResp = await api.get<UserAPI>("/api/profil/");
        const meData = meResp.data;
        const me: UserType = {
          id: meData.id,
          name: meData.username,
          role: meData.role,
          avatar: meData.avatar || null,
        };
        setCurrentUser(me);

        // B) Récupérer TOUS les utilisateurs
        const usersResp = await api.get<UserAPI[]>("/api/utilisateurs/");
        const fetchedUsers: UserType[] = usersResp.data.map((u) => ({
          id: u.id,
          name: u.username,
          role: u.role,
          avatar: u.avatar || null,
        }));
        setUsers(fetchedUsers);

        // C) Récupérer les projets
        const projectsResp = await api.get<ProjectAPI[]>("/api/projects/");
        const fetchedProjects: Project[] = projectsResp.data.map((p) => ({
          id: p.id,
          name: p.titre,
        }));
        setProjects(fetchedProjects);
        if (fetchedProjects.length > 0) {
          setSelectedProject(fetchedProjects[0].id);
        }

        // D) Récupérer les tâches
        const tasksResp = await api.get<TacheAPI[]>("/api/taches/");
        const fetchedTasks: Task[] = tasksResp.data.map((t) => ({
          id: t.id,
          title: t.titre,
          description: t.description,
          completed: t.terminee,
          dueDate: t.date_limite ? t.date_limite.substring(0, 10) : "",
          priority: "medium",
          category: "École",
          projectId: t.projet ? t.projet.id : 0,
          assignedUserId: t.assigne_a ? t.assigne_a.id : 0,
        }));
        setTasks(fetchedTasks);
      } catch (error) {
        console.error(
          "Erreur lors du fetch (profil / users / projects / tasks) :",
          error
        );
      }
    };

    fetchData();
  }, []);

  // ------------------------------------------------------
  // 4) allowedAssignees : en fonction du role
  // ------------------------------------------------------
  const allowedAssignees: UserType[] = currentUser
    ? currentUser.role === "etudiant"
      ? users.filter((u) => u.role === "etudiant")
      : users
    : [];

  // ------------------------------------------------------
  // 5) Filtres & Recherche
  // ------------------------------------------------------
  const [filter, setFilter] = useState<"all" | "completed" | "pending">("all");
  const [searchTerm, setSearchTerm] = useState("");

  // ------------------------------------------------------
  // 6) Modales (AddTask / AddProject)
  // ------------------------------------------------------
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [isAddingProject, setIsAddingProject] = useState(false);

  // État newTask
  const [newTask, setNewTask] = useState<Omit<Task, "id">>({
    title: "",
    description: "",
    completed: false,
    dueDate: new Date().toISOString().split("T")[0],
    priority: "medium",
    category: "École",
    projectId: selectedProject || 0,
    assignedUserId: allowedAssignees.length ? allowedAssignees[0].id : 0,
  });

  // État newProject
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectDescription, setNewProjectDescription] = useState("");

  // ------------------------------------------------------
  // 7) Filtrer les tâches
  // ------------------------------------------------------
  const filteredTasks = tasks
    .filter((t) => (selectedProject ? t.projectId === selectedProject : true))
    .filter((t) => {
      if (filter === "completed") return t.completed;
      if (filter === "pending") return !t.completed;
      return true;
    })
    .filter(
      (t) =>
        t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

  // ------------------------------------------------------
  // 8) Fonctions sur les tâches
  // ------------------------------------------------------
  // A) Toggle local
  const toggleTaskStatus = (id: number) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  // B) Supprimer une tâche
  const deleteTask = async (id: number) => {
    try {
      await api.delete(`/api/taches/${id}/supprimer/`);
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch (error) {
      console.error("Erreur lors de la suppression de la tâche :", error);
      alert("Impossible de supprimer la tâche.");
    }
  };

  // C) Terminer une tâche via l'API
  const finishTask = async (id: number) => {
    try {
      await api.post(`/api/taches/${id}/terminer/`);
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, completed: true } : t))
      );
    } catch (error) {
      console.error("Erreur lors de la terminaison de la tâche :", error);
      alert("Impossible de terminer la tâche.");
    }
  };

  // D) Réouvrir une tâche via l'API
  const reopenTask = async (id: number) => {
    try {
      await api.post(`/api/taches/${id}/reouvrir/`);
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, completed: false } : t))
      );
    } catch (error) {
      console.error("Erreur lors de la réouverture de la tâche :", error);
      alert("Impossible de réouvrir la tâche.");
    }
  };

  // ------------------------------------------------------
  // 9) Supprimer un projet (optionnel)
  // ------------------------------------------------------
  const handleDeleteProject = async (projectId: number) => {
    try {
      await api.delete(`/api/supprimer-projet/${projectId}/`);
      setProjects((prev) => prev.filter((p) => p.id !== projectId));
      if (selectedProject === projectId) {
        setSelectedProject(null);
      }
    } catch (error) {
      console.error("Erreur lors de la suppression du projet :", error);
      alert("Impossible de supprimer le projet.");
    }
  };

  // ------------------------------------------------------
  // 10) Ajouter un projet (API)
  // ------------------------------------------------------
  const handleAddProject = async () => {
    if (!newProjectName.trim()) return;
    try {
      const payload = {
        titre: newProjectName,
        description: newProjectDescription,
      };
      const resp = await api.post("/api/creer-projet/", payload);
      const newProj: Project = {
        id: resp.data.id,
        name: resp.data.titre,
      };
      setProjects((prev) => [...prev, newProj]);
      setNewProjectName("");
      setNewProjectDescription("");
      setIsAddingProject(false);

      // Sélectionne ce projet
      setSelectedProject(newProj.id);
      setNewTask((prev) => ({ ...prev, projectId: newProj.id }));
    } catch (error) {
      console.error("Erreur lors de la création du projet :", error);
      alert("Impossible de créer le projet.");
    }
  };

  // ------------------------------------------------------
  // 11) Ajouter une tâche localement
  // ------------------------------------------------------
  const handleAddTask = (createdLocalTask: Omit<Task, "id">) => {
    const newId = tasks.length ? Math.max(...tasks.map((t) => t.id)) + 1 : 1;
    const finalTask: Task = { ...createdLocalTask, id: newId };
    setTasks((prev) => [finalTask, ...prev]);
  };

  // ------------------------------------------------------
  // 12) Rendu
  // ------------------------------------------------------
  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-white transition-colors duration-300">
      {/* Header */}
      <Header
        theme={theme}
        toggleTheme={toggleTheme}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        userAvatar={currentUser?.avatar || null}
      />

      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Barre latérale */}
          <Sidebar
            projects={projects}
            selectedProject={selectedProject || 0}
            setSelectedProject={(id) => {
              setSelectedProject(id);
              setNewTask((prev) => ({ ...prev, projectId: id }));
            }}
            onAddProject={() => setIsAddingProject(true)}
            filter={filter}
            setFilter={setFilter}
            onDeleteProject={handleDeleteProject}
          />

          {/* Zone principale */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">
                {filter === "all" && "Toutes les tâches"}
                {filter === "pending" && "Tâches en cours"}
                {filter === "completed" && "Tâches terminées"}
              </h2>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={selectedProject === 0 || selectedProject === null}
                onClick={() => setIsAddingTask(true)}
                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus className="h-5 w-5" />
                Ajouter une tâche
              </motion.button>
            </div>

            {/* Modal d'ajout de tâche */}
            <AnimatePresence>
              {isAddingTask && (
                <AddTaskModal
                  newTask={{ ...newTask, completed: false }}
                  setNewTask={(updated) => setNewTask(updated)}
                  onCancel={() => setIsAddingTask(false)}
                  allowedAssignees={allowedAssignees}
                  onTaskAdded={(createdLocalTask) => {
                    setIsAddingTask(false);
                    handleAddTask(createdLocalTask);
                  }}
                />
              )}
            </AnimatePresence>

            {/* Liste des tâches */}
            <TaskList
              tasks={filteredTasks}
              users={allowedAssignees}
              toggleStatus={toggleTaskStatus}
              finishTask={finishTask}
              reopenTask={reopenTask}
              deleteTask={deleteTask}
              searchTerm={searchTerm}
              filter={filter}
            />
          </div>
        </div>
      </main>

      {/* Modal d'ajout de projet */}
      <AnimatePresence>
        {isAddingProject && (
          <AddProjectModal
            newProjectName={newProjectName}
            newProjectDescription={newProjectDescription}
            setNewProjectName={setNewProjectName}
            setNewProjectDescription={setNewProjectDescription}
            handleAddProject={handleAddProject}
            onCancel={() => setIsAddingProject(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Home;
