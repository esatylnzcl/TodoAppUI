import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Card,
  Button,
  Table,
  Tag,
  Space,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  Typography,
  message,
  Popconfirm,
} from "antd";
import { Plus, Edit, Trash2 } from "lucide-react";
import { taskService } from "../api/taskService";
import { categoryService } from "../api/categoryService";
import { TaskStatus, TaskStatusLabels } from "../types";
import type { Task, CreateTaskData, UpdateTaskData } from "../types";
import dayjs from "dayjs";

const { Title, Text } = Typography;
const { TextArea } = Input;

const TasksPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [statusFilter, setStatusFilter] = useState<TaskStatus | "all">("all");
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  // Fetch Tasks
  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ["tasks"],
    queryFn: taskService.getTasks,
  });

  // Fetch Categories
  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: categoryService.getCategories,
  });

  // Create Task Mutation
  const createMutation = useMutation({
    mutationFn: (data: CreateTaskData) => taskService.createTask(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      message.success("Görev başarıyla oluşturuldu!");
      handleCloseModal();
    },
    onError: () => {
      message.error("Görev oluşturulamadı!");
    },
  });

  // Update Task Mutation
  const updateMutation = useMutation({
    mutationFn: (data: UpdateTaskData) => taskService.updateTask(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      message.success("Görev başarıyla güncellendi!");
      handleCloseModal();
    },
    onError: () => {
      message.error("Görev güncellenemedi!");
    },
  });

  // Delete Task Mutation
  const deleteMutation = useMutation({
    mutationFn: (id: number) => taskService.deleteTask(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      message.success("Görev başarıyla silindi!");
    },
    onError: () => {
      message.error("Görev silinemedi!");
    },
  });

  const handleOpenModal = (task?: Task) => {
    if (task) {
      setEditingTask(task);
      form.setFieldsValue({
        ...task,
        startDate: task.startDate ? dayjs(task.startDate) : null,
        endDate: task.endDate ? dayjs(task.endDate) : null,
      });
    } else {
      setEditingTask(null);
      form.resetFields();
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
    form.resetFields();
  };

  const handleSubmit = (values: any) => {
    const data = {
      ...values,
      startDate: values.startDate ? values.startDate.toISOString() : undefined,
      endDate: values.endDate ? values.endDate.toISOString() : undefined,
    };

    if (editingTask) {
      updateMutation.mutate({ id: editingTask.id, ...data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleDelete = (id: number) => {
    deleteMutation.mutate(id);
  };

  // Filter tasks by status
  const filteredTasks =
    statusFilter === "all"
      ? tasks
      : tasks.filter((task) => task.status === statusFilter);

  // Status color mapping
  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case TaskStatus.Todo:
        return "blue";
      case TaskStatus.InProgress:
        return "orange";
      case TaskStatus.Completed:
        return "green";
      default:
        return "default";
    }
  };

  // Category color mapping - dinamik renk ataması
  const getCategoryColor = (index: number) => {
    const colors = [
      "purple",
      "cyan",
      "magenta",
      "green",
      "orange",
      "blue",
      "red",
    ];
    return colors[index % colors.length];
  };

  const columns = [
    {
      title: "Başlık",
      dataIndex: "title",
      key: "title",
      render: (text: string) => <span className="font-medium">{text}</span>,
    },
    {
      title: "Açıklama",
      dataIndex: "description",
      key: "description",
      render: (text: string) => (
        <span className="text-gray-400">{text || "-"}</span>
      ),
    },
    {
      title: "Durum",
      dataIndex: "status",
      key: "status",
      render: (status: TaskStatus) => (
        <Tag color={getStatusColor(status)}>{TaskStatusLabels[status]}</Tag>
      ),
    },
    {
      title: "Kategori",
      dataIndex: "categoryName",
      key: "categoryName",
      render: (categoryName: string, record: Task) => {
        const categoryIndex = categories.findIndex(
          (cat) => cat.id === record.categoryId,
        );
        return (
          <Tag color={getCategoryColor(categoryIndex)}>
            {categoryName || "Kategorisiz"}
          </Tag>
        );
      },
    },
    {
      title: "Başlangıç",
      dataIndex: "startDate",
      key: "startDate",
      render: (date: string) => (date ? dayjs(date).format("DD/MM/YYYY") : "-"),
    },
    {
      title: "Bitiş",
      dataIndex: "endDate",
      key: "endDate",
      render: (date: string) => (date ? dayjs(date).format("DD/MM/YYYY") : "-"),
    },
    {
      title: "İşlemler",
      key: "actions",
      render: (_: any, record: Task) => (
        <Space>
          <Button
            type="text"
            icon={<Edit className="w-4 h-4" />}
            onClick={() => handleOpenModal(record)}
          />
          <Popconfirm
            title="Görevi silmek istediğinize emin misiniz?"
            onConfirm={() => handleDelete(record.id)}
            okText="Evet"
            cancelText="Hayır"
          >
            <Button type="text" danger icon={<Trash2 className="w-4 h-4" />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6 space-y-12 h-[calc(100vh-200px)] overflow-y-auto ">
      {/* Header */}
      <div className="mb-6">
        <div>
          <Title level={2} className="!text-white !mb-1">
            Görevlerim
          </Title>
          <Text className="text-gray-400">
            Tüm görevlerinizi buradan yönetin
          </Text>
        </div>
      </div>

      {/* Filters & Actions */}
      <Card
        className="mb-4"
        style={{
          background: "transparent",
          border: "none",
        }}
      >
        <div className="flex items-center justify-between">
          <Select
            value={statusFilter}
            onChange={setStatusFilter}
            style={{ width: 200 }}
            options={[
              { label: "Tüm Görevler", value: "all" },
              {
                label: TaskStatusLabels[TaskStatus.Todo],
                value: TaskStatus.Todo,
              },
              {
                label: TaskStatusLabels[TaskStatus.InProgress],
                value: TaskStatus.InProgress,
              },
              {
                label: TaskStatusLabels[TaskStatus.Completed],
                value: TaskStatus.Completed,
              },
            ]}
          />
          <Button
            type="primary"
            icon={<Plus className="w-5 h-5" />}
            size="large"
            onClick={() => handleOpenModal()}
            style={{
              backgroundColor: "#3B9EC5",
              borderColor: "#3B9EC5",
              marginRight: "8px",
            }}
            className="!h-11 !px-6 !font-semibold !border-0 !outline-none !shadow-none hover:!shadow-none focus:!shadow-none hover:!brightness-110"
          >
            Yeni Görev
          </Button>
        </div>
      </Card>

      {/* Tasks Table */}
      <Card
        className="mb-4"
        style={{
          background: "transparent",
          border: "none",
        }}
      >
        <Table
          columns={columns}
          dataSource={filteredTasks}
          rowKey="id"
          loading={isLoading}
          pagination={{ pageSize: 10 }}
        />
      </Card>

      {/* Create/Edit Modal */}
      <Modal
        title={editingTask ? "Görev Düzenle" : "Yeni Görev"}
        open={isModalOpen}
        onCancel={handleCloseModal}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="mt-6"
        >
          <Form.Item
            name="title"
            label="Başlık"
            rules={[{ required: true, message: "Başlık gerekli!" }]}
          >
            <Input placeholder="Görev başlığı" size="large" />
          </Form.Item>

          <Form.Item name="description" label="Açıklama">
            <TextArea placeholder="Görev açıklaması (opsiyonel)" rows={4} />
          </Form.Item>

          <Form.Item
            name="categoryId"
            label="Kategori"
            rules={[{ required: true, message: "Kategori gerekli!" }]}
          >
            <Select
              size="large"
              placeholder="Kategori seçin"
              loading={categoriesLoading}
            >
              {categories.map((category) => (
                <Select.Option key={category.id} value={category.id}>
                  {category.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          {editingTask && (
            <Form.Item
              name="status"
              label="Durum"
              rules={[{ required: true, message: "Durum gerekli!" }]}
            >
              <Select size="large">
                <Select.Option value={TaskStatus.Todo}>
                  {TaskStatusLabels[TaskStatus.Todo]}
                </Select.Option>
                <Select.Option value={TaskStatus.InProgress}>
                  {TaskStatusLabels[TaskStatus.InProgress]}
                </Select.Option>
                <Select.Option value={TaskStatus.Completed}>
                  {TaskStatusLabels[TaskStatus.Completed]}
                </Select.Option>
              </Select>
            </Form.Item>
          )}

          <Form.Item name="startDate" label="Başlangıç Tarihi" className="mb-0">
            <DatePicker
              style={{ width: "100%" }}
              size="large"
              format="DD/MM/YYYY"
              placeholder="Tarih seçin"
            />
          </Form.Item>

          <Form.Item name="endDate" label="Bitiş Tarihi" className="mb-0">
            <DatePicker
              style={{ width: "100%" }}
              size="large"
              format="DD/MM/YYYY"
              placeholder="Tarih seçin"
            />
          </Form.Item>

          <Form.Item className="mb-0 flex justify-end gap-2">
            <Space>
              <Button onClick={handleCloseModal}>İptal</Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={createMutation.isPending || updateMutation.isPending}
              >
                {editingTask ? "Güncelle" : "Oluştur"}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default TasksPage;
