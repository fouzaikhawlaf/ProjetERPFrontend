import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import React, { useState, useEffect } from "react";
import { Container, Table, Button, Card } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { getTasksByProjectId } from "services/TaskProjectService";
import { getEmployeeById } from "services/EmployeeService";

const TaskList = () => {
  const { projectId } = useParams(); // Récupérer l'ID du projet depuis l'URL
  const [tasks, setTasks] = useState([]); // État pour stocker les tâches
  const [loading, setLoading] = useState(true); // État pour le chargement
  const [error, setError] = useState(null); // État pour gérer les erreurs
  const navigate = useNavigate(); // Hook pour la navigation

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        console.log("Fetching tasks for projectId:", projectId);
  
        // Récupérer les tâches du projet
        const tasks = await getTasksByProjectId(projectId);
        console.log("API response:", tasks);
  
        // Vérification si les données sont valides
        if (!Array.isArray(tasks)) {
          console.error("L'API n'a pas renvoyé un tableau. Reçu:", tasks);
          setError("Format de données invalide provenant de l'API.");
          return;
        }
  
        if (tasks.length === 0) {
          setError("Aucune tâche disponible pour ce projet.");
          setTasks([]); // Clear tasks si aucun n'est trouvé
          return;
        }
  
        // Enrichir chaque tâche avec les détails de l'employé assigné
        const enrichedTasks = await Promise.all(
          tasks.map(async (task) => {
            if (task.employeeId) {
              try {
                const employee = await getEmployeeById(task.employeeId);
                return {
                  ...task,
                  assignedEmployee: employee, // Ajout des détails de l'employé
                };
              } catch (err) {
                console.warn(`Erreur lors de la récupération de l'employé ${task.employeeId}:`, err);
                return {
                  ...task,
                  assignedEmployee: { name: "Inconnu" }, // Valeur par défaut en cas d'erreur
                };
              }
            }
            return task; // Pas d'employé assigné
          })
        );
  
        console.log("Enriched tasks:", enrichedTasks);
        setTasks(enrichedTasks); // Mise à jour de l'état avec les tâches enrichies
      } catch (err) {
        console.error("Erreur lors de la récupération des tâches:", err);
        setError("Échec de la récupération des tâches.");
      } finally {
        setLoading(false); // Arrêter le chargement
      }
    };
  
    fetchTasks(); // Appel de la fonction pour récupérer les tâches
  }, [projectId]);
  

  
 
  return (
    <DashboardLayout>
      <Container className="mt-5">
        <Card className="shadow-sm">
          <Card.Header className="bg-primary text-white fw-bold">Liste des tâches</Card.Header>
          <Card.Body>
            <Button
              variant="success"
              className="mb-3"
              onClick={() => navigate(`/create-task/${projectId}`)} // Naviguer vers la page de création de tâche
            >
              + Créer une nouvelle tâche
            </Button>

            {loading ? (
              <p>Chargement des tâches...</p>
            ) : error ? (
              <p>{error}</p> // Afficher l'erreur si elle existe
            ) : tasks.length === 0 ? (
              <p>Aucune tâche disponible pour ce projet.</p> // Si aucune tâche n'est trouvée
            ) : (
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Nom de la tâche</th>
                    <th>Description</th>
                    <th>Status</th>
                    <th>Employé Assigné</th> {/* Colonne pour afficher l'employé assigné */}
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.map((task, index) => (
                    <tr key={task.id || index}>
                      <td>{index + 1}</td>
                      <td>{task.name || "Pas de nom"}</td>
                      <td>{task.description || "Pas de description"}</td>
                      <td>
                        {task.status === 0
                          ? "En attente"
                          : task.status === 1
                          ? "En cours"
                          : task.status === 2
                          ? "Terminée"
                          : "Inconnue"}
                      </td>
                      <td>
                        {/* Afficher le nom de l'employé assigné à la tâche */}
                        {task.assignedTo?.fullName||
                         "Aucun employé assigné"}
                      </td>
                      <td>
                        <Button 
                          variant="primary" 
                          size="sm" 
                          onClick={() => navigate(`/edit-task/${task.id}`)} // Navigation vers la page de modification
                        >
                          Modifier
                        </Button>
                        <Button variant="danger" size="sm" className="ms-2">
                          Supprimer
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </Card.Body>
        </Card>
      </Container>
    </DashboardLayout>
  );
};

export default TaskList;
