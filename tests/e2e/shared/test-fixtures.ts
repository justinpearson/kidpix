import { ToolDefinition, WackyBrushSubtool } from "./tool-helpers";

/**
 * Complete tool definitions for all KidPix drawing tools
 */
export const TOOL_DEFINITIONS: ToolDefinition[] = [
  {
    id: "pencil",
    name: "Pencil",
    hasSubtools: true,
    hasMultipleSubtoolSets: true,
    defaultSubtoolIndices: [0], // first size (conservative)
    alternateSubtoolIndices: [1], // second size
  },
  {
    id: "line",
    name: "Line",
    hasSubtools: true,
    hasMultipleSubtoolSets: true,
    defaultSubtoolIndices: [0], // first size (conservative)
    alternateSubtoolIndices: [1], // second size
  },
  {
    id: "square",
    name: "Rectangle",
    hasSubtools: true,
    hasMultipleSubtoolSets: false,
    defaultSubtoolIndices: [0], // first texture
    alternateSubtoolIndices: [1], // second texture
  },
  {
    id: "circle",
    name: "Circle",
    hasSubtools: true,
    hasMultipleSubtoolSets: false,
    defaultSubtoolIndices: [0], // first texture
    alternateSubtoolIndices: [1], // second texture
  },
  {
    id: "brush",
    name: "Brush",
    hasSubtools: true,
    hasMultipleSubtoolSets: false,
    defaultSubtoolIndices: [0], // first brush type
    alternateSubtoolIndices: [1], // different brush type
  },
  {
    id: "jumble",
    name: "Mixer",
    hasSubtools: true,
    hasMultipleSubtoolSets: false,
    defaultSubtoolIndices: [0], // first effect
    alternateSubtoolIndices: [2], // different effect (avoiding index 1 which seems problematic)
  },
  {
    id: "paintcan",
    name: "Paint Can",
    hasSubtools: true,
    hasMultipleSubtoolSets: false,
    defaultSubtoolIndices: [0], // solid fill
    alternateSubtoolIndices: [1], // pattern fill
  },
  {
    id: "eraser",
    name: "Eraser",
    hasSubtools: true,
    hasMultipleSubtoolSets: false,
    defaultSubtoolIndices: [0], // regular eraser
    alternateSubtoolIndices: [1], // special eraser
  },
  {
    id: "text",
    name: "Text",
    hasSubtools: true,
    hasMultipleSubtoolSets: false,
    defaultSubtoolIndices: [0], // letter A
    alternateSubtoolIndices: [1], // letter B
  },
  {
    id: "stamp",
    name: "Stamp",
    hasSubtools: true,
    hasMultipleSubtoolSets: false,
    defaultSubtoolIndices: [0], // first stamp
    alternateSubtoolIndices: [1], // different stamp
  },
  {
    id: "truck",
    name: "Truck",
    hasSubtools: true,
    hasMultipleSubtoolSets: false,
    defaultSubtoolIndices: [0], // first truck type
    alternateSubtoolIndices: [1], // different truck type
  },
];

/**
 * Wacky Brush subtool definitions based on submenu order
 */
export const WACKY_BRUSH_SUBTOOLS: WackyBrushSubtool[] = [
  { index: 0, name: "Dripping Paint", expectsErrors: false },
  { index: 1, name: "Leaky Pen", expectsErrors: false },
  { index: 2, name: "Concentric Circles", expectsErrors: false },
  { index: 3, name: "Fuzzer", expectsErrors: false },
  { index: 4, name: "Splatter Paint", expectsErrors: false }, // Previously broken
  { index: 5, name: "Tree", expectsErrors: false }, // Previously broken
  { index: 6, name: "Bubbly", expectsErrors: false },
  { index: 7, name: "X and O", expectsErrors: false },
  { index: 8, name: "Spray Paint", expectsErrors: false },
  { index: 9, name: "Shapes", expectsErrors: false },
  { index: 10, name: "Cards", expectsErrors: false },
  { index: 11, name: "Dots", expectsErrors: false },
  { index: 12, name: "Rolling Dots", expectsErrors: false },
  { index: 13, name: "Northern Lights", expectsErrors: false },
  { index: 14, name: "Stars", expectsErrors: false },
  { index: 15, name: "Guilloche", expectsErrors: false },
  { index: 16, name: "Inverter", expectsErrors: false },
  { index: 17, name: "Kaleidoscope", expectsErrors: false },
  { index: 18, name: "Owl", expectsErrors: false },
  { index: 19, name: "Pies", expectsErrors: false },
  { index: 20, name: "Twirly", expectsErrors: false },
  { index: 21, name: "Zigzag", expectsErrors: false },
  { index: 22, name: "Zoom", expectsErrors: false },
  { index: 23, name: "Prints", expectsErrors: false },
  { index: 24, name: "Pines", expectsErrors: false },
];

/**
 * Get tool definition by ID
 */
export function getToolDefinition(toolId: string): ToolDefinition | undefined {
  return TOOL_DEFINITIONS.find((tool) => tool.id === toolId);
}

/**
 * Get all tool IDs
 */
export function getAllToolIds(): string[] {
  return TOOL_DEFINITIONS.map((tool) => tool.id);
}
