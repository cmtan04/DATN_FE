import DaNang from "@shared/assets/image/DaNang.avif";
import HaNoi from "@shared/assets/image/HaNoi.avif";
import HoiAn from "@shared/assets/image/HoiAn.avif";
import Hue from "@shared/assets/image/Hue.avif";
import TPHoChiMinh from "@shared/assets/image/TPHoChiminh.avif";
import { useNavigate } from "react-router";
import "./styles.scss";

const destinations = [
  {
    city: "Hà Nội",
    country: "Việt Nam",
    img: HaNoi,
    big: true,
    q: "Hà Nội",
  },
  {
    city: "Đà Nẵng",
    country: "Việt Nam",
    img: DaNang,
    big: false,
    q: "Đà Nẵng",
  },
  {
    city: "Huế",
    country: "Việt Nam",
    img: Hue,
    big: false,
    q: "Huế",
  },
  {
    city: "TP. Hồ Chí Minh",
    country: "Việt Nam",
    img: TPHoChiMinh,
    big: false,
    q: "TP. Hồ Chí Minh",
  },
  {
    city: "Hội An",
    country: "Việt Nam",
    img: HoiAn,
    big: false,
    q: "Hội An",
  },
];

export function PopularDestination() {
  const navigate = useNavigate();

  return (
    <section className="section">
      <div className="header">
        <div className="left">
          <p className="eyebrow">ĐỊA ĐIỂM NỔI BẬT</p>
          <h2>Điểm đến được yêu thích</h2>
        </div>
      </div>

      <div className="grid">
        {destinations.map((destination) => (
          <div
            key={destination.city}
            className={`destCard ${destination.big ? "bigCard" : ""}`}
            onClick={() => navigate(`/locations?q=${destination.q}`)}
          >
            <img src={destination.img} alt={destination.city} />
            <div className="gradientOverlay" />
            <div className="cardContent">
              <h3>{destination.city}</h3>
              <span className="country">{destination.country}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
