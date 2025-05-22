import React from "react";
import { Form, Input, Select, Button, Space } from "antd";

interface SelectOption {
  label: string;
  value: string;
}

interface FormField {
  hidden: any;
  type: "input" | "select" | "textArea";
  name: string;
  label: string;
  required?: boolean;
  placeholder?: string;
  selectOptions?: SelectOption[];
  rules?: any[];
}

interface MyFormProps {
  initialValues?: any;
  fields: any[];
  onFinish: (values: any) => void;
  onCancel?: () => void;
  showOk?: boolean;
  showCancel?: boolean;
  okText?: string;
  cancelText?: string;
  footerStyle?: "end" | "center";
  okLoading?: boolean;
}

const MyForm: React.FC<MyFormProps> = ({
  initialValues,
  fields,
  onFinish,
  onCancel,
  showOk = true,
  showCancel = true,
  okText = "提交",
  cancelText = "取消",
  footerStyle = "end",
  okLoading = false,
}) => {
  const [form] = Form.useForm();

  const renderFormItem = (field: FormField) => {
    if (field.hidden) {
      // 如果是隐藏字段，直接返回一个隐藏的 Input
      return <Input type="hidden" />;
    }
    switch (field.type) {
      case "input":
        return <Input placeholder={field.placeholder} />;
      case "select":
        return (
          <Select placeholder={field.placeholder}>
            {field.selectOptions?.map((option) => (
              <Select.Option key={option.value} value={option.value}>
                {option.label}
              </Select.Option>
            ))}
          </Select>
        );
      case "textArea":
        return <Input.TextArea placeholder={field.placeholder} rows={4} />;
      default:
        return null;
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={initialValues}
      onFinish={onFinish}
    >
      {fields.map((field) => (
        <Form.Item
          key={field.name}
          name={field.name}
          label={field.label}
          rules={[
            ...(field.required
              ? [{ required: true, message: `${field.label}是必填项` }]
              : []),
            ...(field.rules || []),
          ]}
          hidden={field.hidden} // ✅ 这里传递 hidden 属性
        >
          {renderFormItem(field)}
        </Form.Item>
      ))}
  
      <Form.Item
        style={{ textAlign: footerStyle === "end" ? "right" : "center" }}
      >
        <Space>
          {showCancel && (
            <Button onClick={() => onCancel?.()}>{cancelText}</Button>
          )}
          {showOk && (
            <Button type="primary" htmlType="submit" loading={okLoading}>
              {okText}
            </Button>
          )}
        </Space>
      </Form.Item>
    </Form>
  );
};

export default MyForm;
