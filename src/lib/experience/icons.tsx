import {
  Building2,
  Users,
  GraduationCap,
  Shield,
  Video,
  Code,
  Heart,
  BookOpen,
  Award,
  Briefcase,
  Star,
  Globe,
  MessageCircle,
  Siren,
  Droplets,
  Database,
  MapPin,
  Phone,
  Clock,
  Building,
  Pen,
  Scale,
  Landmark,
} from "lucide-react";

export const EXPERIENCE_ICON_OPTIONS = [
  "Building2",
  "Users",
  "GraduationCap",
  "Shield",
  "Video",
  "Code",
  "Heart",
  "BookOpen",
  "Award",
  "Briefcase",
  "Star",
  "Globe",
] as const;

export const BLOOD_ICON_OPTIONS = [
  "Users",
  "MessageCircle",
  "Heart",
  "Siren",
  "Droplets",
  "Database",
  "MapPin",
  "Phone",
  "Clock",
] as const;

export const MEMORIAL_ICON_OPTIONS = [
  "Building",
  "GraduationCap",
  "BookOpen",
  "Pen",
  "Scale",
  "Star",
  "Landmark",
  "Users",
] as const;

const EXPERIENCE_ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Building2,
  Users,
  GraduationCap,
  Shield,
  Video,
  Code,
  Heart,
  BookOpen,
  Award,
  Briefcase,
  Star,
  Globe,
  MessageCircle,
  Siren,
  Droplets,
  Database,
  MapPin,
  Phone,
  Clock,
  Building,
  Pen,
  Scale,
  Landmark,
};

export function ExperienceIcon({ name, className }: { name: string; className?: string }) {
  const Icon = EXPERIENCE_ICON_MAP[name] ?? Briefcase;
  return <Icon className={className} />;
}
