import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import VersionFooter from "@/components/VersionFooter";

describe("VersionFooter", () => {
  it("renders the correct version", () => {
    render(<VersionFooter />);
    expect(screen.getByText(/v1\.0\.4-devops/i)).toBeInTheDocument();
  });

  it("renders the deployment environment", () => {
    render(<VersionFooter />);
    expect(screen.getByText(/env: production/i)).toBeInTheDocument();
  });
});
