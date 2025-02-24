import React, { createContext, useContext, useState } from 'react';

// Crear el contexto
const UserContext = createContext();

// Crear un proveedor que envuelva la aplicación
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Estado para almacenar la información del usuario

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children} {/* Los componentes hijos tendrán acceso a este contexto */}
    </UserContext.Provider>
  );
};

// Hook personalizado para usar el contexto más fácilmente
export const useUser = () => {
  return useContext(UserContext);
};
