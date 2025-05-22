import { Button, Space, TableColumnsType, Tag, Table, Drawer, Row, Col, Card, Modal, Progress, Descriptions, Tooltip } from "antd";
import { useEffect, useMemo, useState } from "react";
import dayjs from 'dayjs';
import { useSelector } from "react-redux";
import MyTable from "../components/public/myTable";
import { API_TASKS_DELETE, API_TASKS_GET_ALL, API_TASKS_PROGRESS, API_TASKS_ATTACHMENTS, API_ADD_TASKS_PROGRESS, API_SUB_TASKS_DELETE } from "../config/api";
import useFresh from "../hook/useFresh";
import { User } from "../redux/user";
import AddOrEditTask from "../components/demandTasks/AddTask";
import PageHeaderSpace from "../components/public/pageHeaderSpace";
import Confirm from "../components/public/confirm";
import { del, post } from "../utils/request";
import { enterLoading, leaveLoading } from "../utils/controllerUtils";
import { Typography } from 'antd';
import { Badge } from 'antd';
import { Avatar } from 'antd';
import { FileTextOutlined, FileImageOutlined, FilePdfOutlined, FileExcelOutlined, FileWordOutlined, FileZipOutlined, FileOutlined } from '@ant-design/icons';

interface TaskProgress {
    progressId: string;
    status: string;
    remark: string;
    implementPerson: string;
    createdAt: string;
    updatedAt: string;
    subTaskId?: string;
}

export default function TaskManagement() {
    const statusColorMap: Record<string, string> = {
        '待处理': 'gray',
        '进行中': 'blue',
        '已完成': 'green',
    };
    const [searchParams, setSearchParams] = useState<any>();
    const token = useSelector((state: { user: User }) => state.user.token);
    const username = useSelector((state: { user: User }) => state.user.username);
    const [loadings, setLoadings] = useState<boolean[]>([]);
    const { key, refresh } = useFresh();
    const { Text } = Typography;
    const [subTasks, setSubTasks] = useState<any[]>([]);
    const [modalType, setModalType] = useState<string>("");
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [handleItem, setHandleItem] = useState<any>();

    const [selectedTask, setSelectedTask] = useState<any>(null);
    const [selectedSubTask, setSelectedSubTask] = useState<any>(null);
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [progressList, setProgressList] = useState<TaskProgress[]>([]);
    const [attachmentsList, setAttachmentsList] = useState<any[]>([]);

    function openModal() {
        setModalOpen(true);
    }
    function closeModal() {
        setHandleItem(null);
        setModalOpen(false);
    }

    // 主任务表格列配置
    const columns: TableColumnsType<any> = [
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
        {
            title: "创建/更新时间",
            width: 180,
            key: "timeInfo",
            sorter: (a, b) => dayjs(a.mainTask.updatedAt).valueOf() - dayjs(b.mainTask.updatedAt).valueOf(),
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
        //     title: "完成时间",
        //     width: 180,
        //     dataIndex: ["mainTask", "completedAt"],
        //     key: "completedAt",
        //     render: (text) => (
        //         <Tag color="geekblue" bordered={false}>
        //             {text ? dayjs(text).format('YYYY-MM-DD HH:mm:ss') : '--'}
        //         </Tag>
        //     ),
        // },
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
                            console.log('Edit button clicked - Original taskId:', record.mainTask.taskId);
                            setModalType("edit");
                            openModal();
                            setHandleItem({
                                ...record.mainTask,
                                taskId: record.mainTask.taskId.toString()
                            });
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
                            console.log('Delete confirmed - taskId:', record.mainTask.taskId);
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
        console.log('handleRowClick - Original taskId:', record.mainTask.taskId);
        setSubTasks(record.subTasks || []);
        setSelectedTask({
            ...record.mainTask,
            taskId: record.mainTask.taskId.toString() // 确保ID作为字符串存储
        });
        setSelectedSubTask(null);
        setDrawerVisible(true);
    };

    const handleSubTaskRowClick = (record: any) => {
        setSelectedSubTask({
            ...record,
            subTaskId: record.subTaskId.toString() // 确保ID作为字符串存储
        });
    };

    function deleteTemplate(id: any, isSubTask: boolean = false) {
        console.log('deleteTemplate - Received id:', id, 'isSubTask:', isSubTask);
        enterLoading(id, setLoadings);
        del({
            url: isSubTask ? API_SUB_TASKS_DELETE : API_TASKS_DELETE,
            id: id,
            token
        })
            .then((res) => {
                if (res) {
                    if (isSubTask) {
                        // 更新子任务列表
                        setSubTasks(prevTasks => prevTasks.filter(task => task.subTaskId !== id));
                        // 如果删除的是当前选中的子任务，清除选中状态
                        if (selectedSubTask?.subTaskId === id) {
                            setSelectedSubTask(null);
                        }
                    }
                    refresh(); // 请求成功后刷新数据
                }
            })
            .finally(() => {
                leaveLoading(5, setLoadings); // 完成后移除加载状态
            });
    }

    const progressColumns: TableColumnsType<TaskProgress> = [
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            render: (text: string) => (
                <Badge color={statusColorMap[text] || 'default'} text={text} />
            ),
        },
        {
            title: '备注',
            dataIndex: 'remark',
            key: 'remark',
        },
        {
            title: '实施人',
            dataIndex: 'implementPerson',
            key: 'implementPerson',
            render: (text: string) => (
                <Space>
                    <Avatar size="small" src={`https://api.dicebear.com/7.x/notionists/svg?seed=${encodeURIComponent(text)}`} />
                    <span>{text}</span>
                </Space>
            ),
        },
        {
            title: '创建时间',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (text: string) => dayjs(text).format('YYYY-MM-DD HH:mm:ss'),
        },
        {
            title: '更新时间',
            dataIndex: 'updatedAt',
            key: 'updatedAt',
            render: (text: string) => dayjs(text).format('YYYY-MM-DD HH:mm:ss'),
        },
    ];

    const getFileIcon = (fileName: string) => {
        const extension = fileName.split('.').pop()?.toLowerCase();
        const iconStyle = { fontSize: '20px' };
        switch (extension) {
            case 'pdf':
                return <FilePdfOutlined style={{ color: '#ff4d4f', ...iconStyle }} />;
            case 'doc':
            case 'docx':
                return <FileWordOutlined style={{ color: '#1890ff', ...iconStyle }} />;
            case 'xls':
            case 'xlsx':
                return <FileExcelOutlined style={{ color: '#52c41a', ...iconStyle }} />;
            case 'jpg':
            case 'jpeg':
            case 'png':
            case 'gif':
                return <FileImageOutlined style={{ color: '#722ed1', ...iconStyle }} />;
            case 'zip':
            case 'rar':
            case '7z':
                return <FileZipOutlined style={{ color: '#faad14', ...iconStyle }} />;
            case 'txt':
                return <FileTextOutlined style={{ color: '#13c2c2', ...iconStyle }} />;
            default:
                return <FileOutlined style={{ color: '#8c8c8c', ...iconStyle }} />;
        }
    };

    const handleFileDownload = async (file: { attachmentName: string; attachmentPath: string }, subTaskId?: string) => {
        try {
            const mark = `${username}下载了${file.attachmentName}`;
            const url = `${API_ADD_TASKS_PROGRESS}?main_id=${selectedTask.taskId}${subTaskId ? `&sub_id=${subTaskId}` : ''}`;

            await post({
                url,
                data: {
                    mark,
                    username
                },
                token
            });

            // 刷新进度列表
            refresh();
        } catch (error) {
            console.error('Failed to update progress:', error);
        }
    };

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
                params={{ 
                    searchParams: searchParams, 
                    main_id: selectedTask?.taskId ? selectedTask.taskId.toString() : '' 
                }}
                getListUrl={API_TASKS_GET_ALL}
                getProgress={API_TASKS_PROGRESS}
                getAttachments={API_TASKS_ATTACHMENTS}
                onProgressData={(data) => {
                    console.log('Progress data:', data);
                    setProgressList(data);
                }}
                onAttachmentsData={(data) => {
                    console.log('Attachments data:', data);
                    setAttachmentsList(data);
                }}
            />
            <Drawer
                title="需求详情"
                placement="right"
                onClose={() => setDrawerVisible(false)}
                open={drawerVisible}
                width={1400}
                styles={{
                    body: {
                        background: '#f5f5f5',
                        padding: '16px'
                    }
                }}
            >
                {selectedTask && (
                    <Row gutter={[16, 16]}>
                        <Col span={24}>
                            <Card title="主任务详情" bordered={false}>
                                {/* 第一行 */}
                                <Row justify="space-between" align="middle" style={{ marginBottom: 30 }}>
                                    <Col span={16}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                            {/* 任务描述 */}
                                            <Tooltip title={selectedTask.description}>
                                                <span style={{ maxWidth: 200, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', display: 'inline-block', fontWeight: 500 }}>
                                                    {selectedTask.description}
                                                </span>
                                            </Tooltip>

                                            {/* 任务ID 可复制 */}
                                            <Typography.Text copyable type="secondary">
                                                ID: {selectedTask.taskId}
                                            </Typography.Text>

                                            {/* 状态 */}
                                            <Badge color={statusColorMap[selectedTask.status] || 'default'} text={selectedTask.status} />
                                        </div>
                                    </Col>
                                    <Col>
                                        <Space>
                                            <Button onClick={() => {
                                                // 刷新主任务数据
                                                refresh();
                                                // 重新获取子任务列表
                                                if (selectedTask) {
                                                    setSubTasks(prevTasks => 
                                                        prevTasks.filter(st => st.mainTaskId === selectedTask.taskId)
                                                    );
                                                }
                                                // 如果当前有选中的子任务，清除选中状态
                                                if (selectedSubTask) {
                                                    setSelectedSubTask(null);
                                                }
                                            }}>刷新</Button>
                                            <Button type="primary" onClick={() => {
                                                setModalType('addsub');
                                                setHandleItem(selectedTask);  // 设置当前选中的主任务
                                                openModal();
                                            }}>创建子任务</Button>
                                        </Space>
                                    </Col>
                                </Row>

                                {/* 第二行 */}
                                <Row align="middle" gutter={[16, 16]}>
                                    <Col>
                                        <Space>
                                            <Avatar src={`https://api.dicebear.com/7.x/notionists/svg?seed=${encodeURIComponent(selectedTask.implementPerson)}`} />
                                            <span><strong>{selectedTask.contactPerson}</strong></span>
                                        </Space>
                                    </Col>
                                    <Col>
                                        <span>创建于：{dayjs(selectedTask.createdAt).format('YYYY-MM-DD HH:mm:ss')}</span>
                                    </Col>
                                    <Col>
                                        <Tag color="blue">{selectedTask.category}</Tag>
                                    </Col>
                                    <Col>
                                        对接人：{selectedTask.implementPerson}
                                    </Col>
                                    <Col style={{ marginLeft: 'auto' }}>
                                        <Space>
                                            <span>附件：</span>
                                            {attachmentsList
                                                .filter((attachment: any) => !attachment.subTaskId)
                                                .map((file: { attachmentName: string; attachmentPath: string }, index: number) => (
                                                    <Tooltip title={file.attachmentName} key={index}>
                                                        <a
                                                            href={file.attachmentPath}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            download
                                                            onClick={() => handleFileDownload(file)}
                                                        >
                                                            {getFileIcon(file.attachmentName)}
                                                        </a>
                                                    </Tooltip>
                                                ))}
                                        </Space>
                                    </Col>
                                </Row>
                            </Card>
                        </Col>

                        <Col span={24}>
                            <Card title="子任务列表" bordered={false}>
                                <Table
                                    dataSource={subTasks.filter(st => st.mainTaskId === selectedTask.taskId)}
                                    rowKey="subTaskId"
                                    pagination={{ pageSize: 5 }}
                                    onRow={(record) => ({
                                        onClick: () => handleSubTaskRowClick(record),
                                        style: { cursor: 'pointer' }
                                    })}
                                    rowClassName={(record) => record.subTaskId === selectedSubTask?.subTaskId ? 'ant-table-row-selected' : ''}
                                    columns={[
                                        {
                                            title: '任务详情',
                                            dataIndex: 'description',
                                            width: 200,
                                            ellipsis: true,
                                            render: (text: string) => (
                                                <Tooltip title={text}>
                                                    <span>{text}</span>
                                                </Tooltip>
                                            ),
                                        },
                                        {
                                            title: '实施人',
                                            width: 100,
                                            dataIndex: 'implementPerson',
                                            render: (text: string) => (
                                                <Space>
                                                    <Avatar size="small" src={`https://api.dicebear.com/7.x/notionists/svg?seed=${encodeURIComponent(text)}`} />
                                                    <span>{text}</span>
                                                </Space>
                                            ),
                                        },
                                        {
                                            title: '状态',
                                            dataIndex: 'status',
                                            width: 90,
                                            render: (text: string) => (
                                                <Badge color={statusColorMap[text] || 'default'} text={text} />
                                            ),
                                        },
                                        {
                                            title: "创建/更新时间",
                                            width: 190,
                                            key: "timeInfo",
                                            render: (_, subTasks) => (
                                                <div>
                                                    <Tag color="orange" style={{ marginBottom: 4 }} bordered={false}>
                                                        创建: {dayjs(subTasks.createdAt).format('YYYY-MM-DD HH:mm:ss')}
                                                    </Tag>
                                                    <br />
                                                    <Tag color="blue" bordered={false}>
                                                        更新: {dayjs(subTasks.updatedAt).format('YYYY-MM-DD HH:mm:ss')}
                                                    </Tag>
                                                </div>
                                            ),
                                        },
                                        {
                                            title: '备注',
                                            width: 160,
                                            dataIndex: 'remark',
                                            render: (text: string) => text || '--',
                                        },
                                        {
                                            title: '附件',
                                            dataIndex: 'attachments',
                                            width: 200,
                                            render: (_, record) => {
                                                const taskAttachments = attachmentsList.filter(
                                                    (attachment: { subTaskId: string }) => attachment.subTaskId === record.subTaskId
                                                );
                                                return taskAttachments.length > 0 ? (
                                                    <Space size="small">
                                                        {taskAttachments.map((file: { attachmentName: string; attachmentPath: string }, index: number) => (
                                                            <Tooltip title={file.attachmentName} key={index}>
                                                                <a
                                                                    href={file.attachmentPath}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    download
                                                                    onClick={() => handleFileDownload(file, record.subTaskId)}
                                                                >
                                                                    {getFileIcon(file.attachmentName)}
                                                                </a>
                                                            </Tooltip>
                                                        ))}
                                                    </Space>
                                                ) : '--';
                                            },
                                        },
                                        {
                                            title: "操作",
                                            fixed: "right",
                                            width: 160,
                                            className: "operation-column",
                                            render: (_, record) => (
                                                <Space size="middle">
                                                    <Button
                                                        size="small"
                                                        type="link"
                                                        onClick={() => {
                                                            setModalType("editsub");
                                                            openModal();
                                                            setHandleItem({
                                                                ...record,
                                                                taskId: record.subTaskId.toString()
                                                            });
                                                        }}
                                                    >
                                                        编辑
                                                    </Button>
                                                    <Confirm
                                                        confirmTitle="是否确认删除？"
                                                        buttonText="删除"
                                                        danger
                                                        loading={loadings[record.subTaskId]}
                                                        onConfirm={() => {
                                                            deleteTemplate(record.subTaskId, true);
                                                        }}
                                                    />
                                                </Space>
                                            ),
                                
                                        },
                                    ]}
                                />
                            </Card>
                        </Col>

                        <Col span={24}>
                            <Card title="任务进度" bordered={false}>
                                <Table
                                    dataSource={selectedSubTask 
                                        ? progressList.filter(p => p.subTaskId === selectedSubTask.subTaskId)
                                        : progressList}
                                    rowKey="progressId"
                                    pagination={{pageSize: 10}}
                                    columns={[
                                        {
                                            title: "操作时间",
                                            width: 180,
                                            key: "timeInfo",
                                            render: (_, record) => (
                                                <div>
                                                    <Tag color="orange" style={{ marginBottom: 4 }} bordered={false}>
                                                        {dayjs(record.createdAt).format('YYYY-MM-DD HH:mm:ss')}
                                                    </Tag>
                                                </div>
                                            ),
                                        },
                                        {
                                            title: '任务描述',
                                            width: 200,
                                            ellipsis: true,
                                            render: (_, record) => {
                                                if (record.subTaskId) {
                                                    const subTask = subTasks.find(st => st.subTaskId === record.subTaskId);
                                                    return (
                                                        <Tooltip title={subTask?.description || '--'}>
                                                            <Badge color="green" text={subTask?.description || '--'} />
                                                        </Tooltip>
                                                    );
                                                } else {
                                                    return (
                                                        <Tooltip title={selectedTask?.description || '--'}>
                                                            <Badge color="red" text={selectedTask?.description || '--'} />
                                                        </Tooltip>
                                                    );
                                                }
                                            }
                                        },
                                        {
                                            title: '操作者',
                                            width: 100,
                                            dataIndex: 'implementPerson',
                                            render: (text: string) => (
                                                <Space>
                                                    <Avatar size="small" src={`https://api.dicebear.com/7.x/notionists/svg?seed=${encodeURIComponent(text)}`} />
                                                    <span>{text}</span>
                                                </Space>
                                            ),
                                        },
                                        {
                                            title: '状态',
                                            dataIndex: 'status',
                                            width: 160,
                                            render: (text: string) => (
                                                <Badge color={statusColorMap[text] || 'default'} text={text} />
                                            ),
                                        },
                                        {
                                            title: '备注',
                                            dataIndex: 'remark',
                                            width: 190,
                                            ellipsis: true,
                                            render: (text: string) => (
                                                <Tooltip title={text}>
                                                    <span>{text || '--'}</span>
                                                </Tooltip>
                                            ),
                                        }

                                    ]}
                                />
                            </Card>
                        </Col>
                    </Row>
                )}
            </Drawer>

            <Modal
                open={modalOpen}
                title={
                    modalType === "add"
                        ? "创建需求"
                        : modalType === "edit"
                            ? "修改需求"
                            : modalType === "addsub"
                                ? "创建子任务"
                                : modalType === "editsub"
                                ? "修改子任务"
                                : ""
                }
                centered
                width={593}
                onCancel={closeModal}
                footer={null}
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
                    mainTaskId={handleItem?.taskId}
                    selectedSubTask={selectedSubTask}
                    setSelectedSubTask={setSelectedSubTask}
                />
            </Modal>
        </>
    );
}


