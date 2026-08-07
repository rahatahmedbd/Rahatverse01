// ── UI Components ──────────────────────────────────────
export { Button, buttonVariants } from "./button";
export type { ButtonProps } from "./button";

export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  GlassCard,
} from "./card";

export { Badge, badgeVariants } from "./badge";
export type { BadgeProps } from "./badge";

export { Separator } from "./separator";
export { AuroraDivider } from "./aurora-divider";

export { Skeleton, CardSkeleton, PageLoader, Spinner, LoadingState } from "./skeleton";

// Phase G — State beautification (empty & loading states, feedback, toasts)
export { EmptyState } from "./empty-state";
export { Feedback } from "./feedback";
export { Toaster, toast } from "./toast";
export type { ToastTone } from "./toast";

// Phase F — Image & visual enhancements
export { BlurUpImage } from "./blur-image";
export type { BlurUpImageProps } from "./blur-image";
export { Lightbox } from "./lightbox";
export type { LightboxItem, LightboxProps } from "./lightbox";

export { BlurImage, ImageSkeleton } from "./blur-image";
export type { BlurImageProps } from "./blur-image";

export { CloudinaryImage } from "./cloudinary-image";
export type { CloudinaryImageProps } from "./cloudinary-image";

// Phase G — State Beautification (Empty, Loading, Feedback states)
export { EmptyState } from "./empty-state";
export type { EmptyStateProps, EmptyStateAction } from "./empty-state";

export {
  LoadingSpinner,
  SectionLoader,
  TableSkeleton,
  ListSkeleton,
} from "./loading-state";
export type {
  LoadingSpinnerProps,
  SectionLoaderProps,
  TableSkeletonProps,
  ListSkeletonProps,
} from "./loading-state";

export { FeedbackAlert } from "./feedback-alert";
export type {
  FeedbackAlertProps,
  FeedbackAlertVariant,
} from "./feedback-alert";

// Phase 31 — Premium form field system
export {
  FormField,
  TextField,
  TextAreaField,
  SelectField,
  ChipGroup,
} from "./form";
export type {
  FormFieldProps,
  TextFieldProps,
  TextAreaFieldProps,
  SelectFieldProps,
  ChipGroupProps,
  ChipOption,
} from "./form";
