import { useEffect } from "react";
import { useLocation } from "react-router-dom";

interface ScrollToTopProps {
  watch?: any;
}

export const ScrollToTop = ({ watch }: ScrollToTopProps): React.ReactNode => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, [pathname, watch]);

  return null;
};
