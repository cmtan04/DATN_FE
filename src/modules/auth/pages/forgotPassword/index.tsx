import {
  Alert,
  App as AntdApp,
  Button,
  Form,
  Input,
  Steps,
  Typography,
} from "antd";
import { Link, useNavigate } from "react-router-dom";
import { ROUTER_PATH } from "@app/router";
import { FormInput } from "@shared/components/FormInput/formInput";
import { FormPassword } from "@shared/components/FormPassword/formPassword";
import { AuthLayout } from "../../components/AuthLayout";
import { useForgotPasswordFlow } from "../../hooks/useForgotPasswordFlow";
import type {
  GetOtpRequest,
  ResetPasswordRequest,
  VerifyOtpRequest,
} from "../../types";

export const ForgotPassword = () => {
  const [emailForm] = Form.useForm<{ email: string }>();
  const [otpForm] = Form.useForm<{ otp: string }>();
  const [resetForm] = Form.useForm<{
    password: string;
    confirmPassword: string;
  }>();
  const navigate = useNavigate();
  const { message } = AntdApp.useApp();
  const {
    currentStep,
    email,
    resetToken,
    errorMessage,
    isSendingOtp,
    isVerifyingOtp,
    isResettingPassword,
    sendOtp,
    resendOtp,
    verifyOtp,
    resetPassword,
    step,
  } = useForgotPasswordFlow();

  const handleSendOtp = async (values: GetOtpRequest) => {
    try {
      const response = await sendOtp(values);
      message.success(response.message || "Mã OTP đã được gửi đến email.");
    } catch {
      // The hook normalizes API errors for the Alert.
    }
  };

  const handleResendOtp = async () => {
    try {
      const response = await resendOtp();
      if (response?.message) {
        message.success(response.message);
        return;
      }

      message.success("Mã OTP mới đã được gửi đến email.");
    } catch {
      // The hook normalizes API errors for the Alert.
    }
  };

  const handleVerifyOtp = async (values: VerifyOtpRequest) => {
    try {
      const response = await verifyOtp(values);
      message.success(response.message || "Xác thực OTP thành công.");
    } catch {
      // The hook normalizes API errors for the Alert.
    }
  };

  const handleResetPassword = async (values: ResetPasswordRequest) => {
    try {
      const response = await resetPassword(values);
      message.success(response.message || "Đặt lại mật khẩu thành công.");
      navigate(ROUTER_PATH.SIGNIN, { replace: true });
    } catch {
      // The hook normalizes API errors for the Alert.
    }
  };

  const renderForm = () => {
    if (step === "otp") {
      return (
        <Form
          form={otpForm}
          layout="vertical"
          requiredMark={false}
          onFinish={(values) => handleVerifyOtp({ ...values, email })}
        >
          <Typography.Paragraph className="auth-page__subtitle">
            Nhập mã OTP 6 chữ số đã được gửi đến {email}.
          </Typography.Paragraph>

          <Form.Item
            label="Mã xác thực OTP"
            name="otp"
            rules={[
              { required: true, message: "Vui lòng nhập đủ 6 số OTP." },
              { len: 6, message: "Mã OTP phải bao gồm đúng 6 chữ số." },
            ]}
          >
            <Input.OTP
              length={6}
              size="large"
              formatter={(value) => value.replace(/\D/g, "")} // Chỉ cho phép nhập số
              style={{ width: "100%", justifyContent: "center" }}
            />
          </Form.Item>

          <Button
            block
            size="large"
            type="primary"
            htmlType="submit"
            loading={isVerifyingOtp}
            disabled={isSendingOtp || isVerifyingOtp}
            className="auth-page__submit"
          >
            Xác thực OTP
          </Button>

          <Button
            type="link"
            className="auth-page__resend-button"
            loading={isSendingOtp}
            disabled={isSendingOtp || isVerifyingOtp}
            onClick={handleResendOtp}
          >
            Gửi lại OTP
          </Button>
        </Form>
      );
    }

    if (step === "reset") {
      return (
        <Form
          form={resetForm}
          layout="vertical"
          requiredMark={false}
          onFinish={(values) =>
            handleResetPassword({
              password: values.password,
              resetToken: resetToken,
            })
          }
        >
          <Typography.Paragraph className="auth-page__subtitle">
            Tạo mật khẩu mới cho tài khoản {email}.
          </Typography.Paragraph>

          <FormPassword
            label="Mật khẩu mới"
            name="password"
            size="large"
            vertical
            placeholder="Nhập mật khẩu mới"
            formItemProps={{
              rules: [
                { required: true, message: "Vui lòng nhập mật khẩu mới." },
                { min: 6, message: "Mật khẩu cần tối thiểu 6 ký tự." },
              ],
            }}
          />

          <FormPassword
            label="Xác nhận mật khẩu"
            name="confirmPassword"
            size="large"
            vertical
            placeholder="Nhập lại mật khẩu mới"
            formItemProps={{
              dependencies: ["password"],
              rules: [
                { required: true, message: "Vui lòng xác nhận mật khẩu." },
                ({ getFieldValue }) => ({
                  validator(_, value: string | undefined) {
                    if (!value || getFieldValue("password") === value) {
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

          <Button
            block
            size="large"
            type="primary"
            htmlType="submit"
            loading={isResettingPassword}
            disabled={isResettingPassword}
            className="auth-page__submit"
          >
            Đặt lại mật khẩu
          </Button>
        </Form>
      );
    }

    return (
      <Form
        form={emailForm}
        layout="vertical"
        requiredMark={false}
        onFinish={(values) => handleSendOtp(values)}
      >
        <Typography.Paragraph className="auth-page__subtitle">
          Nhập email đã đăng ký để nhận mã OTP đặt lại mật khẩu.
        </Typography.Paragraph>

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

        <Button
          block
          size="large"
          type="primary"
          htmlType="submit"
          loading={isSendingOtp}
          disabled={isSendingOtp}
          className="auth-page__submit"
        >
          Gửi OTP
        </Button>
      </Form>
    );
  };

  return (
    <AuthLayout>
      <Typography.Title level={1} className="auth-page__title">
        Quên mật khẩu
      </Typography.Title>

      <Steps
        className="auth-page__steps"
        current={currentStep}
        size="small"
        items={[{ title: "Email" }, { title: "OTP" }, { title: "Mật khẩu" }]}
      />

      {errorMessage ? (
        <Alert
          className="auth-page__alert"
          message={errorMessage}
          type="error"
          showIcon
        />
      ) : null}

      {renderForm()}

      <Typography.Paragraph className="auth-page__switch">
        Đã nhớ mật khẩu? <Link to={ROUTER_PATH.SIGNIN}>Đăng nhập</Link>
      </Typography.Paragraph>
    </AuthLayout>
  );
};

export default ForgotPassword;
