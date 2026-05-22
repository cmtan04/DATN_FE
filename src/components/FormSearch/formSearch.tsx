import { Form, Input, Space, type FormItemProps } from "antd";
import type { ReactNode } from "react";
import "./formSearch.scss";

interface IFormSearch {
  label: string;
  formItemProps?: FormItemProps;
  searchProps?: any;
  name: string;
  vertical?: boolean;
  placeholder?: string;
  size?: "small" | "middle" | "large";
  prefix?: ReactNode;
  suffix?: ReactNode;
  disabled?: boolean;
  allowClear?: boolean;
  bordered?: boolean;
  status?: "error" | "warning";
  onSearch?: (value: string) => void;
}

export const FormSearch = ({
  label,
  formItemProps,
  searchProps,
  name,
  vertical = false,
  placeholder,
  size = "middle",
  prefix,
  suffix,
  disabled = false,
  allowClear = true,
  bordered = true,
  status,
  onSearch,
}: IFormSearch) => {
  return (
    <Form.Item
      label={label}
      labelCol={vertical ? { span: 24 } : undefined}
      name={name}
      className={`form-input ${vertical ? "form-input--vertical" : ""}`}
      {...formItemProps}
    >
      <Input.Search
        className="form-input__search"
        placeholder={placeholder}
        size={size}
        prefix={prefix}
        suffix={suffix}
        disabled={disabled}
        allowClear={allowClear}
        bordered={bordered}
        status={status}
        onSearch={onSearch}
        enterButton="Tìm kiếm"
        {...searchProps}
      />
    </Form.Item>
  );
};
