import { useMutation } from "@tanstack/react-query";
import { useState, type FormEvent } from "react";
import { HexColorPicker } from "react-colorful";
import { api } from "../../api/axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

interface postPayload{
  title: string;
  pixelData: string[][];
}

export default function PixelDrawer() {
  const size = 32;

  const [color, setColor] = useState("#000000")
  const [isDrawing, setIsDrawing] = useState(false);
  const [border, setBorder] = useState(true);
  const [description, setDescription] = useState("");
  const navigate = useNavigate();

  const [pixels, setPixels] = useState<string[][]>(
    // 32x32 array that contains the color of each pixel
    () => Array.from({ length: size }, () => Array<string>(size).fill("#ffffff"))
  );
  const hasContent = pixels.some(row => row.some(pixel => pixel !== "#ffffff"));

  const submitMutation = useMutation({
    mutationFn: async (postData: postPayload) => {
      const res = await api.post("/posts", postData);
      return res.data
    },
    onSuccess: () => {
      navigate("/");
    },
    onError: (error: unknown) => {
      console.error(error);
    }
  })

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if(!hasContent){
      toast.error("Canvas is empty! Draw something")
      return;
    }

    if(!description.trim()){
      toast.error("Please write a description for your post");
      return;
    }

    const payload: postPayload = {
      title: description.trim(),
      pixelData: pixels,
    }

    submitMutation.mutate(payload);

  };

  const handleClick = (x: number, y: number) => {
    setPixels((prev) => {
      const next = [...prev];
      next[x][y] = color;
      return next;
    })
  }

  const handleMouseDown = (x: number, y: number) => {
    setIsDrawing(true);
    handleClick(x, y);
  }

  const handleMouseEnter = (x: number, y: number) => {
    if (isDrawing) {
      handleClick(x, y);
    }
  }

  const handleMouseUp = () => {
    setIsDrawing(false);
  }

  const handleTouchStart = (x: number, y: number) => {
    setIsDrawing(true);
    handleClick(x, y);
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDrawing) return;
    // Only handle if there are actual touches
    if (!e.touches || e.touches.length === 0) return;
    
    const touch = e.touches[0];
    if (!touch) return;
    
    const target = document.elementFromPoint(touch.clientX, touch.clientY);
    if (!target) return;
    
    const pixelElement = target.closest('[data-pixel]');
    if (pixelElement) {
      const rowIndex = parseInt(pixelElement.getAttribute('data-row') || '0');
      const cellIndex = parseInt(pixelElement.getAttribute('data-cell') || '0');
      handleClick(rowIndex, cellIndex);
    }
  }

  const handleTouchEnd = () => {
    setIsDrawing(false);
  }

  const handleClear = () => {
    if (!hasContent) {
      // Already empty, no need to confirm
      return;
    }

    const confirmed = window.confirm("Are you sure you want to clear the canvas? This action cannot be undone.");
    
    if (confirmed) {
      setPixels(Array.from({ length: size }, () => Array<string>(size).fill("#ffffff")));
    }
  }

  return (
    <div className="flex flex-col lg:flex-row gap-4 w-full px-8">
      {/* 32x32 grid consitsting of divs that display the corresponding pixel color in the pixels array*/}
      <div 
        className="flex justify-center lg:justify-start overflow-auto pb-4 lg:pb-0 cursor-crosshair"
        style={{ touchAction: 'none' }}
        onMouseUp={handleMouseUp} 
        onMouseLeave={handleMouseUp}
        onTouchEnd={handleTouchEnd}
        onTouchMove={handleTouchMove}
      > 
        <div className="inline-block">
          {pixels.map((row: string[], rowIndex: number) => (
            <div key={rowIndex} className="flex"> 
              {row.map((pixelColor: string, cellIndex: number) => (
                <div
                  key={cellIndex}
                  data-pixel
                  data-row={rowIndex}
                  data-cell={cellIndex}
                  className={`w-4 h-4 sm:w-4 sm:h-4${border ? " border-t border-l border-black" : ""}`}
                  style={{ backgroundColor: pixelColor }}
                  onMouseDown={() => handleMouseDown(rowIndex, cellIndex)}
                  onMouseEnter={() => handleMouseEnter(rowIndex, cellIndex)}
                  onTouchStart={() => handleTouchStart(rowIndex, cellIndex)}
                />
              ))}
            </div>
          ))}
        </div> 
      </div>
      
      {/* Color picker */}
      <div className="flex flex-col gap-4 w-full lg:w-64 shrink-0">
        <div className="flex flex-col gap-2">
          <div className="rounded-md border border-neutral-700 bg-neutral-800/40 p-2 sm:p-3">
            <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
              <div 
                className="w-8 h-8 sm:w-10 sm:h-10 rounded border-2 border-neutral-600 flex-shrink-0"
                style={{ backgroundColor: color }}
              />
              <div className="flex-1 min-w-0">
                <div className="text-xs text-neutral-400 mb-1">Selected Color</div>
                <div className="text-xs sm:text-sm text-neutral-200 font-mono truncate">{color.toUpperCase()}</div>
              </div>
            </div>
            <div className="w-full">
              <HexColorPicker 
                color={color} 
                onChange={setColor}
                style={{ width: '100%', height: '150px' }}
              />
            </div>
          </div>
        </div>
        {/*Description input */}
        <div className="flex flex-col gap-2">
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Write a description for your pixel art..."
            rows={3}
            className="w-full rounded-md border border-neutral-700 bg-neutral-800/40 px-3 py-2 text-sm sm:text-base text-neutral-100 placeholder-neutral-500 outline-none focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500 resize-none"
          />
        </div>
        {/*toggle border */}
        <div className="flex flex-row gap-2">
          <button 
            onClick={() => setBorder(!border)}
            className="p-2 sm:p-3 rounded-md bg-neutral-800 hover:bg-neutral-700 active:bg-neutral-600 transition-colors touch-manipulation"
            title="Toggle border"
            aria-label="Toggle border"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              className="text-neutral-200 sm:w-6 sm:h-6"
            >
              <path d="M3 3h8v8H3zM13 3h8v8h-8zM3 13h8v8H3zM13 13h8v8h-8z"/>
            </svg>
          </button>

          {/*clear canvas */}
          <button 
            onClick={handleClear}
            className="p-2 sm:p-3 rounded-md bg-neutral-800 hover:bg-red-900/50 active:bg-red-900/70 transition-colors touch-manipulation"
            title="Clear canvas"
            aria-label="Clear canvas"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              className="text-neutral-200 sm:w-6 sm:h-6"
            >
              <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14zM10 11v6M14 11v6"/>
            </svg>
          </button>

          {/*submit button */}
          <button onClick={handleSubmit} className="px-3 sm:px-4 py-2 sm:py-3 rounded-md bg-neutral-700 hover:bg-neutral-600 active:bg-neutral-500 text-neutral-100 font-medium text-sm sm:text-base transition-colors flex-1 touch-manipulation">
            {submitMutation.isPending? 'Submitting...':"Submit"}
          </button>
        </div>
      </div>
      

    </div>
  );
}