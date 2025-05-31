import React from "react";

const Navbar: React.FC = () => {
  return (
    <nav className="sticky bg-blue-400">
      <div className="flex justify-between items-center p-3">
        <h3>Pimod</h3>
        <button className="py-1 px-2 border rounded-md">Build</button>
        <button className="py-1 px-2 border rounded-md">Run</button>
        <button className="py-1 px-2 border rounded-md">Build and run</button>
      </div>
    </nav>
  );
};

export default Navbar;
