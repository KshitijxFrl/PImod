import { useState, useRef, useEffect } from "react";

interface SvgViewProps {
  svgPath: string; // Path to the SVG file
}

type PinState = "default" | "selected" | "added";

const SvgView: React.FC<SvgViewProps> = ({ svgPath }) => {
  const [svgContent, setSvgContent] = useState<string>("");
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [pinStates, setPinStates] = useState<Record<string, PinState>>({});

  const svgContainerRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    if (!svgContent || !svgContainerRef.current) return;

    const container = svgContainerRef.current;

    const handleSvgReady = () => {
      const svgElement = container.querySelector("svg");
      if (!svgElement) return;

      const allElements =
        svgElement.querySelectorAll<SVGElement>("[id^='pin-']");
      const pinPattern = /^pin-0([1-9]|[1-3][0-9]|40)$/;

      allElements.forEach((el) => {
        const id = el.id;
        if (!id || !pinPattern.test(id)) return;

        el.style.cursor = "pointer";
        el.style.transition = "fill 0.2s";

        // Set initial fill if not already tracked
        if (!pinStates[id]) {
          el.setAttribute("fill", "black");
        }

        // Event Handlers
        const handleMouseEnter = () => {
          const currentState = pinStates[id] || "default";
          if (currentState === "default") el.setAttribute("fill", "yellow");
        };

        const handleMouseLeave = () => {
          const state = pinStates[id] || "default";
          updateFill(el, state);
        };

        const handleClick = () => {
          setPinStates((prev) => {
            const current = prev[id] || "default";
            const newState =
              current === "default"
                ? "selected"
                : current === "selected"
                ? "added"
                : "default";
            updateFill(el, newState);
            return { ...prev, [id]: newState };
          });
        };

        el.addEventListener("mouseenter", handleMouseEnter);
        el.addEventListener("mouseleave", handleMouseLeave);
        el.addEventListener("click", handleClick);
      });
    };

    const updateFill = (el: SVGElement, state: PinState) => {
      switch (state) {
        case "selected":
          el.setAttribute("fill", "green");
          break;
        case "added":
          el.setAttribute("fill", "blue");
          break;
        default:
          el.setAttribute("fill", "black");
      }
    };

    const observer = new MutationObserver(() => handleSvgReady());

    observer.observe(container, {
      childList: true,
      subtree: true,
    });

    return () => observer.disconnect();
  }, [svgContent, pinStates]);

  const handleMouseDown = (e: React.MouseEvent) => {
    const target = e.target as Element;
    if (target.tagName?.toLowerCase() === "svg" || !target.id) {
      setIsDragging(true);
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      const dx = e.clientX - dragStart.x;
      const dy = e.clientY - dragStart.y;
      setPosition((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY < 0 ? 0.1 : -0.1;
    setZoom((prev) => Math.max(0.1, Math.min(3, prev + delta)));
  };

  return (
    <div
      ref={svgContainerRef}
      className="relative w-full h-full overflow-hidden bg-gray-100"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
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
          onClick={() => setZoom((prev) => Math.min(3, prev + 0.1))}
        >
          +
        </button>
        <button
          className="bg-gray-200 p-2 rounded hover:bg-gray-300"
          onClick={() => setZoom((prev) => Math.max(0.1, prev - 0.1))}
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
