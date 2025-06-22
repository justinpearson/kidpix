import React, { createContext, useContext, useReducer, ReactNode } from "react";

// State interface
export interface KidPixState {
  currentTool: string;
  currentColor: string;
  brushSize: number;
  isDrawing: boolean;
  canvasLayers: {
    main: HTMLCanvasElement | null;
    tmp: HTMLCanvasElement | null;
    preview: HTMLCanvasElement | null;
    anim: HTMLCanvasElement | null;
    bnim: HTMLCanvasElement | null;
  };
  undoStack: ImageData[];
  redoStack: ImageData[];
}

// Action types
export type KidPixAction =
  | { type: "SET_TOOL"; payload: string }
  | { type: "SET_COLOR"; payload: string }
  | { type: "SET_BRUSH_SIZE"; payload: number }
  | { type: "SET_DRAWING_STATE"; payload: boolean }
  | {
      type: "SET_CANVAS_LAYER";
      payload: {
        layer: keyof KidPixState["canvasLayers"];
        canvas: HTMLCanvasElement;
      };
    }
  | { type: "PUSH_UNDO"; payload: ImageData }
  | { type: "UNDO" }
  | { type: "REDO" };

// Initial state
const initialState: KidPixState = {
  currentTool: "pencil",
  currentColor: "#000000",
  brushSize: 5,
  isDrawing: false,
  canvasLayers: {
    main: null,
    tmp: null,
    preview: null,
    anim: null,
    bnim: null,
  },
  undoStack: [],
  redoStack: [],
};

// Reducer function
function kidPixReducer(state: KidPixState, action: KidPixAction): KidPixState {
  switch (action.type) {
    case "SET_TOOL":
      return { ...state, currentTool: action.payload };

    case "SET_COLOR":
      return { ...state, currentColor: action.payload };

    case "SET_BRUSH_SIZE":
      return { ...state, brushSize: action.payload };

    case "SET_DRAWING_STATE":
      return { ...state, isDrawing: action.payload };

    case "SET_CANVAS_LAYER":
      return {
        ...state,
        canvasLayers: {
          ...state.canvasLayers,
          [action.payload.layer]: action.payload.canvas,
        },
      };

    case "PUSH_UNDO":
      return {
        ...state,
        undoStack: [...state.undoStack, action.payload].slice(-20), // Keep last 20
        redoStack: [], // Clear redo when new action is performed
      };

    case "UNDO": {
      if (state.undoStack.length === 0) return state;
      const lastState = state.undoStack[state.undoStack.length - 1];
      return {
        ...state,
        undoStack: state.undoStack.slice(0, -1),
        redoStack: [lastState, ...state.redoStack],
      };
    }

    case "REDO": {
      if (state.redoStack.length === 0) return state;
      const nextState = state.redoStack[0];
      return {
        ...state,
        undoStack: [...state.undoStack, nextState],
        redoStack: state.redoStack.slice(1),
      };
    }

    default:
      return state;
  }
}

// Context creation
interface KidPixContextType {
  state: KidPixState;
  dispatch: React.Dispatch<KidPixAction>;
}

const KidPixContext = createContext<KidPixContextType | undefined>(undefined);

// Provider component
interface KidPixProviderProps {
  children: ReactNode;
}

export const KidPixProvider: React.FC<KidPixProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(kidPixReducer, initialState);

  return (
    <KidPixContext.Provider value={{ state, dispatch }}>
      {children}
    </KidPixContext.Provider>
  );
};

// Custom hook for using the context
export const useKidPix = () => {
  const context = useContext(KidPixContext);
  if (context === undefined) {
    throw new Error("useKidPix must be used within a KidPixProvider");
  }
  return context;
};
