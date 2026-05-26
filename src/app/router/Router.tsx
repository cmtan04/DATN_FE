import { BrowserRouter, Route, Routes } from "react-router-dom";
import { WebRouter } from "./Route";

export const Router = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/*" element={<WebRouter />} />
    </Routes>
  </BrowserRouter>
);
