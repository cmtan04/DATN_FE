import { Button, Card, Empty, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import { ROUTER_PATH } from "@app/router/routes";
import "./style.scss";

const toAbsolutePath = (path: string) =>
  path.startsWith("/") ? path : `/${path}`;

export const UserBookingsPage = () => {
  const navigate = useNavigate();
  const locationsPath = toAbsolutePath(ROUTER_PATH.LOCATIONS);

  return (
    <main className="user-bookings">
      <Typography.Title level={1}>Lich su booking</Typography.Title>
      <Card className="user-bookings__card">
        <Empty
          description="Lich su booking chua co du lieu tu API."
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        >
          <Button type="primary" onClick={() => navigate(locationsPath)}>
            Ve danh sach phong
          </Button>
        </Empty>
      </Card>
    </main>
  );
};
