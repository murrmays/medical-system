import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Menu,
  UnstyledButton,
  Text,
  Drawer,
  Stack,
  Burger,
} from "@mantine/core";
import { getProfile, logoutDoctor } from "../../api/doctor";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import "./Header.css";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { useDisclosure } from "@mantine/hooks";

export const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isAtLogin = location.pathname === "/login";
  const targetPath = isAtLogin ? "/registration" : "/login";
  const buttonText = isAtLogin ? "Регистрация" : "Вход";
  const navLinks = [
    { label: "Пациенты", link: "/patients" },
    { label: "Консультации", link: "/consultations" },
    { label: "Отчеты", link: "/reports" },
  ];
  const [drawerOpened, { toggle, close }] = useDisclosure(false);

  const items = navLinks.map((item) => (
    <NavLink
      key={item.link}
      to={item.link}
      onClick={close}
      className={({ isActive }) =>
        isActive ? "section-link active" : "section-link"
      }
    >
      {item.label}
    </NavLink>
  ));
  const queryClient = useQueryClient();
  const token = localStorage.getItem("token");
  const [opened, setOpened] = useState(false);

  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
    enabled: !!token,
  });
  const logoutMutation = useMutation({
    mutationFn: logoutDoctor,
    onSettled: () => {
      localStorage.removeItem("token");
      queryClient.clear();
      navigate("/login");
      window.location.reload();
    },
  });
  return (
    <>
      <header className="main-header">
        <div className="header-left">
          <span className="logo-text">Medical system</span>
          {token && profile && <nav className="section-container">{items}</nav>}
        </div>

        <div className="header-right">
          <Burger
            opened={drawerOpened}
            onClick={toggle}
            hiddenFrom="xl"
            size="sm"
            color="var(--med-blue"
            className="burger-btn"
          />

          {token && profile ? (
            <Menu
              position="bottom-end"
              offset={10}
              shadow="lg"
              opened={opened}
              onChange={setOpened}
            >
              <Menu.Target>
                <UnstyledButton className="user-profile-btn">
                  <Text className="username-truncated">{profile.name}</Text>
                  <ChevronDown
                    className={`arrow-icon ${opened ? "open" : ""}`}
                  />
                </UnstyledButton>
              </Menu.Target>
              <Menu.Dropdown className="dropdown-menu">
                <div className="profile-info">
                  <Text>{profile.name}</Text>
                </div>
                <Menu.Divider />
                <Menu.Item
                  onClick={() => navigate("/profile")}
                  className="medical-select-option"
                >
                  Профиль
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item
                  color="red"
                  onClick={() => logoutMutation.mutate()}
                  className="medical-select-option"
                >
                  Выход
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          ) : (
            <button
              className="auth-toggle-btn"
              onClick={() => navigate(targetPath)}
            >
              {buttonText}
            </button>
          )}
        </div>
      </header>
      <Drawer
        opened={drawerOpened}
        onClose={close}
        size="xs"
        padding="md"
        hiddenFrom="sm"
        title="Навигация"
        zIndex={1000}
        lockScroll={false}
        className="drawer"
      >
        <Stack gap="xs">{items}</Stack>
      </Drawer>
    </>
  );
};
