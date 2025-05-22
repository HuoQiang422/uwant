import { Card } from "antd";
import { useState } from "react";
import { useSelector } from "react-redux";
import { API_TASKS_Create, API_TASKS_Update } from "../../config/api";
import { User } from "../../redux/user";
import { enterLoading, leaveLoading } from "../../utils/controllerUtils";
import { post,put } from "../../utils/request";
import MyForm, { FormField } from "./MyForm";

interface AddOrEditTaskProps {
  modalType: string;
  handleItem: any;
  reFresh: () => void;
  closeModal: () => void;
}

export default function AddOrEditTask(props: AddOrEditTaskProps) {
  const { modalType, handleItem, reFresh, closeModal } = props;
  const token = useSelector((state: { user: User }) => state.user.token);
  const [loadings, setLoadings] = useState<boolean[]>([]);

  function addTask(e: object) {
    enterLoading(0, setLoadings);
  
    const requestData = {
      task: {
        description: (e as any).description,
        priority: (e as any).priority,
        category: (e as any).category,
        status: (e as any).status ?? "待处理",
        contactPerson: (e as any).contactPerson,
        implementPerson: (e as any).implementPerson,
        remark: (e as any).remark ?? "无",
      },
      attachments: (e as any).attachments ?? [],
    };
  
    console.log("请求数据:", requestData); // 打印请求数据，检查是否正确
  
    post({
      url: API_TASKS_Create,
      token,
      data: requestData,
    })
      .then((res) => {
        if (res.code === 200) {
          reFresh();
          closeModal();
        }
      })
      .finally(() => {
        leaveLoading(0, setLoadings);
      });
  }
  

  function editTask(e: object) {
    enterLoading(0, setLoadings);
    const requestData = {
          description: (e as any).description,
          priority: (e as any).priority,
          category: (e as any).category,
          status: (e as any).status ,
          contactPerson: (e as any).contactPerson,
          implementPerson: (e as any).implementPerson,
          remark: (e as any).remark ?? "无",
      };
    put({
      url: API_TASKS_Update,
      id: (e as any).taskId,
      token,
      data: { ...requestData},
    })
      .then((res) => {
        if (res.code === 200) {
          reFresh();
          closeModal();
        }
      })
      .finally(() => {
        leaveLoading(0, setLoadings);
      });
  }

  // const formFields:FormField[] = [
  //   { type: "input", name: "taskId", label: "任务id", hidden: true},
  //   { type: "textArea", name: "description",hidden: false, label: "需求说明", required: true, placeholder: "请输入需求说明" },
  //   { type: "input", name: "contactPerson", hidden: false,label: "联系人", required: true, placeholder: "请输入联系人" },
  //   { type: "input", name: "implementPerson",hidden: false, label: "负责人", required: true, placeholder: "请输入负责人" },
  //   { type: "select", name: "status", hidden: true,label: "状态", required: true, placeholder: "请选择状态", selectOptions: [
  //     { label: "待处理", value: "待处理" },
  //     { label: "进行中", value: "进行中" },
  //     { label: "已完成 ", value: "已完成" }
  //     ]},
  //     // { type: "select", name: "priority",hidden: false, label: "优先级", required: true, placeholder: "请选择优先级", selectOptions: [
  //     //   { label: "P0", value: "P0" },
  //     //   { label: "P1", value: "P1" },
  //     //   { label: "P2", value: "P2" }
  //     // ]},
  //     { type: "select", name: "category", hidden: false,label: "类别", required: true, placeholder: "请选择类别", selectOptions: [
  //       { label: "RPA", value: "RPA" },
  //       { label: "Bi预策", value: "Bi预策" },
  //       { label: "web开发", value: "web开发" }
  //   ]},
  //   { type: "textArea", name: "remark", hidden: false,label: "备注", placeholder: "请输入备注" },
  //   {
  //     type: "upload",
  //     name: "attachments",
  //     label: "",
  //     hidden: false,
  //     // action: "/api/upload", // 这里是你的上传接口
  //     multiple: true,
  //     listType: "text",
  //     onChange: (info: any) => {
  //       if (info.file.status === 'done') {
  //         console.log("上传成功：", info.file.response);
  //       }
  //     }
  //   }
  // ];
  const formFields: FormField[] = [
    { type: "textArea", name: "description", hidden: false, label: "需求说明", required: true, placeholder: "请输入需求说明" },
    // { type: "radioGroup", name: "category", hidden: false, label: "类别", required: true, defaultValue: "RPA", options: [
    //   { value: "RPA", label: "RPA" },
    //   { value: "Bi预策", label: "Bi预策" },
    //   { value: "WEB", label: "WEB" },
    //   { value: "Agent", label: "Agent" }
    // ]},
    {
      type: "radioGroup",
      name: "category",
      hidden: false,
      label: "类别",
      required: true,
      defaultValue: "RPA",
      options: [
        { label: "RPA", value: "RPA" },
        { label: "Bi预策", value: "Bi预策" },
        { label: "WEB", value: "WEB" },
        { label: "Agent", value: "Agent" },
      ],
    },
    
    // { type: "select", name: "category", hidden: false, label: "类别", required: true, placeholder: "请选择类别", selectOptions: [
    //   { label: "RPA", value: "RPA" },
    //   { label: "Bi预策", value: "Bi预策" },
    //   { label: "WEB", value: "WEB" },
    //   { label: "Agent", value: "Agent" }
    // ]},
    { type: "input", name: "implementPerson", hidden: false, label: "负责人", required: true, placeholder: "请输入负责人" },
    { type: "textArea", name: "remark", hidden: false, label: "备注", placeholder: "请输入备注" },
    { type: "upload", name: "attachments", label: "上传需求附件", hidden: false, multiple: true, listType: "text", onChange: (info: any) => {
      if (info.file.status === 'done') {
        console.log("上传成功：", info.file.response);
      }
    }}
  ];
  return (
    <div style={{ border: 0, padding: 5, background: "#fafafa" }}>
    <Card title="任务详情" bordered>
      <MyForm
        initialValues={handleItem ? handleItem : undefined}
        fields={formFields}
        showOk
        showCancel
        footerStyle="end"
        okLoading={loadings[0]}
        onFinish={modalType === "add" ? addTask : editTask}
        onCancel={closeModal}
      />
    </Card>
  </div>
    
  );
}
