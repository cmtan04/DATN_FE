import { ROUTER_PATH } from "@app/router/routes";
import heroSearch from "@shared/assets/image/heroSearch.avif";
import {
  LocationSearchCard,
  type LocationSearchPayload,
} from "@shared/components";
import { useNavigate } from "react-router-dom";
import "./styles.scss";

const heroText = {
  title: "T\u00ecm ch\u1ed7 \u1edf ho\u00e0n h\u1ea3o",
  accent: "c\u1ee7a b\u1ea1n",
};

const quickFilters = [
  { label: "H\u00e0 N\u1ed9i", query: "H\u00e0 N\u1ed9i" },
  { label: "Sapa", query: "Sapa" },
  { label: "H\u1ea3i Ph\u00f2ng", query: "H\u1ea3i Ph\u00f2ng" },
  { label: "Nha Trang", query: "Nha Trang" },
  { label: "H\u1ed9i An", query: "H\u1ed9i An" },
];

export function HeroSearch() {
  const navigate = useNavigate();

  const handleSearch = ({
    destination,
    guests,
  }: LocationSearchPayload) => {
    const params = new URLSearchParams();

    if (destination) {
      params.set("q", destination);
    }

    params.set("guestCount", guests);

    const search = params.toString();
    navigate(
      search ? `${ROUTER_PATH.LOCATIONS}?${search}` : ROUTER_PATH.LOCATIONS,
    );
  };

  return (
    <section className="hero">
      <div className="bg">
        <img src={heroSearch} alt="Luxury resort" />
        <div className="overlay" />
      </div>

      <div className="content">
        <h1 className="title">
          {heroText.title}
          <br />
          <span className="accent">{heroText.accent}</span>
        </h1>

        <LocationSearchCard onSearch={handleSearch} />

        <div className="quickFilters">
          {quickFilters.map((tag) => (
            <button
              key={tag.query}
              className="filterTag"
              onClick={() =>
                navigate(
                  `${ROUTER_PATH.LOCATIONS}?q=${encodeURIComponent(tag.query)}`,
                )
              }
            >
              {tag.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
