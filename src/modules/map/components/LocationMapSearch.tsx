import { SearchOutlined } from "@ant-design/icons";
import { Input } from "antd";
import type { MapAddressSearchState } from "../hooks/useMapAddressPicker";

interface LocationMapSearchProps {
  searchState: MapAddressSearchState;
}

export const LocationMapSearch = ({ searchState }: LocationMapSearchProps) => (
  <div className="location-map__search">
    <Input
      placeholder="Tim kiem dia diem..."
      prefix={<SearchOutlined />}
      size="large"
      value={searchState.input}
      onChange={(event) => searchState.onInputChange(event.target.value)}
      onFocus={searchState.onFocus}
      onPressEnter={() => {
        void searchState.onSubmit();
      }}
    />
    {searchState.isDropdownOpen && (
      <div className="location-map__suggestions">
        {searchState.isSearching && (
          <div className="location-map__suggestion-state">
            Dang tim dia diem...
          </div>
        )}
        {!searchState.isSearching &&
          searchState.results.map((result, index) => (
            <button
              key={`${result.lat}-${result.lon}-${index}`}
              type="button"
              className="location-map__suggestion"
              onClick={() => searchState.onSelectResult(result)}
            >
              <span>{result.display_name}</span>
            </button>
          ))}
        {!searchState.isSearching &&
          searchState.input.trim().length >= 2 &&
          searchState.results.length === 0 && (
            <div className="location-map__suggestion-state">
              Khong tim thay ket qua phu hop.
            </div>
          )}
      </div>
    )}
  </div>
);
