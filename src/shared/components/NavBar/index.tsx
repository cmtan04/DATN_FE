import { useMemo } from "react";
import {
  Avatar,
  Badge,
  Button,
  Dropdown,
  Empty,
  List,
  Popover,
  Space,
  Typography,
  type MenuProps,
} from "antd";
import {
  BellOutlined,
  GlobalOutlined,
  HeartOutlined,
  HistoryOutlined,
  IdcardOutlined,
  LogoutOutlined,
  UserAddOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { NavLink, useNavigate } from "react-router-dom";
import "./style.scss";
import { ROUTER_PATH } from "@/app/router/routes";
import { useAuth } from "@/modules/auth/hooks/useAuth";
import {
  useMarkNotificationRead,
  useNotifications,
} from "@/modules/user/hooks/useNotifications";

export function NavBar() {
  const navigate = useNavigate();
  const { user, isAuthenticated, signOut } = useAuth();
  const notificationsQuery = useNotifications(isAuthenticated);
  const markNotificationRead = useMarkNotificationRead();

  const profile = user?.profile;
  const displayName = profile?.fullName ?? user?.email ?? "Tai khoan";
  const avatarUrl = profile?.avatarUrl;
  const avatarText = displayName.trim().charAt(0).toUpperCase() || "U";
  const notifications = notificationsQuery.data ?? [];
  const unreadNotificationCount = notifications.filter(
    (item) => !item.isRead,
  ).length;

  const navLinks = useMemo(
    () => [
      { key: ROUTER_PATH.LOCATIONS, label: "Kham pha" },
      { key: ROUTER_PATH.MAP, label: "Ban do" },
      { key: ROUTER_PATH.CHAT, label: "Tin nhan" },
      { key: ROUTER_PATH.USER_PROFILE, label: "Ho so" },
    ],
    [],
  );

  const accountMenuItems: MenuProps["items"] = useMemo(
    () => [
      {
        key: "profile",
        label: (
          <div style={{ padding: "4px 0" }}>
            <div
              style={{
                fontFamily: "Inter, sans-serif",
                fontWeight: 600,
                fontSize: "0.9rem",
                color: "#0f1923",
              }}
            >
              {displayName}
            </div>
            <div
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "0.78rem",
                color: "#6b7280",
              }}
            >
              {user?.email ?? "Email khong xac dinh"}
            </div>
          </div>
        ),
        disabled: true,
      },
      { type: "divider" },
      {
        key: ROUTER_PATH.USER_PROFILE,
        icon: <UserOutlined />,
        label: "Thông tin cá nhân",
      },
      {
        key: ROUTER_PATH.USER_BOOKINGS,
        icon: <HistoryOutlined />,
        label: "Lịch sử đặt phòng",
      },
      {
        key: ROUTER_PATH.USER_FAVORITES,
        icon: <HeartOutlined />,
        label: "Danh sách yêu thích",
      },
      { type: "divider" },
      {
        key: "sign-out",
        danger: true,
        icon: <LogoutOutlined />,
        label: "Đăng xuất",
      },
    ],
    [displayName, user?.email],
  );

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  const handleNotificationClick = (notificationId: number) => {
    markNotificationRead.mutate(notificationId);
  };

  const handleAccountMenuClick: MenuProps["onClick"] = ({ key }) => {
    if (key === "sign-out") {
      signOut();
      navigate(ROUTER_PATH.HOME);
      return;
    }

    navigate(key);
  };

  const notificationContent = (
    <div className="navbarNotifications">
      {notifications.length ? (
        <List
          dataSource={notifications}
          renderItem={(item) => (
            <List.Item
              className={item.isRead ? undefined : "navbarNotificationUnread"}
              onClick={() => handleNotificationClick(item.id)}
            >
              <List.Item.Meta
                title={item.title}
                description={
                  <Space direction="vertical" size={2}>
                    <Typography.Text>{item.message}</Typography.Text>
                    <Typography.Text type="secondary">
                      {new Date(item.createdAt).toLocaleString("vi-VN")}
                    </Typography.Text>
                  </Space>
                }
              />
            </List.Item>
          )}
        />
      ) : (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="Chua co thong bao."
        />
      )}
    </div>
  );

  const authenticatedActions = (
    <>
      <Popover
        content={notificationContent}
        title="Thong bao"
        trigger="click"
        placement="bottomRight"
      >
        <Button
          type="text"
          shape="circle"
          className="notificationButton"
          aria-label="Thong bao"
        >
          <Badge count={unreadNotificationCount} size="small" offset={[-2, 2]}>
            <BellOutlined />
          </Badge>
        </Button>
      </Popover>

      <Dropdown
        menu={{ items: accountMenuItems, onClick: handleAccountMenuClick }}
        placement="bottom"
        arrow
        align={{ offset: [0, 20] }}
        trigger={["click"]}
        getPopupContainer={(triggerNode) =>
          triggerNode.parentElement ?? triggerNode
        }
      >
        <button type="button" className="avatarTrigger" aria-label="Tai khoan">
          <Avatar src={avatarUrl} icon={!avatarUrl ? <UserOutlined /> : null}>
            {!avatarUrl ? avatarText : null}
          </Avatar>
        </button>
      </Dropdown>
    </>
  );

  return (
    <header className="navbar">
      <div className="inner">
        <NavLink to={ROUTER_PATH.HOME} className="logo">
          <div className="logoIcon">
            <GlobalOutlined />
          </div>
          <span className="logoText">Hostings</span>
        </NavLink>

        <nav>
          <ul className="navMenu">
            {navLinks.map((link) => (
              <li key={link.key}>
                <NavLink to={link.key} end>
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <Space className="actions" size={8}>
          {isAuthenticated ? (
            authenticatedActions
          ) : (
            <>
              <Button
                block
                type="primary"
                onClick={() => handleNavigate(ROUTER_PATH.SIGNIN)}
                icon={<UserOutlined />}
              >
                Dang nhap
              </Button>
              <Button
                onClick={() => handleNavigate(ROUTER_PATH.SIGNUP)}
                icon={<UserAddOutlined />}
              >
                Dang ky
              </Button>
            </>
          )}
        </Space>
      </div>
    </header>
  );
}
