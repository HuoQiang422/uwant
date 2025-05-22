import React, { useState } from "react";
import { Form, Input, Select, Button, Space, Upload, message, Radio } from "antd";
import { InboxOutlined, UploadOutlined } from "@ant-design/icons";

interface SelectOption {
  label: string;
  value: string;
}

export interface FormField {
  hidden: any;
  type: "input" | "select" | "textArea" | "upload" | "radioGroup";
  name: string;
  label: string;
  required?: boolean;
  placeholder?: string;
  defaultValue?: string;
  selectOptions?: SelectOption[];
  rules?: any[];
  action?: string;
  options?: { value: string; label: string }[];
  multiple?: boolean;
  listType?: "text" | "picture" | "picture-card";
  onChange?: (info: any) => void;
}

interface MyFormProps {
  initialValues?: any;
  fields: FormField[];
  onFinish: (values: any) => void;
  onCancel?: () => void;
  showOk?: boolean;
  showCancel?: boolean;
  okText?: string;
  cancelText?: string;
  footerStyle?: "end" | "center";
  okLoading?: boolean;
  style?: React.CSSProperties;
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
  style,
}) => {
  const [form] = Form.useForm();
  
  // 处理文件上传
  const handleUploadChange = (info: any) => {
    const newFileList = info.fileList.map((file: any) => {
      if (!file.attachmentPath) {
        // 生成一个模拟路径
        file.attachmentPath = `/uploads/${file.uid}-${file.name}`;
      }
      return file;
    });

    // 设置到 Form 中
    form.setFieldsValue({
      attachments: newFileList.map(file => ({
        attachmentName: file.name,
        attachmentPath: file.attachmentPath
      }))
    });
  };

  // 渲染表单项
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
        return <Input.TextArea placeholder={field.placeholder} rows={3} />;
      case "upload":
        return (
          <Upload.Dragger
            style={{ height: "120px", minHeight: 100 }}
            multiple={field.multiple}
            listType={field.listType}
            beforeUpload={() => false}
            onChange={handleUploadChange}
            showUploadList={true}
          >
            <p className="ant-upload-text"  style={{ fontSize:"16px"}}>上传需求附件</p>
            <p className="ant-upload-hint" style={{ fontSize:10}}>支持多文件上传</p>
          </Upload.Dragger>
        );
      // case "upload":
      //   return (
      //     <Upload
      //       multiple={field.multiple}
      //       listType={field.listType}
      //       beforeUpload={() => false}
      //       onChange={handleUploadChange}
      //     >
      //       <Button icon={<UploadOutlined />}>上传附件</Button>
      //     </Upload>
      //   );
        case "radioGroup":
      return (
        <Radio.Group
          options={field.options}
          defaultValue={field.defaultValue}
        />
      );
      default:
        return null;
    }
  };

  // 提交表单
  const handleFinish = (values: any) => {
    console.log("提交的数据：", values);
    onFinish(values);
  };

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={initialValues}
      onFinish={handleFinish}
      style={style}
    >
      {fields.map((field) => (
        <Form.Item
          key={field.name}
          name={field.name}
          label={field.label}
          rules={[
            ...(field.required ? [{ required: true, message: `${field.label}是必填项` }] : []),
            ...(field.rules || []),
          ]}
          hidden={field.hidden} // ✅ 这里传递 hidden 属性
          className="mb-[5px]"
        >
          {renderFormItem(field)}
        </Form.Item>
      ))}

      {/* 手动将 Upload 的值绑定到 Form */}
      <Form.Item name="attachments" hidden>
        <Input />
      </Form.Item>

      <Form.Item style={{ textAlign: footerStyle === "end" ? "right" : "center" }}>
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
