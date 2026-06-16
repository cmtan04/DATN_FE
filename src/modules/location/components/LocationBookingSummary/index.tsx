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
import { useMemo, useState } from "react";
import type { LocationDetail } from "../../types";
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

  const canBook = Boolean(!isOwner && dates?.[0] && dates?.[1]);
  const priceUnit = location.priceUnit.split("/").at(1);
  const moneyUnit = location.priceUnit.split("/").at(0) || "VND";
  const formatMoney = (value: number) =>
    `${value.toLocaleString()} ${moneyUnit}`;

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

        <div className="widgetField">
          <label htmlFor="location-booking-dates">Ngay luu tru</label>
          <RangePicker
            id="location-booking-dates"
            placeholder={["Nhan phong", "Tra phong"]}
            format="DD/MM/YYYY"
            value={dates}
            onChange={(value) => setDates(value as BookingDateRange)}
            disabledDate={(current) =>
              Boolean(current && current < dayjs().startOf("day"))
            }
          />
        </div>
        <Button className="checkAvailabilityBtn" type="default" block>
          Kiểm tra
        </Button>

        <Row
          gutter={16}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
          }}
        >
          <Col span={12}>
            <div className="widgetField">
              <label htmlFor="location-booking-rooms">So phong</label>
              <InputNumber
                id="location-booking-rooms"
                min={1}
                precision={0}
                value={rooms}
                onChange={(value) => setRooms(Number(value) || 1)}
              />
            </div>
          </Col>
        </Row>

        {dates?.[0] && dates?.[1] ? (
          <div className="widgetSummary">
            <div className="row">
              <span>
                {formatMoney(location.price)} x {pricing.nights} {priceUnit} x{" "}
                {rooms} phòng
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
        ) : null}

        <Tooltip
          title={isOwner ? "Chu phong khong the dat phong cua minh" : ""}
        >
          <Button
            type="primary"
            block
            size="large"
            disabled={!canBook}
            onClick={onOpenBooking}
          >
            Dat ngay
          </Button>
        </Tooltip>

        <Space align="start" className="cancelNote">
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
