import { Form, Input, Button, Card, Typography, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { authService } from "../api/authService";
import { useAuthStore } from "../store/authStore";
import type { RegisterData } from "../types";
import { getColors } from "../config/colors";

const { Title, Text } = Typography;

const RegisterPage = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const colors = getColors(false); // Always light mode
  const [form] = Form.useForm();

  const registerMutation = useMutation({
    mutationFn: (data: RegisterData) => authService.register(data),
    onSuccess: (data) => {
      console.log("Register Success Data:", data); // Debug

      if (!data.token || !data.user) {
        console.error("Invalid response format:", data);
        message.error("Sunucu yanıtı geçersiz!");
        return;
      }

      setAuth(data.user, data.token);
      message.success("Kayıt başarılı!");
      navigate("/dashboard");
    },
    onError: (error: any) => {
      // Backend validation hatalarını göster
      const errorMessage = error.response?.data?.errors
        ? Object.values(error.response.data.errors).flat().join(", ")
        : error.response?.data?.message ||
          error.response?.data?.title ||
          "Kayıt başarısız!";
      message.error(errorMessage);
    },
  });

  const handleSubmit = (values: any) => {
    // confirmPassword'u çıkar, backend'e gönderme
    const { confirmPassword, ...registerData } = values;
    registerMutation.mutate(registerData as RegisterData);
  };

  return (
    <div 
      className="p-2 min-h-screen flex items-center justify-center px-4"
      style={{ background: colors.background.primary }}
    >
      <Card
        className="sm:w-[280px] w-[450px] max-w-lg shadow-2xl"
        style={{ 
          background: colors.background.secondary,
          borderColor: colors.border.light
        }}
      >
        <div className="text-center mb-4">
          <Title 
            level={2} 
            className="!mb-1"
            style={{ color: colors.text.primary }}
          >
            Kayıt Olun
          </Title>
          <Text style={{ color: colors.text.tertiary }}>
            Yeni bir hesap oluşturun
          </Text>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          requiredMark={false}
        >
          <Form.Item
            name="username"
            label={<span style={{ color: colors.text.secondary }}>Kullanıcı Adı</span>}
            rules={[
              { required: true, message: "Kullanıcı adı gerekli!" },
              { min: 3, message: "Kullanıcı adı en az 3 karakter olmalı!" },
            ]}
          >
            <Input
              placeholder="kullaniciadi"
              size="middle"
            />
          </Form.Item>

          <Form.Item
            name="email"
            label={<span style={{ color: colors.text.secondary }}>E-posta</span>}
            rules={[
              { required: true, message: "E-posta adresi gerekli!" },
              { type: "email", message: "Geçerli bir e-posta adresi girin!" },
            ]}
          >
            <Input
              placeholder="ornek@email.com"
              size="middle"
            />
          </Form.Item>

          <Form.Item
            name="firstName"
            label={<span style={{ color: colors.text.secondary }}>Ad</span>}
            rules={[
              { required: true, message: "Ad gerekli!" },
              { min: 2, message: "Ad en az 2 karakter olmalı!" },
            ]}
          >
            <Input
              placeholder="Adınız"
              size="middle"
            />
          </Form.Item>

          <Form.Item
            name="lastName"
            label={<span style={{ color: colors.text.secondary }}>Soyad</span>}
            rules={[
              { required: true, message: "Soyad gerekli!" },
              { min: 2, message: "Soyad en az 2 karakter olmalı!" },
            ]}
          >
            <Input
              placeholder="Soyadınız"
              size="middle"
            />
          </Form.Item>

          <Form.Item
            name="password"
            label={<span style={{ color: colors.text.secondary }}>Şifre</span>}
            rules={[
              { required: true, message: "Şifre gerekli!" },
              { min: 6, message: "Şifre en az 6 karakter olmalı!" },
            ]}
          >
            <Input.Password
              placeholder="••••••••"
              size="middle"
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label={<span style={{ color: colors.text.secondary }}>Şifre Tekrar</span>}
            dependencies={["password"]}
            rules={[
              { required: true, message: "Şifrenizi tekrar girin!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Şifreler eşleşmiyor!"));
                },
              }),
            ]}
          >
            <Input.Password
              placeholder="••••••••"
              size="middle"
            />
          </Form.Item>

          <Form.Item className="mb-2">
            <div className="flex justify-center">
              <Button
                type="primary"
                htmlType="submit"
                size="middle"
                loading={registerMutation.isPending}
                className="!h-10 !text-sm font-semibold !px-12"
              >
                Kayıt Ol
              </Button>
            </div>
          </Form.Item>

          <div className="text-center">
            <Text style={{ color: colors.text.tertiary }}>
              Zaten hesabınız var mı?{" "}
              <Link
                to="/login"
                style={{ color: "#3B9EC5" }}
                className="hover:underline font-medium"
              >
                Giriş Yapın
              </Link>
            </Text>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default RegisterPage;
