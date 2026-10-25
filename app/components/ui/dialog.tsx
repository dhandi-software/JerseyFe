/**
 * Dialog Component
 *
 * A custom wrapper around Radix UI's `Dialog` primitives (`Root`, `Trigger`, `Content`, etc.)
 * with opinionated styling, optional header/footer, and integrated action buttons.
 *
 * ## Example Usage:
 *
 * ```tsx
 * <Dialog>
 *   <DialogTrigger size="lg" variant="default">
 *     Open
 *   </DialogTrigger>
 *
 *   <DialogContent showCloseButton={true} footer={true}>
 *     <DialogHeader>
 *       <DialogTitle>Title Besar</DialogTitle>
 *       <DialogDescription>
 *         Input description
 *       </DialogDescription>
 *     </DialogHeader>
 *   </DialogContent>
 * </Dialog>
 * ```
 *
 * ## Props
 *
 * ### DialogContent
 * - `showCloseButton?: boolean`  
 *   Default: `true`.  
 *   Controls whether the "Close" button (X) appears in the top-right corner.
 *
 * - `footer?: boolean`  
 *   Default: `false`.  
 *   If `true`, renders a footer with action buttons ("Cancel" & "Save Changes").
 *   If `false`, no footer is rendered.
 *
 * ### DialogTrigger
 * - `variant?: "default" | "secondary" | "destructive" | "ghost" | "outline" | "link"`  
 *   Default: `"default"`.  
 *   Passed directly to the underlying `Button` variant.
 *
 * - `size?: "sm" | "md" | "lg" | "icon"`  
 *   Default: `"lg"`.  
 *   Passed directly to the underlying `Button` size.
 *
 * ## Notes
 * - `DialogHeader`, `DialogTitle`, and `DialogDescription` are optional helpers
 *   for structuring your dialog content. You can replace them with your own layout if needed.
 * - By default, the `footer` renders a **Cancel** and **Save Changes** button with `console.log` handlers.
 *   You can customize this further by extending `DialogFooter` instead of using the `footer` prop.
 */


import {
  Root,
  Trigger,
  Content,
  Close,
  Overlay,
  Title,
  Description,
  Portal,
} from "@radix-ui/react-dialog"
import { XIcon } from "lucide-react"
import { Button } from "~/components/ui/button"
import { cn } from "~/lib/utils"

function Dialog({
  ...props
}: React.ComponentProps<typeof Root>) {
  return <Root data-slot="dialog" {...props} />
}

function DialogTrigger({
  children,
  variant = "default",
  size = "lg",
  ...props
}: React.ComponentProps<typeof Trigger> & {
  variant?: "default" | "secondary" | "destructive" | "ghost" | "outline" | "link";
  size?: "sm" | "md" | "lg" | "icon";
}) {
  return (
    <Trigger data-slot="dialog-trigger">
      <Button variant={variant} size={size} {...props}>
        {children ?? "Open"}
      </Button>
    </Trigger>
  )
}

function DialogPortal({
  ...props
}: React.ComponentProps<typeof Portal>) {
  return <Portal data-slot="dialog-portal" {...props} />
}

function DialogClose({
  ...props
}: React.ComponentProps<typeof Close>) {
  return <Close data-slot="dialog-close" {...props} />
}

function DialogOverlay({
  className,
  style,
  ...props
}: React.ComponentProps<typeof Overlay>) {
  return (
    <Overlay
      data-slot="dialog-overlay"
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        backdropFilter: "blur(2px)",
        zIndex: 9998,
        ...style
      }}
      className={cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 duration-200",
        className
      )}
      {...props}
    />
  )
}

function DialogContent({
  className,
  children,
  showCloseButton = true,
  footer,
  overlayClassName,
  style,
  ...props
}: React.ComponentProps<typeof Content> & {
  showCloseButton?: boolean
  footer?: React.ReactNode;
  overlayClassName?: string;
}) {
  return (
    <DialogPortal data-slot="dialog-portal">
      <DialogOverlay className={overlayClassName} />
      <Content
        data-slot="dialog-content"
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "min(92vw, 540px)",
          maxWidth: "540px",
          minWidth: "320px",
          boxSizing: "border-box",
          zIndex: 9999,
          ...style
        }}
        className={cn(
          "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 bg-white rounded-3xl p-6 sm:p-8 shadow-2xl duration-200 outline-none max-h-[90vh] overflow-y-auto custom-scrollbar flex flex-col",
          className
        )}
        {...props}
      >
        {children}
        {showCloseButton && (
          <Close
            data-slot="dialog-close"
            asChild
          >
            <button
              type="button"
              className="absolute top-5 right-5 w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-all cursor-pointer z-20"
              aria-label="Tutup"
            >
              <XIcon className="w-4 h-4" />
            </button>
          </Close>
        )}

        {footer && (
          <div className="flex gap-2.5 mt-sm justify-end">
            <Button
              variant="outline"
              size="md"
              onClick={() => console.log("Cancel clicked")}
            >
              Cancel
            </Button>
            <Button
              variant="default"
              size="md"
              onClick={() => console.log("Save clicked")}
            >
              Save Changes
            </Button>
          </div>
        )}
      </Content>
    </DialogPortal>
  )
}

function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-header"
      className={cn("flex flex-col gap-sm text-center sm:text-left", className)}
      {...props}
    />
  )
}

function DialogFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn(
        "flex flex-col-reverse gap-sm sm:flex-row sm:justify-end",
        className
      )}
      {...props}
    />
  )
}

function DialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof Title>) {
  return (
    <Title
      data-slot="dialog-title"
      className={cn("text-heading-h4 leading-none", className)}
      {...props}
    />
  )
}

function DialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof Description>) {
  return (
    <Description
      data-slot="dialog-description"
      className={cn("text-paragraph text-muted-foreground", className)}
      {...props}
    />
  )
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
}
