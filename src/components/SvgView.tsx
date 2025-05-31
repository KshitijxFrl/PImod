// import React from "react";
// import { useDirector } from "./DirectorContext";

// const SvgView: React.FC = () => {
//   const { selected_boards, slected_component } = useDirector();
//   return (
//     <div className="relative w-full h-full overflow-hidden bg-gray-100">
//       {selected_boards}
//     </div>
//   );
// };

// export default SvgView;

import React, { useEffect, useRef, useState } from "react";
import { useDirector } from "./DirectorContext";

// Load all board SVGs
const boardSvgs = import.meta.glob("../assets/svgs/boards/*.svg", {
  as: "raw",
  eager: true,
});

const SvgView: React.FC = () => {
  const { selected_boards, slected_component, setSlectedComponent } =
    useDirector();
  const containerRef = useRef<HTMLDivElement>(null);
  const [svgContent, setSvgContent] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);

  const selectedBoardName = selected_boards[0];
  const boardKey = `../assets/svgs/boards/${selectedBoardName}.svg`;

  useEffect(() => {
    if (boardKey in boardSvgs) {
      const rawSvg = boardSvgs[boardKey] as string;
      setSvgContent(rawSvg);
    } else {
      console.error("SVG not found for board:", boardKey);
    }
  }, [selectedBoardName]);

  useEffect(() => {
    if (!svgContent || !containerRef.current) return;

    const svgEl = containerRef.current.querySelector("svg");
    if (!svgEl) return;

    const pins = svgEl.querySelectorAll("[id^=pin-]");

    pins.forEach((el) => {
      el.setAttribute("style", "cursor:pointer; transition: fill 0.2s");

      el.addEventListener("click", () => {
        const id = el.id;
        const isSelected = slected_component.includes(id);

        if (isSelected) {
          el.setAttribute("fill", "black");
          setSlectedComponent((prev) => prev.filter((p) => p !== id));
        } else {
          el.setAttribute("fill", "blue");
          setSlectedComponent((prev) => [...prev, id]);
        }
      });
    });
  }, [svgContent, slected_component, setSlectedComponent]);

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY < 0 ? 0.1 : -0.1;
    setZoom((prev) => Math.min(3, Math.max(0.5, prev + delta)));
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-hidden bg-gray-100"
      onWheel={handleWheel}
    >
      {svgContent && (
        <div
          className="absolute origin-center"
          style={{
            transform: `scale(${zoom})`,
            transformOrigin: "center center",
          }}
          dangerouslySetInnerHTML={{ __html: svgContent }}
        />
      )}
      <div className="absolute bottom-4 right-4 bg-white rounded shadow p-2 flex items-center gap-2">
        <button onClick={() => setZoom((z) => Math.min(3, z + 0.1))}>+</button>
        <button onClick={() => setZoom((z) => Math.max(0.5, z - 0.1))}>
          −
        </button>
        <button onClick={() => setZoom(1)}>Reset</button>
        <span>{Math.round(zoom * 100)}%</span>
      </div>
    </div>
  );
};

export default SvgView;
