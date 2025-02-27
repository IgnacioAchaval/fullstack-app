// src/__tests__/App.test.jsx
import React from "react";
import { render, screen } from "@testing-library/react";
import App from "../App";

test("renders Usuarios title", () => {
  render(<App />);
  expect(screen.getByText(/Usuarios/i)).toBeInTheDocument();
});