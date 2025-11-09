import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Prevent flash of unstyled content for dark mode
const root = document.getElementById("root");
if (root) {
  createRoot(root).render(<App />);
}
