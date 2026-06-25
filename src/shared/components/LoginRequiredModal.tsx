import { ArrowLeftOutlined, LoginOutlined } from "@ant-design/icons";
import { Button, Modal, Space, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/shared/hooks/useAuth";
import { ROUTER_PATH } from "@app/router";
import "./loginRequiredModal.scss";

const hasHistoryEntry = () => {
  const historyState = globalThis.history.state as { idx?: number } | null;

  return typeof historyState?.idx === "number" && historyState.idx > 0;
};

export const LoginRequiredModal = () => {
  const navigate = useNavigate();
  const {
    isLoginRequiredOpen,
    loginRequiredRoute,
    loginRequiredSource,
    closeLoginRequired,
    resolveBackFromProtected,
  } = useAuth();

  const handleNavigateToAuth = (path: string) => {
    const from = loginRequiredRoute;

    closeLoginRequired();
    navigate(path, { state: from ? { from } : undefined });
  };

  const handleBack = () => {
    resolveBackFromProtected();

    if (loginRequiredSource === "intercept") {
      return;
    }

    if (hasHistoryEntry()) {
      navigate(-1);
      return;
    }

    navigate(ROUTER_PATH.HOME, { replace: true });
  };

  return (
    <Modal
      open={isLoginRequiredOpen}
      footer={null}
      centered
      closable={false}
      maskClosable={false}
      keyboard={false}
      onCancel={handleBack}
      className="login-required-modal"
      width={880}
      styles={{ body: { padding: 0 } }}
    >
      <div className="login-required-modal__layout">
        <section className="login-required-modal__content">
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={handleBack}
            className="login-required-modal__back-button"
          >
            Quay lại
          </Button>

          <Space
            direction="vertical"
            size={18}
            className="login-required-modal__content-stack"
          >
            <div>
              <Typography.Title
                level={3}
                className="login-required-modal__title"
              >
                Cần đăng nhập để tiếp tục
              </Typography.Title>
              <Typography.Paragraph className="login-required-modal__description">
                Đăng nhập hoặc tạo tài khoản để lưu thông tin, tiếp tục đặt chỗ
                và truy cập đầy đủ tính năng dành cho bạn.
              </Typography.Paragraph>
            </div>

            <Space
              direction="vertical"
              size={12}
              className="login-required-modal__actions"
            >
              <Button
                type="primary"
                size="large"
                icon={<LoginOutlined />}
                onClick={() => handleNavigateToAuth(ROUTER_PATH.SIGNIN)}
                className="login-required-modal__button login-required-modal__button--primary"
              >
                Đăng nhập
              </Button>
              <Typography.Paragraph className="login-required-modal__switch">
                Chưa có tài khoản?
                <Button
                  type="link"
                  onClick={() => handleNavigateToAuth(ROUTER_PATH.SIGNUP)}
                  className="login-required-modal__switch-link"
                >
                  Đăng ký ngay
                </Button>
              </Typography.Paragraph>
            </Space>
          </Space>
        </section>

        <aside className="login-required-modal__visual" aria-hidden="true">
          <div className="login-required-modal__visual-overlay" />
          <div className="login-required-modal__visual-content">
            <Typography.Text className="login-required-modal__visual-kicker">
              Truy cập nhanh hơn
            </Typography.Text>
            <Typography.Title
              level={4}
              className="login-required-modal__visual-title"
            >
              Một lần đăng nhập, đầy đủ trải nghiệm
            </Typography.Title>
            <Typography.Paragraph className="login-required-modal__visual-description">
              Theo dõi lịch sử, nhận cập nhật đặt chỗ và quản lý thao tác của
              bạn liền mạch trên toàn bộ ứng dụng.
            </Typography.Paragraph>
          </div>
        </aside>
      </div>
    </Modal>
  );
};
