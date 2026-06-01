import {
  ArrowLeftOutlined,
  CalendarOutlined,
  EnvironmentOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  App as AntdApp,
  Alert,
  Button,
  Card,
  DatePicker,
  Descriptions,
  Form,
  Input,
  Result,
  Space,
  Spin,
  Typography,
} from "antd";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { useNavigate, useParams } from "react-router-dom";
import { ROUTER_PATH } from "@app/router/routes";
import { useAuth } from "@app/providers/useAuth";
import { useLocationDetail } from "../../hooks/useLocationDetail";
import {
  formatLocationArea,
  formatLocationPrice,
} from "../../utils/locationDetailFormatters";
import "./style.scss";

type LocationBookingFormValues = {
  visitDate: Dayjs;
  note?: string;
};

const toAbsolutePath = (path: string) =>
  path.startsWith("/") ? path : `/${path}`;

export const LocationBooking = () => {
  const { message } = AntdApp.useApp();
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    data,
    errorMessage,
    isError,
    isLoading,
    isOwner,
    primaryAddress,
    refetch,
  } = useLocationDetail(id, { includeSimilar: false });

  const detailPath = toAbsolutePath(
    id ? ROUTER_PATH.LOCATION_DETAIL.replace(":id", id) : ROUTER_PATH.LOCATIONS,
  );
  const locationsPath = toAbsolutePath(ROUTER_PATH.LOCATIONS);

  const handleBackToDetail = () => {
    navigate(detailPath);
  };

  const handleSubmit = () => {
    message.success("Đã ghi nhận yêu cầu đặt phòng.");
    navigate(detailPath);
  };

  if (!id) {
    return (
      <main className="location-booking">
        <Result
          status="404"
          title="Khong tim thay phong"
          extra={
            <Button type="primary" onClick={() => navigate(locationsPath)}>
              Quay lai danh sach
            </Button>
          }
        />
      </main>
    );
  }

  if (isLoading) {
    return (
      <main className="location-booking">
        <div className="location-booking__state">
          <Spin />
        </div>
      </main>
    );
  }

  if (isError) {
    return (
      <main className="location-booking">
        <Result
          status="error"
          title="Khong the tai thong tin phong"
          subTitle={errorMessage}
          extra={[
            <Button key="retry" type="primary" onClick={() => void refetch()}>
              Thu lai
            </Button>,
            <Button key="back" onClick={() => navigate(locationsPath)}>
              Quay lai danh sach
            </Button>,
          ]}
        />
      </main>
    );
  }

  if (!data) {
    return (
      <main className="location-booking">
        <Result
          status="info"
          title="Chua co du lieu phong"
          extra={
            <Button type="primary" onClick={() => navigate(locationsPath)}>
              Quay lai danh sach
            </Button>
          }
        />
      </main>
    );
  }

  return (
    <main className="location-booking">
      <Button icon={<ArrowLeftOutlined />} onClick={handleBackToDetail}>
        Quay lai chi tiet
      </Button>

      <div className="location-booking__layout">
        <section className="location-booking__content">
          <Typography.Title level={1}>Đặt phòng</Typography.Title>
          <Typography.Paragraph>
            Gui lich mong muon de chu phong lien he xac nhan tinh trang phong.
          </Typography.Paragraph>

          {isOwner ? (
            <Alert
              showIcon
              type="warning"
              message="Chu phong khong the dat phong cua minh."
              className="location-booking__alert"
            />
          ) : null}

          <Card title="Thong tin dat phong" className="location-booking__card">
            <Form<LocationBookingFormValues>
              layout="vertical"
              onFinish={handleSubmit}
              disabled={isOwner}
            >
              <Form.Item
                name="visitDate"
                label="Ngay muon xem/nhan phong"
                rules={[
                  {
                    required: true,
                    message: "Vui long chon ngay muon xem/nhan phong.",
                  },
                ]}
              >
                <DatePicker
                  className="location-booking__date-picker"
                  format="DD/MM/YYYY"
                  placeholder="Chon ngay"
                  disabledDate={(current) =>
                    Boolean(current && current < dayjs().startOf("day"))
                  }
                />
              </Form.Item>

              <Form.Item name="note" label="Ghi chu">
                <Input.TextArea
                  rows={5}
                  maxLength={500}
                  showCount
                  placeholder="Ghi chu them ve thoi gian lien he hoac nhu cau cua ban"
                />
              </Form.Item>

              <Space className="location-booking__actions">
                <Button onClick={handleBackToDetail}>Huy</Button>
                <Button type="primary" htmlType="submit" disabled={isOwner}>
                  Gửi yêu cầu đặt phòng
                </Button>
              </Space>
            </Form>
          </Card>
        </section>

        <aside className="location-booking__summary">
          <Card title="Phong dang dat" className="location-booking__card">
            <Space direction="vertical" size={14} className="location-booking__room">
              <Typography.Title level={2}>{data.name}</Typography.Title>
              <Typography.Text className="location-booking__price">
                {formatLocationPrice(data.price, data.priceUnit)}
              </Typography.Text>
              {primaryAddress?.fullAddress ? (
                <p>
                  <EnvironmentOutlined /> {primaryAddress.fullAddress}
                </p>
              ) : null}
            </Space>
            <Descriptions
              column={1}
              size="small"
              items={[
                {
                  key: "type",
                  label: "Loai hinh",
                  children: data.type?.name ?? "Chua cap nhat",
                },
                {
                  key: "area",
                  label: "Dien tich",
                  children: formatLocationArea(data.area),
                },
                {
                  key: "owner",
                  label: "Chu so huu",
                  children: data.owner?.fullName ?? "Chua cap nhat",
                },
              ]}
            />
          </Card>

          <Alert
            showIcon
            type="info"
            icon={<CalendarOutlined />}
            message="Yeu cau nay chua tao don dat phong tren he thong."
            description="Backend booking se duoc ket noi sau khi co endpoint chinh thuc."
          />

          {user ? (
            <Card className="location-booking__card">
              <Space>
                <UserOutlined />
                <span>{user.fullName ?? user.email ?? "Tai khoan cua ban"}</span>
              </Space>
            </Card>
          ) : null}
        </aside>
      </div>
    </main>
  );
};
