import { useState, useEffect } from "react";
import {
 Layout,
 Menu,
 Avatar,
 Dropdown,
 Typography,
 message,
 Drawer,
} from "antd";
import { Outlet, useNavigate } from "react-router-dom";
import {
 CheckSquare,
 FolderOpen,
 LogOut,
 Menu as MenuIcon,
} from "lucide-react";
import { useAuthStore } from "../store/authStore";
import { getColors } from "../config/colors";

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

const DashboardLayout = () => {
 const navigate = useNavigate();
 const { user, clearAuth } = useAuthStore();
 const [collapsed, setCollapsed] = useState(false);
 const [isMobile, setIsMobile] = useState(false);
 const [drawerOpen, setDrawerOpen] = useState(false);

 const colors = getColors(false); // Always light mode

 useEffect(() => {
  const checkMobile = () => {
   setIsMobile(window.innerWidth < 640);
  };

  checkMobile();
  window.addEventListener("resize", checkMobile);

  return () => window.removeEventListener("resize", checkMobile);
 }, []);

 const handleLogout = () => {
  clearAuth();
  message.success("Çıkış yapıldı!");
  navigate("/login");
 };

 const menuItems = [
  {
   key: "dashboard",
   icon: <CheckSquare className="w-4 h-4" />,
   label: "Görevlerim",
   onClick: () => navigate("/dashboard"),
  },
  {
   key: "categories",
   icon: <FolderOpen className="w-4 h-4" />,
   label: "Kategoriler",
   onClick: () => navigate("/dashboard/categories"),
  },
 ];

 const userMenuItems = [
  {
   key: "logout",
   icon: <LogOut className="w-4 h-4" />,
   label: "Çıkış Yap",
   onClick: handleLogout,
   danger: true,
  },
 ];

 const sidebarContent = (isCollapsed: boolean) => (
  <>
   {/* Logo Area */}
   <div
    className="flex items-center border-b transition-all duration-200"
    style={{
     height: "56px",
     padding: isCollapsed ? "0 16px" : "0 20px",
     borderColor: colors.border.light,
    }}
   >
    {!isCollapsed ? (
     <div>
      <h1
       className="font-semibold tracking-tight leading-none"
       style={{
        fontSize: "16px",
        color: colors.text.primary,
       }}
      >
       TodoApp
      </h1>
      <p className="text-xs mt-0.5" style={{ color: colors.text.tertiary }}>
       Görev Yönetimi
      </p>
     </div>
    ) : (
     <h1
      className="font-bold tracking-tight"
      style={{
       fontSize: "16px",
       color: colors.text.primary,
      }}
     >
      TA
     </h1>
    )}
   </div>

   {/* Menu */}
   <Menu
    mode="inline"
    defaultSelectedKeys={["dashboard"]}
    items={menuItems.map((item) => ({
     ...item,
     onClick: () => {
      item.onClick?.();
      if (isMobile) {
       setDrawerOpen(false);
      }
     },
    }))}
    className="border-0"
    style={{
     background: "transparent",
     marginTop: "8px",
     padding: "0 8px",
    }}
   />
  </>
 );

 return (
  <Layout className="min-h-screen">
   {/* Sidebar - Desktop */}
   {!isMobile && (
    <Sider
     collapsible
     collapsed={collapsed}
     onCollapse={setCollapsed}
     width={240}
     collapsedWidth={64}
     style={{
      background: colors.background.secondary,
      borderRight: `1px solid ${colors.border.light}`,
     }}
     trigger={
      <div
       className="transition-colors duration-200"
       style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "40px",
        width: "100%",
        borderTop: `1px solid ${colors.border.light}`,
       }}
      >
       <MenuIcon className="w-4 h-4" style={{ color: colors.text.tertiary }} />
      </div>
     }
    >
     {sidebarContent(collapsed)}
    </Sider>
   )}

   {/* Drawer - Mobile */}
   {isMobile && (
    <Drawer
     title={null}
     placement="left"
     closable={false}
     onClose={() => setDrawerOpen(false)}
     open={drawerOpen}
     width={240}
     styles={{
      body: {
       padding: 0,
       background: colors.background.secondary,
      },
     }}
     style={{
      background: colors.background.secondary,
     }}
    >
     {sidebarContent(false)}
    </Drawer>
   )}

   <Layout>
    {/* Header */}
    <Header
     style={{
      background: colors.background.secondary,
      borderBottom: `1px solid ${colors.border.light}`,
      padding: "0 24px",
      height: "56px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
     }}
    >
     <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
      {isMobile && (
       <button
        onClick={() => setDrawerOpen(true)}
        className="transition-colors duration-200 rounded-lg p-2 hover:bg-opacity-10"
        style={{
         border: "none",
         background: "transparent",
         cursor: "pointer",
         display: "flex",
         alignItems: "center",
         justifyContent: "center",
        }}
        onMouseEnter={(e) => {
         e.currentTarget.style.background = colors.background.primary;
        }}
        onMouseLeave={(e) => {
         e.currentTarget.style.background = "transparent";
        }}
       >
        <MenuIcon className="w-5 h-5" style={{ color: colors.text.primary }} />
       </button>
      )}
      <Text
       style={{
        color: colors.text.primary,
        fontSize: "16px",
        fontWeight: 500,
       }}
      >
       Hoş Geldiniz, {user?.firstName || user?.username || user?.email}
      </Text>
     </div>

     <Dropdown
      menu={{ items: userMenuItems }}
      placement="bottomRight"
      trigger={["click"]}
     >
      <div
       className="flex items-center gap-3 cursor-pointer rounded-lg transition-all duration-200"
       style={{
        padding: "6px 12px",
       }}
       onMouseEnter={(e) => {
        e.currentTarget.style.background = colors.background.primary;
       }}
       onMouseLeave={(e) => {
        e.currentTarget.style.background = "transparent";
       }}
      >
       <Avatar
        size={32}
        style={{
         backgroundColor: colors.primary[500],
         fontSize: "13px",
         fontWeight: "600",
         flexShrink: 0,
         marginRight: "8px",
        }}
       >
        {user?.firstName?.[0]?.toUpperCase() ||
         user?.username?.[0]?.toUpperCase() ||
         user?.email?.[0]?.toUpperCase() ||
         "U"}
       </Avatar>

       <div className="text-left">
        <Text
         style={{
          color: colors.text.primary,
          fontSize: "13px",
          fontWeight: 500,
          display: "block",
          lineHeight: "1.2",
         }}
        >
         {user?.firstName && user?.lastName
          ? `${user.firstName} ${user.lastName}`
          : user?.username || "User"}
        </Text>
        <Text
         style={{
          color: colors.text.tertiary,
          fontSize: "11px",
          display: "block",
          marginTop: "2px",
         }}
        >
         {user?.email}
        </Text>
       </div>
      </div>
     </Dropdown>
    </Header>

    {/* Content */}
    <Content
     style={{
      margin: "16px",
      padding: "20px",
      background: colors.background.primary,
      minHeight: 280,
      borderRadius: "6px",
     }}
    >
     <Outlet />
    </Content>
   </Layout>
  </Layout>
 );
};

export default DashboardLayout;
