import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { Alert, App, Button, Card, Descriptions, QRCode, Result, Spin, Typography } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { ROUTER_PATH } from "@app/router/routes";
import { getPaymentErrorMessage } from "../../utils/paymentErrors";
import { usePaymentCheckUpdate } from "../../hooks/usePaymentCheckUpdate";
import { BOOKING_STATUS, PAYMENT_STATUS } from "../../types";
import type { PaymentCheckUpdateResponse } from "../../types";
import { simulatePaymentSuccess } from "../../api/payment.api";
import "./style.scss";

const toAbsolutePath = (path: string) =>
  path.startsWith("/") ? path : `/${path}`;

const formatCurrency = (amount: number, currency: string) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: currency.toUpperCase(),
    maximumFractionDigits: 0,
  }).format(amount);

const getResultCopy = (payment: PaymentCheckUpdateResponse) => {
  if (
    payment.paymentStatus === PAYMENT_STATUS.PAID &&
    payment.bookingStatus === BOOKING_STATUS.CONFIRMED
  ) {
    return {
      status: "success" as const,
      icon: <CheckCircleOutlined />,
      title: "Thanh toan thanh cong",
      subTitle: "Booking cua ban da duoc xac nhan.",
    };
  }

  if (payment.paymentStatus === PAYMENT_STATUS.UNPAID) {
    return {
      status: "info" as const,
      icon: <ClockCircleOutlined />,
      title: "Thanh toan dang cho",
      subTitle: "Giao dich chua hoan tat. Ban co the mo lai cong thanh toan.",
    };
  }

  if (payment.paymentStatus === PAYMENT_STATUS.CANCELLED) {
    return {
      status: "warning" as const,
      icon: <CloseCircleOutlined />,
      title: "Thanh toan da huy",
      subTitle: "Booking lien quan da duoc huy theo giao dich nay.",
    };
  }

  if (payment.paymentStatus === PAYMENT_STATUS.EXPIRED) {
    return {
      status: "warning" as const,
      icon: <ExclamationCircleOutlined />,
      title: "Thanh toan da het han",
      subTitle: "Lien ket thanh toan khong con hieu luc.",
    };
  }

  if (payment.paymentStatus === PAYMENT_STATUS.FAILED) {
    return {
      status: "error" as const,
      icon: <CloseCircleOutlined />,
      title: "Thanh toan that bai",
      subTitle: "Khong the hoan tat giao dich thanh toan.",
    };
  }

  return {
    status: "info" as const,
    icon: <ClockCircleOutlined />,
    title: "Trang thai thanh toan",
    subTitle: "He thong da ghi nhan trang thai moi nhat cua giao dich.",
  };
};

export const PaymentCheckoutResult = () => {
  const { token } = useParams();
  const { message } = App.useApp();
  const navigate = useNavigate();
  const { data, error, isError, isFetching, refetch } =
    usePaymentCheckUpdate(token);
  const locationsPath = toAbsolutePath(ROUTER_PATH.LOCATIONS);
  const userBookingsPath = toAbsolutePath(ROUTER_PATH.USER_BOOKINGS);

  const simulateMutation = useMutation({
    mutationFn: () => simulatePaymentSuccess(token ?? ""),
  });

  const handleSimulateSuccess = async () => {
    try {
      await simulateMutation.mutateAsync();
      message.success("Giả lập thanh toán thành công!");
      void refetch();
    } catch (err) {
      message.error(getPaymentErrorMessage(err));
    }
  };

  const openCheckout = (checkoutUrl?: string | null) => {
    if (!checkoutUrl) return;

    window.location.assign(checkoutUrl);
  };

  if (!token) {
    return (
      <main className="payment-result">
        <Result
          status="404"
          title="Khong tim thay giao dich"
          subTitle="Duong dan thanh toan khong hop le."
          extra={
            <Button type="primary" onClick={() => navigate(locationsPath)}>
              Ve danh sach phong
            </Button>
          }
        />
      </main>
    );
  }

  if (isFetching && !data) {
    return (
      <main className="payment-result">
        <div className="payment-result__state">
          <Spin />
        </div>
      </main>
    );
  }

  if (isError) {
    return (
      <main className="payment-result">
        <Result
          status="error"
          title="Khong the kiem tra thanh toan"
          subTitle={getPaymentErrorMessage(error)}
          extra={[
            <Button
              key="retry"
              icon={<ReloadOutlined />}
              type="primary"
              loading={isFetching}
              onClick={() => void refetch()}
            >
              Thu lai
            </Button>,
            <Button key="locations" onClick={() => navigate(locationsPath)}>
              Ve danh sach phong
            </Button>,
          ]}
        />
      </main>
    );
  }

  if (!data) {
    return (
      <main className="payment-result">
        <Result
          status="info"
          title="Chua co du lieu thanh toan"
          extra={
            <Button type="primary" onClick={() => navigate(locationsPath)}>
              Ve danh sach phong
            </Button>
          }
        />
      </main>
    );
  }

  const resultCopy = getResultCopy(data);
  const canResumeCheckout = Boolean(
    data.checkoutUrl && data.paymentStatus === PAYMENT_STATUS.UNPAID,
  );

  return (
    <main className="payment-result">
      <Card className="payment-result__card">
        <Result
          status={resultCopy.status}
          icon={resultCopy.icon}
          title={resultCopy.title}
          subTitle={resultCopy.subTitle}
          extra={[
            canResumeCheckout ? (
              <Button
                key="checkout"
                type="primary"
                onClick={() => openCheckout(data.checkoutUrl)}
              >
                Mo lai thanh toan
              </Button>
            ) : null,
            <Button key="bookings" onClick={() => navigate(userBookingsPath)}>
              Lich su booking
            </Button>,
            <Button key="locations" onClick={() => navigate(locationsPath)}>
              Ve danh sach phong
            </Button>,
          ].filter(Boolean)}
        />

        <Descriptions
          bordered
          column={1}
          size="small"
          className="payment-result__details"
          items={[
            {
              key: "bookingId",
              label: "Ma booking",
              children: `#${data.bookingId}`,
            },
            {
              key: "paymentId",
              label: "Ma thanh toan",
              children: `#${data.paymentId}`,
            },
            {
              key: "amount",
              label: "So tien",
              children: formatCurrency(data.amount, data.currency),
            },
            {
              key: "bookingStatus",
              label: "Trang thai booking",
              children: data.bookingStatus,
            },
            {
              key: "paymentStatus",
              label: "Trang thai thanh toan",
              children: data.paymentStatus,
            },
          ]}
        />

        {data.paymentStatus === PAYMENT_STATUS.UNPAID && (
          <div
            className="payment-result__qr-section"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginTop: 24,
              padding: "24px 0",
              borderTop: "1px solid #f0f0f0",
            }}
          >
            <Typography.Title level={4} style={{ marginBottom: 16 }}>
              Mã QR Thanh Toán (payOS Simulation)
            </Typography.Title>
            <QRCode
              value={`2|99|0901234567|CONG TY DAT PHONG||0|0|${data.amount}|Booking ${data.bookingId}|`}
              size={220}
              status={simulateMutation.isPending ? "loading" : "active"}
            />
            <div style={{ marginTop: 20, width: "100%", maxWidth: 400 }}>
              <Descriptions column={1} size="small" bordered>
                <Descriptions.Item label="Ngân hàng">MB Bank (Simulated)</Descriptions.Item>
                <Descriptions.Item label="Số tài khoản">123456789</Descriptions.Item>
                <Descriptions.Item label="Chủ tài khoản">CONG TY DAT PHONG</Descriptions.Item>
                <Descriptions.Item label="Số tiền">{formatCurrency(data.amount, data.currency)}</Descriptions.Item>
                <Descriptions.Item label="Nội dung">{`Booking ${data.bookingId}`}</Descriptions.Item>
              </Descriptions>
            </div>
            <Button
              type="primary"
              style={{
                marginTop: 20,
                backgroundColor: "#52c41a",
                borderColor: "#52c41a",
              }}
              loading={simulateMutation.isPending}
              onClick={handleSimulateSuccess}
            >
              Giả lập thanh toán thành công
            </Button>
          </div>
        )}

        {data.paymentStatus === PAYMENT_STATUS.UNPAID && !data.checkoutUrl ? (
          <Alert
            showIcon
            type="warning"
            message="Giao dich chua co lien ket thanh toan de mo lai."
            className="payment-result__alert"
          />
        ) : null}
      </Card>
    </main>
  );
};
