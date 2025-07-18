// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";

// const FormulaireProjetUpdate = ({
//   projectToUpdate,
//   onClose,
//   onUpdateSuccess,
// }) => {
//   const navigate = useNavigate();
//   const [updatedProject, setUpdatedProject] = useState({ ...projectToUpdate });
//   const [success, setSuccess] = useState("");
//   const [error, setError] = useState("");

//   useEffect(() => {
//     setUpdatedProject({ ...projectToUpdate });
//   }, [projectToUpdate]);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setUpdatedProject((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleFileChange = (e) => {
//     setUpdatedProject((prev) => ({ ...prev, logo: e.target.files[0] }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const token = localStorage.getItem("token");

//     const formData = new FormData();
//     formData.append("name", updatedProject.name || "");
//     formData.append("description", updatedProject.description || "");
//     formData.append("company", updatedProject.company || "");
//     formData.append("city", updatedProject.city || "");
//     formData.append("priority", updatedProject.priority || "medium");

//     // Image si présente
//     if (updatedProject.logo instanceof File) {
//       formData.append("logo", updatedProject.logo);
//     }

//     // Employés assignés CINs
//     if (Array.isArray(updatedProject.assignedEmployeesCINs)) {
//       updatedProject.assignedEmployeesCINs.forEach((cin) => {
//         formData.append("assignedEmployeesCINs", cin);
//       });
//     }

//     try {
//       await axios.put(
//         `http://localhost:5001/api/admin/projects/update/${projectToUpdate._id}`,
//         formData,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "multipart/form-data",
//           },
//         }
//       );

//       setSuccess("Projet mis à jour avec succès !");
//       onUpdateSuccess && onUpdateSuccess();
//       onClose && onClose();
//     } catch (err) {
//       console.error("Erreur lors de la mise à jour du projet :", err);
//       setError(err.response?.data?.message || "Erreur lors de la mise à jour");
//     }
//   };

//   const navigateToEmployees = () => {
//     navigate("/admin/employees");
//   };

//   return (
//     <div className="modal-overlay">
//       <div className="project-modal">
//         <div className="modal-header">
//           <h2 className="new-project">Modifier le projet</h2>
//           <button className="close-btn" onClick={onClose}>
//             &times;
//           </button>
//         </div>

//         <form onSubmit={handleSubmit} className="project-form">
//           {error && <div className="error-message">{error}</div>}
//           {success && <div className="success-message">{success}</div>}

//           <div className="form-group">
//             <label>Nom du projet</label>
//             <input
//               type="text"
//               name="name"
//               value={updatedProject.name || ""}
//               onChange={handleInputChange}
//               required
//             />
//           </div>

//           <div className="form-group">
//             <label>Description</label>
//             <textarea
//               name="description"
//               value={updatedProject.description || ""}
//               onChange={handleInputChange}
//               required
//             ></textarea>
//           </div>

//           <div className="form-row">
//             <div className="form-group">
//               <label>Entreprise</label>
//               <input
//                 type="text"
//                 name="company"
//                 value={updatedProject.company || ""}
//                 onChange={handleInputChange}
//                 required
//               />
//             </div>

//             <div className="form-group">
//               <label>Ville</label>
//               <input
//                 type="text"
//                 name="city"
//                 value={updatedProject.city || ""}
//                 onChange={handleInputChange}
//                 required
//               />
//             </div>
//           </div>

//           <div className="form-row">
//             <div className="form-group">
//               <label>Statut</label>
//               <select
//                 name="status"
//                 value={updatedProject.status || "active"}
//                 onChange={handleInputChange}
//               >
//                 <option value="active">Actif</option>
//                 <option value="inactive">Inactif</option>
//                 <option value="completed">Terminé</option>
//               </select>
//             </div>

//             <div className="form-group">
//               <label>Priorité</label>
//               <select
//                 name="priority"
//                 value={updatedProject.priority || "medium"}
//                 onChange={handleInputChange}
//               >
//                 <option value="high">Haute</option>
//                 <option value="medium">Moyenne</option>
//                 <option value="low">Basse</option>
//               </select>
//             </div>
//           </div>

//           <div className="form-group">
//             <label>Date de début</label>
//             <input
//               type="date"
//               name="startDate"
//               value={updatedProject.startDate?.slice(0, 10) || ""}
//               onChange={handleInputChange}
//               required
//             />
//           </div>

//           <div className="form-group">
//             <label>Date de fin</label>
//             <input
//               type="date"
//               name="endDate"
//               value={updatedProject.endDate?.slice(0, 10) || ""}
//               onChange={handleInputChange}
//             />
//           </div>

//           <div className="form-group">
//             <label>Employés assignés</label>
//             <button
//               type="button"
//               className="employee-select-btn"
//               onClick={navigateToEmployees}
//             >
//               Sélectionner des employés
//             </button>
//           </div>

//           <div className="form-group">
//             <label>Logo du projet</label>
//             <div className="file-input-container">
//               <input
//                 type="file"
//                 id="logo-upload"
//                 accept="image/*"
//                 onChange={handleFileChange}
//                 className="file-input"
//               />
//               <label htmlFor="logo-upload" className="file-input-label">
//                 {updatedProject.logo instanceof File
//                   ? updatedProject.logo.name
//                   : "Choisir un fichier"}
//               </label>
//             </div>
//           </div>

//           <div className="form-actions">
//             <button type="button" className="cancel-btn" onClick={onClose}>
//               Annuler
//             </button>
//             <button type="submit" className="submit-btn">
//               Mettre à jour le projet
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default FormulaireProjetUpdate;
//////////////////////////////////////////////////////////////
