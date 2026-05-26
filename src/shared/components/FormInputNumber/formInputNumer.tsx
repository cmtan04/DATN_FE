import { Form } from "antd";
import InputNumber from "antd/es/input-number";
import type { InputNumberProps } from "antd/es/input-number";
import "./formInputNumber.scss";
import type { FormItemInputProps } from "antd/es/form/FormItemInput";
import type { ReactNode } from "react";

interface IFormNumber {
  label: string;
  formItemProps?: FormItemInputProps;
  numberProps?: InputNumberProps;
  name: string;
  vertical?: boolean;
  placeholder?: string;
  size?: "small" | "middle" | "large";
  prefix?: ReactNode;
  suffix?: ReactNode;
  disabled?: boolean;
  variant?: "outlined" | "borderless" | "filled";
  status?: "error" | "warning";
  min?: number;
  max?: number;
  step?: number;
  precision?: number;
  formatter?: InputNumberProps["formatter"];
  parser?: InputNumberProps["parser"];
}

export const FormNumber = ({
  label,
  formItemProps,
  numberProps,
  name,
  vertical = false,
  placeholder,
  size = "middle",
  prefix,
  suffix,
  disabled = false,
  variant = "outlined",
  status,
  min,
  max,
  step,
  precision,
  formatter,
  parser,
}: IFormNumber) => {
  return (
    <Form.Item
      label={label}
      name={name}
      className={`form-input ${vertical ? "form-input--vertical" : ""}`}
      {...formItemProps}
      labelCol={vertical ? { span: 24 } : undefined}
    >
      <InputNumber
        className="form-input__number"
        placeholder={placeholder}
        size={size}
        prefix={prefix}
        suffix={suffix}
        disabled={disabled}
        variant={variant}
        status={status}
        min={min}
        max={max}
        step={step}
        precision={precision}
        formatter={formatter}
        parser={parser}
        {...numberProps}
      />
    </Form.Item>
  );
};
