import { Alert, App as AntdApp, Button, Checkbox, Form, Typography } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { ROUTER_PATH } from "@app/router";
import { useAuth } from "@app/providers/authContext";
import { FormInput } from "@shared/components/FormInput/formInput";
import { FormPassword } from "@shared/components/FormPassword/formPassword";
import { AuthLayout } from "../../components/AuthLayout";
import type { SignUpFormValues } from "../../types";

export const SignUp = () => {
  const [form] = Form.useForm<SignUpFormValues>();
  const navigate = useNavigate();
  const { message } = AntdApp.useApp();
  const { authError, isSigningUp, signUp } = useAuth();

  const handleSubmit = async (values: SignUpFormValues) => {
    try {
      const response = await signUp({
        fullName: values.fullName,
        email: values.email,
        phoneNumber: values.phoneNumber,
        password: values.password,
      });

      message.success(response.message || "Đăng kí tài khoản thành công.");
      navigate(ROUTER_PATH.HOME);
    } catch {
      // AuthProvider đã normalize lỗi vào authError để Alert hiển thị nhất quán.
    }
  };

  return (
    <AuthLayout
      visualTitle="Bắt đầu với tài khoản mới"
      visualDescription="Lưu lựa chọn, quản lý hồ sơ và theo dõi các địa điểm quan trọng."
    >
      <Typography.Title level={1} className="auth-page__title">
        Đăng kí
      </Typography.Title>
      <Typography.Paragraph className="auth-page__subtitle">
        Tạo tài khoản để lưu địa điểm yêu thích và quản lý thông tin cá nhân.
      </Typography.Paragraph>

      {authError ? (
        <Alert
          className="auth-page__alert"
          message={authError}
          type="error"
          showIcon
        />
      ) : null}

      <Form
        form={form}
        layout="vertical"
        requiredMark={false}
        onFinish={handleSubmit}
      >
        <FormInput
          label="Họ tên"
          name="fullName"
          size="large"
          vertical
          placeholder="Nhập họ tên"
          formItemProps={{
            rules: [
              { required: true, message: "Vui lòng nhập họ tên." },
              { min: 2, message: "Họ tên cần tối thiểu 2 ký tự." },
            ],
          }}
        />

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

        <FormInput
          label="Số điện thoại"
          name="phoneNumber"
          type="tel"
          size="large"
          vertical
          placeholder="Nhập số điện thoại"
          formItemProps={{
            rules: [
              { required: true, message: "Vui lòng nhập số điện thoại." },
              {
                pattern: /^(0|\+84)[0-9]{9,10}$/,
                message: "Số điện thoại không hợp lệ.",
              },
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

        <FormPassword
          label="Xác nhận mật khẩu"
          name="confirmPassword"
          size="large"
          vertical
          placeholder="Nhập lại mật khẩu"
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

        <Form.Item
          name="termsAccepted"
          valuePropName="checked"
          rules={[
            {
              validator: (_, value: boolean | undefined) =>
                value
                  ? Promise.resolve()
                  : Promise.reject(
                      new Error("Vui lòng đồng ý với điều khoản."),
                    ),
            },
          ]}
        >
          <Checkbox>Tôi đồng ý với điều khoản sử dụng</Checkbox>
        </Form.Item>

        <Button
          block
          size="large"
          type="primary"
          htmlType="submit"
          loading={isSigningUp}
          disabled={isSigningUp}
          className="auth-page__submit"
        >
          Đăng kí
        </Button>
      </Form>

      <Typography.Paragraph className="auth-page__switch">
        Đã có tài khoản? <Link to={ROUTER_PATH.SIGNIN}>Đăng nhập</Link>
      </Typography.Paragraph>
    </AuthLayout>
  );
};

export default SignUp;
