import { useMutation } from "@tanstack/react-query";
import { useState, useRef, useEffect, memo, type FormEvent } from "react";
import { HexColorPicker } from "react-colorful";
import { api } from "../../api/axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Grid3x3, Trash2 } from "lucide-react";

interface postPayload {
  title: string;
  pixelData: string[][];
}

// Memoized pixel component - only re-renders when its color or showGrid changes
const Pixel = memo(function Pixel({
  color,
  size,
  showGrid
}: {
  color: string;
  size: number;
  showGrid: boolean;
}) {
  return (
    <div
      style={{
        width: size,
        height: size,
        backgroundColor: color,
        boxShadow: showGrid ? "inset 0 0 0 0.5px rgba(0,0,0,0.2)" : "none",
      }}
    />
  );
});

export default function PixelDrawer() {
  const size = 32;
  const pixelSize = 14;

  const [color, setColor] = useState("#000000");
  const [showGrid, setShowGrid] = useState(false);
  const [description, setDescription] = useState("");
  const [showColorPicker, setShowColorPicker] = useState(false);

  const navigate = useNavigate();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  // Use refs for drawing state (synchronous updates during drag)
  const isDrawingRef = useRef(false);
  const prevPixelRef = useRef<{ row: number; col: number } | null>(null);
  const colorRef = useRef(color);

  // Keep colorRef in sync
  useEffect(() => {
    colorRef.current = color;
  }, [color]);

  const [pixels, setPixels] = useState<string[][]>(() =>
    Array.from({ length: size }, () => Array<string>(size).fill("#ffffff"))
  );

  const hasContent = pixels.some((row) => row.some((pixel) => pixel !== "#ffffff"));

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  const submitMutation = useMutation({
    mutationFn: async (postData: postPayload) => {
      const res = await api.post("/posts", postData);
      return res.data;
    },
    onSuccess: () => navigate("/"),
    onError: (error: unknown) => console.error(error),
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!hasContent) {
      toast.error("Canvas is empty! Draw something");
      return;
    }
    if (!description.trim()) {
      toast.error("Please write a description for your post");
      return;
    }
    submitMutation.mutate({ title: description.trim(), pixelData: pixels });
  };

  // Bresenham's line algorithm - draws all pixels between two points
  const drawLine = (r0: number, c0: number, r1: number, c1: number, paintColor: string) => {
    const dr = Math.abs(r1 - r0);
    const dc = Math.abs(c1 - c0);
    const sr = r0 < r1 ? 1 : -1;
    const sc = c0 < c1 ? 1 : -1;
    let err = dr - dc;

    setPixels((prev) => {
      const next = prev.map((r) => [...r]);
      let x = r0, y = c0;

      while (true) {
        if (x >= 0 && x < size && y >= 0 && y < size) {
          next[x][y] = paintColor;
        }
        if (x === r1 && y === c1) break;
        const e2 = err * 2;
        if (e2 > -dc) { err -= dc; x += sr; }
        if (e2 < dr) { err += dr; y += sc; }
      }
      return next;
    });
  };

  // Get pixel coordinates from mouse/touch position
  const getPixelFromEvent = (e: React.MouseEvent | React.TouchEvent) => {
    const grid = gridRef.current;
    if (!grid) return null;

    const rect = grid.getBoundingClientRect();
    let clientX: number, clientY: number;

    if ("touches" in e && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else if ("clientX" in e) {
      clientX = e.clientX;
      clientY = e.clientY;
    } else {
      return null;
    }

    const col = Math.floor((clientX - rect.left) / pixelSize);
    const row = Math.floor((clientY - rect.top) / pixelSize);

    if (row < 0 || row >= size || col < 0 || col >= size) return null;
    return { row, col };
  };

  const handlePointerDown = (e: React.MouseEvent | React.TouchEvent) => {
    const pixel = getPixelFromEvent(e);
    if (!pixel) return;

    isDrawingRef.current = true;
    prevPixelRef.current = pixel;

    // Paint single pixel
    setPixels((prev) => {
      const next = prev.map((r) => [...r]);
      next[pixel.row][pixel.col] = colorRef.current;
      return next;
    });
  };

  const handlePointerMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawingRef.current) return;

    const pixel = getPixelFromEvent(e);
    if (!pixel) return;

    const prev = prevPixelRef.current;
    if (prev) {
      drawLine(prev.row, prev.col, pixel.row, pixel.col, colorRef.current);
    }
    prevPixelRef.current = pixel;
  };

  const handlePointerUp = () => {
    isDrawingRef.current = false;
    prevPixelRef.current = null;
  };

  const handleClear = () => {
    if (!hasContent) return;
    if (window.confirm("Clear the canvas?")) {
      setPixels(Array.from({ length: size }, () => Array<string>(size).fill("#ffffff")));
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      {/* Description input */}
      <div className="flex items-center gap-2">
        <textarea
          ref={textareaRef}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="What are you creating today?"
          rows={1}
          className="flex-1 bg-transparent text-neutral-100 placeholder-neutral-600 outline-none resize-none py-2"
        />
        <button
          onClick={handleSubmit}
          disabled={submitMutation.isPending}
          className="text-sm text-neutral-400 hover:text-neutral-200 disabled:text-neutral-600 transition-colors"
        >
          {submitMutation.isPending ? "Submitting..." : "Submit →"}
        </button>
      </div>

      {/* Canvas with toolbar */}
      <div className="flex flex-col sm:flex-row justify-center items-center sm:items-start gap-4">
        {/* Pixel Grid */}
        <div
          ref={gridRef}
          className="cursor-crosshair select-none rounded-lg overflow-hidden bg-white"
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${size}, ${pixelSize}px)`,
            gridTemplateRows: `repeat(${size}, ${pixelSize}px)`,
            touchAction: "none",
          }}
          onMouseDown={handlePointerDown}
          onMouseMove={handlePointerMove}
          onMouseUp={handlePointerUp}
          onMouseLeave={handlePointerUp}
          onTouchStart={handlePointerDown}
          onTouchMove={handlePointerMove}
          onTouchEnd={handlePointerUp}
        >
          {pixels.map((row, rowIdx) =>
            row.map((pixelColor, colIdx) => (
              <Pixel
                key={`${rowIdx}-${colIdx}`}
                color={pixelColor}
                size={pixelSize}
                showGrid={showGrid}
              />
            ))
          )}
        </div>

        {/* Toolbar */}
        <div className="flex flex-row sm:flex-col gap-2">
          <div className="relative">
            <button
              onClick={() => setShowColorPicker(!showColorPicker)}
              className="w-10 h-10 rounded-lg border-2 border-neutral-600 hover:border-neutral-500"
              style={{ backgroundColor: color }}
              title="Pick color"
            />
            {showColorPicker && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowColorPicker(false)} />
                <div className="absolute left-0 sm:right-12 sm:left-auto top-12 sm:top-0 z-50 p-3 rounded-xl bg-neutral-800 border border-neutral-700 shadow-xl">
                  <HexColorPicker color={color} onChange={setColor} style={{ width: 180, height: 180 }} />
                  <input
                    type="text"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="mt-2 w-full px-2 py-1 rounded bg-neutral-700 text-neutral-200 text-sm font-mono text-center uppercase"
                  />
                </div>
              </>
            )}
          </div>

          <button
            onClick={() => setShowGrid(!showGrid)}
            className={`w-10 h-10 rounded-lg flex items-center justify-center ${showGrid ? "bg-neutral-700 border border-neutral-600" : "bg-neutral-800 hover:bg-neutral-700"
              }`}
            title="Toggle grid"
          >
            <Grid3x3 className="w-5 h-5 text-neutral-200" />
          </button>

          <button
            onClick={handleClear}
            className="w-10 h-10 rounded-lg bg-neutral-800 hover:bg-red-900/50 flex items-center justify-center"
            title="Clear"
          >
            <Trash2 className="w-5 h-5 text-neutral-200" />
          </button>
        </div>
      </div>
    </div>
  );
}
