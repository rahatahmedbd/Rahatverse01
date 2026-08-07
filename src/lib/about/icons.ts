import type { ComponentType } from "react";
import {
  Award,
  BookOpen,
  Calendar,
  Code,
  Droplets,
  GraduationCap,
  Heart,
  MapPin,
  Medal,
  Star,
  Trophy,
  Users,
} from "lucide-react";
import type { AboutIconName, AchievementIconName } from "@/types/about";

type IconComponent = ComponentType<{ className?: string }>;

export const ABOUT_ICON_MAP: Record<AboutIconName, IconComponent> = {
  Calendar,
  MapPin,
  Droplets,
  GraduationCap,
  BookOpen,
  Award,
  Code,
  Users,
  Heart,
  Trophy,
  Medal,
  Star,
};

export const ACHIEVEMENT_ICON_MAP: Record<AchievementIconName, IconComponent> = {
  Trophy,
  Medal,
  Award,
  Star,
};
