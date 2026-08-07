import {
  Code,
  Palette,
  ShoppingBag,
  GraduationCap,
  Droplets,
  Building2,
  Globe,
  Briefcase,
  Newspaper,
  Zap,
  Shield,
  Smartphone,
  Search,
  Clock,
  Users,
  Code2,
  Sparkles,
  Rocket,
  PenTool,
  BarChart3,
  Layers,
  Wallet,
  Database,
  Server,
  Gauge,
  CheckCircle2,
} from "lucide-react";
import type { ServicesIconName } from "@/types/services";

/** Maps a services icon name to its Lucide component. Unknown names fall back to a code icon. */
const SERVICES_ICON_MAP: Record<ServicesIconName, React.ComponentType<{ className?: string }>> = {
  Code,
  Palette,
  ShoppingBag,
  GraduationCap,
  Droplets,
  Building2,
  Globe,
  Briefcase,
  Newspaper,
  Zap,
  Shield,
  Smartphone,
  Search,
  Clock,
  Users,
  Code2,
  Sparkles,
  Rocket,
  PenTool,
  BarChart3,
  Layers,
  Wallet,
  Database,
  Server,
  Gauge,
  CheckCircle2,
};

export const SERVICES_ICON_OPTIONS = Object.keys(SERVICES_ICON_MAP) as ServicesIconName[];

export function ServicesIcon({ name, className }: { name: string; className?: string }) {
  const Icon = SERVICES_ICON_MAP[name as ServicesIconName] ?? Code;
  return <Icon className={className} />;
}
