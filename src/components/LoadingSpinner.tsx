import { Spin } from "antd";

interface LoadingSpinnerProps {
  fullScreen?: boolean;
  tip?: string;
}

const LoadingSpinner = ({
  fullScreen = false,
  tip = "Yükleniyor...",
}: LoadingSpinnerProps) => {
  if (fullScreen) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark">
        <Spin size="large" tip={tip} />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-12">
      <Spin size="large" tip={tip} />
    </div>
  );
};

export default LoadingSpinner;
