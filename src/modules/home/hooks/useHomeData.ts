import { useQuery } from "@tanstack/react-query";
import { HOME_QUERY_KEYS } from "../constants/queryKeys";
import { homeService } from "../api/home.service";

export const useHomeData = () =>
  useQuery({
    queryKey: HOME_QUERY_KEYS.overview,
    queryFn: homeService.getHomeData,
  });
