
import { createRoot } from "react-dom/client";
import App from "./app/App";
import "./styles/index.css";

import { ThemeProvider } from "./app/contexts/ThemeContext";

createRoot(document.getElementById("root")!).render(
    <ThemeProvider>
        <App />
    </ThemeProvider>
);
