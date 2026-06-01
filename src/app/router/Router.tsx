import { BrowserRouter, Route, Routes } from "react-router-dom";
import { WebRouter } from "./Route";
import { ScrollToTop } from "@/shared/components/ScrollToTop";

export const Router = () => (
  <BrowserRouter>
    <ScrollToTop />
    <Routes>
      <Route path="/*" element={<WebRouter />} />
    </Routes>
  </BrowserRouter>
);
