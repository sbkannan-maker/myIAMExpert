import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      position="bottom-right"
      expand={false}
      visibleToasts={3}
      closeButton
      duration={3000}
      toastOptions={{
        classNames: {
          toast: "myiam-toast",
          title: "myiam-toast-title",
          description: "myiam-toast-description",
          closeButton: "myiam-toast-close",
          success: "myiam-toast-success",
          info: "myiam-toast-info",
          error: "myiam-toast-error",
        },
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
