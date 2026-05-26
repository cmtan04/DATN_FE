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
  featuredLocations: [
    {
      code: "can-ho-view-song-quan-7",
      title: "Căn hộ view sông Quận 7",
      address: "Nguyễn Văn Linh, Quận 7, TP. Hồ Chí Minh",
      priceLabel: "8.5 triệu/tháng",
      areaLabel: "35 m2",
      typeLabel: "Căn hộ",
      imageUrl:
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80",
      rating: 4.5,
      viewCount: 1280,
      isFeatured: true,
    },
    {
      code: "phong-tro-gan-dh-bach-khoa",
      title: "Phòng trọ gần ĐH Bách Khoa",
      address: "Tạ Quang Bửu, Hai Bà Trưng, Hà Nội",
      priceLabel: "3.2 triệu/tháng",
      areaLabel: "22 m2",
      typeLabel: "Phòng trọ",
      imageUrl:
        "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80",
      rating: 4,
      viewCount: 960,
      isFeatured: true,
    },
    {
      code: "studio-trung-tam-da-nang",
      title: "Studio trung tâm Đà Nẵng",
      address: "Nguyễn Văn Linh, Hải Châu, Đà Nẵng",
      priceLabel: "5.8 triệu/tháng",
      areaLabel: "28 m2",
      typeLabel: "Studio",
      imageUrl:
        "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=800&q=80",
      rating: 4.5,
      viewCount: 830,
      isFeatured: true,
    },
  ],
  newLocations: [
    {
      code: "nha-nguyen-can-thu-duc",
      title: "Nhà nguyên căn Thủ Đức",
      address: "Đường số 8, TP. Thủ Đức, TP. Hồ Chí Minh",
      priceLabel: "12 triệu/tháng",
      areaLabel: "68 m2",
      typeLabel: "Nhà nguyên căn",
      imageUrl:
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80",
      rating: 4,
      viewCount: 420,
      isNew: true,
    },
    {
      code: "can-ho-mini-cau-giay",
      title: "Căn hộ mini Cầu Giấy",
      address: "Dịch Vọng Hậu, Cầu Giấy, Hà Nội",
      priceLabel: "6.1 triệu/tháng",
      areaLabel: "30 m2",
      typeLabel: "Căn hộ mini",
      imageUrl:
        "https://images.unsplash.com/photo-1560448075-bb485b067938?auto=format&fit=crop&w=800&q=80",
      rating: 4.5,
      viewCount: 510,
      isNew: true,
    },
    {
      code: "phong-ban-cong-nha-trang",
      title: "Phòng có ban công Nha Trang",
      address: "Trần Phú, Nha Trang, Khánh Hòa",
      priceLabel: "4.4 triệu/tháng",
      areaLabel: "24 m2",
      typeLabel: "Phòng trọ",
      imageUrl:
        "https://images.unsplash.com/photo-1560185127-6ed189bf02f4?auto=format&fit=crop&w=800&q=80",
      rating: 4,
      viewCount: 390,
      isNew: true,
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
