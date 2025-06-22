import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { KidPixProvider } from "../../../contexts/KidPixContext";
import { Toolbar } from "../Toolbar";

// Mock component to test context integration
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <KidPixProvider>{children}</KidPixProvider>;
};

describe("Toolbar", () => {
  const tools = [
    { id: "pencil", name: "Pencil", icon: "✏️" },
    { id: "brush", name: "Brush", icon: "🖌️" },
    { id: "eraser", name: "Eraser", icon: "🧽" },
    { id: "line", name: "Line", icon: "📏" },
    { id: "circle", name: "Circle", icon: "⭕" },
    { id: "square", name: "Square", icon: "⬜" },
  ];

  it("renders all tools", () => {
    render(
      <TestWrapper>
        <Toolbar />
      </TestWrapper>,
    );

    // Check that all tools are rendered
    tools.forEach((tool) => {
      expect(screen.getByText(tool.name)).toBeInTheDocument();
      expect(screen.getByText(tool.icon)).toBeInTheDocument();
    });

    // Check toolbar heading
    expect(screen.getByText("Tools")).toBeInTheDocument();
  });

  it("shows pencil as active tool by default", () => {
    render(
      <TestWrapper>
        <Toolbar />
      </TestWrapper>,
    );

    const pencilButton = screen.getByRole("button", { name: /pencil/i });
    expect(pencilButton).toHaveClass("active");
  });

  it("changes active tool when clicked", async () => {
    const user = userEvent.setup();

    render(
      <TestWrapper>
        <Toolbar />
      </TestWrapper>,
    );

    const brushButton = screen.getByRole("button", { name: /brush/i });
    const pencilButton = screen.getByRole("button", { name: /pencil/i });

    // Initially pencil should be active
    expect(pencilButton).toHaveClass("active");
    expect(brushButton).not.toHaveClass("active");

    // Click brush tool
    await user.click(brushButton);

    // Now brush should be active and pencil inactive
    expect(brushButton).toHaveClass("active");
    expect(pencilButton).not.toHaveClass("active");
  });

  it("applies correct CSS classes", () => {
    render(
      <TestWrapper>
        <Toolbar />
      </TestWrapper>,
    );

    // Check main container classes
    const toolbar = screen.getByText("Tools").closest(".toolbar");
    expect(toolbar).toBeInTheDocument();

    const toolGrid = toolbar?.querySelector(".tool-grid");
    expect(toolGrid).toBeInTheDocument();

    // Check button classes
    const buttons = screen.getAllByRole("button");
    buttons.forEach((button) => {
      expect(button).toHaveClass("tool-button");
    });
  });

  it("has correct accessibility attributes", () => {
    render(
      <TestWrapper>
        <Toolbar />
      </TestWrapper>,
    );

    tools.forEach((tool) => {
      const button = screen.getByRole("button", {
        name: new RegExp(tool.name),
      });
      expect(button).toHaveAttribute("title", tool.name);
    });
  });

  it("allows selecting each tool", async () => {
    const user = userEvent.setup();

    render(
      <TestWrapper>
        <Toolbar />
      </TestWrapper>,
    );

    // Test each tool can be selected
    for (const tool of tools) {
      const button = screen.getByRole("button", {
        name: new RegExp(tool.name),
      });
      await user.click(button);
      expect(button).toHaveClass("active");

      // Check that other tools are not active
      const allButtons = screen.getAllByRole("button");
      const otherButtons = allButtons.filter((btn) => btn !== button);
      otherButtons.forEach((otherBtn) => {
        expect(otherBtn).not.toHaveClass("active");
      });
    }
  });
});
