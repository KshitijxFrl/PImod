import React from "react";

const Navbar: React.FC = () => {
  return (
    <nav className="sticky top-0 z-5 py-3 bg-blue-400">
      <div className="flex justify-between items-center">
        <h3>Pimod</h3>
        <button className="py-2 px-2 border rounded-md">Build</button>
        <button className="py-2 px-2 border rounded-md">Run</button>
        <button className="py-2 px-2 border rounded-md">Build and run</button>
      </div>
    </nav>
  );
};

export default Navbar;
