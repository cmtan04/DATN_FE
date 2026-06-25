import { useQuery } from "@tanstack/react-query";
import { HOME_QUERY_KEYS } from "@/shared/constants/queryKeys";
import { homeService } from "../constants/home";

export const useHomeData = () =>
  useQuery({
    queryKey: HOME_QUERY_KEYS.overview,
    queryFn: homeService.getHomeData,
  });
