import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import { AlertCircle, ArrowRight, Lock, Mail } from "lucide-react";

interface LoginData {
  username: string;
  password: string;
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState<LoginData>({
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/token/",
        loginData
      );
      console.log("Réponse de login :", response.data);

      if (response.data && response.data.access) {
        localStorage.setItem("token", response.data.access);
        if (response.data.refresh) {
          localStorage.setItem("refreshToken", response.data.refresh);
        }
        const userResponse = await axios.get(
          "http://127.0.0.1:8000/api/profil/",
          {
            headers: { Authorization: `Bearer ${response.data.access}` },
          }
        );
        if (userResponse.data && userResponse.data.role === "admin") {
          navigate("/admin/statistique");
        } else {
          navigate("/home");
        }
      } else {
        setError("Token non trouvé dans la réponse.");
      }
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.message || "Identifiants incorrects");
      } else {
        setError("Une erreur est survenue lors de la connexion");
      }
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  const buttonVariants = {
    hover: {
      scale: 1.05,
      boxShadow: "0px 10px 20px rgba(101, 41, 255, 0.3)",
      transition: { type: "spring", stiffness: 400, damping: 10 },
    },
    tap: { scale: 0.95 },
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
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
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
              </svg>
            </div>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="text-4xl font-bold mb-4 text-center"
          >
            Bienvenue sur
            <br />
            <span className="text-5xl">TaskMaster</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="text-xl text-center max-w-md"
          >
            Connectez-vous pour accéder à votre espace personnel
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

      {/*Formulaire */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="w-full max-w-md"
        >
          <motion.div variants={itemVariants} className="mb-8">
            <h1 className="text-4xl font-bold mb-2 gradient-text">Connexion</h1>
            <p className="text-muted-foreground">
              Accédez à votre espace de gestion de tâches
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

          <form onSubmit={handleSubmit}>
            <motion.div variants={itemVariants} className="mb-4">
              <label
                htmlFor="username"
                className="block text-sm font-medium mb-2 flex items-center gap-2"
              >
                <Mail className="h-4 w-4" /> Username
              </label>
              <input
                id="username"
                name="username"
                type="username"
                required
                value={loginData.username}
                onChange={handleChange}
                className="input-field"
                placeholder="Entrez votre username"
              />
            </motion.div>

            <motion.div variants={itemVariants} className="mb-6">
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
                value={loginData.password}
                onChange={handleChange}
                className="input-field"
                placeholder="Entrez votre mot de passe"
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <motion.button
                type="submit"
                disabled={loading}
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                {loading ? (
                  <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    Se connecter <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </motion.button>
            </motion.div>
          </form>

          <motion.div variants={itemVariants} className="mt-6 text-center">
            <p className="text-muted-foreground">
              Pas encore de compte?{" "}
              <Link to="/register" className="text-primary hover:underline">
                Inscrivez-vous
              </Link>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
