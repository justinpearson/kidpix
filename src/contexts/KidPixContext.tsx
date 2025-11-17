import React, { createContext, useContext, useReducer, ReactNode } from "react";
import { Tool, CanvasLayerName } from "../types/kiddopaint";
import { ModifierKeys } from "../types/utils";

// State interface with expanded properties to match vanilla JS KiddoPaint.Current
export interface KidPixState {
  // Tool state
  currentTool: string;
  toolInstance: Tool | null;

  // Color state
  currentColor: string;
  backgroundColor: string;

  // Drawing state
  brushSize: number;
  isDrawing: boolean;

  // Modifier keys
  modifierKeys: ModifierKeys;

  // Canvas layers
  canvasLayers: {
    main: HTMLCanvasElement | null;
    tmp: HTMLCanvasElement | null;
    preview: HTMLCanvasElement | null;
    anim: HTMLCanvasElement | null;
    bnim: HTMLCanvasElement | null;
  };

  // Canvas contexts (for convenience)
  canvasContexts: {
    main: CanvasRenderingContext2D | null;
    tmp: CanvasRenderingContext2D | null;
    preview: CanvasRenderingContext2D | null;
    anim: CanvasRenderingContext2D | null;
    bnim: CanvasRenderingContext2D | null;
  };

  // Undo/Redo state (in-memory and persistent)
  undoStack: string[]; // Base64 encoded image data for in-memory undo (max 30)
  redoStack: string[];
  persistedUndoStack: string[]; // Persisted to localStorage (max 10)
  persistedRedoStack: string[];

  // Canvas persistence
  canvasSaved: boolean;
  lastSaveTimestamp: number | null;

  // UI state
  activeSubmenu: string | null;
  showColorPicker: boolean;

  // Feature flags
  undoEnabled: boolean;
  allowClearTmp: boolean;
}

// Action types with expanded set to match new state
export type KidPixAction =
  // Tool actions
  | { type: "SET_TOOL"; payload: { toolName: string; toolInstance: Tool | null } }
  | { type: "SET_BRUSH_SIZE"; payload: number }

  // Color actions
  | { type: "SET_COLOR"; payload: string }
  | { type: "SET_BACKGROUND_COLOR"; payload: string }

  // Drawing state actions
  | { type: "SET_DRAWING_STATE"; payload: boolean }
  | { type: "SET_MODIFIER_KEYS"; payload: Partial<ModifierKeys> }

  // Canvas layer actions
  | {
      type: "SET_CANVAS_LAYER";
      payload: {
        layer: CanvasLayerName;
        canvas: HTMLCanvasElement;
        context: CanvasRenderingContext2D;
      };
    }

  // Undo/Redo actions
  | { type: "PUSH_UNDO"; payload: string } // Base64 image data
  | { type: "UNDO" }
  | { type: "REDO" }
  | { type: "LOAD_PERSISTED_UNDO_REDO"; payload: { undo: string[]; redo: string[] } }

  // Canvas persistence actions
  | { type: "MARK_CANVAS_SAVED"; payload: number } // timestamp
  | { type: "MARK_CANVAS_UNSAVED" }

  // UI actions
  | { type: "SET_ACTIVE_SUBMENU"; payload: string | null }
  | { type: "TOGGLE_COLOR_PICKER" }
  | { type: "SET_COLOR_PICKER"; payload: boolean }

  // Feature flag actions
  | { type: "SET_UNDO_ENABLED"; payload: boolean }
  | { type: "SET_ALLOW_CLEAR_TMP"; payload: boolean }

  // Bulk state reset
  | { type: "RESET_STATE" };

// Initial state with all new fields
const initialState: KidPixState = {
  // Tool state
  currentTool: "pencil",
  toolInstance: null,

  // Color state
  currentColor: "#000000",
  backgroundColor: "#FFFFFF",

  // Drawing state
  brushSize: 5,
  isDrawing: false,

  // Modifier keys
  modifierKeys: {
    shift: false,
    ctrl: false,
    alt: false,
    meta: false,
  },

  // Canvas layers
  canvasLayers: {
    main: null,
    tmp: null,
    preview: null,
    anim: null,
    bnim: null,
  },

  // Canvas contexts
  canvasContexts: {
    main: null,
    tmp: null,
    preview: null,
    anim: null,
    bnim: null,
  },

  // Undo/Redo state
  undoStack: [],
  redoStack: [],
  persistedUndoStack: [],
  persistedRedoStack: [],

  // Canvas persistence
  canvasSaved: false,
  lastSaveTimestamp: null,

  // UI state
  activeSubmenu: null,
  showColorPicker: false,

  // Feature flags
  undoEnabled: true,
  allowClearTmp: true,
};

// Reducer function with all new actions
function kidPixReducer(state: KidPixState, action: KidPixAction): KidPixState {
  switch (action.type) {
    // Tool actions
    case "SET_TOOL":
      return {
        ...state,
        currentTool: action.payload.toolName,
        toolInstance: action.payload.toolInstance,
      };

    case "SET_BRUSH_SIZE":
      return { ...state, brushSize: action.payload };

    // Color actions
    case "SET_COLOR":
      return { ...state, currentColor: action.payload };

    case "SET_BACKGROUND_COLOR":
      return { ...state, backgroundColor: action.payload };

    // Drawing state actions
    case "SET_DRAWING_STATE":
      return { ...state, isDrawing: action.payload };

    case "SET_MODIFIER_KEYS":
      return {
        ...state,
        modifierKeys: { ...state.modifierKeys, ...action.payload },
      };

    // Canvas layer actions
    case "SET_CANVAS_LAYER":
      return {
        ...state,
        canvasLayers: {
          ...state.canvasLayers,
          [action.payload.layer]: action.payload.canvas,
        },
        canvasContexts: {
          ...state.canvasContexts,
          [action.payload.layer]: action.payload.context,
        },
      };

    // Undo/Redo actions
    case "PUSH_UNDO": {
      const newUndoStack = [...state.undoStack, action.payload].slice(-30); // Keep last 30 in memory
      const newPersistedStack = newUndoStack.slice(-10); // Keep last 10 for persistence

      return {
        ...state,
        undoStack: newUndoStack,
        redoStack: [], // Clear redo when new action is performed
        persistedUndoStack: newPersistedStack,
        persistedRedoStack: [],
        canvasSaved: false,
      };
    }

    case "UNDO": {
      if (state.undoStack.length === 0) return state;
      const lastState = state.undoStack[state.undoStack.length - 1];

      return {
        ...state,
        undoStack: state.undoStack.slice(0, -1),
        redoStack: [lastState, ...state.redoStack].slice(0, 30),
        persistedUndoStack: state.undoStack.slice(-10, -1),
        persistedRedoStack: [lastState, ...state.redoStack].slice(0, 10),
        canvasSaved: false,
      };
    }

    case "REDO": {
      if (state.redoStack.length === 0) return state;
      const nextState = state.redoStack[0];

      return {
        ...state,
        undoStack: [...state.undoStack, nextState].slice(-30),
        redoStack: state.redoStack.slice(1),
        persistedUndoStack: [...state.undoStack, nextState].slice(-10),
        persistedRedoStack: state.redoStack.slice(1, 11),
        canvasSaved: false,
      };
    }

    case "LOAD_PERSISTED_UNDO_REDO":
      return {
        ...state,
        undoStack: action.payload.undo,
        redoStack: action.payload.redo,
        persistedUndoStack: action.payload.undo,
        persistedRedoStack: action.payload.redo,
      };

    // Canvas persistence actions
    case "MARK_CANVAS_SAVED":
      return {
        ...state,
        canvasSaved: true,
        lastSaveTimestamp: action.payload,
      };

    case "MARK_CANVAS_UNSAVED":
      return { ...state, canvasSaved: false };

    // UI actions
    case "SET_ACTIVE_SUBMENU":
      return { ...state, activeSubmenu: action.payload };

    case "TOGGLE_COLOR_PICKER":
      return { ...state, showColorPicker: !state.showColorPicker };

    case "SET_COLOR_PICKER":
      return { ...state, showColorPicker: action.payload };

    // Feature flag actions
    case "SET_UNDO_ENABLED":
      return { ...state, undoEnabled: action.payload };

    case "SET_ALLOW_CLEAR_TMP":
      return { ...state, allowClearTmp: action.payload };

    // Bulk state reset
    case "RESET_STATE":
      return initialState;

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
