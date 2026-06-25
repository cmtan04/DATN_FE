import { useState } from "react";
import {
  Button,
  Input,
  Tag,
  Modal,
  DatePicker,
  InputNumber,
  Popconfirm,
  message,
  Badge,
  Tooltip,
  Empty,
  Spin,
} from "antd";
import {
  SearchOutlined,
  CalendarOutlined,
  TeamOutlined,
  EnvironmentOutlined,
  EditOutlined,
  CloseCircleOutlined,
  EyeOutlined,
  CheckCircleOutlined,
  PlusOutlined,
  HistoryOutlined,
} from "@ant-design/icons";
import { Link, useNavigate } from "react-router";
import { useMutation } from "@tanstack/react-query";
import { useUserBookings } from "../../hooks/useUserBookings";
import { userApi } from "../../api/user.api";
import dayjs from "dayjs";
import "./style.scss";

const { RangePicker } = DatePicker;

export type BookingStatus = "confirmed" | "completed" | "cancelled" | "pending";

export type Booking = {
  id: string;
  hotelId: number;
  hotelName: string;
  hotelImg: string;
  hotelLocation: string;
  roomName: string;
  roomSize: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  guests: number;
  pricePerNight: number;
  subtotal: number;
  tax: number;
  total: number;
  status: BookingStatus;
  bookedAt: string;
  confirmationCode: string;
};

export const mockBookings: Booking[] = [
  {
    id: "bk-001",
    hotelId: 1,
    hotelName: "The Ritz-Carlton Bali",
    hotelImg:
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=280&fit=crop&auto=format",
    hotelLocation: "Nusa Dua, Bali",
    roomName: "Ocean View Suite",
    roomSize: "78m²",
    checkIn: "2025-08-10",
    checkOut: "2025-08-14",
    nights: 4,
    guests: 2,
    pricePerNight: 480,
    subtotal: 1920,
    tax: 192,
    total: 2112,
    status: "confirmed",
    bookedAt: "2025-06-12T09:24:00Z",
    confirmationCode: "VJA-887654",
  },
  {
    id: "bk-002",
    hotelId: 5,
    hotelName: "Caldera Bay Retreat",
    hotelImg:
      "https://images.unsplash.com/photo-1623718649591-311775a30c43?w=400&h=280&fit=crop&auto=format",
    hotelLocation: "Oia, Santorini",
    roomName: "Infinity Cliff Villa",
    roomSize: "140m²",
    checkIn: "2025-09-20",
    checkOut: "2025-09-25",
    nights: 5,
    guests: 2,
    pricePerNight: 890,
    subtotal: 4450,
    tax: 445,
    total: 4895,
    status: "pending",
    bookedAt: "2025-06-10T14:30:00Z",
    confirmationCode: "VJA-773421",
  },
  {
    id: "bk-003",
    hotelId: 3,
    hotelName: "Hôtel Plaza Athénée",
    hotelImg:
      "https://images.unsplash.com/photo-1549294413-26f195200c16?w=400&h=280&fit=crop&auto=format",
    hotelLocation: "Paris 8ème, Pháp",
    roomName: "Luxury Room",
    roomSize: "40m²",
    checkIn: "2025-04-01",
    checkOut: "2025-04-04",
    nights: 3,
    guests: 1,
    pricePerNight: 860,
    subtotal: 2580,
    tax: 258,
    total: 2838,
    status: "completed",
    bookedAt: "2025-03-10T11:00:00Z",
    confirmationCode: "VJA-612309",
  },
  {
    id: "bk-004",
    hotelId: 4,
    hotelName: "Four Seasons Kyoto",
    hotelImg:
      "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=400&h=280&fit=crop&auto=format",
    hotelLocation: "Higashiyama, Kyoto",
    roomName: "Ikeniwa Suite",
    roomSize: "110m²",
    checkIn: "2025-02-14",
    checkOut: "2025-02-17",
    nights: 3,
    guests: 2,
    pricePerNight: 1100,
    subtotal: 3300,
    tax: 330,
    total: 3630,
    status: "completed",
    bookedAt: "2025-01-20T08:45:00Z",
    confirmationCode: "VJA-498765",
  },
  {
    id: "bk-005",
    hotelId: 2,
    hotelName: "Burj Al Arab Jumeirah",
    hotelImg:
      "https://images.unsplash.com/photo-1561501900-3701fa6a0864?w=400&h=280&fit=crop&auto=format",
    hotelLocation: "Dubai, UAE",
    roomName: "Deluxe Suite",
    roomSize: "170m²",
    checkIn: "2025-01-05",
    checkOut: "2025-01-08",
    nights: 3,
    guests: 2,
    pricePerNight: 1250,
    subtotal: 3750,
    tax: 375,
    total: 4125,
    status: "cancelled",
    bookedAt: "2024-12-01T16:20:00Z",
    confirmationCode: "VJA-334521",
  },
];

export const mockUser = {
  firstName: "Nguyễn",
  lastName: "Văn Minh",
  email: "nguyenvanminh@gmail.com",
  phone: "+84 912 345 678",
  dob: "1992-05-15",
  gender: "male",
  nationality: "Việt Nam",
  address: "123 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh",
  avatar: "https://i.pravatar.cc/150?img=12",
  memberSince: "2023-01-10",
  tier: "Gold",
  points: 12400,
};

const statusConfig: Record<BookingStatus, { label: string; color: string }> = {
  confirmed: { label: "Đã xác nhận", color: "blue" },
  pending: { label: "Chờ xử lý", color: "orange" },
  completed: { label: "Hoàn thành", color: "green" },
  cancelled: { label: "Đã hủy", color: "red" },
};

const filters: { key: "all" | BookingStatus; label: string }[] = [
  { key: "all", label: "Tất cả" },
  { key: "confirmed", label: "Đã xác nhận" },
  { key: "pending", label: "Chờ xử lý" },
  { key: "completed", label: "Hoàn thành" },
  { key: "cancelled", label: "Đã hủy" },
];

export function UserBookingsPage() {
  const navigate = useNavigate();
  const [msgApi, ctxHolder] = message.useMessage();
  const { data: serverBookings, isLoading, refetch } = useUserBookings();
  const bookings = (serverBookings ?? []) as Booking[];

  const [activeFilter, setActiveFilter] = useState<"all" | BookingStatus>(
    "all",
  );
  const [searchQ, setSearchQ] = useState("");
  const [modifyTarget, setModifyTarget] = useState<Booking | null>(null);
  const [modifyDates, setModifyDates] = useState<
    [dayjs.Dayjs | null, dayjs.Dayjs | null] | null
  >(null);
  const [modifyGuests, setModifyGuests] = useState(2);
  const [detailTarget, setDetailTarget] = useState<Booking | null>(null);

  const displayed = bookings.filter((b) => {
    const matchFilter = activeFilter === "all" || b.status === activeFilter;
    const matchSearch =
      !searchQ ||
      b.hotelName.toLowerCase().includes(searchQ.toLowerCase()) ||
      b.confirmationCode.toLowerCase().includes(searchQ.toLowerCase());
    return matchFilter && matchSearch;
  });

  const statCounts = {
    confirmed: bookings.filter((b) => b.status === "confirmed").length,
    pending: bookings.filter((b) => b.status === "pending").length,
    completed: bookings.filter((b) => b.status === "completed").length,
    cancelled: bookings.filter((b) => b.status === "cancelled").length,
  };

  const cancelMutation = useMutation({
    mutationFn: (bookingId: string | number) => userApi.cancelBooking(bookingId),
    onSuccess: () => {
      msgApi.success(
        "Đã hủy đặt phòng thành công. Hoàn tiền trong 3–5 ngày làm việc.",
      );
      void refetch();
    },
    onError: (err: any) => {
      msgApi.error("Không thể hủy đặt phòng: " + err.message);
    },
  });

  const handleCancel = (id: string) => {
    cancelMutation.mutate(id);
  };

  const openModify = (b: Booking) => {
    setModifyTarget(b);
    setModifyDates([dayjs(b.checkIn), dayjs(b.checkOut)]);
    setModifyGuests(b.guests);
  };

  const handleModifySave = () => {
    if (!modifyTarget) return;
    setModifyTarget(null);
    msgApi.warning("Tính năng thay đổi lịch đặt phòng đang được bảo trì!");
  };

  const modifyNights =
    modifyDates?.[0] && modifyDates?.[1]
      ? Math.max(1, modifyDates[1].diff(modifyDates[0], "day"))
      : (modifyTarget?.nights ?? 1);

  const modifyTotal = modifyTarget
    ? Math.round(modifyTarget.pricePerNight * modifyNights * 1.1)
    : 0;

  return (
    <div className="bookings-page">
      {ctxHolder}

      {/* Header */}
      <div className="bookings-header">
        <div className="bookings-header__inner">
          <div className="bookings-header__title">
            <h1>Lịch sử đặt phòng</h1>
            <p>Quản lý và theo dõi tất cả các chuyến đi của bạn</p>
          </div>
          <div className="bookings-header__stats">
            {[
              { num: bookings.length, txt: "Tổng đặt phòng" },
              {
                num: statCounts.confirmed + statCounts.pending,
                txt: "Sắp tới",
              },
              { num: statCounts.completed, txt: "Hoàn thành" },
            ].map(({ num, txt }) => (
              <div key={txt} className="bookings-header__stat">
                <span className="stat-num">{num}</span>
                <span className="stat-txt">{txt}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="bookings-content">
        {/* Toolbar */}
        <div className="bookings-toolbar">
          <span className="bookings-toolbar__label">Trạng thái:</span>
          <div className="filter-tags">
            {filters.map((f) => (
              <button
                key={f.key}
                className={`filter-tag ${activeFilter === f.key ? "active" : ""}`}
                onClick={() => setActiveFilter(f.key)}
              >
                {f.label}
                {f.key !== "all" && statCounts[f.key] > 0 && (
                  <span style={{ marginLeft: 4, opacity: 0.7 }}>
                    ({statCounts[f.key as BookingStatus]})
                  </span>
                )}
              </button>
            ))}
          </div>
          <div className="bookings-toolbar__search">
            <Input
              prefix={<SearchOutlined style={{ color: "#d4a849" }} />}
              placeholder="Tìm khách sạn, mã đặt phòng..."
              value={searchQ}
              onChange={(e) => setSearchQ(e.target.value)}
              allowClear
            />
          </div>
        </div>

        {/* Booking list */}
        {isLoading ? (
          <div style={{ display: "flex", justifyContent: "center", padding: "80px 0" }}>
            <Spin size="large" />
          </div>
        ) : displayed.length === 0 ? (
          <div className="bookings-empty">
            <div className="empty-icon">
              <HistoryOutlined />
            </div>
            <h2>Không có đặt phòng nào</h2>
            <p>Hãy khám phá và đặt phòng khách sạn đầu tiên của bạn</p>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => navigate("/search")}
            >
              Tìm khách sạn ngay
            </Button>
          </div>
        ) : (
          displayed.map((booking) => (
            <div key={booking.id} className="booking-card">
              <div className="booking-card__inner">
                {/* Image */}
                <div className="booking-card__img">
                  <img src={booking.hotelImg} alt={booking.hotelName} />
                  <div className="img-overlay" />
                </div>

                {/* Info */}
                <div className="booking-card__info">
                  <div className="booking-card__top-row">
                    <div>
                      <h3 className="booking-card__hotel-name">
                        {booking.hotelName}
                      </h3>
                      <p className="booking-card__room">
                        <EnvironmentOutlined
                          style={{ marginRight: 4, fontSize: 12 }}
                        />
                        {booking.hotelLocation} · {booking.roomName}
                      </p>
                    </div>
                    <span className={`status-tag ${booking.status}`}>
                      {statusConfig[booking.status].label}
                    </span>
                  </div>

                  <div className="booking-card__meta-row">
                    <div className="booking-card__meta-item">
                      <span className="meta-label">
                        <CalendarOutlined style={{ marginRight: 4 }} />
                        Nhận phòng
                      </span>
                      <span className="meta-val">
                        {dayjs(booking.checkIn).format("DD/MM/YYYY")}
                      </span>
                    </div>
                    <div className="booking-card__meta-item">
                      <span className="meta-label">
                        <CalendarOutlined style={{ marginRight: 4 }} />
                        Trả phòng
                      </span>
                      <span className="meta-val">
                        {dayjs(booking.checkOut).format("DD/MM/YYYY")}
                      </span>
                    </div>
                    <div className="booking-card__meta-item">
                      <span className="meta-label">Số đêm</span>
                      <span className="meta-val">{booking.nights} đêm</span>
                    </div>
                    <div className="booking-card__meta-item">
                      <span className="meta-label">
                        <TeamOutlined style={{ marginRight: 4 }} />
                        Khách
                      </span>
                      <span className="meta-val">{booking.guests} người</span>
                    </div>
                  </div>

                  <div
                    style={{ display: "flex", alignItems: "center", gap: 12 }}
                  >
                    <span className="booking-card__code">
                      {booking.confirmationCode}
                    </span>
                    <span
                      style={{
                        fontFamily: "Inter, sans-serif",
                        fontSize: "0.75rem",
                        color: "#6b7280",
                      }}
                    >
                      Đặt ngày {dayjs(booking.bookedAt).format("DD/MM/YYYY")}
                    </span>
                  </div>
                </div>

                {/* Actions panel */}
                <div className="booking-card__actions">
                  <div className="booking-card__price">
                    <span className="price-total">
                      ${booking.total.toLocaleString()}
                    </span>
                    <span className="price-nights">
                      {booking.nights} đêm · đã gồm thuế
                    </span>
                  </div>

                  <div className="booking-card__btn-group">
                    <Button
                      icon={<EyeOutlined />}
                      block
                      onClick={() => setDetailTarget(booking)}
                    >
                      Chi tiết
                    </Button>

                    {(booking.status === "confirmed" ||
                      booking.status === "pending") && (
                      <>
                        <Button
                          icon={<EditOutlined />}
                          block
                          onClick={() => openModify(booking)}
                        >
                          Chỉnh sửa
                        </Button>
                        <Popconfirm
                          title="Hủy đặt phòng?"
                          description="Bạn sẽ được hoàn tiền 100% nếu hủy trước 48 giờ nhận phòng."
                          okText="Xác nhận hủy"
                          cancelText="Giữ lại"
                          okButtonProps={{ danger: true }}
                          onConfirm={() => handleCancel(booking.id)}
                          placement="topRight"
                        >
                          <Button danger icon={<CloseCircleOutlined />} block>
                            Hủy đặt phòng
                          </Button>
                        </Popconfirm>
                      </>
                    )}

                    {booking.status === "completed" && (
                      <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        block
                        onClick={() => navigate(`/hotel/${booking.hotelId}`)}
                      >
                        Đặt lại
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ── Modify modal ── */}
      <Modal
        open={!!modifyTarget}
        onCancel={() => setModifyTarget(null)}
        className="modify-modal"
        title="Chỉnh sửa đặt phòng"
        width={520}
        footer={[
          <Button key="cancel" onClick={() => setModifyTarget(null)}>
            Hủy bỏ
          </Button>,
          <Button
            key="save"
            type="primary"
            icon={<CheckCircleOutlined />}
            onClick={handleModifySave}
            disabled={!modifyDates?.[0] || !modifyDates?.[1]}
          >
            Lưu thay đổi
          </Button>,
        ]}
      >
        {modifyTarget && (
          <>
            <div className="modify-modal__hotel-row">
              <img src={modifyTarget.hotelImg} alt={modifyTarget.hotelName} />
              <div>
                <h4>{modifyTarget.hotelName}</h4>
                <p>
                  {modifyTarget.roomName} · {modifyTarget.roomSize}
                </p>
                <p style={{ marginTop: 4 }}>
                  <span className={`status-tag ${modifyTarget.status}`}>
                    {statusConfig[modifyTarget.status].label}
                  </span>
                </p>
              </div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <label className="modal-form-label">Thay đổi ngày lưu trú</label>
              <RangePicker
                value={modifyDates}
                onChange={(val) =>
                  setModifyDates(
                    val as [dayjs.Dayjs | null, dayjs.Dayjs | null],
                  )
                }
                format="DD/MM/YYYY"
                style={{ width: "100%" }}
                disabledDate={(d) => d.isBefore(dayjs(), "day")}
              />
            </div>

            <div style={{ marginBottom: 20 }}>
              <label className="modal-form-label">Số khách</label>
              <InputNumber
                min={1}
                max={10}
                value={modifyGuests}
                onChange={(v) => setModifyGuests(v || 1)}
                addonAfter="người lớn"
                style={{ width: "100%" }}
              />
            </div>

            <div className="modal-price-summary">
              <div className="row">
                <span>
                  ${modifyTarget.pricePerNight} × {modifyNights} đêm
                </span>
                <strong>
                  $
                  {(modifyTarget.pricePerNight * modifyNights).toLocaleString()}
                </strong>
              </div>
              <div className="row">
                <span>Thuế & phí (10%)</span>
                <strong>
                  ${Math.round(modifyTarget.pricePerNight * modifyNights * 0.1)}
                </strong>
              </div>
              <div className="total-row">
                <span>Tổng mới</span>
                <strong>${modifyTotal.toLocaleString()}</strong>
              </div>
            </div>
          </>
        )}
      </Modal>

      {/* ── Detail modal ── */}
      <Modal
        open={!!detailTarget}
        onCancel={() => setDetailTarget(null)}
        title={
          <span
            style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700 }}
          >
            Chi tiết đặt phòng
          </span>
        }
        width={540}
        footer={[
          <Button key="close" onClick={() => setDetailTarget(null)}>
            Đóng
          </Button>,
          detailTarget &&
            (detailTarget.status === "confirmed" ||
              detailTarget.status === "pending") && (
              <Button
                key="modify"
                type="primary"
                icon={<EditOutlined />}
                onClick={() => {
                  setDetailTarget(null);
                  openModify(detailTarget);
                }}
              >
                Chỉnh sửa
              </Button>
            ),
        ].filter(Boolean)}
      >
        {detailTarget && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div
              style={{
                display: "flex",
                gap: 14,
                padding: 16,
                borderRadius: 14,
                background: "#e8f0f7",
              }}
            >
              <img
                src={detailTarget.hotelImg}
                alt={detailTarget.hotelName}
                style={{
                  width: 80,
                  height: 64,
                  borderRadius: 10,
                  objectFit: "cover",
                  flexShrink: 0,
                }}
              />
              <div>
                <p
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontWeight: 700,
                    fontSize: "1rem",
                    margin: "0 0 4px",
                    color: "#0f1923",
                  }}
                >
                  {detailTarget.hotelName}
                </p>
                <p
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: "0.82rem",
                    color: "#6b7280",
                    margin: 0,
                  }}
                >
                  <EnvironmentOutlined style={{ marginRight: 4 }} />
                  {detailTarget.hotelLocation}
                </p>
                <p
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: "0.82rem",
                    color: "#6b7280",
                    margin: "2px 0 0",
                  }}
                >
                  {detailTarget.roomName}
                </p>
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 12,
              }}
            >
              {[
                {
                  label: "Mã xác nhận",
                  val: detailTarget.confirmationCode,
                  highlight: true,
                },
                {
                  label: "Trạng thái",
                  val: statusConfig[detailTarget.status].label,
                },
                {
                  label: "Nhận phòng",
                  val: dayjs(detailTarget.checkIn).format("DD/MM/YYYY"),
                },
                {
                  label: "Trả phòng",
                  val: dayjs(detailTarget.checkOut).format("DD/MM/YYYY"),
                },
                { label: "Số đêm", val: `${detailTarget.nights} đêm` },
                { label: "Số khách", val: `${detailTarget.guests} người` },
                {
                  label: "Giá mỗi đêm",
                  val: `$${detailTarget.pricePerNight.toLocaleString()}`,
                },
                {
                  label: "Đặt ngày",
                  val: dayjs(detailTarget.bookedAt).format("DD/MM/YYYY HH:mm"),
                },
              ].map(({ label, val, highlight }) => (
                <div
                  key={label}
                  style={{
                    padding: "10px 14px",
                    borderRadius: 10,
                    background: "#f8f7f4",
                    border: "1px solid rgba(15,25,35,0.07)",
                  }}
                >
                  <p
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontSize: "0.7rem",
                      fontWeight: 600,
                      color: "#6b7280",
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                      margin: "0 0 4px",
                    }}
                  >
                    {label}
                  </p>
                  <p
                    style={{
                      fontFamily: highlight
                        ? "Courier New, monospace"
                        : "'Playfair Display', serif",
                      fontSize: highlight ? "0.88rem" : "0.95rem",
                      fontWeight: 700,
                      color: highlight ? "#0b3d6b" : "#0f1923",
                      margin: 0,
                    }}
                  >
                    {val}
                  </p>
                </div>
              ))}
            </div>

            <div
              style={{
                padding: 16,
                borderRadius: 14,
                background: "#f8f7f4",
                border: "1px solid rgba(15,25,35,0.07)",
              }}
            >
              {[
                [
                  `$${detailTarget.pricePerNight} × ${detailTarget.nights} đêm`,
                  `$${detailTarget.subtotal.toLocaleString()}`,
                ],
                ["Thuế & phí (10%)", `$${detailTarget.tax.toLocaleString()}`],
              ].map(([l, v]) => (
                <div
                  key={l}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 8,
                    fontFamily: "Inter, sans-serif",
                    fontSize: "0.85rem",
                    color: "#6b7280",
                  }}
                >
                  <span>{l}</span>
                  <strong style={{ color: "#0f1923" }}>{v}</strong>
                </div>
              ))}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  borderTop: "1px solid rgba(15,25,35,0.1)",
                  paddingTop: 10,
                  marginTop: 4,
                }}
              >
                <span
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontWeight: 700,
                    fontSize: "0.9rem",
                    color: "#0f1923",
                  }}
                >
                  Tổng
                </span>
                <strong
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "1.15rem",
                    fontWeight: 700,
                    color: "#0b3d6b",
                  }}
                >
                  ${detailTarget.total.toLocaleString()}
                </strong>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
