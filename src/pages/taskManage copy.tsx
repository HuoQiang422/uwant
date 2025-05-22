import { Button, Space, TableColumnsType, Tag, Table, Drawer, Row, Col, Card, Modal } from "antd";
import { useState } from "react";
import { useSelector } from "react-redux";
import MyTable from "../components/public/myTable";
import { TimeTag } from "../components/public/myTag";
import TableSearchBar from "../components/public/tableSearchBar";
import { API_TASKS_DELETE, API_TASKS_GET_ALL } from "../config/api";
import useFresh from "../hook/useFresh";
import { User } from "../redux/user";
import AddOrEditTask from "../components/demandTasks/AddTask";
import { transformRangePickerTime } from "../utils/transformData";
import Divider from "antd/lib/divider";
import PageHeaderSpace from "../components/public/pageHeaderSpace";
import Confirm from "../components/public/confirm";
import { del } from "../utils/request";
import { enterLoading, leaveLoading } from "../utils/controllerUtils";

export default function TaskManagement() {
    const [searchParams, setSearchParams] = useState<any>();
    const token = useSelector((state: { user: User }) => state.user.token);
    const [loadings, setLoadings] = useState<boolean[]>([]);
    const { key, refresh } = useFresh();
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [subTasks, setSubTasks] = useState<any[]>([]);
    const [modalType, setModalType] = useState<string>("");
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [handleItem, setHandleItem] = useState<any>();

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
            title: "任务描述",
            fixed: "left",
            width: 300,
            dataIndex: ["mainTask", "description"],
            key: "description",
        },
        {
            title: "类别",
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
                <Tag color={
                    text === "RPA" ? "green" :
                        text === "Bi预策" ? "blue" :
                            text === "web开发" ? "pink" :
                                "default"
                }>
                    {text}
                </Tag>
            ),
        },
        {
            title: "优先级",
            width: 100,
            dataIndex: ["mainTask", "priority"],
            key: "priority",
            filters: [
                { text: "P0", value: "P0" },
                { text: "P1", value: "P1" },
                { text: "P2", value: "P2" },
            ],
            onFilter: (value, record) => record.mainTask.priority === value,
            render: (text) => (
                <Tag color={text === "P0" ? "red" : text === "P1" ? "orange" : "blue"}>
                    {text}
                </Tag>
            ),
        },
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
                <Tag color={
                    text === "已完成" ? "green" :
                        text === "进行中" ? "blue" :
                            "default"
                }>
                    {text}
                </Tag>
            ),
        },
        {
            title: "需求方",
            width: 120,
            dataIndex: ["mainTask", "contactPerson"],
            key: "contactPerson",
        },
        {
            title: "实施方",
            width: 120,
            dataIndex: ["mainTask", "implementPerson"],
            key: "contactPerson",
        },
        {
            title: "创建时间",
            width: 180,
            dataIndex: ["mainTask", "createdAt"],
            key: "createdAt",
            render: (text) => <TimeTag text={text} />,
        },
        {
            title: "更新时间",
            width: 180,
            dataIndex: ["mainTask", "updatedAt"],
            key: "updatedAt",
            render: (text) => <TimeTag text={text} />,
        },
        {
            title: "完成时间",
            width: 180,
            dataIndex: ["mainTask", "completedAt"],
            key: "completedAt",
            render: (text) => <TimeTag text={text} />,
        },
        {
            title: "备注",
            width: 200,
            dataIndex: ["mainTask", "remark"],
            key: "remark",
        },
        {
            title: "操作",
            fixed: "right",
            width: 120,

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
            // render: (_, record) => (
            //     <Space size="middle">
            //         <Button
            //             size="small"
            //             type="link"
            //             onClick={() => {
            //                 setSubTasks(record.subTasks);
            //                 setDrawerVisible(true);
            //                 // 这里可以添加查看详情或编辑的操作
            //             }}
            //         >
            //             查看子任务
            //         </Button>
            //     </Space>
            // ),

        },
    ];
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

    // 子任务表格列配置
    // const expandedRowRender = (record: any) => {
    //     const subTaskColumns: TableColumnsType<any> = [
    //         // {
    //         //     title: "子任务ID",
    //         //     width: 100,
    //         //     dataIndex: "subTaskId",
    //         //     key: "subTaskId",
    //         // },
    //         {
    //             fixed: "left",
    //             title: "任务描述",
    //             width: 300,
    //             dataIndex: "description",
    //             key: "description",
    //         },
    //         {
    //             title: "类别",
    //             width: 120,
    //             dataIndex: "category",
    //             key: "category",
    //         },
    //         {
    //             title: "优先级",
    //             width: 100,
    //             dataIndex: "priority",
    //             key: "priority",
    //             render: (text) => (
    //                 <Tag color={text === "P1" ? "red" : text === "P2" ? "orange" : "blue"}>
    //                     {text}
    //                 </Tag>
    //             ),
    //         },
    //         {
    //             title: "状态",
    //             width: 120,
    //             dataIndex: "status",
    //             key: "status",
    //             render: (text) => (
    //                 <Tag color={
    //                     text === "已完成" ? "green" : 
    //                     text === "进行中" ? "blue" : 
    //                     "default"
    //                 }>
    //                     {text}
    //                 </Tag>
    //             ),
    //         },
    //         {
    //             title: "负责人",
    //             width: 120,
    //             dataIndex: "implementPerson",
    //             key: "implementPerson",
    //         },
    //         {
    //             title: "联系人",
    //             width: 120,
    //             dataIndex: "contactPerson",
    //             key: "contactPerson",
    //         },
    //         {
    //             title: "创建时间",
    //             width: 180,
    //             dataIndex: "createdAt",
    //             key: "createdAt",
    //             render: (text) => <TimeTag text={text} />,
    //         },
    //         {
    //             title: "更新时间",
    //             width: 180,
    //             dataIndex: "updatedAt",
    //             key: "updatedAt",
    //             render: (text) => <TimeTag text={text} />,
    //         },
    //         {
    //             title: "完成时间",
    //             width: 180,
    //             dataIndex: "completedAt",
    //             key: "completedAt",
    //             render: (text) => <TimeTag text={text} />,
    //         },
    //         {
    //             title: "备注",
    //             width: 200,
    //             dataIndex: "remark",
    //             key: "remark",
    //         },
    //         {
    //             title: "操作",
    //             fixed: "right",
    //             width: 120,
    //             render: (_, record) => (
    //                 <Space size="middle">
    //                     <Button
    //                         size="small"
    //                         type="link"
    //                         onClick={() => {
    //                             // 这里可以添加查看详情或编辑的操作
    //                         }}
    //                     >
    //                         查看详情
    //                     </Button>
    //                     <Button
    //                         size="small"
    //                         type="link"
    //                         onClick={() => {
    //                             // 这里可以添加查看详情或编辑的操作
    //                         }}
    //                     >
    //                         查看附件
    //                     </Button>
    //                 </Space>
    //             ),
    //         },
    //     ];

    //     return (
    //         <Table
    //             columns={subTaskColumns}
    //             dataSource={record.subTasks}
    //             pagination={false}
    //             size="small"
    //         />
    //     );
    // };

    return (
        <>
            {/* <TableSearchBar
                fields={[
                    {
                        type: "input",
                        placeholder: "任务描述",
                        name: "description",
                    },
                    {
                        type: "select",
                        placeholder: "类别",
                        name: "category",
                        selectOptions: [
                            { label: "调研", value: "调研" },
                            { label: "开发", value: "开发" },
                            { label: "测试", value: "测试" },
                        ],
                    },
                    {
                        type: "select",
                        placeholder: "优先级",
                        name: "priority",
                        selectOptions: [
                            { label: "P1", value: "P1" },
                            { label: "P2", value: "P2" },
                            { label: "P3", value: "P3" },
                        ],
                    },
                    {
                        type: "select",
                        placeholder: "状态",
                        name: "status",
                        selectOptions: [
                            { label: "待处理", value: "待处理" },
                            { label: "进行中", value: "进行中" },
                            { label: "已完成", value: "已完成" },
                        ],
                    },
                    {
                        type: "rangePicker",
                        name: "date",
                    },
                ]}
                onFinish={(e) => {
                    if (e.date) {
                        const time = transformRangePickerTime(e.date);
                        e.startTime = time.startTime;
                        e.endTime = time.endTime;
                    }
                    delete e.date;
                    setSearchParams(e);
                }}
                rows={1}
            /> */}
            <PageHeaderSpace>
                <Button
                    onClick={() => {
                        setModalType("add");
                        openModal();
                    }}
                    type="primary"
                >
                    新增任务
                </Button>
            </PageHeaderSpace>
            <MyTable
                dataKey="content"
                tableKey={key}
                columns={columns}
                params={{ searchParams: searchParams }}
                getListUrl={API_TASKS_GET_ALL}
            // expandable={{
            //     expandedRowRender,
            //     rowExpandable: (record) => record.subTasks && record.subTasks.length > 0,
            // }}
            />
            <Drawer
                title="子任务详情"
                placement="right"
                width={600}
                onClose={() => setDrawerVisible(false)}
                visible={drawerVisible}
            >
                <Row gutter={[16, 16]}>
                    {subTasks.map((task, index) => (
                        <Col span={24} key={index}>
                            <Card
                                title={<span style={{ fontSize: '16px', fontWeight: 'bold' }}>{task.description}</span>}
                                hoverable
                                style={{ borderRadius: '8px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}
                            >
                                <p><Tag color="geekblue">{task.category}</Tag></p>
                                <p><Tag color={task.priority === "P1" ? "red" : task.priority === "P2" ? "orange" : "blue"}>{task.priority}</Tag></p>
                                <p><Tag color={task.status === "已完成" ? "green" : task.status === "进行中" ? "blue" : "default"}>{task.status}</Tag></p>
                                <Divider />
                                <p><b>负责人:</b> {task.implementPerson}</p>
                                <p><b>联系人:</b> {task.contactPerson}</p>
                                <p><b>备注:</b> {task.remark}</p>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Drawer>
            <Modal
                open={modalOpen}
                title={
                    modalType === "add"
                        ? "新增任务"
                        : modalType === "edit"
                            ? "修改任务"
                            : ""
                }
                centered
                onCancel={closeModal}
                footer={null}
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


