import type { FormItemProps } from "antd/es/form";
import "./formDatePicker.scss";
import { DatePicker, Form } from "antd";
import type { DatePickerProps } from "antd";

interface IFormDatePicker {
  label: string;
  formItemProps?: FormItemProps;
  datePickerProps?: DatePickerProps;
  name: string;
  vertical?: boolean;
  placeholder?: string;
}

export const FormDatePicker = ({
  label,
  formItemProps,
  datePickerProps,
  name,
  vertical = false,
  placeholder,
}: IFormDatePicker) => {
  return (
    <Form.Item
      label={label}
      name={name}
      className={`form-date-picker ${vertical ? "form-date-picker--vertical" : ""}`}
      {...formItemProps}
      labelCol={vertical ? { span: 24 } : undefined}
    >
      <DatePicker
        className="form-date-picker__picker"
        {...datePickerProps}
        placeholder={placeholder}
      />
    </Form.Item>
  );
};
