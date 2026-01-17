import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Card,
  Button,
  Table,
  Space,
  Modal,
  Form,
  Input,
  Typography,
  message,
  Popconfirm,
} from "antd";
import { Plus, Edit, Trash2, FolderOpen } from "lucide-react";
import { categoryService } from "../api/categoryService";
import type {
  Category,
  CreateCategoryData,
  UpdateCategoryData,
} from "../types/category";

const { Title, Text } = Typography;
const { TextArea } = Input;

const CategoriesPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  // Fetch Categories
  const { data: categories = [], isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: categoryService.getCategories,
  });

  // Create Category Mutation
  const createMutation = useMutation({
    mutationFn: (data: CreateCategoryData) =>
      categoryService.createCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      message.success("Kategori başarıyla oluşturuldu!");
      handleCloseModal();
    },
    onError: () => {
      message.error("Kategori oluşturulamadı!");
    },
  });

  // Update Category Mutation
  const updateMutation = useMutation({
    mutationFn: (data: UpdateCategoryData) =>
      categoryService.updateCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      message.success("Kategori başarıyla güncellendi!");
      handleCloseModal();
    },
    onError: () => {
      message.error("Kategori güncellenemedi!");
    },
  });

  // Delete Category Mutation
  const deleteMutation = useMutation({
    mutationFn: (id: number) => categoryService.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      message.success("Kategori başarıyla silindi!");
    },
    onError: () => {
      message.error("Kategori silinemedi!");
    },
  });

  const handleOpenModal = (category?: Category) => {
    if (category) {
      setEditingCategory(category);
      form.setFieldsValue(category);
    } else {
      setEditingCategory(null);
      form.resetFields();
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
    form.resetFields();
  };

  const handleSubmit = (values: any) => {
    if (editingCategory) {
      updateMutation.mutate({ id: editingCategory.id, ...values });
    } else {
      createMutation.mutate(values);
    }
  };

  const handleDelete = (id: number) => {
    deleteMutation.mutate(id);
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 80,
    },
    {
      title: "Kategori Adı",
      dataIndex: "name",
      key: "name",
      render: (text: string) => (
        <span className="font-medium flex items-center gap-2">
          <FolderOpen className="w-4 h-4" />
          {text}
        </span>
      ),
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
      title: "İşlemler",
      key: "actions",
      width: 150,
      render: (_: any, record: Category) => (
        <Space>
          <Button
            type="text"
            icon={<Edit className="w-4 h-4" />}
            onClick={() => handleOpenModal(record)}
          />
          <Popconfirm
            title="Kategoriyi silmek istediğinize emin misiniz?"
            description="Bu kategoriye ait görevler etkilenebilir."
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
    <div className="space-y-6">
      {/* Header & Actions */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <Title level={2} className="!text-white !mb-1">
            Kategoriler
          </Title>
          <Text className="text-gray-400">
            Görev kategorilerinizi düzenleyin
          </Text>
        </div>
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
          Yeni Kategori
        </Button>
      </div>

      {/* Categories Table */}
      <Card
        style={{
          background: "transparent",
          border: "none",
        }}
      >
        <Table
          columns={columns}
          dataSource={categories}
          rowKey="id"
          loading={isLoading}
          pagination={{ pageSize: 10 }}
        />
      </Card>

      {/* Create/Edit Modal */}
      <Modal
        title={editingCategory ? "Kategori Düzenle" : "Yeni Kategori"}
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
            name="name"
            label="Kategori Adı"
            rules={[
              { required: true, message: "Kategori adı gerekli!" },
              { min: 2, message: "Kategori adı en az 2 karakter olmalı!" },
            ]}
          >
            <Input placeholder="Örn: İş, Kişisel, Alışveriş..." size="large" />
          </Form.Item>

          <Form.Item name="description" label="Açıklama">
            <TextArea placeholder="Kategori açıklaması (opsiyonel)" rows={4} />
          </Form.Item>

          <Form.Item className="mb-0 flex justify-end gap-2">
            <Space>
              <Button onClick={handleCloseModal}>İptal</Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={createMutation.isPending || updateMutation.isPending}
              >
                {editingCategory ? "Güncelle" : "Oluştur"}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CategoriesPage;
