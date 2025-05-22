import { Button, Space, TableColumnsType, Tag, Table, Drawer, Row, Col, Card, Modal, Progress, Descriptions, Tooltip } from "antd";
import { useState } from "react";
import dayjs from 'dayjs';
import { useSelector } from "react-redux";
import MyTable from "../components/public/myTable";
import { API_TASKS_DELETE, API_TASKS_GET_ALL } from "../config/api";
import useFresh from "../hook/useFresh";
import { User } from "../redux/user";
import AddOrEditTask from "../components/demandTasks/AddTask";
import PageHeaderSpace from "../components/public/pageHeaderSpace";
import Confirm from "../components/public/confirm";
import { del } from "../utils/request";
import { enterLoading, leaveLoading } from "../utils/controllerUtils";
import { Timeline } from "antd";
import { ClockCircleOutlined, CheckCircleOutlined } from "@ant-design/icons";
import { Typography } from 'antd';
import { Badge } from 'antd';
import { Avatar } from 'antd';


export default function TaskManagement() {
    const statusColorMap = {
        '待处理': 'gray',
        '进行中': 'blue',
        '已完成': 'green',
      };
    const [searchParams, setSearchParams] = useState<any>();
    const token = useSelector((state: { user: User }) => state.user.token);
    const [loadings, setLoadings] = useState<boolean[]>([]);
    const { key, refresh } = useFresh();
    const { Text } = Typography;
    const [subTasks, setSubTasks] = useState<any[]>([]);
    const [modalType, setModalType] = useState<string>("");
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [handleItem, setHandleItem] = useState<any>();

    const [selectedTask, setSelectedTask] = useState<any>(null);
    const [drawerVisible, setDrawerVisible] = useState(false);

    function openModal() {
        setModalOpen(true);
    }
    function closeModal() {
        setHandleItem(null);
        setModalOpen(false);
    }

    // 主任务表格列配置
    const columns: TableColumnsType<any> = [
        // {
        //     title: "任务ID",
        //     width: 100,
        //     dataIndex: ["mainTask", "taskId"],
        //     key: "taskId",
        //     fixed: "left",
        // },
        {
            title: '任务描述',
            dataIndex: ['mainTask', 'description'],
            key: 'description',
            width: 250,
            fixed: 'left',
            ellipsis: {
              showTitle: false,
            },
            render: (text) => (
              <Tooltip placement="topLeft" title={text}>
                {text}
              </Tooltip>
            ),
          },
          
        // {
        //     title: "任务描述",
        //     fixed: "left",
        //     width: 300,
        //     dataIndex: ["mainTask", "description"],
        //     key: "description",
        // },
        {
            title: "分类",
            width: 120,
            dataIndex: ["mainTask", "category"],
            key: "category",
            filters: [
              { text: "RPA", value: "RPA" },
              { text: "Bi预策", value: "Bi预策" },
              { text: "web开发", value: "web开发" },
            ],
            onFilter: (value, record) => record.mainTask.category === value,
            render: (text) => (
              <Tag
                bordered={false}
                color={
                  text === "RPA" ? "red" :
                  text === "Bi预策" ? "blue" :
                  text === "WEB" ? "pink" :
                  text === "Agent" ? "orange" :
                  "default"
                }
              >
                {text}
              </Tag>
            ),
          },
        // {
        //     title: "优先级",
        //     width: 100,
        //     dataIndex: ["mainTask", "priority"],
        //     key: "priority",
        //     filters: [
        //         { text: "P0", value: "P0" },
        //         { text: "P1", value: "P1" },
        //         { text: "P2", value: "P2" },
        //     ],
        //     onFilter: (value, record) => record.mainTask.priority === value,
        //     render: (text) => (
        //         <Tag color={text === "P0" ? "red" : text === "P1" ? "orange" : "blue"}>
        //             {text}
        //         </Tag>
        //     ),
        // },
        {
            title: "状态",
            width: 120,
            dataIndex: ["mainTask", "status"],
            key: "status",
            filters: [
              { text: "待处理", value: "待处理" },
              { text: "进行中", value: "进行中" },
              { text: "已完成", value: "已完成" },
            ],
            onFilter: (value, record) => record.mainTask.status === value,
            render: (text) => (
              <Badge color={statusColorMap[text] || 'default'} text={text} />
            ),
          },
          {
            title: "对接人",
            width: 160,
            dataIndex: ["mainTask", "implementPerson"],
            key: "contactPerson",
            render: (text) => (
              <Space>
                <Avatar
                  src={`https://api.dicebear.com/7.x/notionists/svg?seed=${encodeURIComponent(text)}`}
                />
                {text}
              </Space>
            ),
          },
        // {
        //     title: "对接人",
        //     width: 120,
        //     dataIndex: ["mainTask", "implementPerson"],
        //     key: "contactPerson",
        // },
        {
            title: "创建/更新时间",
            width: 180,
            key: "timeInfo",
            render: (_, record) => (
              <div>
                <Tag color="orange" style={{ marginBottom: 4 }} bordered={false}>
                创建: {dayjs(record.mainTask.createdAt).format('YYYY-MM-DD HH:mm:ss')}
                </Tag>
                <br />
                <Tag color="blue" bordered={false}>
                更新: {dayjs(record.mainTask.updatedAt).format('YYYY-MM-DD HH:mm:ss')}
                </Tag>
              </div>
            ),
          },
          
          
        // {
        //     title: "创建时间",
        //     width: 180,
        //     dataIndex: ["mainTask", "createdAt"],
        //     key: "createdAt",
        //     render: (text) => <TimeTag text={text} />,
        // },
        // {
        //     title: "更新时间",
        //     width: 180,
        //     dataIndex: ["mainTask", "updatedAt"],
        //     key: "updatedAt",
        //     render: (text) => <TimeTag text={text} />,
        // },
        {
            title: "完成时间",
            width: 180,
            dataIndex: ["mainTask", "completedAt"],
            key: "completedAt",
            render: (text) => (
              <Tag color="geekblue" bordered={false}>
                 {text ? dayjs(text).format('YYYY-MM-DD HH:mm:ss') : '--'}
              </Tag>
            ),
          },
        {
            title: "备注",
            width: 250,
            dataIndex: ["mainTask", "remark"],
            key: "remark",
        },
        {
            title: "操作",
            fixed: "right",
            width: 120,
            className: "operation-column",
            render: (_, record) => (
                <Space size="middle">
                    <Button
                        size="small"
                        type="link"
                        onClick={() => {
                            setModalType("edit");
                            openModal();
                            setHandleItem(record.mainTask);
                        }}
                    >
                        编辑
                    </Button>
                    <Confirm
                        confirmTitle="是否确认删除？"
                        buttonText="删除"
                        danger
                        loading={loadings[record.mainTask.taskId]}
                        onConfirm={() => {
                            deleteTemplate(record.mainTask.taskId);
                        }}
                    />
                </Space>
            ),

        },
    ];
    const handleRowClick = (record: any, event: React.MouseEvent<HTMLElement>) => {
        const targetElement = event.target as HTMLElement;

      // 判断是否点击的是操作列的按钮
      if (
        targetElement.closest(".operation-column") || // 如果点击的是操作列
        targetElement.closest("button")               // 或者是按钮
      ) {
        return; // 不执行任何操作
      }
        setSelectedTask(record.mainTask);
        setDrawerVisible(true);
      };
    function deleteTemplate(id: any) {
        enterLoading(id, setLoadings);
        del({
            url: API_TASKS_DELETE,
            id: id,        // 传入你要删除的 ID
            token
        })
            .then((res) => {
                if (res) {
                    refresh(); // 请求成功后刷新数据
                }
            })
            .finally(() => {
                leaveLoading(5, setLoadings); // 完成后移除加载状态
            });
    }
    // const getProgress = (status: string) => {
    //     switch (status) {
    //       case "待处理":
    //         return 0;
    //       case "进行中":
    //         return 50;
    //       case "已完成":
    //         return 100;
    //       default:
    //         return 0;
    //     }
    //   };

    return (
        <>
            { }
            <PageHeaderSpace>
                <Button
                    onClick={() => {
                        setModalType("add");
                        openModal();
                    }}
                    type="primary"
                >
                    创建需求
                </Button>
            </PageHeaderSpace>
            <MyTable
                dataKey="content"
                tableKey={key}
                columns={columns}
                onRowClick={handleRowClick}
                params={{ searchParams: searchParams }}
                getListUrl={API_TASKS_GET_ALL}
            />
            <Drawer
                title="任务进度"
                placement="right"
                onClose={() => setDrawerVisible(false)}
                open={drawerVisible}
                width={500}
            >
                {selectedTask && (
                    <>
                        <Card title={selectedTask.description} bordered={false} style={{ marginBottom: 16 }}>
                            <p><strong>负责人:</strong> {selectedTask.implementPerson}</p>
                            <p><strong>需求方:</strong> {selectedTask.contactPerson}</p>
                            <p><strong>备注:</strong> {selectedTask.remark}</p>
                        </Card>

                        <Card title="任务进度" bordered={false}>
                            <Timeline mode="left">
                                <Timeline.Item color="green" label={selectedTask.createdAt}>
                                    任务创建
                                </Timeline.Item>

                                {selectedTask.updatedAt && (
                                    <Timeline.Item color="blue" label={selectedTask.updatedAt}>
                                        任务更新
                                    </Timeline.Item>
                                )}

                                {selectedTask.status === "已完成" ? (
                                    <Timeline.Item
                                        color="green"
                                        label={selectedTask.completedAt}
                                        dot={<CheckCircleOutlined />}
                                    >
                                        任务完成
                                    </Timeline.Item>
                                ) : (
                                    <Timeline.Item
                                        color="red"
                                        label="进行中"
                                        dot={<ClockCircleOutlined />}
                                    >
                                        当前状态：{selectedTask.status}
                                    </Timeline.Item>
                                )}
                            </Timeline>
                        </Card>
                    </>
                )}
            </Drawer>
            {/* <Drawer
                title={`任务详情`}
                placement="bottom"
                height={400}
                onClose={() => setDrawerVisible(false)}
                visible={drawerVisible}
            >
                {selectedTask && (
                    <Card title={selectedTask.description} bordered={false} style={{ marginBottom: 16 }}>
                        <p><strong>任务状态:</strong> {selectedTask.status}</p>
                        <p><strong>负责人:</strong> {selectedTask.implementPerson}</p>
                        <p><strong>需求方:</strong> {selectedTask.contactPerson}</p>
                        <p><strong>创建时间:</strong> {selectedTask.createdAt}</p>
                        <p><strong>更新时间:</strong> {selectedTask.updatedAt}</p>
                        <p><strong>完成时间:</strong> {selectedTask.completedAt}</p>
                        <p><strong>备注:</strong> {selectedTask.remark}</p>
                    </Card>
                )}

                <div style={{ marginTop: 20 }}>
                    <h4>任务进度</h4>
                    <Progress
                        percent={getProgress(selectedTask?.status ?? "")}
                        status={
                            selectedTask?.status === "已完成"
                                ? "success"
                                : selectedTask?.status === "进行中"
                                    ? "active"
                                    : "exception"
                        }
                    />
                </div>
            </Drawer> */}
            <Modal
                open={modalOpen}
                title={
                    modalType === "add"
                        ? "创建需求"
                        : modalType === "edit"
                            ? "修改需求"
                            : ""
                }
                centered
                onCancel={closeModal}
                footer={null}
                width={593}
                styles={{ 
                    content: { padding: '20px 0px' },
                    header: { padding: '0px 10px' }
                }}
                destroyOnClose
            >
                <AddOrEditTask
                    modalType={modalType}
                    handleItem={handleItem}
                    closeModal={closeModal}
                    reFresh={refresh}
                />
            </Modal>
        </>
    );
}


