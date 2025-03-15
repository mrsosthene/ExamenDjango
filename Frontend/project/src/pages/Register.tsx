import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import {
  CheckCircle,
  AlertCircle,
  ChevronRight,
  ArrowRight,
  CheckCheck,
  User,
  Users,
  Lock,
  Mail,
} from "lucide-react";

interface FormData {
  username: string;
  email: string;
  role: "etudiant" | "professeur";
  password: string;
  password2: string;
}

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    username: "",
    email: "",
    role: "etudiant",
    password: "",
    password2: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (formData.password !== formData.password2) {
      setError("Les mots de passe ne correspondent pas");
      setLoading(false);
      return;
    }

    try {
      await axios.post("http://127.0.0.1:8000/api/register/", formData);
      setSuccess(true);
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setError(
          err.response.data.message ||
            "Une erreur est survenue lors de l'inscription"
        );
      } else {
        setError("Une erreur est survenue lors de l'inscription");
      }
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  const buttonVariants = {
    hover: {
      scale: 1.05,
      boxShadow: "0px 10px 20px rgba(101, 41, 255, 0.3)",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10,
      },
    },
    tap: {
      scale: 0.95,
    },
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="flex-1 flex items-center justify-center p-6 md:p-12">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="w-full max-w-md"
        >
          <motion.div variants={itemVariants} className="mb-8">
            <h1 className="text-4xl font-bold mb-2 gradient-text">
              Créez votre compte
            </h1>
            <p className="text-muted-foreground">
              Rejoignez notre plateforme de gestion de tâches innovante
            </p>
          </motion.div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center gap-3"
            >
              <AlertCircle className="h-5 w-5 text-red-500" />
              <p className="text-red-500">{error}</p>
            </motion.div>
          )}

          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 rounded-lg bg-green-500/10 border border-green-500/30 flex items-center gap-3"
            >
              <CheckCircle className="h-5 w-5 text-green-500" />
              <p className="text-green-500">
                Inscription réussie! Redirection...
              </p>
            </motion.div>
          )}

          <form onSubmit={handleSubmit}>
            <motion.div variants={itemVariants} className="mb-4">
              <label
                htmlFor="username"
                className="block text-sm font-medium mb-2 flex items-center gap-2"
              >
                <User className="h-4 w-4" /> Nom d'utilisateur
              </label>
              <div className="relative">
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={formData.username}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Entrez votre nom d'utilisateur"
                />
                {formData.username && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500"
                  >
                    <CheckCheck className="h-5 w-5" />
                  </motion.span>
                )}
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="mb-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium mb-2 flex items-center gap-2"
              >
                <Mail className="h-4 w-4" /> Email
              </label>
              <div className="relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Entrez votre email"
                />
                {formData.email && formData.email.includes("@") && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500"
                  >
                    <CheckCheck className="h-5 w-5" />
                  </motion.span>
                )}
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="mb-4">
              <label
                htmlFor="role"
                className="block text-sm font-medium mb-2 flex items-center gap-2"
              >
                <Users className="h-4 w-4" /> Rôle
              </label>
              <div className="relative">
                <select
                  id="role"
                  name="role"
                  required
                  value={formData.role}
                  onChange={handleChange}
                  className="input-field appearance-none"
                >
                  <option value="etudiant">Étudiant</option>
                  <option value="professeur">Professeur</option>
                </select>
                <ChevronRight className="absolute right-3 top-1/2 transform -translate-y-1/2 rotate-90 text-muted-foreground" />
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="mb-4">
              <label
                htmlFor="password"
                className="block text-sm font-medium mb-2 flex items-center gap-2"
              >
                <Lock className="h-4 w-4" /> Mot de passe
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="input-field"
                placeholder="Créez un mot de passe sécurisé"
              />
            </motion.div>

            <motion.div variants={itemVariants} className="mb-6">
              <label
                htmlFor="password2"
                className="block text-sm font-medium mb-2 flex items-center gap-2"
              >
                <Lock className="h-4 w-4" /> Confirmer le mot de passe
              </label>
              <input
                id="password2"
                name="password2"
                type="password"
                required
                value={formData.password2}
                onChange={handleChange}
                className="input-field"
                placeholder="Confirmez votre mot de passe"
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <motion.button
                type="submit"
                disabled={loading || success}
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                {loading ? (
                  <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    S'inscrire <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </motion.button>
            </motion.div>
          </form>

          <motion.div variants={itemVariants} className="mt-6 text-center">
            <p className="text-muted-foreground">
              Déjà inscrit?{" "}
              <Link to="/login" className="text-primary hover:underline">
                Connectez-vous
              </Link>
            </p>
          </motion.div>
        </motion.div>
      </div>
      <div className="hidden md:flex md:flex-1 animated-bg relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 to-black/20 z-10"></div>
        <div className="relative z-20 flex flex-col items-center justify-center w-full h-full p-12 text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="floating"
          >
            <div className="w-32 h-32 rounded-full gradient-bg flex items-center justify-center mb-8">
              <CheckCheck className="h-16 w-16 text-white" />
            </div>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="text-4xl font-bold mb-4 text-center"
          >
            Organisez votre travail
            <br />
            <span className="text-5xl">comme jamais</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="text-xl text-center max-w-md"
          >
            Notre plateforme de gestion de tâches vous aide à rester organisé et
            productif
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 1 }}
            className="absolute -bottom-10 -right-10 w-64 h-64 rounded-full bg-secondary/30 blur-3xl"
          ></motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4, duration: 1 }}
            className="absolute -top-10 -left-10 w-64 h-64 rounded-full bg-primary/30 blur-3xl"
          ></motion.div>
        </div>
      </div>
    </div>
  );
};

export default Register;
