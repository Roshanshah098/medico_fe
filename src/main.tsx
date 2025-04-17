import { createRoot } from "react-dom/client";
import "@mantine/core/styles.css";

import "@mantine/charts/styles.css";
import "./index.css";
import App from "./App.tsx"; // Your main app component
import { MantineProvider } from "@mantine/core";
import { BrowserRouter } from "react-router-dom"; // Import BrowserRouter

// Use createRoot to render your app
createRoot(document.getElementById("root")!).render(
  <MantineProvider>
    <BrowserRouter>
      {" "}
      {/* Wrap the entire app with BrowserRouter */}
      <App />
    </BrowserRouter>
  </MantineProvider>
);
