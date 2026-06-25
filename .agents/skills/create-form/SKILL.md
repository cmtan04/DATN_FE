---
name: create-form
description: Tạo Form Ant Design theo chuẩn dự án. Dùng skill này khi cần tạo form nhập liệu, đảm bảo tách biệt logic validation và tích hợp với React Query.
---

# Hướng dẫn tạo Form (Ant Design)

Khi người dùng yêu cầu "tạo form", "form nhập liệu", "form tạo/chỉnh sửa", hãy áp dụng chuẩn Form của dự án, tuân thủ nghiêm ngặt quy tắc: **"Keep form schema, validation, and submit logic outside JSX"**.

## 1. Cấu trúc và Vị trí

- Nằm trong thư mục `components/` của module.
- Nếu là form phức tạp, validation rules nên được tách ra file riêng, ví dụ `constants/rules.ts` hoặc `schemas/`.
- Nếu có mutation, sử dụng React Query (thông qua custom hook) để xử lý submit.

## 2. Quy tắc Validation (Rules)

- KHÔNG viết logic validation quá dài trực tiếp bên trong thẻ JSX `<Form.Item rules={...}>`.
- Khai báo rules ở ngoài component hoặc trong file riêng biệt (nếu tái sử dụng).

**Ví dụ định nghĩa Rules:**
```typescript
import type { Rule } from 'antd/es/form';

export const productFormRules: Record<string, Rule[]> = {
  name: [
    { required: true, message: 'Vui lòng nhập tên sản phẩm!' },
    { min: 3, message: 'Tên phải có ít nhất 3 ký tự!' }
  ],
  price: [
    { required: true, message: 'Vui lòng nhập giá!' },
  ],
};
```

## 3. Quy tắc xây dựng Component Form

- Sử dụng `Form` của `antd`.
- Nhận `onSubmit` hoặc `onFinish` thông qua props, form không nên tự gánh vác logic điều hướng mạng lưới (API/React Query) trừ khi form là một thành phần tự quản (container). Tốt nhất là truyền hàm submit từ trên xuống.
- Phải có trạng thái `loading` ở nút Submit để ngăn **Double Submit**.

**Ví dụ Form Component:**
```tsx
import React from 'react';
import { Form, Input, InputNumber, Button, Space } from 'antd';
import { productFormRules } from '../constants/rules';

export interface IProductFormValues {
  name: string;
  price: number;
}

interface ProductFormProps {
  initialValues?: Partial<IProductFormValues>;
  onSubmit: (values: IProductFormValues) => void;
  isLoading?: boolean;
}

export const ProductForm: React.FC<ProductFormProps> = ({ 
  initialValues, 
  onSubmit, 
  isLoading 
}) => {
  const [form] = Form.useForm();

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={initialValues}
      onFinish={onSubmit}
      disabled={isLoading}
    >
      <Form.Item 
        label="Tên sản phẩm" 
        name="name" 
        rules={productFormRules.name}
      >
        <Input placeholder="Nhập tên sản phẩm" />
      </Form.Item>

      <Form.Item 
        label="Giá" 
        name="price" 
        rules={productFormRules.price}
      >
        <InputNumber 
          style={{ width: '100%' }} 
          placeholder="Nhập giá" 
          min={0}
        />
      </Form.Item>

      <Form.Item>
        <Space>
          <Button type="primary" htmlType="submit" loading={isLoading}>
            Lưu
          </Button>
          <Button htmlType="button" onClick={() => form.resetFields()}>
            Nhập lại
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};
```

## 4. Quy tắc Tích hợp vào Page/Container

- Page (hoặc Container) sẽ chứa React Query Hook (`useMutation`) và truyền hàm gọi mutation vào `onSubmit` của Form.
- Truyền cờ `isPending` của mutation vào prop `isLoading` của Form.
