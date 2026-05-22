import { Form, type FormItemProps } from "antd";
import TextArea from "antd/es/input/TextArea";
import "./formTextArea.scss";

interface IFormTextArea {
  label: string;
  formItemProps?: FormItemProps;
  textAreaProps?: any;
  name: string;
  vertical?: boolean;
  placeholder?: string;
  rows?: number;
  showCount?: boolean;
  maxLength?: number;
  disabled?: boolean;
  readOnly?: boolean;
  variant?: "outlined" | "borderless" | "filled";
  status?: "error" | "warning";
}

export const FormTextArea = ({
  label,
  formItemProps,
  textAreaProps,
  name,
  vertical = false,
  placeholder,
  rows = 4,
  showCount = false,
  maxLength,
  disabled = false,
  readOnly = false,
  variant = "outlined",
  status,
}: IFormTextArea) => {
  return (
    <Form.Item
      label={label}
      labelCol={vertical ? { span: 24 } : undefined}
      name={name}
      className={`form-input ${vertical ? "form-input--vertical" : ""}`}
      {...formItemProps}
    >
      <TextArea
        className="form-input__textarea"
        placeholder={placeholder}
        rows={rows}
        showCount={showCount}
        maxLength={maxLength}
        disabled={disabled}
        readOnly={readOnly}
        variant={variant}
        status={status}
        {...textAreaProps}
      />
    </Form.Item>
  );
};
