import { Card } from "antd";
import { useState } from "react";
import { useSelector } from "react-redux";
import { API_TASKS_Create, API_TASKS_Update, API_SUB_TASKS_Create, API_SUB_TASKS_Update } from "../../config/api";
import { User } from "../../redux/user";
import { enterLoading, leaveLoading } from "../../utils/controllerUtils";
import { post, put } from "../../utils/request";
import MyForm, { FormField } from "./MyForm";

interface AddOrEditTaskProps {
  modalType: string;
  handleItem: any;
  reFresh: () => void;
  closeModal: () => void;
  mainTaskId?: string;  // 添加主任务ID属性
  selectedSubTask?: any;
  setSelectedSubTask?: (task: any) => void;
}

interface TaskFormData {
  taskId?: string;
  mainTaskId?: string;  // 添加主任务ID字段
  description: string;
  category: string;
  status: string;
  contactPerson?: string;
  implementPerson: string;
  remark?: string;
  attachments?: any[];
}

export default function AddOrEditTask(props: AddOrEditTaskProps) {
  const { modalType, handleItem, reFresh, closeModal, mainTaskId, selectedSubTask, setSelectedSubTask } = props;
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
      attachments: (e as any).attachments ?? [], // 直接使用
    };
  
    console.log("请求数据:", requestData);
  
    post({ 
      url: API_TASKS_Create,
      token,
      data: requestData
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
  

  function editTask(e: TaskFormData) {
    if (!e.taskId) {
      console.error("编辑任务时缺少taskId");
      return;
    }
    enterLoading(0, setLoadings);
    const requestData = {
      taskId: e.taskId.toString(),
      description: e.description,
      category: e.category,
      status: e.status,
      contactPerson: e.contactPerson,
      implementPerson: e.implementPerson,
      remark: e.remark ?? "无",
    };
    console.log("请求数据:", requestData);
    put({
      url: API_TASKS_Update,
      id: e.taskId.toString(),
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

  function addSubTask(e: TaskFormData) {
    if (!mainTaskId) {
      console.error("创建子任务时缺少主任务ID");
      return;
    }

    console.log("开始创建子任务，表单数据:", e);
    enterLoading(0, setLoadings);
  
    const requestData = {
      subTask: {
        description: e.description,
        category: e.category,
        status: e.status ?? "待处理",
        contactPerson: e.contactPerson,
        implementPerson: e.implementPerson,
        remark: e.remark ?? "无",
        
      },
      attachments: e.attachments ?? [],
    };
  
    console.log("发送的请求数据:", requestData);
  
    post({
      url: `${API_SUB_TASKS_Create}?main_id=${mainTaskId}`,
      token,
      data: requestData,
    })
      .then((res) => {
        console.log("创建子任务响应:", res);
        if (res.code === 200) {
          reFresh();
          closeModal();
        }
      })
      .catch(error => {
        console.error("创建子任务失败:", error);
      })
      .finally(() => {
        leaveLoading(0, setLoadings);
      });
  }

  function editSubTask(e: TaskFormData) {
    if (!e.taskId) {
      console.error("编辑子任务时缺少taskId");
      return;
    }
    enterLoading(0, setLoadings);
    const requestData = {
      id: e.taskId.toString(),
      description: e.description,
      category: e.category,
      status: e.status,
      contactPerson: e.contactPerson,
      implementPerson: e.implementPerson,
      remark: e.remark ?? "无",
    };
    console.log("编辑子任务请求数据:", requestData);
    put({
      url: API_SUB_TASKS_Update,
      id: e.taskId.toString(),
      token,
      data: { ...requestData},
    })
      .then((res) => {
        if (res.code === 200) {
          // 更新子任务列表
          if (handleItem?.mainTaskId) {
            // 如果当前选中的子任务被编辑，更新选中状态
            if (selectedSubTask?.subTaskId === e.taskId) {
              setSelectedSubTask({
                ...requestData,
                subTaskId: e.taskId,
                mainTaskId: handleItem.mainTaskId
              });
            }
          }
          reFresh();
          closeModal();
        }
      })
      .finally(() => {
        leaveLoading(0, setLoadings);
      });
  }

  const formFields: FormField[] = [
    { type: "input", name: "taskId", label: "任务id", hidden: true},
    { type: "textArea", name: "description", hidden: false, label: "需求说明", required: true, placeholder: "请输入需求说明" },
  
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
    { type: "select", name: "status", hidden: true, label: "状态", required: false, placeholder: "请选择状态", selectOptions: [
      { label: "待处理", value: "待处理" },
      { label: "进行中", value: "进行中" },
      { label: "已完成 ", value: "已完成" }
      ]},
    
    { type: "input", name: "implementPerson", hidden: false, label: "负责人", required: true, placeholder: "请输入负责人" },
    { type: "textArea", name: "remark", hidden: false, label: "备注", placeholder: "请输入备注" },
    { type: "upload", name: "attachments", label: "上传需求附件", hidden: false, multiple: true, listType: "text", onChange: (info: any) => {
      if (info.file.status === 'done') {
        console.log("上传成功：", info.file.response);
      }
    }}
  ];
  return (
    <div style={{ border: 0, padding: 16, background: "#fafafa"}}>
    <Card title="任务详情" bordered>
      <MyForm 
        initialValues={{
          category: "RPA",
          ...handleItem, // 如果是编辑，覆盖默认值
        }}
        fields={formFields}
        showOk
        showCancel
        style={{ marginBottom: '8px' }}
        footerStyle="end"
        okLoading={loadings[0]}
        onFinish={modalType === "add" ? addTask : 
                 modalType === "addsub" ? addSubTask : 
                 modalType === "editsub" ? editSubTask : 
                 editTask}
        onCancel={closeModal}
      />  
    </Card>
  </div>
    
  );
}
