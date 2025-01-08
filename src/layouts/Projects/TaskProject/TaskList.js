import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import React, { useState, useEffect } from "react";
import { Container, Table, Button, Card } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { getTasksByProjectId, deleteTask } from "services/TaskProjectService";
import { getEmployeeById } from "services/EmployeeService";
import { FaTrashAlt, FaEdit, FaEye } from "react-icons/fa";

const TaskList = () => {
  const { projectId } = useParams();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const tasks = await getTasksByProjectId(projectId);
        if (!Array.isArray(tasks)) {
          setError("Format de données invalide provenant de l'API.");
          return;
        }
        if (tasks.length === 0) {
          setError("Aucune tâche disponible pour ce projet.");
          setTasks([]);
          return;
        }
        const enrichedTasks = await Promise.all(
          tasks.map(async (task) => {
            if (task.employeeId) {
              try {
                const employee = await getEmployeeById(task.employeeId);
                return { ...task, assignedEmployee: employee };
              } catch {
                return { ...task, assignedEmployee: { name: "Inconnu" } };
              }
            }
            return task;
          })
        );
        setTasks(enrichedTasks);
      } catch (err) {
        setError("Échec de la récupération des tâches.");
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, [projectId]);

  // Fonction pour supprimer une tâche
  const handleDelete = async (taskId) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette tâche ?")) {
      try {
        await deleteTask(taskId); // Appel API pour supprimer
        setTasks(tasks.filter((task) => task.id !== taskId)); // Mise à jour de l'état
      } catch (err) {
        alert("Erreur lors de la suppression de la tâche.");
      }
    }
  };

  return (
    <DashboardLayout>
      <Container className="mt-5">
        <Card className="shadow-sm">
          <Card.Header className="bg-primary text-white fw-bold">Liste des tâches</Card.Header>
          <Card.Body>
            <Button
              variant="success"
              className="mb-3"
              onClick={() => navigate(`/create-task/${projectId}`)}
            >
              + Créer une nouvelle tâche
            </Button>
            {loading ? (
              <p>Chargement des tâches...</p>
            ) : error ? (
              <p>{error}</p>
            ) : tasks.length === 0 ? (
              <p>Aucune tâche disponible pour ce projet.</p>
            ) : (
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Nom de la tâche</th>
                    <th>Description</th>
                    <th>Status</th>
                    <th>Employé Assigné</th>
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
                        {task.assignedTo?.fullName || "Aucun employé assigné"}
                      </td>
                      <td>
                        <Button
                          variant="info"
                          size="sm"
                          className="me-2"
                          onClick={() => navigate(`/view-task/${task.id}`)}
                        >
                          <FaEye /> 
                        </Button>
                        <Button
                          variant="primary"
                          size="sm"
                          className="me-2"
                          onClick={() => navigate(`/edit-task/${task.id}`)}
                        >
                          <FaEdit /> 
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDelete(task.id)}
                        >
                          <FaTrashAlt /> 
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
