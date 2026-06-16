import { EnvironmentOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Input, Select } from "antd";
import { useState } from "react";
import "./locationSearchCard.scss";

const searchText = {
  destination: "Địa điểm",
  guests: "Số khách",
  search: "Tìm kiếm",
};

export type LocationSearchPayload = {
  destination: string;
  guests: string;
};

type LocationSearchCardProps = {
  onSearch: (payload: LocationSearchPayload) => void;
};

export function LocationSearchCard({ onSearch }: LocationSearchCardProps) {
  const [destination, setDestination] = useState("");
  const [guests, setGuests] = useState("1");

  const handleSearch = () => {
    onSearch({
      destination: destination.trim(),
      guests,
    });
  };

  return (
    <div className="location-search-card">
      <div className="location-search-card__fields">
        <div className="location-search-card__field">
          <label>{searchText.destination}</label>
          <Input
            prefix={<EnvironmentOutlined style={{ color: "#d4a849" }} />}
            placeholder="Ha Noi, Da Nang, Hoi An, ..."
            value={destination}
            onChange={(event) => setDestination(event.target.value)}
            onPressEnter={handleSearch}
            size="large"
          />
        </div>
        <div className="location-search-card__field">
          <label>{searchText.guests}</label>
          <Select
            value={guests}
            onChange={setGuests}
            size="large"
            options={["1", "2", "3", "4", "5", "6+"].map((value) => ({
              value,
              label: `${value} khách`,
            }))}
          />
        </div>
        <Button
          type="primary"
          icon={<SearchOutlined />}
          size="large"
          className="location-search-card__button"
          onClick={handleSearch}
        >
          {searchText.search}
        </Button>
      </div>
    </div>
  );
}
