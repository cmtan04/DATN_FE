import {
  Alert,
  App as AntdApp,
  Avatar,
  Badge,
  Button,
  Checkbox,
  Descriptions,
  Drawer,
  Dropdown,
  Empty,
  List,
  Menu,
  Modal,
  Popover,
  Space,
  Typography,
} from "antd";
import {
  BellOutlined,
  HeartOutlined,
  HistoryOutlined,
  HomeOutlined,
  IdcardOutlined,
  LogoutOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@app/providers/useAuth";
import { ROUTER_PATH } from "@app/router";
import {
  useMarkNotificationRead,
  useNotifications,
} from "@modules/user/hooks/useNotifications";
import { useSubmitOwnerRequest } from "@modules/user/hooks/useSubmitOwnerRequest";
import "./topbar.scss";
import type { MenuProps } from "antd";

const OWNER_USER_ROLE = 1;
const OWNER_REQUEST_PENDING = 1;
const OWNER_REQUEST_APPROVED = 2;

export const TopBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { message } = AntdApp.useApp();
  const { user, isAuthenticated, signOut, setUser } = useAuth();
  const [menuDrawerOpen, setMenuDrawerOpen] = useState(false);
  const [hostRequestOpen, setHostRequestOpen] = useState(false);
  const [hostTermsAccepted, setHostTermsAccepted] = useState(false);
  const submitOwnerRequest = useSubmitOwnerRequest();
  const notificationsQuery = useNotifications(isAuthenticated);
  const markNotificationRead = useMarkNotificationRead();

  const profile = user?.profile;
  const displayName =
    profile?.fullName ?? user?.fullName ?? user?.email ?? "Tai khoan";
  const phoneNumber =
    profile?.phoneNumber ?? user?.phoneNumber ?? "Chua cap nhat";
  const avatarUrl = profile?.avatarUrl;
  const avatarText = displayName.trim().charAt(0).toUpperCase() || "U";
  const ownerRequestStatus = user?.ownerRequestStatus ?? 0;
  const isOwner = user?.userRole === OWNER_USER_ROLE;
  const isOwnerRequestPending = ownerRequestStatus === OWNER_REQUEST_PENDING;
  const isOwnerRequestApproved = ownerRequestStatus === OWNER_REQUEST_APPROVED;
  const canShowOwnerRequestAction =
    isAuthenticated && !isOwner && !isOwnerRequestApproved;
  const notifications = notificationsQuery.data ?? [];
  const unreadNotificationCount = notifications.filter((item) => !item.isRead).length;

  const navItems = useMemo(
    () => [
      { key: ROUTER_PATH.HOME, label: "Trang chu" },
      { key: ROUTER_PATH.LOCATIONS, label: "Danh sach phong" },
      { key: ROUTER_PATH.MAP, label: "Ban do" },
      { key: ROUTER_PATH.CHAT, label: "Tin nhan" },
      { key: ROUTER_PATH.USER_PROFILE, label: "Ho so" },
    ],
    [],
  );

  const accountMenuItems: MenuProps["items"] = useMemo(
    () => [
      {
        key: ROUTER_PATH.USER_PROFILE,
        icon: <IdcardOutlined />,
        label: "Thong tin ca nhan",
      },
      {
        key: ROUTER_PATH.USER_BOOKINGS,
        icon: <HistoryOutlined />,
        label: "Lich su dat phong",
      },
      {
        key: ROUTER_PATH.USER_FAVORITES,
        icon: <HeartOutlined />,
        label: "Danh sach phong yeu thich",
      },
      { type: "divider" },
      {
        key: "sign-out",
        danger: true,
        icon: <LogoutOutlined />,
        label: "Dang xuat",
      },
    ],
    [],
  );

  const handleMenuClick = ({ key }: { key: string }) => {
    setMenuDrawerOpen(false);
    navigate(key);
  };

  const handleNavigate = (path: string) => {
    setMenuDrawerOpen(false);
    navigate(path);
  };

  const closeHostRequest = () => {
    setHostRequestOpen(false);
    setHostTermsAccepted(false);
  };

  const handleOpenHostRequest = () => {
    setMenuDrawerOpen(false);
    setHostRequestOpen(true);
  };

  const handleSubmitHostRequest = () => {
    if (!hostTermsAccepted || isOwnerRequestPending) {
      return;
    }

    submitOwnerRequest.mutate(undefined, {
      onSuccess: (updatedUser) => {
        setUser(updatedUser);
        message.success("Da gui yeu cau dang ki lam chu phong. Vui long cho duyet.");
        closeHostRequest();
      },
      onError: () => {
        message.error("Khong gui duoc yeu cau. Vui long thu lai.");
      },
    });
  };

  const handleNotificationClick = (notificationId: number) => {
    markNotificationRead.mutate(notificationId);
  };

  const handleAccountMenuClick: MenuProps["onClick"] = ({ key }) => {
    if (key === "sign-out") {
      setMenuDrawerOpen(false);
      signOut();
      navigate(ROUTER_PATH.HOME);
      return;
    }

    handleNavigate(key);
  };

  const notificationContent = (
    <div className="topbar__notifications">
      {notifications.length ? (
        <List
          dataSource={notifications}
          renderItem={(item) => (
            <List.Item
              className={item.isRead ? undefined : "topbar__notification--unread"}
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
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Chua co thong bao." />
      )}
    </div>
  );

  const notificationButton = (
    <Popover
      content={notificationContent}
      title="Thong bao"
      trigger="click"
      placement="bottomRight"
    >
      <Button
        type="text"
        shape="circle"
        className="topbar__notification-button"
        aria-label="Thong bao"
      >
        <Badge count={unreadNotificationCount} size="small" offset={[-2, 2]}>
          <BellOutlined />
        </Badge>
      </Button>
    </Popover>
  );

  const ownerRequestButton = canShowOwnerRequestAction ? (
    <Button
      type="primary"
      icon={<HomeOutlined />}
      className="topbar__host-button"
      onClick={handleOpenHostRequest}
      disabled={isOwnerRequestPending}
    >
      {isOwnerRequestPending ? "Dang cho duyet" : "Dang cho nghi cua ban"}
    </Button>
  ) : null;

  const authenticatedActions = (
    <>
      {ownerRequestButton}
      {notificationButton}

      <Dropdown
        menu={{ items: accountMenuItems, onClick: handleAccountMenuClick }}
        placement="bottomRight"
        trigger={["click"]}
      >
        <button type="button" className="topbar__avatar-trigger">
          <Avatar src={avatarUrl} icon={!avatarUrl ? <UserOutlined /> : null}>
            {!avatarUrl ? avatarText : null}
          </Avatar>
        </button>
      </Dropdown>
    </>
  );

  return (
    <header className="top__bar">
      <div className="top__bar-desktop">
        <div className="left">
          <Link to={ROUTER_PATH.HOME} className="top__bar-logo">
            <span className="top__bar-logo-mark">H</span>
            <span className="title">Hostings</span>
          </Link>

          <nav className="top__bar-menu" aria-label="Dieu huong chinh">
            <Menu
              mode="horizontal"
              selectedKeys={[location.pathname]}
              items={navItems}
              className="top__bar-menu-list"
              disabledOverflow
              onClick={handleMenuClick}
            />
          </nav>
        </div>

        <div className="right">
          {isAuthenticated ? (
            authenticatedActions
          ) : (
            <>
              <Link className="guest-login" to={ROUTER_PATH.SIGNIN}>
                Dang nhap
              </Link>
              <Link className="guest-signup" to={ROUTER_PATH.SIGNUP}>
                Dang ky
              </Link>
            </>
          )}
        </div>
      </div>

      <div className="top__bar-mobile">
        <button
          type="button"
          className="topbar__hamburger"
          onClick={() => setMenuDrawerOpen(true)}
          aria-label="Mo menu"
        >
          <span />
          <span />
          <span />
        </button>

        <Link
          to={ROUTER_PATH.HOME}
          className="top__bar-logo top__bar-logo--mobile"
        >
          <span className="top__bar-logo-mark">H</span>
          <span className="title">Hostings</span>
        </Link>

        {isAuthenticated ? (
          notificationButton
        ) : (
          <Button
            type="primary"
            onClick={() => handleNavigate(ROUTER_PATH.SIGNIN)}
          >
            Dang nhap
          </Button>
        )}
      </div>

      <Drawer
        open={menuDrawerOpen}
        placement="left"
        closable={false}
        width={320}
        className="topbar__drawer"
        onClose={() => setMenuDrawerOpen(false)}
      >
        <div className="topbar__drawer-header">
          <Link
            to={ROUTER_PATH.HOME}
            className="top__bar-logo"
            onClick={() => setMenuDrawerOpen(false)}
          >
            <span className="top__bar-logo-mark">H</span>
            <span className="title">Hostings</span>
          </Link>
          <button
            type="button"
            className="topbar__drawer-close"
            onClick={() => setMenuDrawerOpen(false)}
            aria-label="Dong menu"
          >
            x
          </button>
        </div>

        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={navItems}
          className="topbar__drawer-menu"
          onClick={handleMenuClick}
        />

        <div className="topbar__drawer-actions">
          {isAuthenticated ? (
            <>
              <div className="topbar__drawer-user">
                <Avatar src={avatarUrl} icon={!avatarUrl ? <UserOutlined /> : null}>
                  {!avatarUrl ? avatarText : null}
                </Avatar>
                <div>
                  <strong>{displayName}</strong>
                  <span>{user?.email}</span>
                </div>
              </div>

              {ownerRequestButton}

              <Menu
                mode="inline"
                selectable={false}
                items={accountMenuItems}
                className="topbar__drawer-account-menu"
                onClick={handleAccountMenuClick}
              />
            </>
          ) : (
            <>
              <Button
                block
                type="primary"
                onClick={() => handleNavigate(ROUTER_PATH.SIGNIN)}
              >
                Dang nhap
              </Button>
              <Button block onClick={() => handleNavigate(ROUTER_PATH.SIGNUP)}>
                Dang ky
              </Button>
            </>
          )}
        </div>
      </Drawer>

      <Modal
        title="Dang cho nghi cua ban"
        open={hostRequestOpen}
        onCancel={closeHostRequest}
        footer={
          <Space>
            <Button onClick={closeHostRequest}>Huy</Button>
            <Button
              type="primary"
              disabled={!hostTermsAccepted || isOwnerRequestPending}
              loading={submitOwnerRequest.isPending}
              onClick={handleSubmitHostRequest}
            >
              Gui yeu cau
            </Button>
          </Space>
        }
      >
        <Space direction="vertical" size={16} className="topbar__host-modal">
          <Alert
            type={isOwnerRequestPending ? "warning" : "info"}
            showIcon
            message={
              isOwnerRequestPending
                ? "Yeu cau cua ban dang cho admin duyet."
                : "Hosting se su dung thong tin nay de gui yeu cau dang phong, vui long cho duyet trong 1-3 ngay."
            }
          />

          <Descriptions
            bordered
            size="small"
            column={1}
            items={[
              { key: "fullName", label: "Ho ten", children: displayName },
              { key: "email", label: "Email", children: user?.email ?? "Chua cap nhat" },
              {
                key: "phoneNumber",
                label: "So dien thoai",
                children: phoneNumber,
              },
            ]}
          />

          <Checkbox
            checked={hostTermsAccepted}
            disabled={isOwnerRequestPending}
            onChange={(event) => setHostTermsAccepted(event.target.checked)}
          >
            Toi dong y voi dieu khoan su dung
          </Checkbox>
        </Space>
      </Modal>
    </header>
  );
};
