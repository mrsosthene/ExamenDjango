import React, { useEffect, useState } from "react";
import api from "../../services/api";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface MonthlyStat {
  month: string;
  tasksCreated: number;
  tasksCompleted: number;
}

interface CategoryStat {
  name: string;
  value: number;
  color: string;
}

interface PriorityStat {
  name: string;
  value: number;
}

interface StatisticsData {
  monthlyStats: MonthlyStat[];
  categoryStats: CategoryStat[];
  priorityStats: PriorityStat[];
  completionRate: number;
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  overdueTasks: number;
}

interface PrimeData {
  professeur: string;
  total_tasks: number;
  on_time_tasks: number;
  taux_d_execution: number;
  prime: number;
}

const Statistics: React.FC = () => {
  const [data, setData] = useState<StatisticsData | null>(null);
  const [loading, setLoading] = useState(true);

  // États pour la gestion des primes
  const [primeLoading, setPrimeLoading] = useState(false);
  const [primes, setPrimes] = useState<PrimeData[]>([]);
  const [primeError, setPrimeError] = useState<string>("");

  useEffect(() => {
    api
      .get("/api/statistics/")
      .then((response) => {
        console.log("Réponse API:", response.data);
        setData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(
          "Erreur lors de la récupération des statistiques:",
          error
        );
        setLoading(false);
      });
  }, []);

  const fetchPrimes = async () => {
    setPrimeLoading(true);
    setPrimeError("");
    try {
      const response = await api.post("/api/attribuer_primes_api/");
      setPrimes(response.data.resultats);
    } catch {
      console.error("Erreur lors du calcul des primes :");
      setPrimeError("Erreur lors de la récupération des primes.");
    } finally {
      setPrimeLoading(false);
    }
  };

  // Animation variants pour les cartes
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut",
      },
    }),
  };

  // Animation variants pour les graphiques
  const chartVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: (i: number) => ({
      opacity: 1,
      scale: 1,
      transition: {
        delay: 0.3 + i * 0.2,
        duration: 0.6,
        ease: "easeOut",
      },
    }),
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-center h-screen"
      >
        <div className="text-lg">Chargement...</div>
      </motion.div>
    );
  }

  if (!data) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-center h-screen"
      >
        <div className="text-lg">Aucune donnée disponible.</div>
      </motion.div>
    );
  }

  const {
    monthlyStats = [],
    categoryStats = [],
    priorityStats = [],
    completionRate,
    totalTasks,
    completedTasks,
    pendingTasks,
    overdueTasks,
  } = data;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      {/* Statistiques globales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            title: "Tâches totales",
            value: totalTasks,
            color: "blue",
            width: "100%",
          },
          {
            title: "Tâches terminées",
            value: completedTasks,
            color: "green",
            width: totalTasks
              ? `${(completedTasks / totalTasks) * 100}%`
              : "0%",
          },
          {
            title: "Tâches en cours",
            value: pendingTasks,
            color: "yellow",
            width: totalTasks ? `${(pendingTasks / totalTasks) * 100}%` : "0%",
          },
          {
            title: "Tâches en retard",
            value: overdueTasks,
            color: "red",
            width: totalTasks ? `${(overdueTasks / totalTasks) * 100}%` : "0%",
          },
        ].map((item, index) => (
          <motion.div
            key={item.title}
            custom={index}
            initial="hidden"
            animate="visible"
            variants={cardVariants}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-4 transition-colors duration-300"
          >
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
              {item.title}
            </div>
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                delay: 0.3 + index * 0.1,
                duration: 0.5,
                type: "spring",
              }}
              className={`text-3xl font-bold ${
                item.color !== "blue" ? `text-${item.color}-500` : ""
              }`}
            >
              {item.value}
            </motion.div>
            <div className="mt-2 h-1 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: item.width }}
                transition={{
                  delay: 0.5 + index * 0.1,
                  duration: 0.8,
                  ease: "easeOut",
                }}
                className={`h-1 bg-${item.color}-500 rounded-full`}
              ></motion.div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          custom={0}
          initial="hidden"
          animate="visible"
          variants={chartVariants}
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
          className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-4 transition-colors duration-300"
        >
          <h3 className="text-lg font-semibold mb-4">Progression mensuelle</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={monthlyStats}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient
                    id="colorCompleted"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorCreated" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#374151"
                  opacity={0.1}
                />
                <XAxis dataKey="month" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(255, 255, 255, 0.9)",
                    borderRadius: "0.5rem",
                    border: "none",
                    boxShadow:
                      "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                  }}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="tasksCompleted"
                  name="Tâches terminées"
                  stroke="#3B82F6"
                  fillOpacity={1}
                  fill="url(#colorCompleted)"
                  isAnimationActive={true}
                  animationBegin={200}
                  animationDuration={2000}
                  animationEasing="ease-out"
                />
                <Area
                  type="monotone"
                  dataKey="tasksCreated"
                  name="Tâches créées"
                  stroke="#8B5CF6"
                  fillOpacity={1}
                  fill="url(#colorCreated)"
                  isAnimationActive={true}
                  animationBegin={400}
                  animationDuration={2000}
                  animationEasing="ease-out"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          custom={1}
          initial="hidden"
          animate="visible"
          variants={chartVariants}
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
          className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-4 transition-colors duration-300"
        >
          <h3 className="text-lg font-semibold mb-4">
            Répartition par catégorie
          </h3>
          <div className="h-80 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryStats}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  isAnimationActive={true}
                  animationBegin={300}
                  animationDuration={2000}
                  animationEasing="ease-out"
                >
                  {categoryStats?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [`${value} tâches`, "Nombre"]}
                  contentStyle={{
                    backgroundColor: "rgba(255, 255, 255, 0.9)",
                    borderRadius: "0.5rem",
                    border: "none",
                    boxShadow:
                      "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          custom={2}
          initial="hidden"
          animate="visible"
          variants={chartVariants}
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
          className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-4 transition-colors duration-300"
        >
          <h3 className="text-lg font-semibold mb-4">Tâches par priorité</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={priorityStats}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#374151"
                  opacity={0.1}
                />
                <XAxis dataKey="name" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(255, 255, 255, 0.9)",
                    borderRadius: "0.5rem",
                    border: "none",
                    boxShadow:
                      "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                  }}
                />
                <Legend />
                <Bar
                  dataKey="value"
                  name="Nombre de tâches"
                  radius={[4, 4, 0, 0]}
                  isAnimationActive={true}
                  animationBegin={400}
                  animationDuration={1800}
                  animationEasing="ease-out"
                >
                  <Cell fill="#EF4444" />
                  <Cell fill="#F59E0B" />
                  <Cell fill="#10B981" />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          custom={3}
          initial="hidden"
          animate="visible"
          variants={chartVariants}
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
          className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-4 transition-colors duration-300"
        >
          <h3 className="text-lg font-semibold mb-4">Taux de complétion</h3>
          <div className="flex flex-col items-center justify-center h-80">
            <div className="relative w-64 h-64">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle
                  className="text-gray-200 dark:text-gray-700 stroke-current"
                  strokeWidth="10"
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                />
                <motion.circle
                  initial={{ strokeDashoffset: `${2 * Math.PI * 40}` }}
                  animate={{
                    strokeDashoffset: `${
                      2 * Math.PI * 40 * (1 - completionRate / 100)
                    }`,
                  }}
                  transition={{ delay: 0.5, duration: 1.5, ease: "easeOut" }}
                  className="text-blue-600 dark:text-blue-500 progress-ring__circle stroke-current"
                  strokeWidth="10"
                  strokeLinecap="round"
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  strokeDasharray={`${2 * Math.PI * 40}`}
                  transform="rotate(-90 50 50)"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <motion.span
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7, duration: 0.6, type: "spring" }}
                  className="text-5xl font-bold"
                >
                  {completionRate}%
                </motion.span>
                <motion.span
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9, duration: 0.6 }}
                  className="text-sm text-gray-500 dark:text-gray-400"
                >
                  Taux de complétion
                </motion.span>
              </div>
            </div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1, duration: 0.6 }}
              className="mt-6 grid grid-cols-2 gap-4 w-full max-w-xs"
            >
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1.2, duration: 0.4, type: "spring" }}
                  className="text-2xl font-bold text-green-500"
                >
                  {completedTasks}
                </motion.div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Terminées
                </div>
              </div>
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1.3, duration: 0.4, type: "spring" }}
                  className="text-2xl font-bold text-yellow-500"
                >
                  {pendingTasks}
                </motion.div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  En cours
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
      {/* Section pour le calcul des primes */}
      <motion.div
        custom={4}
        initial="hidden"
        animate="visible"
        variants={chartVariants}
        whileHover={{ y: -5, transition: { duration: 0.2 } }}
        className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-4 transition-colors duration-300"
      >
        <h3 className="text-lg font-semibold mb-4">
          Calcul des primes pour les professeurs
        </h3>
        <motion.button
          onClick={fetchPrimes}
          disabled={primeLoading}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2.5 rounded-lg shadow-md transition duration-300 ease-in-out transform disabled:opacity-70 disabled:cursor-not-allowed mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          {primeLoading ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Calcul en cours...
            </span>
          ) : (
            "Calculer les primes"
          )}
        </motion.button>

        {primeError && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="text-red-500 mb-4"
          >
            {primeError}
          </motion.p>
        )}

        {primes.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow"
          >
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Professeur
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Tâches totales
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Tâches dans les délais
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Taux d'exécution
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Prime
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {primes.map((item, index) => (
                  <motion.tr
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index, duration: 0.3 }}
                    className={
                      index % 2 === 0
                        ? "bg-white dark:bg-gray-800"
                        : "bg-gray-50 dark:bg-gray-700"
                    }
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {item.professeur}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {item.total_tasks}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {item.on_time_tasks}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${item.taux_d_execution * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-gray-500 dark:text-gray-300">
                          {(item.taux_d_execution * 100).toFixed(2)}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600 dark:text-green-400">
                      {item.prime.toLocaleString()} FCFA
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};
export default Statistics;
