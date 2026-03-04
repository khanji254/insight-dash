import { useState } from "react";
import {
  usePendingUsers,
  useAllUsers,
  useApproveUser,
  useSuspendUser,
  useReactivateUser,
  useUpdateUserRole,
  useDeleteUser,
} from "@/hooks/use-api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Shield, UserCheck, UserX, Trash2, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { AdminUser } from "@/lib/api";

function getStatusColor(status: string) {
  switch (status) {
    case "ACTIVE":
      return "bg-green-500";
    case "PENDING_EMAIL":
      return "bg-yellow-500";
    case "PENDING_APPROVAL":
      return "bg-blue-500";
    case "SUSPENDED":
      return "bg-red-500";
    default:
      return "bg-gray-500";
  }
}

function getRoleColor(role: string) {
  switch (role) {
    case "ADMIN":
      return "bg-purple-500";
    case "ANALYST":
      return "bg-blue-500";
    case "VIEWER":
      return "bg-gray-500";
    default:
      return "bg-gray-500";
  }
}

export default function AdminDashboard() {
  const { toast } = useToast();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);

  const { data: pendingUsers, isLoading: pendingLoading } = usePendingUsers();
  const { data: allUsers, isLoading: allLoading } = useAllUsers();

  const approveMutation = useApproveUser();
  const suspendMutation = useSuspendUser();
  const reactivateMutation = useReactivateUser();
  const updateRoleMutation = useUpdateUserRole();
  const deleteMutation = useDeleteUser();

  async function handleApprove(userId: string) {
    try {
      const result = await approveMutation.mutateAsync(userId);
      toast({
        title: "User approved",
        description: result.data.message,
      });
    } catch (error: any) {
      toast({
        title: "Failed to approve user",
        description: error.message,
        variant: "destructive",
      });
    }
  }

  async function handleSuspend(userId: string) {
    try {
      await suspendMutation.mutateAsync({ userId });
      toast({
        title: "User suspended",
        description: "The user has been suspended successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Failed to suspend user",
        description: error.message,
        variant: "destructive",
      });
    }
  }

  async function handleReactivate(userId: string) {
    try {
      await reactivateMutation.mutateAsync(userId);
      toast({
        title: "User reactivated",
        description: "The user has been reactivated successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Failed to reactivate user",
        description: error.message,
        variant: "destructive",
      });
    }
  }

  async function handleRoleChange(userId: string, role: "ADMIN" | "ANALYST" | "VIEWER") {
    try {
      await updateRoleMutation.mutateAsync({ userId, role });
      toast({
        title: "Role updated",
        description: `User role changed to ${role}`,
      });
    } catch (error: any) {
      toast({
        title: "Failed to update role",
        description: error.message,
        variant: "destructive",
      });
    }
  }

  async function handleDelete() {
    if (!userToDelete) return;
    try {
      await deleteMutation.mutateAsync(userToDelete);
      toast({
        title: "User deleted",
        description: "The user has been deleted successfully.",
      });
      setDeleteDialogOpen(false);
      setUserToDelete(null);
    } catch (error: any) {
      toast({
        title: "Failed to delete user",
        description: error.message,
        variant: "destructive",
      });
    }
  }

  function openDeleteDialog(userId: string) {
    setUserToDelete(userId);
    setDeleteDialogOpen(true);
  }

  function renderUserTable(users: AdminUser[], showApprove = false) {
    if (!users || users.length === 0) {
      return (
        <div className="py-8 text-center text-muted-foreground">
          No users found
        </div>
      );
    }

    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Email</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">{user.email}</TableCell>
              <TableCell>{user.name}</TableCell>
              <TableCell>
                <Select
                  value={user.role}
                  onValueChange={(value) =>
                    handleRoleChange(
                      user.id,
                      value as "ADMIN" | "ANALYST" | "VIEWER"
                    )
                  }
                  disabled={
                    updateRoleMutation.isPending || user.role === "ADMIN"
                  }
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ADMIN">
                      <div className="flex items-center gap-2">
                        <div className={`h-2 w-2 rounded-full ${getRoleColor("ADMIN")}`} />
                        Admin
                      </div>
                    </SelectItem>
                    <SelectItem value="ANALYST">
                      <div className="flex items-center gap-2">
                        <div className={`h-2 w-2 rounded-full ${getRoleColor("ANALYST")}`} />
                        Analyst
                      </div>
                    </SelectItem>
                    <SelectItem value="VIEWER">
                      <div className="flex items-center gap-2">
                        <div className={`h-2 w-2 rounded-full ${getRoleColor("VIEWER")}`} />
                        Viewer
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className="border-transparent text-white"
                >
                  <div className="flex items-center gap-1.5">
                    <div className={`h-2 w-2 rounded-full ${getStatusColor(user.status)}`} />
                    {user.status.replace("_", " ")}
                  </div>
                </Badge>
              </TableCell>
              <TableCell>
                {new Date(user.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  {showApprove && user.status === "PENDING_APPROVAL" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleApprove(user.id)}
                      disabled={approveMutation.isPending}
                    >
                      {approveMutation.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <UserCheck className="h-4 w-4" />
                      )}
                      <span className="ml-2">Approve</span>
                    </Button>
                  )}
                  {user.status === "ACTIVE" && user.role !== "ADMIN" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleSuspend(user.id)}
                      disabled={suspendMutation.isPending}
                    >
                      {suspendMutation.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <UserX className="h-4 w-4" />
                      )}
                    </Button>
                  )}
                  {user.status === "SUSPENDED" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleReactivate(user.id)}
                      disabled={reactivateMutation.isPending}
                    >
                      {reactivateMutation.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <UserCheck className="h-4 w-4" />
                      )}
                    </Button>
                  )}
                  {user.role !== "ADMIN" && (
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => openDeleteDialog(user.id)}
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Shield className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage user accounts, roles, and permissions
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">
              Pending Approval
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {pendingLoading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                pendingUsers?.length || 0
              )}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {allLoading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                allUsers?.length || 0
              )}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {allLoading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                allUsers?.filter((u) => u.status === "ACTIVE").length || 0
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* User Management Tabs */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Users</TabsTrigger>
          <TabsTrigger value="pending">
            Pending Approval
            {pendingUsers && pendingUsers.length > 0 && (
              <Badge variant="destructive" className="ml-2 px-1.5 text-xs">
                {pendingUsers.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All Users</CardTitle>
              <CardDescription>
                View and manage all user accounts
              </CardDescription>
            </CardHeader>
            <CardContent>
              {allLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : (
                renderUserTable(allUsers || [])
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pending Approval</CardTitle>
              <CardDescription>
                Users awaiting admin approval to access the platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              {pendingLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : (
                renderUserTable(pendingUsers || [], true)
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this user account. This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setUserToDelete(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
