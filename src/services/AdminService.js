import apiErp from './api';
import axios from "axios";
/**
 * Créer un nouvel utilisateur.
 * @param {Object} userData - Les données de l'utilisateur à créer.
 * @returns {Promise<Object>} - Les détails de l'utilisateur créé.
 */
export const createUser = async (userData) => {
  try {
    const response = await axios.post('https://localhost:7298/api/Admin/user/create', userData);
    console.log('User created:', response.data); // Log the response to check the data returned
    return response.data;
  } catch (error) {
    console.error('Error creating user:', error.response ? error.response.data : error.message);
    throw new Error('Failed to create user');
  }
};
/**
 * Récupérer un utilisateur par email.
 * @param {string} email - Email de l'utilisateur à récupérer.
 * @returns {Promise<Object>} - Les détails de l'utilisateur.
 */
export const getUserByEmail = async (email) => {
  try {
    const response = await apiErp.get(`/Admin/user/${email}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * Mettre à jour un utilisateur.
 * @param {string} userId - ID de l'utilisateur à mettre à jour.
 * @param {Object} userData - Les nouvelles données de l'utilisateur.
 * @returns {Promise<void>}
 */
export const updateUser = async (userId, userData) => {
  try {
    await apiErp.put(`/admin/update/${userId}`, userData);
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * Supprimer un utilisateur par ID.
 * @param {string} userId - ID de l'utilisateur à supprimer.
 * @returns {Promise<void>}
 */
export const deleteUser = async (userId) => {
  try {
    await apiErp.delete(`/Admin/delete/${userId}`);
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * Rechercher des utilisateurs par un terme donné.
 * @param {string} searchTerm - Le terme à rechercher.
 * @returns {Promise<Array>} - Une liste d'utilisateurs correspondants.
 */
export const searchUsers = async (searchTerm) => {
  try {
    const response = await apiErp.get(`/Admin/search`, { params: { searchTerm } });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * Créer un profil pour un utilisateur.
 * @param {Object} userData - Les données de l'utilisateur pour créer un profil.
 * @returns {Promise<string>} - Un message confirmant la création du profil.
 */
export const createProfile = async (userData) => {
  try {
    const response = await apiErp.post('/Admin/user/create-profile', userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};



