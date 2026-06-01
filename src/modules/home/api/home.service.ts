import type { HomeOverviewData } from "../types";

const homeOverviewData: HomeOverviewData = {
  searchSuggestions: [
    "Hà Nội",
    "TP. Hồ Chí Minh",
    "Đà Nẵng",
    "Cầu Giấy",
    "Quận 7",
    "Thủ Đức",
  ],
  popularPlaces: [
    {
      key: "ha-noi",
      title: "Hà Nội",
      description: "Nhiều lựa chọn quanh các trường đại học và khu văn phòng.",
      keyword: "Hà Nội",
      imageUrl:
        "https://images.unsplash.com/photo-1592201272713-39c5a5df639d?auto=format&fit=crop&w=800&q=80",
    },
    {
      key: "tp-ho-chi-minh",
      title: "TP. Hồ Chí Minh",
      description: "Phòng trọ, căn hộ mini và nhà nguyên căn tại các quận trung tâm.",
      keyword: "TP. Hồ Chí Minh",
      imageUrl:
        "https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=800&q=80",
    },
    {
      key: "da-nang",
      title: "Đà Nẵng",
      description: "Không gian sống gần biển, trung tâm và các khu công nghệ.",
      keyword: "Đà Nẵng",
      imageUrl:
        "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=800&q=80",
    },
    {
      key: "nha-trang",
      title: "Nha Trang",
      description: "Khu vực ven biển, gần trung tâm và các tuyến du lịch chính.",
      keyword: "Nha Trang",
      imageUrl:
        "https://images.unsplash.com/photo-1590458892624-3a94a09dc0b4?auto=format&fit=crop&w=800&q=80",
    },
    {
      key: "binh-duong",
      title: "Bình Dương",
      description: "Phù hợp người đi làm tại các khu công nghiệp và đô thị mới.",
      keyword: "Bình Dương",
      imageUrl:
        "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80",
    },
    {
      key: "hai-phong",
      title: "Hải Phòng",
      description: "Nhiều lựa chọn quanh khu cảng, trung tâm và khu công nghiệp.",
      keyword: "Hải Phòng",
      imageUrl:
        "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=800&q=80",
    },
    {
      key: "can-tho",
      title: "Cần Thơ",
      description: "Phòng thuê gần trường, chợ, bến xe và các trục đường lớn.",
      keyword: "Cần Thơ",
      imageUrl:
        "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80",
    },
    {
      key: "hue",
      title: "Huế",
      description: "Không gian sống yên tĩnh, phù hợp sinh viên và người đi làm.",
      keyword: "Huế",
      imageUrl:
        "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80",
    },
  ],
  regions: [
    {
      key: "north",
      title: "Miền Bắc",
      description: "Hà Nội, Hải Phòng, Quảng Ninh và các tỉnh lân cận.",
      highlight: "1.200+ lựa chọn",
    },
    {
      key: "central",
      title: "Miền Trung",
      description: "Đà Nẵng, Huế, Nha Trang và các khu vực ven biển.",
      highlight: "680+ lựa chọn",
    },
    {
      key: "south",
      title: "Miền Nam",
      description: "TP. Hồ Chí Minh, Bình Dương, Đồng Nai và vùng phụ cận.",
      highlight: "1.850+ lựa chọn",
    },
  ],
  regionOptions: [
    { label: "Miền Bắc", value: "north" },
    { label: "Miền Trung", value: "central" },
    { label: "Miền Nam", value: "south" },
  ],
};

export const homeService = {
  async getHomeData() {
    return homeOverviewData;
  },
};
