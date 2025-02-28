// src/__tests__/App.test.jsx
import React from "react";
import { render, screen } from "@testing-library/react";
import App from "../App";

test("renders main Usuarios title", () => {
  render(<App />);
  const titleElement = screen.getByRole("heading", { level: 1, name: /Usuarios/i });
  expect(titleElement).toBeInTheDocument();
});