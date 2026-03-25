import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Bike,
  CheckCircle2,
  Loader2,
  LogOut,
  ShieldAlert,
  Users,
  XCircle,
} from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";
import type { Page } from "../App";
import { DriverStatus, type DriverWithPrincipal } from "../backend";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useAllDrivers,
  useIsAdmin,
  useUpdateDriverStatus,
} from "../hooks/useQueries";

interface Props {
  navigate: (page: Page) => void;
}

function StatusBadge({ status }: { status: DriverStatus }) {
  const styles = {
    [DriverStatus.pending]: "bg-yellow-100 text-yellow-700 border-yellow-200",
    [DriverStatus.approved]: "bg-green-100 text-green-700 border-green-200",
    [DriverStatus.rejected]: "bg-red-100 text-red-700 border-red-200",
  };
  return <Badge className={styles[status]}>{status}</Badge>;
}

export default function AdminDashboard({ navigate }: Props) {
  const { identity, clear } = useInternetIdentity();
  const { data: isAdmin, isLoading: checkingAdmin } = useIsAdmin();
  const { data: drivers, isLoading: loadingDrivers } = useAllDrivers();
  const updateStatus = useUpdateDriverStatus();

  const handleLogout = () => {
    clear();
    navigate("landing");
  };

  const handleStatusUpdate = (
    driverEntry: DriverWithPrincipal,
    status: DriverStatus,
  ) => {
    updateStatus.mutate(
      { driver: driverEntry.principal, status },
      {
        onSuccess: () => toast.success(`Driver ${status} successfully.`),
        onError: () => toast.error("Failed to update driver status."),
      },
    );
  };

  if (!identity) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center">
          <ShieldAlert className="w-12 h-12 text-primary mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Admin Access Required</h2>
          <p className="text-muted-foreground mb-6">
            Please log in to access the admin dashboard.
          </p>
          <Button
            onClick={() => navigate("landing")}
            data-ocid="admin.primary_button"
          >
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  if (checkingAdmin) {
    return (
      <div
        className="min-h-screen bg-background flex items-center justify-center"
        data-ocid="admin.loading_state"
      >
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center">
          <ShieldAlert className="w-12 h-12 text-destructive mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Access Denied</h2>
          <p className="text-muted-foreground mb-6">
            You don't have admin privileges.
          </p>
          <Button
            onClick={() => navigate("landing")}
            data-ocid="admin.primary_button"
          >
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const pendingCount =
    drivers?.filter((d) => d.profile.status === DriverStatus.pending).length ??
    0;
  const approvedCount =
    drivers?.filter((d) => d.profile.status === DriverStatus.approved).length ??
    0;
  const rejectedCount =
    drivers?.filter((d) => d.profile.status === DriverStatus.rejected).length ??
    0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-navy text-white border-b border-white/10 shadow-navbar">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate("landing")}
            className="flex items-center gap-2 font-bold text-lg hover:text-green-400 transition-colors"
            data-ocid="admin.link"
          >
            <Bike className="w-6 h-6 text-green-400" />
            CycleUser Admin
          </button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="gap-2 text-white hover:text-white hover:bg-white/10"
            data-ocid="admin.secondary_button"
          >
            <LogOut className="w-4 h-4" /> Log Out
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-3 mb-8">
            <Users className="w-7 h-7 text-primary" />
            <h1 className="text-2xl font-extrabold text-foreground">
              Driver Management
            </h1>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[
              {
                label: "Pending",
                value: pendingCount,
                color: "text-yellow-600 bg-yellow-50 border-yellow-100",
              },
              {
                label: "Approved",
                value: approvedCount,
                color: "text-green-600 bg-green-50 border-green-100",
              },
              {
                label: "Rejected",
                value: rejectedCount,
                color: "text-red-600 bg-red-50 border-red-100",
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className={`rounded-xl border p-4 text-center ${stat.color}`}
              >
                <div className="text-2xl font-extrabold">{stat.value}</div>
                <div className="text-xs font-medium mt-1">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Table */}
          <div
            className="bg-card border border-border rounded-xl shadow-card overflow-hidden"
            data-ocid="admin.table"
          >
            {loadingDrivers ? (
              <div className="p-8 space-y-3" data-ocid="admin.loading_state">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            ) : !drivers?.length ? (
              <div className="p-12 text-center" data-ocid="admin.empty_state">
                <Users className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                <h3 className="font-bold text-foreground mb-1">
                  No drivers yet
                </h3>
                <p className="text-sm text-muted-foreground">
                  Driver applications will appear here once submitted.
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>City</TableHead>
                    <TableHead>Vehicle</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {drivers.map((driverEntry, i) => (
                    <TableRow
                      key={`${driverEntry.profile.email}-${i}`}
                      data-ocid={`admin.row.${i + 1}`}
                    >
                      <TableCell className="font-medium">
                        {driverEntry.profile.name}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {driverEntry.profile.email}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {driverEntry.profile.phone}
                      </TableCell>
                      <TableCell>{driverEntry.profile.city}</TableCell>
                      <TableCell className="capitalize">
                        {driverEntry.profile.vehicleType}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={driverEntry.profile.status} />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-2">
                          {driverEntry.profile.status !==
                            DriverStatus.approved && (
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700 text-white h-7 gap-1"
                              onClick={() =>
                                handleStatusUpdate(
                                  driverEntry,
                                  DriverStatus.approved,
                                )
                              }
                              disabled={updateStatus.isPending}
                              data-ocid={`admin.confirm_button.${i + 1}`}
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" /> Approve
                            </Button>
                          )}
                          {driverEntry.profile.status !==
                            DriverStatus.rejected && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-red-200 text-red-600 hover:bg-red-50 h-7 gap-1"
                              onClick={() =>
                                handleStatusUpdate(
                                  driverEntry,
                                  DriverStatus.rejected,
                                )
                              }
                              disabled={updateStatus.isPending}
                              data-ocid={`admin.delete_button.${i + 1}`}
                            >
                              <XCircle className="w-3.5 h-3.5" /> Reject
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </motion.div>
      </main>

      <footer className="border-t border-border py-6 text-center text-sm text-muted-foreground mt-8">
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
