import { Themes } from "@/app/constants";
import { useBreadcrumbs } from "@/hooks/use-breadcrumbs";
import { useUiStore } from "@/stores/ui.store";
import { Separator } from "@radix-ui/react-separator";
import { Moon, Sun, User } from "lucide-react";
import { useTheme } from "next-themes";
import { Fragment, useEffect, useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../ui/breadcrumb";
import { Button } from "../ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../ui/hover-card";
import { SidebarTrigger } from "../ui/sidebar";

export const Header = () => {
  const theme = useTheme();
  const { breadcrumbs } = useBreadcrumbs();
  const { env, mockUser, toggleUserRole } = useUiStore();
  const [isVisible, setIsVisible] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < 10) {
        // Siempre mostrar en la parte superior
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY.current) {
        // Scrolling down - ocultar
        setIsVisible(false);
      } else {
        // Scrolling up - mostrar
        setIsVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const toggleTheme = () => {
    theme.setTheme(theme.resolvedTheme === "light" ? "dark" : "light");
  };

  return (
    <header
      className={`flex h-16 shrink-0 items-center gap-2 transition-all duration-300 ease-in-out group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 bg-background/40 sticky top-0 z-50 border-b backdrop-blur-md md:rounded-tl-xl md:rounded-tr-xl ${
        isVisible || isHovered ? "translate-y-0" : "-translate-y-full"
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="bg-border shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:w-px mx-2 data-[orientation=vertical]:h-4 "
        />
        <Breadcrumb>
          <BreadcrumbList>
            {breadcrumbs.map((crumb, index) => (
              <Fragment key={index}>
                <BreadcrumbItem
                  className={
                    index === breadcrumbs.length - 1 ? "" : "hidden md:block"
                  }
                >
                  {index === breadcrumbs.length - 1 ? (
                    <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink href={crumb.href || "#"}>
                      {crumb.label}
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
                {index < breadcrumbs.length - 1 && (
                  <BreadcrumbSeparator className="hidden md:block" />
                )}
              </Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
        <div className="ml-auto flex items-center gap-2">
          {env === "DEV" && (
            <Button variant="outline" size="sm" onClick={toggleUserRole}>
              <User className="size-4 mr-2" />
              Cambiar Rol ({mockUser.role})
            </Button>
          )}
          <HoverCard>
            <HoverCardTrigger>
              <Avatar>
                <AvatarImage />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </HoverCardTrigger>
            <HoverCardContent className="mr-auto">
              <div className="flex flex-col">
                <p>
                  Bienvenido{" "}
                  {mockUser.role === "assistant" ? "Asistente" : "Residente"}
                </p>
                <p>{mockUser.name}</p>
              </div>
            </HoverCardContent>
          </HoverCard>
          <Separator
            orientation="vertical"
            className="bg-border shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:w-px mx-2 data-[orientation=vertical]:h-4"
          />
          <Button variant={"secondary"} onClick={toggleTheme}>
            {theme.resolvedTheme === Themes.LIGHT ? (
              <Sun className="size-5" />
            ) : (
              <Moon className="size-5" />
            )}
            {/* <span className="sr-only">Cambiar</span> */}
          </Button>
        </div>
      </div>
    </header>
  );
};
