import { useState, useRef, useEffect, MouseEvent } from "react";

interface SvgViewProps {
  svgPath: string; // Path to the SVG file in public folder
}

const SvgView: React.FC<SvgViewProps> = ({ svgPath }) => {
  const [svgContent, setSvgContent] = useState<string>("");
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [selectedPins, setSelectedPins] = useState<string[]>([]);

  // Updated minimum zoom level - changed from 0.5 to 0.1 for more zoom out capability
  const MIN_ZOOM = 0.1;
  const MAX_ZOOM = 3;
  const ZOOM_STEP = 0.1;

  const svgContainerRef = useRef<HTMLDivElement>(null);

  // Load SVG content
  useEffect(() => {
    const fetchSvg = async () => {
      try {
        const response = await fetch(svgPath);
        const svgText = await response.text();
        setSvgContent(svgText);
      } catch (error) {
        console.error("Error loading SVG:", error);
      }
    };

    fetchSvg();
  }, [svgPath]);

  // Handle mouse down for dragging
  const handleMouseDown = (e: MouseEvent) => {
    // Only start dragging if it's not a pin element
    if (!(e.target as HTMLElement).classList.contains("pin")) {
      setIsDragging(true);
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  };

  // Handle mouse move for dragging
  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      const dx = e.clientX - dragStart.x;
      const dy = e.clientY - dragStart.y;

      setPosition((prev) => ({
        x: prev.x + dx,
        y: prev.y + dy,
      }));

      setDragStart({ x: e.clientX, y: e.clientY });
    }
  };

  // Handle mouse up to stop dragging
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Handle zooming with mouse wheel
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();

    // Adjust the delta based on current zoom level for smoother zooming at small scales
    const zoomFactor = zoom < 0.5 ? ZOOM_STEP * 0.5 : ZOOM_STEP;
    const delta = e.deltaY < 0 ? zoomFactor : -zoomFactor;

    setZoom((prev) => Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, prev + delta)));
  };

  // Handle pin click
  const handlePinClick = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.classList.contains("pin")) {
      const pinId = target.id;

      // Toggle selection
      setSelectedPins((prev) => {
        if (prev.includes(pinId)) {
          return prev.filter((id) => id !== pinId);
        } else {
          return [...prev, pinId];
        }
      });
    }
  };

  // Apply pin color changes after SVG is loaded
  useEffect(() => {
    if (!svgContent) return;

    // Use a short timeout to ensure the SVG has been added to the DOM
    const timer = setTimeout(() => {
      // Find all pins in the SVG
      const pins = document.querySelectorAll(".pin");

      // Reset all pins to original color
      pins.forEach((pin) => {
        pin.setAttribute("fill", "#808080"); // Default gray color
      });

      // Highlight selected pins
      selectedPins.forEach((pinId) => {
        const pin = document.getElementById(pinId);
        if (pin) {
          pin.setAttribute("fill", "#87CEEB"); // Sky blue
        }
      });
    }, 100);

    return () => clearTimeout(timer);
  }, [svgContent, selectedPins]);

  return (
    <div
      ref={svgContainerRef}
      className="relative w-full h-full overflow-hidden bg-gray-100"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
      onClick={handlePinClick}
    >
      <div
        style={{
          transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
          transformOrigin: "center",
          cursor: isDragging ? "grabbing" : "grab",
        }}
        className="absolute transition-transform duration-100"
        dangerouslySetInnerHTML={{ __html: svgContent }}
      />
      <div className="absolute bottom-4 right-4 bg-white rounded shadow p-2 flex gap-2">
        <button
          className="bg-gray-200 p-2 rounded hover:bg-gray-300"
          onClick={() =>
            setZoom((prev) => Math.min(MAX_ZOOM, prev + ZOOM_STEP))
          }
        >
          +
        </button>
        <button
          className="bg-gray-200 p-2 rounded hover:bg-gray-300"
          onClick={() =>
            setZoom((prev) => Math.max(MIN_ZOOM, prev - ZOOM_STEP))
          }
        >
          -
        </button>
        <button
          className="bg-gray-200 p-2 rounded hover:bg-gray-300"
          onClick={() => {
            setZoom(1);
            setPosition({ x: 0, y: 0 });
          }}
        >
          Reset
        </button>
        <div className="bg-gray-100 px-2 rounded flex items-center">
          {Math.round(zoom * 100)}%
        </div>
      </div>
    </div>
  );
};

export default SvgView;
