import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeft,
  Bike,
  CheckCircle2,
  Clock,
  ExternalLink,
  LogOut,
  Mail,
  MapPin,
  Phone,
  User,
  XCircle,
} from "lucide-react";
import { motion } from "motion/react";
import type { Page } from "../App";
import { DriverStatus } from "../backend";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useDriverProfile } from "../hooks/useQueries";

interface Props {
  navigate: (page: Page) => void;
}

const statusConfig = {
  [DriverStatus.pending]: {
    label: "Pending Review",
    icon: Clock,
    color: "bg-yellow-100 text-yellow-700 border-yellow-200",
    message:
      "Your application is under review. We'll notify you within 24–48 hours.",
  },
  [DriverStatus.approved]: {
    label: "Approved",
    icon: CheckCircle2,
    color: "bg-green-100 text-green-700 border-green-200",
    message: "Congratulations! You're approved to drive on CycleRide.",
  },
  [DriverStatus.rejected]: {
    label: "Rejected",
    icon: XCircle,
    color: "bg-red-100 text-red-700 border-red-200",
    message:
      "Your application was not approved. Please contact support for more information.",
  },
};

export default function DriverDashboard({ navigate }: Props) {
  const { identity, clear } = useInternetIdentity();
  const { data: profile, isLoading } = useDriverProfile();

  const handleLogout = () => {
    clear();
    navigate("landing");
  };

  if (!identity) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center">
          <Bike className="w-12 h-12 text-primary mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">
            Sign in to view your dashboard
          </h2>
          <p className="text-muted-foreground mb-6">
            You need to be logged in to access this page.
          </p>
          <Button
            onClick={() => navigate("landing")}
            data-ocid="dashboard.primary_button"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Go Back
          </Button>
        </div>
      </div>
    );
  }

  const status = profile?.status;
  const statusInfo = status ? statusConfig[status] : null;
  const StatusIcon = statusInfo?.icon;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border shadow-navbar">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate("landing")}
            className="flex items-center gap-2 font-bold text-lg text-foreground hover:text-primary transition-colors"
            data-ocid="dashboard.link"
          >
            <Bike className="w-6 h-6 text-primary" />
            CycleUser
          </button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="gap-2"
            data-ocid="dashboard.secondary_button"
          >
            <LogOut className="w-4 h-4" /> Log Out
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-2xl font-extrabold text-foreground mb-2">
            Driver Dashboard
          </h1>
          <p className="text-muted-foreground mb-8">
            Principal:{" "}
            <code className="text-xs bg-muted px-1.5 py-0.5 rounded">
              {identity.getPrincipal().toString()}
            </code>
          </p>

          {isLoading ? (
            <div className="space-y-4" data-ocid="dashboard.loading_state">
              <Skeleton className="h-32 w-full rounded-xl" />
              <Skeleton className="h-24 w-full rounded-xl" />
            </div>
          ) : !profile ? (
            <div
              className="bg-card border border-border rounded-xl p-10 text-center"
              data-ocid="dashboard.empty_state"
            >
              <Bike className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="font-bold text-lg text-foreground mb-2">
                No Profile Found
              </h3>
              <p className="text-muted-foreground mb-6">
                You haven't registered as a driver yet. Head back to the
                homepage to sign up.
              </p>
              <Button
                onClick={() => navigate("landing")}
                data-ocid="dashboard.primary_button"
              >
                Register as Driver
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Status Banner */}
              {statusInfo && StatusIcon && (
                <div
                  className={`border rounded-xl p-5 flex items-start gap-4 ${statusInfo.color}`}
                >
                  <StatusIcon className="w-6 h-6 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold mb-1">{statusInfo.label}</div>
                    <p className="text-sm">{statusInfo.message}</p>
                    {status === DriverStatus.approved && (
                      <a
                        href="https://cycleride-vs0.caffeine.xyz"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 mt-3 text-sm font-semibold hover:underline"
                        data-ocid="dashboard.link"
                      >
                        Open CycleRide Platform{" "}
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Profile Card */}
              <div className="bg-card border border-border rounded-xl p-6 shadow-card">
                <h2 className="font-bold text-foreground mb-5 text-lg">
                  Your Profile
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    { icon: User, label: "Full Name", value: profile.name },
                    { icon: Mail, label: "Email", value: profile.email },
                    { icon: Phone, label: "Phone", value: profile.phone },
                    { icon: MapPin, label: "City", value: profile.city },
                    {
                      icon: Bike,
                      label: "Vehicle Type",
                      value: profile.vehicleType,
                    },
                    {
                      icon: CheckCircle2,
                      label: "License / ID",
                      value: profile.licenseNumber,
                    },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                        <item.icon className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">
                          {item.label}
                        </div>
                        <div className="text-sm font-medium text-foreground capitalize">
                          {item.value}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-5 pt-5 border-t border-border flex items-center gap-3">
                  <span className="text-sm text-muted-foreground">
                    Application Status:
                  </span>
                  <Badge
                    className={
                      status === DriverStatus.approved
                        ? "bg-green-100 text-green-700 border-green-200"
                        : status === DriverStatus.rejected
                          ? "bg-red-100 text-red-700 border-red-200"
                          : "bg-yellow-100 text-yellow-700 border-yellow-200"
                    }
                  >
                    {status}
                  </Badge>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </main>

      <footer className="border-t border-border py-6 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} CycleUser · Built with ❤️ using{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-primary"
        >
          caffeine.ai
        </a>
      </footer>
    </div>
  );
}
