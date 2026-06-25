import { useState, useEffect } from "react";
import { Avatar, Button, Form, Tooltip } from "antd";
import {
  UserOutlined,
  LockOutlined,
  EditOutlined,
  CameraOutlined,
  TrophyOutlined,
  CheckCircleOutlined,
  HistoryOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { ROUTER_PATH } from "@/app/router/routes";
import { useAuth } from "@/shared/hooks/useAuth";
import { FormPassword } from "@shared/components/FormPassword/formPassword";
import "./style.scss";
import { FormInput } from "@/shared/components";
import { useUpdateCurrentUser } from "../../hooks/useUpdateCurrentUser";

type NavKey = "info" | "password";
const RoleOptions = ["Quản trị viên", "Chủ nhà", "Người dùng"];

const navItems: {
  key: NavKey;
  icon: React.ReactNode;
  label: string;
}[] = [
  {
    key: "info",
    icon: <UserOutlined />,
    label: "Thông tin cá nhân",
  },
  {
    key: "password",
    icon: <LockOutlined />,
    label: "Đổi mật khẩu",
  },
];

export function ProfilePage() {
  const [activeNav, setActiveNav] = useState<NavKey>("info");
  const [editing, setEditing] = useState(false);
  const [infoForm] = Form.useForm();
  const [pwForm] = Form.useForm();
  const { user } = useAuth();
  const { updateCurrentUser, changePassword } = useUpdateCurrentUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      infoForm.setFieldsValue({
        fullName: user?.profile?.fullName,
        email: user?.email,
        phoneNumber: user?.profile?.phoneNumber,
      });
    }
  }, [user]);

  const role = user?.userRole ?? 0;
  const roleName = RoleOptions[role] || "Người dùng";

  const handleSaveInfo = () => {
    infoForm.validateFields().then(() => {
      const { fullName, phoneNumber } = infoForm.getFieldsValue();
      updateCurrentUser({ fullName, phoneNumber }).then(() => {
        setEditing(false);
      });
    });
  };

  const handleSavePw = () => {
    pwForm.validateFields().then((values) => {
      const { password, newPassword } = values;
      changePassword({ currentPassword: password, newPassword }).then(() => {
        pwForm.resetFields();
      });
    });
  };

  return (
    <div className="profile-page">
      {/* Hero */}
      <div className="profile-hero">
        <div className="profile-hero__inner">
          <div className="profile-hero__avatar-wrap">
            <Avatar
              src={user?.profile?.avatarUrl}
              size={96}
              style={{
                border: "3px solid rgba(255,255,255,0.4)",
              }}
            />
            <Tooltip title="Đổi ảnh đại diện">
              <button className="edit-avatar-btn">
                <CameraOutlined />
              </button>
            </Tooltip>
          </div>

          <div className="profile-hero__info">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                flexWrap: "wrap",
              }}
            >
              <h1>{user?.profile?.fullName}</h1>
              <span className={`tier-badge gold`}>
                <TrophyOutlined /> {roleName}
              </span>
            </div>

            <div className="profile-hero__stats">
              {[
                { val: "5", lbl: "Chuyến đã đặt" },
                { val: "3", lbl: "Hoàn thành" },
              ].map(({ val, lbl }) => (
                <div key={lbl} className="profile-hero__stat">
                  <span className="stat-val">{val}</span>
                  <span className="stat-lbl">{lbl}</span>
                </div>
              ))}
            </div>
          </div>

          <div
            style={{
              marginLeft: "auto",
              display: "flex",
              gap: 10,
              flexShrink: 0,
            }}
          >
            <Button
              icon={<HistoryOutlined />}
              ghost
              onClick={() => navigate(ROUTER_PATH.USER_BOOKINGS)}
            >
              Lịch sử đặt phòng
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="profile-content">
        {/* Side nav */}
        <nav className="profile-sidenav">
          {navItems.map((item, idx) => (
            <div key={item.key}>
              <div
                className={`profile-sidenav__item ${activeNav === item.key ? "active" : ""}`}
                onClick={() => setActiveNav(item.key)}
              >
                <span className="nav-icon">{item.icon}</span>
                {item.label}
              </div>
              {idx === 0 && <div className="profile-sidenav__divider" />}
            </div>
          ))}
        </nav>

        {/* Panel */}
        <div className="profile-panel">
          {/* ── Thông tin cá nhân ── */}
          {activeNav === "info" && (
            <>
              <div className="profile-panel__header">
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                  }}
                >
                  <div>
                    <h2>Thông tin cá nhân</h2>
                    <p>Quản lý thông tin hồ sơ của bạn</p>
                  </div>
                  {!editing && (
                    <Button
                      icon={<EditOutlined />}
                      onClick={() => setEditing(true)}
                    >
                      Chỉnh sửa
                    </Button>
                  )}
                </div>
              </div>

              <div className="profile-panel__body">
                <Form
                  form={infoForm}
                  layout="vertical"
                  className="profile-form"
                >
                  <div className="form-row-2">
                    <FormInput
                      label="Họ và tên"
                      name="fullName"
                      disabled={!editing}
                      formItemProps={{
                        rules: [
                          {
                            required: true,
                            message: "Vui lòng nhập họ và tên",
                          },
                        ],
                      }}
                    ></FormInput>
                  </div>

                  <div className="form-row-2">
                    <FormInput
                      label="Email"
                      name="email"
                      disabled={!editing}
                      formItemProps={{
                        rules: [
                          {
                            type: "email",
                            message: "Email không hợp lệ",
                          },
                          { required: true },
                        ],
                      }}
                    ></FormInput>
                    <FormInput
                      label="Số điện thoại"
                      name="phoneNumber"
                      disabled={!editing}
                      formItemProps={{
                        rules: [
                          {
                            required: true,
                            message: "Vui lòng nhập số điện thoại",
                          },
                        ],
                      }}
                    ></FormInput>
                  </div>
                </Form>
              </div>

              {editing && (
                <div className="profile-action-bar">
                  <Button
                    onClick={() => {
                      setEditing(false);
                    }}
                  >
                    Hủy
                  </Button>
                  <Button
                    type="primary"
                    icon={<CheckCircleOutlined />}
                    onClick={handleSaveInfo}
                  >
                    Lưu thay đổi
                  </Button>
                </div>
              )}
            </>
          )}

          {/* ── Đổi mật khẩu ── */}
          {activeNav === "password" && (
            <>
              <div className="profile-panel__header">
                <h2>Đổi mật khẩu</h2>
                <p>Cập nhật mật khẩu để bảo vệ tài khoản của bạn</p>
              </div>
              <div className="profile-panel__body">
                <Form form={pwForm} layout="vertical" style={{ maxWidth: 400 }}>
                  <FormPassword
                    label="Mật khẩu"
                    name="password"
                    size="large"
                    vertical
                    placeholder="Nhập mật khẩu"
                    formItemProps={{
                      rules: [
                        { required: true, message: "Vui lòng nhập mật khẩu." },
                        { min: 6, message: "Mật khẩu cần tối thiểu 6 ký tự." },
                      ],
                    }}
                  />

                  <FormPassword
                    label="Mật khẩu mới"
                    name="newPassword"
                    size="large"
                    vertical
                    placeholder="Nhập mật khẩu mới"
                    formItemProps={{
                      rules: [
                        { required: true, message: "Vui lòng nhập mật khẩu." },
                        { min: 6, message: "Mật khẩu cần tối thiểu 6 ký tự." },
                      ],
                    }}
                  />

                  <FormPassword
                    label="Xác nhận mật khẩu mới"
                    name="confirmPassword"
                    size="large"
                    vertical
                    placeholder="Nhập lại mật khẩu"
                    formItemProps={{
                      dependencies: ["newPassword"],
                      rules: [
                        {
                          required: true,
                          message: "Vui lòng xác nhận mật khẩu.",
                        },
                        ({ getFieldValue }) => ({
                          validator(_, value: string | undefined) {
                            if (
                              !value ||
                              getFieldValue("newPassword") === value
                            ) {
                              return Promise.resolve();
                            }

                            return Promise.reject(
                              new Error("Mật khẩu xác nhận không khớp."),
                            );
                          },
                        }),
                      ],
                    }}
                  />
                </Form>
              </div>
              <div className="profile-action-bar">
                <Button
                  type="primary"
                  icon={<LockOutlined />}
                  onClick={handleSavePw}
                >
                  Cập nhật mật khẩu
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
