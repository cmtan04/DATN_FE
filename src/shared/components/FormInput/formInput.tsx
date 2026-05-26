import type { FormItemProps } from "antd/es/form";
import "./formInput.scss";
import { Form, Input, type InputProps } from "antd";
import type { ReactNode } from "react";

interface IFormInput {
  label: string;
  formItemProps?: FormItemProps;
  inputProps?: InputProps;
  name: string;
  vertical?: boolean;
  placeholder?: string;
  size?: "small" | "middle" | "large";
  prefix?: ReactNode;
  suffix?: ReactNode;
  type?: "text" | "password" | "email" | "number" | "tel" | "url";
  disabled?: boolean;
  readOnly?: boolean;
  maxLength?: number;
  showCount?: boolean;
  allowClear?: boolean;
  variant?: "outlined" | "borderless" | "filled";
  status?: "error" | "warning";
}

export const FormInput = ({
  label,
  formItemProps,
  inputProps,
  name,
  vertical = false,
  placeholder,
  size = "middle",
  prefix,
  suffix,
  type = "text",
  disabled = false,
  readOnly = false,
  maxLength,
  showCount = false,
  allowClear = true,
  variant = "outlined",
  status,
}: IFormInput) => {
  return (
    <Form.Item
      label={label}
      name={name}
      className={`form-input ${vertical ? "form-input--vertical" : ""}`}
      {...formItemProps}
      labelCol={vertical ? { span: 24 } : undefined}
    >
      <Input
        className="form-input__input"
        type={type}
        placeholder={placeholder}
        size={size}
        prefix={prefix}
        suffix={suffix}
        disabled={disabled}
        readOnly={readOnly}
        maxLength={maxLength}
        showCount={showCount}
        allowClear={allowClear}
        variant={variant}
        status={status}
        {...inputProps}
      />
    </Form.Item>
  );
};
