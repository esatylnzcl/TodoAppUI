import { Form, Input, Button, Card, Typography, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { authService } from "../api/authService";
import { useAuthStore } from "../store/authStore";
import type { LoginCredentials } from "../types";
import { getColors } from "../config/colors";

const { Title, Text } = Typography;

const LoginPage = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const colors = getColors(false); // Always light mode
  const [form] = Form.useForm();

  const loginMutation = useMutation({
    mutationFn: (credentials: LoginCredentials) =>
      authService.login(credentials),
    onSuccess: (data) => {
      if (!data.token || !data.user) {
        console.error("Invalid response format:", data);
        message.error("Sunucu yanıtı geçersiz!");
        return;
      }

      setAuth(data.user, data.token);
      message.success("Giriş başarılı!");
      navigate("/dashboard");
    },
    onError: (error: any) => {
      console.error("Login Error:", error.response?.data);
      message.error(error.response?.data?.message || "Giriş başarısız!");
    },
  });

  const handleSubmit = (values: LoginCredentials) => {
    loginMutation.mutate(values);
  };

  return (
    <div 
      className="px-4 min-h-screen w-full flex items-center justify-center px-4"
      style={{ background: colors.background.primary }}
    >
      <Card
        className="mx-4 sm:w-[280px] w-[450px] shadow-2xl"
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
            Hoş Geldiniz
          </Title>
          <Text style={{ color: colors.text.tertiary }}>
            Hesabınıza giriş yapın
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
              placeholder="Kullanıcı Adı"
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

          <Form.Item className="mb-2">
            <div className="flex justify-center">
              <Button
                type="primary"
                htmlType="submit"
                size="middle"
                loading={loginMutation.isPending}
                className="!h-10 !text-sm font-semibold !px-12"
              >
                Giriş Yap
              </Button>
            </div>
          </Form.Item>

          <div className="text-center">
            <Text style={{ color: colors.text.tertiary }}>
              Hesabınız yok mu?{" "}
              <Link
                to="/register"
                style={{ color: "#3B9EC5" }}
                className="hover:underline font-medium"
              >
                Kayıt Olun
              </Link>
            </Text>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default LoginPage;
