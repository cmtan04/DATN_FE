import { CheckCircleFilled } from "@ant-design/icons";
import {
  Button,
  Card,
  DatePicker,
  Flex,
  InputNumber,
  Row,
  Col,
  Space,
  Tooltip,
  Typography,
} from "antd";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { useEffect, useMemo, useState } from "react";
import type { LocationDetail } from "../../types";
import { getAvailableRooms } from "../../api/location.api";
import "./styles.scss";

interface LocationBookingSummaryProps {
  isOwner: boolean;
  location: LocationDetail;
  onOpenBooking: () => void;
}

type BookingDateRange = [Dayjs | null, Dayjs | null] | null;

const { Text } = Typography;
const { RangePicker } = DatePicker;

export const LocationBookingSummary = ({
  isOwner,
  location,
  onOpenBooking,
}: LocationBookingSummaryProps) => {
  const [dates, setDates] = useState<BookingDateRange>(null);
  const [rooms, setRooms] = useState(1);
  const [availableRooms, setAvailableRooms] = useState(0);
  // 1. Thêm flag kiểm soát xem người dùng đã bấm nút "Kiểm tra" hay chưa
  const [isSearched, setIsSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const pricing = useMemo(() => {
    const [startDate, endDate] = dates ?? [];
    const nights =
      startDate && endDate ? Math.max(endDate.diff(startDate, "day"), 1) : 0;
    const subtotal = location.price * nights * rooms;
    const tax = Math.round(subtotal * 0.1);

    return {
      nights,
      subtotal,
      tax,
      total: subtotal + tax,
    };
  }, [dates, location.price, rooms]);

  const canBook = Boolean(
    !isOwner && dates?.[0] && dates?.[1] && isSearched && availableRooms > 0,
  );
  const priceUnit = location.priceUnit.split("/").at(1);
  const moneyUnit = location.priceUnit.split("/").at(0) || "VND";
  const formatMoney = (value: number) =>
    `${value.toLocaleString()} ${moneyUnit}`;

  // 2. Hàm xử lý khi bấm nút "Kiểm tra"
  const handleCheckAvailability = async () => {
    if (!dates?.[0] || !dates?.[1]) return;

    setLoading(true);
    try {
      const params = {
        locationId: location.id,
        startDate: dates[0].format("YYYY-MM-DD"),
        endDate: dates[1].format("YYYY-MM-DD"),
      };

      const roomsResult = await getAvailableRooms(params);
      setAvailableRooms(roomsResult);
      setIsSearched(true); // Đánh dấu đã check thành công để mở khóa các ô tiếp theo
    } catch (error) {
      console.error("Lỗi kiểm tra phòng trống:", error);
    } finally {
      setLoading(false);
    }
  };

  // 3. Reset trạng thái tìm kiếm nếu người dùng thay đổi lại ngày tháng
  useEffect(() => {
    setIsSearched(false);
    setAvailableRooms(0);
    setRooms(1); // Reset lại số phòng về 1
  }, [dates]);

  return (
    <Card className="widget">
      <Flex vertical className="widgetBody">
        <div className="widgetPrice">
          <Text className="main" strong>
            {location.price.toLocaleString()}
          </Text>
          <Text className="per" type="secondary">
            <span> </span>
            {location.priceUnit}
          </Text>
        </div>

        <div className="dateField">
          <label htmlFor="location-booking-dates">Ngày lưu trú</label>
          <RangePicker
            id="location-booking-dates"
            placeholder={["Nhận phòng", "Trả phòng"]}
            format="DD/MM/YYYY"
            value={dates}
            onChange={(value) => setDates(value as BookingDateRange)}
            disabledDate={(current) =>
              Boolean(current && current < dayjs().startOf("day"))
            }
          />
        </div>

        {/* Nút kiểm tra phòng */}
        <Button
          className="checkAvailabilityBtn"
          type="primary" // Đổi sang primary nhìn cho nổi bật kích thích click
          block
          loading={loading}
          onClick={handleCheckAvailability}
          disabled={!dates?.[0] || !dates?.[1]}
        >
          Kiểm tra phòng trống
        </Button>

        {/* 4. LUỒNG THAY ĐỔI: Chỉ khi đã bấm kiểm tra mới hiển thị đống bên dưới */}
        {isSearched && (
          <>
            <Text
              type={availableRooms > 0 ? "success" : "danger"}
              className="availableRooms"
              style={{ marginTop: 8 }}
            >
              {availableRooms > 0
                ? `Số lượng phòng còn trống: ${availableRooms} `
                : "Rất tiếc, khoảng thời gian này đã hết phòng trống!"}
            </Text>

            {availableRooms > 0 && (
              <>
                {/* Hiện ô chọn số phòng và giới hạn max chính bằng số phòng còn trống */}
                <Row gutter={16}>
                  <Col span={24}>
                    <div className="widgetField">
                      <label htmlFor="location-booking-rooms">
                        Số lượng phòng muốn đặt:
                      </label>
                      <InputNumber
                        id="location-booking-rooms"
                        min={1}
                        max={availableRooms} // 👈 Khóa không cho chọn quá số phòng đang trống
                        precision={0}
                        value={rooms}
                        onChange={(value) => setRooms(Number(value) || 1)}
                      />
                    </div>
                  </Col>
                </Row>

                {/* Tính toán hiển thị cập nhật tổng tiền tương ứng theo số phòng */}
                <div className="widgetSummary">
                  <div className="row">
                    <span>
                      {formatMoney(location.price)} x {pricing.nights}{" "}
                      {priceUnit} x {rooms} phòng
                    </span>
                    <strong>{formatMoney(pricing.subtotal)}</strong>
                  </div>

                  <div className="row">
                    <span>Thuế (10%)</span>
                    <strong>{formatMoney(pricing.tax)}</strong>
                  </div>

                  <div className="total">
                    <span>Tổng cộng</span>
                    <strong>{formatMoney(pricing.total)}</strong>
                  </div>
                </div>
              </>
            )}
            <Tooltip
              title={
                isOwner
                  ? "Chủ phòng không thể đặt phòng của mình"
                  : isSearched && availableRooms === 0
                    ? "Không còn phòng trống để đặt"
                    : ""
              }
            >
              <Button
                type="primary"
                block
                size="large"
                style={{ marginTop: 12 }}
                disabled={!canBook}
                onClick={onOpenBooking}
              >
                Đặt ngay
              </Button>
            </Tooltip>
          </>
        )}

        <Space align="start" className="cancelNote" style={{ marginTop: 12 }}>
          <CheckCircleFilled className="icon" />
          <p>
            Miễn phí hủy phòng trước <strong>48 giờ</strong> nhận phòng - hoàn
            tiền 100%.
          </p>
        </Space>
      </Flex>
    </Card>
  );
};
