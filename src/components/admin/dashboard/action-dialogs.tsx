"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
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
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

// Product Actions
interface Product {
    id: string;
    name: string;
    category: string;
    price: number;
    stock: number;
    status: string;
    brand: string;
    rating: number;
}

interface ProductActionsProps {
    product: Product;
    onUpdate: (product: Product) => void;
    onDelete: (productId: string) => void;
    deleteLoading?: boolean;
}

export function ProductActions({
    product,
    onUpdate,
    onDelete,
    deleteLoading = false,
}: ProductActionsProps) {
    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [viewOpen, setViewOpen] = useState(false);
    const [editData, setEditData] = useState(product);

    const handleEdit = () => {
        onUpdate(editData);
        setEditOpen(false);
        toast.success("Product updated successfully");
    };

    const handleDelete = () => {
        onDelete(product.id);
        setDeleteOpen(false);
        // Note: Toast is handled in the parent component now
    };

    return (
        <>
            {/* View Dialog */}
            <Dialog open={viewOpen} onOpenChange={setViewOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Product Details</DialogTitle>
                        <DialogDescription>
                            View complete product information
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label className="text-sm font-medium">
                                    Product Name
                                </Label>
                                <p className="text-sm text-gray-600">
                                    {product.name}
                                </p>
                            </div>
                            <div>
                                <Label className="text-sm font-medium">
                                    Product ID
                                </Label>
                                <p className="text-sm text-gray-600">
                                    {product.id}
                                </p>
                            </div>
                            <div>
                                <Label className="text-sm font-medium">
                                    Category
                                </Label>
                                <p className="text-sm text-gray-600">
                                    {product.category}
                                </p>
                            </div>
                            <div>
                                <Label className="text-sm font-medium">
                                    Brand
                                </Label>
                                <p className="text-sm text-gray-600">
                                    {product.brand}
                                </p>
                            </div>
                            <div>
                                <Label className="text-sm font-medium">
                                    Price
                                </Label>
                                <p className="text-sm text-gray-600">
                                    ${product.price}
                                </p>
                            </div>
                            <div>
                                <Label className="text-sm font-medium">
                                    Stock
                                </Label>
                                <p className="text-sm text-gray-600">
                                    {product.stock} units
                                </p>
                            </div>
                            <div>
                                <Label className="text-sm font-medium">
                                    Rating
                                </Label>
                                <p className="text-sm text-gray-600">
                                    ⭐ {product.rating}
                                </p>
                            </div>
                            <div>
                                <Label className="text-sm font-medium">
                                    Status
                                </Label>
                                <Badge
                                    variant="outline"
                                    className={
                                        product.status === "Active"
                                            ? "border-green-500 text-green-700 bg-green-50"
                                            : product.status === "Low Stock"
                                            ? "border-yellow-500 text-yellow-700 bg-yellow-50"
                                            : "border-red-500 text-red-700 bg-red-50"
                                    }
                                >
                                    {product.status}
                                </Badge>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setEditOpen(true)}
                        >
                            Edit Product
                        </Button>
                        <Button onClick={() => setViewOpen(false)}>
                            Close
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Dialog */}
            <Dialog open={editOpen} onOpenChange={setEditOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Edit Product</DialogTitle>
                        <DialogDescription>
                            Update product information
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Product Name</Label>
                                <Input
                                    id="name"
                                    value={editData.name}
                                    onChange={(e) =>
                                        setEditData({
                                            ...editData,
                                            name: e.target.value,
                                        })
                                    }
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="category">Category</Label>
                                <Select
                                    value={editData.category}
                                    onValueChange={(value) =>
                                        setEditData({
                                            ...editData,
                                            category: value,
                                        })
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Electronics">
                                            Electronics
                                        </SelectItem>
                                        <SelectItem value="Sports">
                                            Sports
                                        </SelectItem>
                                        <SelectItem value="Home">
                                            Home
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="price">Price</Label>
                                <Input
                                    id="price"
                                    type="number"
                                    value={editData.price}
                                    onChange={(e) =>
                                        setEditData({
                                            ...editData,
                                            price: Number.parseFloat(
                                                e.target.value
                                            ),
                                        })
                                    }
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="stock">Stock</Label>
                                <Input
                                    id="stock"
                                    type="number"
                                    value={editData.stock}
                                    onChange={(e) =>
                                        setEditData({
                                            ...editData,
                                            stock: Number.parseInt(
                                                e.target.value
                                            ),
                                        })
                                    }
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="brand">Brand</Label>
                                <Input
                                    id="brand"
                                    value={editData.brand}
                                    onChange={(e) =>
                                        setEditData({
                                            ...editData,
                                            brand: e.target.value,
                                        })
                                    }
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="status">Status</Label>
                                <Select
                                    value={editData.status}
                                    onValueChange={(value) =>
                                        setEditData({
                                            ...editData,
                                            status: value,
                                        })
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Active">
                                            Active
                                        </SelectItem>
                                        <SelectItem value="Low Stock">
                                            Low Stock
                                        </SelectItem>
                                        <SelectItem value="Out of Stock">
                                            Out of Stock
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setEditOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleEdit}
                            className="bg-gradient-to-r from-orange-500 to-pink-500"
                        >
                            Save Changes
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation */}
            <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Product</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete &quot;{product.name}
                            &quot;? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={deleteLoading}>
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            disabled={deleteLoading}
                            className="bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {deleteLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Deleting...
                                </>
                            ) : (
                                "Delete"
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Action Buttons */}
            <div className="flex items-center gap-1">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setViewOpen(true)}
                >
                    View
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditOpen(true)}
                >
                    Edit
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDeleteOpen(true)}
                    className="text-red-600"
                >
                    Delete
                </Button>
            </div>
        </>
    );
}

// Order Actions
import { InvoiceButton } from "@/components/admin/dashboard/invoice-button";

interface Order {
    id: string;
    customer: string;
    email: string;
    date: string;
    status: string;
    payment: string;
    total: number;
    items: number;
    priority: string;
    shippingMethod: string;
}

interface OrderActionsProps {
    order: Order;
    onUpdate: (order: Order) => void;
    onDelete: (orderId: string) => void;
}

export function OrderActions({ order, onUpdate, onDelete }: OrderActionsProps) {
    const [viewOpen, setViewOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [editData, setEditData] = useState(order);

    const handleEdit = () => {
        onUpdate(editData);
        setEditOpen(false);
        toast.success("Order updated successfully");
    };

    const handleDelete = () => {
        onDelete(order.id);
        setDeleteOpen(false);
        toast.success("Order deleted successfully");
    };

    const handleStatusChange = (newStatus: string) => {
        const updatedOrder = { ...order, status: newStatus };
        onUpdate(updatedOrder);
        toast.success(`Order status changed to ${newStatus}`);
    };

    return (
        <>
            {/* View Dialog */}
            <Dialog open={viewOpen} onOpenChange={setViewOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Order Details</DialogTitle>
                        <DialogDescription>
                            Complete order information
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label className="text-sm font-medium">
                                    Order ID
                                </Label>
                                <p className="text-sm text-gray-600">
                                    {order.id}
                                </p>
                            </div>
                            <div>
                                <Label className="text-sm font-medium">
                                    Customer
                                </Label>
                                <p className="text-sm text-gray-600">
                                    {order.customer}
                                </p>
                            </div>
                            <div>
                                <Label className="text-sm font-medium">
                                    Email
                                </Label>
                                <p className="text-sm text-gray-600">
                                    {order.email}
                                </p>
                            </div>
                            <div>
                                <Label className="text-sm font-medium">
                                    Date
                                </Label>
                                <p className="text-sm text-gray-600">
                                    {new Date(order.date).toLocaleDateString()}
                                </p>
                            </div>
                            <div>
                                <Label className="text-sm font-medium">
                                    Status
                                </Label>
                                <Badge
                                    variant="outline"
                                    className={
                                        order.status === "Delivered"
                                            ? "border-green-500 text-green-700 bg-green-50"
                                            : order.status === "Processing"
                                            ? "border-blue-500 text-blue-700 bg-blue-50"
                                            : order.status === "Shipped"
                                            ? "border-purple-500 text-purple-700 bg-purple-50"
                                            : order.status === "Pending"
                                            ? "border-yellow-500 text-yellow-700 bg-yellow-50"
                                            : "border-red-500 text-red-700 bg-red-50"
                                    }
                                >
                                    {order.status}
                                </Badge>
                            </div>
                            <div>
                                <Label className="text-sm font-medium">
                                    Payment
                                </Label>
                                <Badge
                                    variant={
                                        order.payment === "Paid"
                                            ? "default"
                                            : "secondary"
                                    }
                                    className={
                                        order.payment === "Paid"
                                            ? "bg-green-100 text-green-800"
                                            : order.payment === "Pending"
                                            ? "bg-yellow-100 text-yellow-800"
                                            : "bg-gray-100 text-gray-800"
                                    }
                                >
                                    {order.payment}
                                </Badge>
                            </div>
                            <div>
                                <Label className="text-sm font-medium">
                                    Total
                                </Label>
                                <p className="text-sm text-gray-600">
                                    ${order.total}
                                </p>
                            </div>
                            <div>
                                <Label className="text-sm font-medium">
                                    Items
                                </Label>
                                <p className="text-sm text-gray-600">
                                    {order.items} items
                                </p>
                            </div>
                            <div>
                                <Label className="text-sm font-medium">
                                    Priority
                                </Label>
                                <Badge variant="outline">
                                    {order.priority}
                                </Badge>
                            </div>
                            <div>
                                <Label className="text-sm font-medium">
                                    Shipping
                                </Label>
                                <p className="text-sm text-gray-600">
                                    {order.shippingMethod}
                                </p>
                            </div>
                        </div>
                        <Separator />
                        <div className="flex gap-2">
                            <Button
                                size="sm"
                                onClick={() => handleStatusChange("Processing")}
                            >
                                Mark Processing
                            </Button>
                            <Button
                                size="sm"
                                onClick={() => handleStatusChange("Shipped")}
                            >
                                Mark Shipped
                            </Button>
                            <Button
                                size="sm"
                                onClick={() => handleStatusChange("Delivered")}
                            >
                                Mark Delivered
                            </Button>
                        </div>
                    </div>
                    <DialogFooter>
                        <InvoiceButton
                            order={order as unknown as Record<string, unknown>}
                            variant="outline"
                            showText={true}
                        />
                        <Button
                            variant="outline"
                            onClick={() => setEditOpen(true)}
                        >
                            Edit Order
                        </Button>
                        <Button onClick={() => setViewOpen(false)}>
                            Close
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Dialog */}
            <Dialog open={editOpen} onOpenChange={setEditOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Edit Order</DialogTitle>
                        <DialogDescription>
                            Update order information
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="status">Status</Label>
                                <Select
                                    value={editData.status}
                                    onValueChange={(value) =>
                                        setEditData({
                                            ...editData,
                                            status: value,
                                        })
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Pending">
                                            Pending
                                        </SelectItem>
                                        <SelectItem value="Processing">
                                            Processing
                                        </SelectItem>
                                        <SelectItem value="Shipped">
                                            Shipped
                                        </SelectItem>
                                        <SelectItem value="Delivered">
                                            Delivered
                                        </SelectItem>
                                        <SelectItem value="Cancelled">
                                            Cancelled
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="payment">Payment Status</Label>
                                <Select
                                    value={editData.payment}
                                    onValueChange={(value) =>
                                        setEditData({
                                            ...editData,
                                            payment: value,
                                        })
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Paid">
                                            Paid
                                        </SelectItem>
                                        <SelectItem value="Pending">
                                            Pending
                                        </SelectItem>
                                        <SelectItem value="Refunded">
                                            Refunded
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="priority">Priority</Label>
                                <Select
                                    value={editData.priority}
                                    onValueChange={(value) =>
                                        setEditData({
                                            ...editData,
                                            priority: value,
                                        })
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Low">Low</SelectItem>
                                        <SelectItem value="Normal">
                                            Normal
                                        </SelectItem>
                                        <SelectItem value="High">
                                            High
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="shipping">
                                    Shipping Method
                                </Label>
                                <Select
                                    value={editData.shippingMethod}
                                    onValueChange={(value) =>
                                        setEditData({
                                            ...editData,
                                            shippingMethod: value,
                                        })
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Standard">
                                            Standard
                                        </SelectItem>
                                        <SelectItem value="Express">
                                            Express
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setEditOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleEdit}
                            className="bg-gradient-to-r from-orange-500 to-pink-500"
                        >
                            Save Changes
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation */}
            <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Order</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete order &quot;
                            {order.id}&quot;? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Action Buttons */}
            <div className="flex items-center gap-1">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setViewOpen(true)}
                >
                    View
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditOpen(true)}
                >
                    Edit
                </Button>
                <InvoiceButton
                    order={order as unknown as Record<string, unknown>}
                />
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDeleteOpen(true)}
                    className="text-red-600"
                >
                    Delete
                </Button>
            </div>
        </>
    );
}

// User Actions
interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    status: string;
    orders: number;
    spent: number;
    joined: string;
    location: string;
    tier: string;
}

interface UserActionsProps {
    user: User;
    onUpdate: (user: User) => void;
    onDelete: (userId: string) => void;
}

export function UserActions({ user, onUpdate, onDelete }: UserActionsProps) {
    const [viewOpen, setViewOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [suspendOpen, setSuspendOpen] = useState(false);
    const [editData, setEditData] = useState(user);

    const handleEdit = () => {
        onUpdate(editData);
        setEditOpen(false);
        toast.success("User updated successfully");
    };

    const handleDelete = () => {
        onDelete(user.id);
        setDeleteOpen(false);
        toast.success("User deleted successfully");
    };

    const handleSuspend = () => {
        const updatedUser = {
            ...user,
            status: user.status === "Suspended" ? "Active" : "Suspended",
        };
        onUpdate(updatedUser);
        setSuspendOpen(false);
        toast.success(
            `User ${
                user.status === "Suspended" ? "activated" : "suspended"
            } successfully`
        );
    };

    return (
        <>
            {/* View Dialog */}
            <Dialog open={viewOpen} onOpenChange={setViewOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>User Details</DialogTitle>
                        <DialogDescription>
                            Complete user information
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label className="text-sm font-medium">
                                    User ID
                                </Label>
                                <p className="text-sm text-gray-600">
                                    {user.id}
                                </p>
                            </div>
                            <div>
                                <Label className="text-sm font-medium">
                                    Name
                                </Label>
                                <p className="text-sm text-gray-600">
                                    {user.name}
                                </p>
                            </div>
                            <div>
                                <Label className="text-sm font-medium">
                                    Email
                                </Label>
                                <p className="text-sm text-gray-600">
                                    {user.email}
                                </p>
                            </div>
                            <div>
                                <Label className="text-sm font-medium">
                                    Role
                                </Label>
                                <Badge variant="outline">{user.role}</Badge>
                            </div>
                            <div>
                                <Label className="text-sm font-medium">
                                    Status
                                </Label>
                                <Badge
                                    variant="outline"
                                    className={
                                        user.status === "Active"
                                            ? "border-green-500 text-green-700 bg-green-50"
                                            : user.status === "Suspended"
                                            ? "border-red-500 text-red-700 bg-red-50"
                                            : "border-gray-500 text-gray-700 bg-gray-50"
                                    }
                                >
                                    {user.status}
                                </Badge>
                            </div>
                            <div>
                                <Label className="text-sm font-medium">
                                    Tier
                                </Label>
                                <Badge variant="outline">{user.tier}</Badge>
                            </div>
                            <div>
                                <Label className="text-sm font-medium">
                                    Orders
                                </Label>
                                <p className="text-sm text-gray-600">
                                    {user.orders}
                                </p>
                            </div>
                            <div>
                                <Label className="text-sm font-medium">
                                    Total Spent
                                </Label>
                                <p className="text-sm text-gray-600">
                                    ${user.spent.toFixed(2)}
                                </p>
                            </div>
                            <div>
                                <Label className="text-sm font-medium">
                                    Location
                                </Label>
                                <p className="text-sm text-gray-600">
                                    {user.location}
                                </p>
                            </div>
                            <div>
                                <Label className="text-sm font-medium">
                                    Joined
                                </Label>
                                <p className="text-sm text-gray-600">
                                    {new Date(user.joined).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setEditOpen(true)}
                        >
                            Edit User
                        </Button>
                        <Button onClick={() => setViewOpen(false)}>
                            Close
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Dialog */}
            <Dialog open={editOpen} onOpenChange={setEditOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Edit User</DialogTitle>
                        <DialogDescription>
                            Update user information
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    value={editData.name}
                                    onChange={(e) =>
                                        setEditData({
                                            ...editData,
                                            name: e.target.value,
                                        })
                                    }
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={editData.email}
                                    onChange={(e) =>
                                        setEditData({
                                            ...editData,
                                            email: e.target.value,
                                        })
                                    }
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="role">Role</Label>
                                <Select
                                    value={editData.role}
                                    onValueChange={(value) =>
                                        setEditData({
                                            ...editData,
                                            role: value,
                                        })
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Customer">
                                            Customer
                                        </SelectItem>
                                        <SelectItem value="Admin">
                                            Admin
                                        </SelectItem>
                                        <SelectItem value="Moderator">
                                            Moderator
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="status">Status</Label>
                                <Select
                                    value={editData.status}
                                    onValueChange={(value) =>
                                        setEditData({
                                            ...editData,
                                            status: value,
                                        })
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Active">
                                            Active
                                        </SelectItem>
                                        <SelectItem value="Inactive">
                                            Inactive
                                        </SelectItem>
                                        <SelectItem value="Suspended">
                                            Suspended
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="tier">Tier</Label>
                                <Select
                                    value={editData.tier}
                                    onValueChange={(value) =>
                                        setEditData({
                                            ...editData,
                                            tier: value,
                                        })
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Bronze">
                                            Bronze
                                        </SelectItem>
                                        <SelectItem value="Silver">
                                            Silver
                                        </SelectItem>
                                        <SelectItem value="Gold">
                                            Gold
                                        </SelectItem>
                                        <SelectItem value="Platinum">
                                            Platinum
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="location">Location</Label>
                                <Input
                                    id="location"
                                    value={editData.location}
                                    onChange={(e) =>
                                        setEditData({
                                            ...editData,
                                            location: e.target.value,
                                        })
                                    }
                                />
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setEditOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleEdit}
                            className="bg-gradient-to-r from-orange-500 to-pink-500"
                        >
                            Save Changes
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Suspend Confirmation */}
            <AlertDialog open={suspendOpen} onOpenChange={setSuspendOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            {user.status === "Suspended"
                                ? "Activate"
                                : "Suspend"}{" "}
                            User
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to{" "}
                            {user.status === "Suspended"
                                ? "activate"
                                : "suspend"}{" "}
                            &quot;{user.name}&quot;?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleSuspend}>
                            {user.status === "Suspended"
                                ? "Activate"
                                : "Suspend"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Delete Confirmation */}
            <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete User</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete &quot;{user.name}
                            &quot;? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Action Buttons */}
            <div className="flex items-center gap-1">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setViewOpen(true)}
                >
                    View
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditOpen(true)}
                >
                    Edit
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSuspendOpen(true)}
                    className={
                        user.status === "Suspended"
                            ? "text-green-600"
                            : "text-orange-600"
                    }
                >
                    {user.status === "Suspended" ? "Activate" : "Suspend"}
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDeleteOpen(true)}
                    className="text-red-600"
                >
                    Delete
                </Button>
            </div>
        </>
    );
}
