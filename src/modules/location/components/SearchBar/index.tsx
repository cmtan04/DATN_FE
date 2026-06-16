import { SearchOutlined } from "@ant-design/icons";
import { Button, Input, Select } from "antd";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import "./styles.scss";
export function SearchBar() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [guests, setGuests] = useState(searchParams.get("guestCount") || "1");

  const handleSearch = () => {
    const params = new URLSearchParams(searchParams);
    if (query) params.set("q", query);
    else params.delete("q");
    params.set("guestCount", guests);
    setSearchParams(params);
  };
  return (
    <div className="searchBar">
      <div className="inner">
        <Input
          prefix={<SearchOutlined />}
          placeholder="Điểm đến..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onPressEnter={handleSearch}
          className="queryInput"
        />

        <Select
          value={guests}
          onChange={setGuests}
          size="large"
          options={["1", "2", "3", "4", "5", "6+"].map((value) => ({
            value,
            label: `${value} khách`,
          }))}
        />

        <Button
          type="primary"
          icon={<SearchOutlined />}
          onClick={handleSearch}
          className="searchButton"
        >
          Tìm kiếm
        </Button>
      </div>
    </div>
  );
}
