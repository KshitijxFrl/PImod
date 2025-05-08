import React, { createContext, useContext } from "react";
import { DirectorContextType } from "../types";

//! Director component implements the top oversear approach in PIMode. It is responsible for the scene which is being displayed
//! and the data which travell inside of the the application

const directorContext = createContext<DirectorContextType>({
  connectionlink: null,
  slected_component: [],
  selected_boards: [],
});

export const DirectorContext: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const connectionlink = null;
  const slected_component: any[] = [];
  const selected_boards = ["RapberryPi"];

  return (
    <directorContext.Provider
      value={{ connectionlink, slected_component, selected_boards }}
    >
      {children}
    </directorContext.Provider>
  );
};

export const useDirector = () => useContext(directorContext);
