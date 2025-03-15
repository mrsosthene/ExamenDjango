import React, { useState, useEffect, FormEvent } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Camera,
  Save,
  Shield,
  AlertCircle,
  CheckCircle,
  ArrowLeft,
} from "lucide-react";

// l'interface du profil
interface UserProfile {
  id: number;
  username: string;
  email: string;
  role: string;
  avatar?: string | null;
}

const Profil: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState<boolean>(false);
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [activeSection, setActiveSection] = useState<"personal" | "security">(
    "personal"
  );

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        const response = await axios.get(
          "http://127.0.0.1:8000/api/profil/",
          config
        );
        console.log("[Profil] GET profil :", response.data);
        setProfile(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Erreur lors de la récupération du profil :", error);
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    try {
      setSaving(true);
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("username", profile.username);
      formData.append("email", profile.email);
      if (avatarFile) {
        formData.append("avatar", avatarFile);
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      };
      const response = await axios.post(
        "http://127.0.0.1:8000/api/profil/",
        formData,
        config
      );
      console.log("[Profil] POST profil :", response.data);
      setProfile(response.data);
      setSaving(false);
      setNotification({
        type: "success",
        message: "Profil mis à jour avec succès !",
      });
    } catch (error) {
      console.error("Erreur lors de la mise à jour du profil :", error);
      setSaving(false);
      setNotification({
        type: "error",
        message: "Impossible de mettre à jour le profil.",
      });
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const getAvatarURL = (avatar: string | null | undefined) => {
    if (!avatar) return null;
    return avatar.startsWith("http")
      ? avatar
      : `http://127.0.0.1:8000${avatar}`;
  };

  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case "etudiant":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "professeur":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
    }
  };

  const getRoleName = (role: string) => {
    switch (role.toLowerCase()) {
      case "etudiant":
        return "Étudiant";
      case "professeur":
        return "Professeur";
      default:
        return role;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-400 border-t-blue-600"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="p-8 text-center bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300">
        <p className="text-xl">
          Impossible de charger le profil. Veuillez vous reconnecter.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300">
      {notification && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 py-3 px-6 rounded-lg shadow-lg flex items-center gap-2 ${
            notification.type === "success"
              ? "bg-green-500 text-white"
              : "bg-red-500 text-white"
          }`}
        >
          {notification.type === "success" ? (
            <CheckCircle className="h-5 w-5" />
          ) : (
            <AlertCircle className="h-5 w-5" />
          )}
          {notification.message}
        </motion.div>
      )}

      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-5xl mx-auto"
        >
          <div className="flex items-center mb-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Retour</span>
            </motion.button>
            <h1 className="text-3xl font-bold ml-4">Paramètres du compte</h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-3">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden sticky top-8 transition-colors duration-300">
                <div className="flex flex-col items-center p-6 border-b border-gray-200 dark:border-gray-700">
                  <div className="relative mb-4">
                    <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 border-4 border-white dark:border-gray-800 shadow-sm">
                      {/* Affichage de l'avatar */}
                      {avatarPreview ? (
                        <img
                          src={avatarPreview}
                          alt="Avatar Preview"
                          className="w-full h-full object-cover"
                        />
                      ) : profile.avatar ? (
                        <img
                          src={getAvatarURL(profile.avatar) ?? undefined} // <-- On préfixe si besoin
                          alt="Avatar"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-400 to-purple-500">
                          <span className="text-3xl font-bold text-white">
                            {profile.username.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold">{profile.username}</h3>
                  <span
                    className={`mt-1 px-3 py-1 text-xs font-medium rounded-full ${getRoleColor(
                      profile.role
                    )}`}
                  >
                    {getRoleName(profile.role)}
                  </span>
                </div>

                <nav className="p-2">
                  <ul className="space-y-1">
                    <li>
                      <button
                        onClick={() => setActiveSection("personal")}
                        className={`w-full flex items-center gap-2 px-4 py-3 rounded-lg transition-colors ${
                          activeSection === "personal"
                            ? "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 font-medium"
                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50"
                        }`}
                      >
                        <User className="h-5 w-5" />
                        Informations personnelles
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => setActiveSection("security")}
                        className={`w-full flex items-center gap-2 px-4 py-3 rounded-lg transition-colors ${
                          activeSection === "security"
                            ? "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 font-medium"
                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50"
                        }`}
                      >
                        <Shield className="h-5 w-5" />
                        Sécurité
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>

            {/* Main content */}
            <div className="lg:col-span-9">
              {activeSection === "personal" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden transition-colors duration-300"
                >
                  <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                      <User className="h-5 w-5 text-blue-500" />
                      Informations personnelles
                    </h2>
                    <p className="mt-1 text-gray-600 dark:text-gray-400">
                      Mettez à jour vos informations personnelles
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                          Nom d'utilisateur
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <User className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type="text"
                            value={profile.username}
                            onChange={(e) =>
                              setProfile({
                                ...profile,
                                username: e.target.value,
                              })
                            }
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 bg-white dark:bg-gray-700 dark:text-white"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                          Adresse email
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Mail className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type="email"
                            value={profile.email}
                            onChange={(e) =>
                              setProfile({ ...profile, email: e.target.value })
                            }
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 bg-white dark:bg-gray-700 dark:text-white"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                        Avatar
                      </label>
                      <div className="flex flex-col sm:flex-row items-center gap-6">
                        <div className="relative">
                          <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 border-2 border-white dark:border-gray-800 shadow-sm">
                            {avatarPreview ? (
                              <img
                                src={avatarPreview}
                                alt="Avatar Preview"
                                className="w-full h-full object-cover"
                              />
                            ) : profile.avatar ? (
                              <img
                                src={getAvatarURL(profile.avatar) ?? undefined}
                                alt="Avatar"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-400 to-purple-500">
                                <span className="text-3xl font-bold text-white">
                                  {profile.username.charAt(0).toUpperCase()}
                                </span>
                              </div>
                            )}
                          </div>
                          <label
                            htmlFor="avatar-input"
                            className="absolute bottom-0 right-0 bg-blue-500 text-white p-1.5 rounded-full cursor-pointer shadow-md hover:bg-blue-600 transition-colors"
                          >
                            <Camera className="h-4 w-4" />
                          </label>
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center justify-center w-full">
                            <label
                              htmlFor="dropzone-file"
                              className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500"
                            >
                              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <Camera className="w-8 h-8 mb-3 text-gray-500 dark:text-gray-400" />
                                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                  <span className="font-semibold">
                                    Cliquez pour télécharger
                                  </span>{" "}
                                  ou glissez-déposez
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  PNG, JPG ou GIF (Max. 2MB)
                                </p>
                              </div>
                              <input
                                id="dropzone-file"
                                type="file"
                                className="hidden"
                                onChange={handleAvatarChange}
                                accept="image/*"
                              />
                            </label>
                          </div>
                          <input
                            id="avatar-input"
                            type="file"
                            onChange={handleAvatarChange}
                            className="hidden"
                            accept="image/*"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                        Rôle dans l'application
                      </label>
                      <div className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 flex items-center gap-2">
                        <Shield className="h-5 w-5 text-blue-500" />
                        <span>{getRoleName(profile.role)}</span>
                        <span className="text-xs text-gray-500 ml-2">
                          (Vous ne pouvez pas modifier ce champ)
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={saving}
                        className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium rounded-lg shadow hover:shadow-lg transition-all duration-200 flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                      >
                        {saving ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-2 border-t-transparent border-white"></div>
                            Mise à jour...
                          </>
                        ) : (
                          <>
                            <Save className="h-5 w-5" />
                            Enregistrer les modifications
                          </>
                        )}
                      </motion.button>
                    </div>
                  </form>
                </motion.div>
              )}

              {activeSection === "security" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden transition-colors duration-300"
                >
                  <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                      <Shield className="h-5 w-5 text-blue-500" />
                      Sécurité du compte
                    </h2>
                    <p className="mt-1 text-gray-600 dark:text-gray-400">
                      Gérez vos paramètres de sécurité et connexion
                    </p>
                  </div>

                  <div className="p-6">
                    <div className="p-4 border border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-800 rounded-lg mb-6">
                      <p className="text-yellow-800 dark:text-yellow-200 flex items-center gap-2">
                        <AlertCircle className="h-5 w-5" />
                        <span>
                          Cette fonctionnalité sera disponible prochainement.
                        </span>
                      </p>
                    </div>

                    <div className="opacity-60 pointer-events-none">
                      <h3 className="text-lg font-medium mb-4">
                        Changement de mot de passe
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                            Mot de passe actuel
                          </label>
                          <input
                            type="password"
                            disabled
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white"
                            placeholder="••••••••"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                            Nouveau mot de passe
                          </label>
                          <input
                            type="password"
                            disabled
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white"
                            placeholder="••••••••"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                            Confirmer le nouveau mot de passe
                          </label>
                          <input
                            type="password"
                            disabled
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white"
                            placeholder="••••••••"
                          />
                        </div>
                        <div>
                          <button
                            disabled
                            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium rounded-lg shadow transition-all duration-200 flex items-center gap-2 opacity-50 cursor-not-allowed"
                          >
                            <Save className="h-5 w-5" />
                            Mettre à jour le mot de passe
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Profil;
