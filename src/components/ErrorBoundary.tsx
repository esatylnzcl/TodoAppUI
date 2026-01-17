import { Component, type ReactNode } from "react";
import { Result, Button } from "antd";
import { AlertCircle } from "lucide-react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined });
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-dark px-4">
          <Result
            icon={<AlertCircle className="w-16 h-16 text-red-500" />}
            title={<span className="text-white">Bir Hata Oluştu</span>}
            subTitle={
              <span className="text-gray-400">
                {this.state.error?.message || "Beklenmeyen bir hata oluştu"}
              </span>
            }
            extra={
              <Button type="primary" size="large" onClick={this.handleReset}>
                Ana Sayfaya Dön
              </Button>
            }
          />
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
