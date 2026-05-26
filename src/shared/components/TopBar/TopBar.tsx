import { Button, Drawer, Menu } from "antd";
import { useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ROUTER_PATH } from "@app/router";
import "./topbar.scss";

export const TopBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuDrawerOpen, setMenuDrawerOpen] = useState(false);

  const navItems = useMemo(
    () => [
      { key: ROUTER_PATH.HOME, label: "Trang chủ" },
      { key: ROUTER_PATH.LOCATIONS, label: "Danh sách phòng" },
      { key: ROUTER_PATH.MAP, label: "Bản đồ" },
      { key: ROUTER_PATH.CHAT, label: "Tin nhắn" },
      { key: ROUTER_PATH.PROFILE, label: "Hồ sơ" },
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

  return (
    <header className="top__bar">
      <div className="top__bar-desktop">
        <div className="left">
          <Link to={ROUTER_PATH.HOME} className="top__bar-logo">
            <span className="top__bar-logo-mark">H</span>
            <span className="title">Hostings</span>
          </Link>

          <nav className="top__bar-menu" aria-label="Điều hướng chính">
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
          <Link className="guest-login" to={ROUTER_PATH.SIGNIN}>
            Đăng nhập
          </Link>
          <Link className="guest-signup" to={ROUTER_PATH.SIGNUP}>
            Đăng ký
          </Link>
        </div>
      </div>

      <div className="top__bar-mobile">
        <button
          type="button"
          className="topbar__hamburger"
          onClick={() => setMenuDrawerOpen(true)}
          aria-label="Mở menu"
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

        <Button type="primary" onClick={() => handleNavigate(ROUTER_PATH.SIGNIN)}>
          Login
        </Button>
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
          <Link to={ROUTER_PATH.HOME} className="top__bar-logo">
            <span className="top__bar-logo-mark">H</span>
            <span className="title">Hostings</span>
          </Link>
          <button
            type="button"
            className="topbar__drawer-close"
            onClick={() => setMenuDrawerOpen(false)}
            aria-label="Đóng menu"
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
          <Button
            block
            type="primary"
            onClick={() => handleNavigate(ROUTER_PATH.SIGNIN)}
          >
            Đăng nhập
          </Button>
          <Button block onClick={() => handleNavigate(ROUTER_PATH.SIGNUP)}>
            Đăng ký
          </Button>
        </div>
      </Drawer>
    </header>
  );
};
