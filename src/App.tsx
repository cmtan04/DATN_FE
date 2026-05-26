import "./App.css";
import "./color.scss";
import { AppProvider } from "@app/providers/AppProvider";
import { Router } from "@app/router/Router";

const App = () => {
  return (
    <AppProvider>
      <Router />
    </AppProvider>
  );
};

export default App;
