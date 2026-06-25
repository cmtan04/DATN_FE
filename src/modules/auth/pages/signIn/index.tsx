import {
  Alert,
  App as AntdApp,
  Button,
  Checkbox,
  Form,
  Typography,
} from "antd";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ROUTER_PATH } from "@app/router";
import { useAuth } from "@/shared/hooks/useAuth";
import { FormInput } from "@shared/components/FormInput/formInput";
import { FormPassword } from "@shared/components/FormPassword/formPassword";
import { AuthLayout } from "../../components/AuthLayout";
import type { LoginRequest, SignInLocationState } from "../../types";

export const SignIn = () => {
  const [form] = Form.useForm<LoginRequest>();
  const navigate = useNavigate();
  const location = useLocation();
  const { message } = AntdApp.useApp();
  const { isSigningIn, signIn } = useAuth();
  const locationState = location.state as SignInLocationState | null;
  const redirectPath = locationState?.from?.pathname
    ? `${locationState.from.pathname}${locationState.from.search ?? ""}${
        locationState.from.hash ?? ""
      }`
    : ROUTER_PATH.HOME;

  const handleSubmit = async (values: LoginRequest) => {
    try {
      await signIn(values);
      message.success("Đăng nhập thành công.");
      navigate(redirectPath, { replace: false });
    } catch {
      // AuthProvider already normalizes auth errors for a consistent Alert.
      message.error(
        "Đăng nhập thất bại. Vui lòng kiểm tra thông tin và thử lại.",
      );
    }
  };

  return (
    <AuthLayout>
      <Typography.Title level={1} className="auth-page__title">
        Đăng nhập
      </Typography.Title>

      <Form
        form={form}
        layout="vertical"
        requiredMark={false}
        onFinish={handleSubmit}
        initialValues={{ rememberMe: true }}
      >
        <FormInput
          label="Email"
          name="email"
          type="email"
          size="large"
          vertical
          placeholder="Nhập email"
          formItemProps={{
            rules: [
              { required: true, message: "Vui lòng nhập email." },
              { type: "email", message: "Email không hợp lệ." },
            ],
          }}
        />

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

        <div className="auth-page__form-row">
          <Form.Item name="rememberMe" valuePropName="checked" noStyle>
            <Checkbox>Ghi nhớ đăng nhập</Checkbox>
          </Form.Item>
          <Link
            className="auth-page__link-button"
            to={ROUTER_PATH.FORGOT_PASSWORD}
          >
            Quên mật khẩu?
          </Link>
        </div>

        <Button
          block
          size="large"
          type="primary"
          htmlType="submit"
          loading={isSigningIn}
          disabled={isSigningIn}
          className="auth-page__submit"
        >
          Đăng nhập
        </Button>
      </Form>

      <Typography.Paragraph className="auth-page__switch">
        Chưa có tài khoản?{" "}
        <Link to={ROUTER_PATH.SIGNUP} state={locationState}>
          Đăng ký ngay
        </Link>
      </Typography.Paragraph>
    </AuthLayout>
  );
};

export default SignIn;
