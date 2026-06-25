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
  InputNumber,
  Result,
  Space,
  Spin,
  Typography,
} from "antd";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ROUTER_PATH } from "@app/router/routes";
import { useAuth } from "@/modules/auth/hooks/useAuth";
import { getPaymentErrorMessage, useCreateCheckout } from "@modules/payment";
import { useLocationDetail } from "../../hooks/useLocationDetail";
import {
  formatLocationArea,
  formatLocationPrice,
} from "../../utils/locationDetailFormatters";
import "./style.scss";

type LocationBookingFormValues = {
  dateRange: [Dayjs, Dayjs];
  guestCount: number;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  note?: string;
};

const toAbsolutePath = (path: string) =>
  path.startsWith("/") ? path : `/${path}`;

const getUserFullName = (
  user: ReturnType<typeof useAuth>["user"],
): string | undefined => user?.profile?.fullName;

const getUserPhoneNumber = (
  user: ReturnType<typeof useAuth>["user"],
): string | undefined => user?.profile?.phoneNumber;

export const LocationBooking = () => {
  const { message } = AntdApp.useApp();
  const [form] = Form.useForm<LocationBookingFormValues>();
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const checkoutMutation = useCreateCheckout();
  const { location, errorMessage, isError, isLoading, isOwner, refetch } =
    useLocationDetail(id, { includeSimilar: false });

  const detailPath = toAbsolutePath(
    id ? ROUTER_PATH.LOCATION_DETAIL.replace(":id", id) : ROUTER_PATH.LOCATIONS,
  );
  const locationsPath = toAbsolutePath(ROUTER_PATH.LOCATIONS);

  useEffect(() => {
    form.setFieldsValue({
      contactName: getUserFullName(user),
      contactPhone: getUserPhoneNumber(user),
      contactEmail: user?.email,
      guestCount: 1,
    });
  }, [form, user]);

  const handleBackToDetail = () => {
    navigate(detailPath);
  };

  const handleSubmit = async (values: LocationBookingFormValues) => {
    if (!location?.id) {
      message.error("Khong tim thay phong can thanh toan.");
      return;
    }

    const [startDate, endDate] = values.dateRange;

    try {
      const checkout = await checkoutMutation.mutateAsync({
        locationId: location.id,
        startDate: startDate.format("YYYY-MM-DD"),
        endDate: endDate.format("YYYY-MM-DD"),
        guestCount: values.guestCount,
        contactName: values.contactName.trim(),
        contactPhone: values.contactPhone.trim(),
        contactEmail: values.contactEmail.trim(),
        note: values.note?.trim() || undefined,
      });

      window.location.assign(checkout.checkoutUrl);
    } catch (error) {
      message.error(getPaymentErrorMessage(error));
    }
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

  if (!location) {
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
          <Typography.Title level={1}>Dat phong</Typography.Title>
          <Typography.Paragraph>
            Chon thoi gian luu tru va thong tin lien he de thanh toan qua payOS.
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
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              disabled={isOwner || checkoutMutation.isPending}
            >
              <Form.Item
                name="dateRange"
                label="Thoi gian dat phong"
                rules={[
                  {
                    required: true,
                    message: "Vui long chon thoi gian dat phong.",
                  },
                ]}
              >
                <DatePicker.RangePicker
                  className="location-booking__date-picker"
                  format="DD/MM/YYYY"
                  placeholder={["Ngay bat dau", "Ngay ket thuc"]}
                  disabledDate={(current) =>
                    Boolean(current && current < dayjs().startOf("day"))
                  }
                />
              </Form.Item>

              <Form.Item
                name="guestCount"
                label="So luong khach"
                rules={[
                  {
                    required: true,
                    message: "Vui long nhap so luong khach.",
                  },
                ]}
              >
                <InputNumber
                  className="location-booking__number"
                  min={1}
                  max={99}
                  precision={0}
                  placeholder="So khach"
                />
              </Form.Item>

              <Form.Item
                name="contactName"
                label="Ho ten lien he"
                rules={[
                  {
                    required: true,
                    whitespace: true,
                    message: "Vui long nhap ho ten lien he.",
                  },
                  {
                    max: 255,
                    message: "Ho ten lien he khong duoc vuot qua 255 ky tu.",
                  },
                ]}
              >
                <Input placeholder="Ho ten cua ban" />
              </Form.Item>

              <Form.Item
                name="contactPhone"
                label="So dien thoai"
                rules={[
                  {
                    required: true,
                    whitespace: true,
                    message: "Vui long nhap so dien thoai.",
                  },
                  {
                    max: 50,
                    message: "So dien thoai khong duoc vuot qua 50 ky tu.",
                  },
                ]}
              >
                <Input placeholder="So dien thoai lien he" />
              </Form.Item>

              <Form.Item
                name="contactEmail"
                label="Email"
                rules={[
                  {
                    required: true,
                    whitespace: true,
                    message: "Vui long nhap email lien he.",
                  },
                  {
                    type: "email",
                    message: "Email lien he khong hop le.",
                  },
                  {
                    max: 255,
                    message: "Email khong duoc vuot qua 255 ky tu.",
                  },
                ]}
              >
                <Input placeholder="Email lien he" />
              </Form.Item>

              <Form.Item
                name="note"
                label="Ghi chu"
                rules={[
                  {
                    max: 2000,
                    message: "Ghi chu khong duoc vuot qua 2000 ky tu.",
                  },
                ]}
              >
                <Input.TextArea
                  rows={5}
                  maxLength={2000}
                  showCount
                  placeholder="Ghi chu them ve thoi gian lien he hoac nhu cau cua ban"
                />
              </Form.Item>

              <Space className="location-booking__actions">
                <Button onClick={handleBackToDetail}>Huy</Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  disabled={isOwner}
                  loading={checkoutMutation.isPending}
                >
                  Thanh toan qua payOS
                </Button>
              </Space>
            </Form>
          </Card>
        </section>

        <aside className="location-booking__summary">
          <Card title="Phong dang dat" className="location-booking__card">
            <Space
              direction="vertical"
              size={14}
              className="location-booking__room"
            >
              <Typography.Title level={2}>{location.name}</Typography.Title>
              <Typography.Text className="location-booking__price">
                {formatLocationPrice(location.price, location.priceUnit)}
              </Typography.Text>
              {location.address?.fullAddress ? (
                <p>
                  <EnvironmentOutlined /> {location.address.fullAddress}
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
                  children: location.type?.name ?? "Chua cap nhat",
                },
                {
                  key: "area",
                  label: "Dien tich",
                  children: formatLocationArea(location.area),
                },
                {
                  key: "owner",
                  label: "Chu so huu",
                  children: location.owner?.fullName ?? "Chua cap nhat",
                },
              ]}
            />
          </Card>

          <Alert
            showIcon
            type="info"
            icon={<CalendarOutlined />}
            message="Tong tien se duoc xac nhan o buoc thanh toan."
            description="Gia hien tai chi la thong tin tham khao theo phong dang chon."
          />

          {user ? (
            <Card className="location-booking__card">
              <Space>
                <UserOutlined />
                <span>{getUserFullName(user) ?? user.email}</span>
              </Space>
            </Card>
          ) : null}
        </aside>
      </div>
    </main>
  );
};
