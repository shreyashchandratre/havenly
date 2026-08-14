'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Property, Booking } from '@/lib/dummy-data';
import { getStoredBookings, saveStoredBooking } from '@/lib/bookings';
import { getStoredProperties, deleteStoredProperty } from '@/lib/properties';
import { useToast } from '@/hooks/use-toast';
import { Footer } from '@/components/Footer';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export default function HostDashboardPage() {
  const currentHostId = 'host-1'; // Mock current host
  const [hostProperties, setHostProperties] = useState<Property[]>([]);
  const [hostBookings, setHostBookings] = useState<Booking[]>([]);
  const [deletingPropertyId, setDeletingPropertyId] = useState<string | null>(null);
  const { toast } = useToast();
  const [bookingAction, setBookingAction] = useState<{id: string; action: "accept" | "decline";} | null>(null);

  useEffect(() => {
    const loadProperties = () => {
      const allProps = getStoredProperties();
      const filtered = allProps.filter((p) => p.hostId === currentHostId);
      setHostProperties(filtered);

      const allBookings = getStoredBookings();
      setHostBookings(
        allBookings.filter((booking) =>
          filtered.some((property) => property.id === booking.propertyId)
        )
      );
    };

    loadProperties();

    window.addEventListener('propertiesUpdated', loadProperties);
    return () => {
      window.removeEventListener('propertiesUpdated', loadProperties);
    };
  }, []);

    const handleBookingAction = () => {
      if (!bookingAction) return;

      if (bookingAction.action === "accept") {
        handleAccept(bookingAction.id);
      } else {
        handleDecline(bookingAction.id);
      }
    
      setBookingAction(null);
    };


  const handleAccept = (bookingId : string) => {
    setHostBookings((prev) => {
      const updated = prev.map((booking) => 
        booking.id === bookingId? { ...booking, status: "confirmed" } as Booking : booking
      );
      const accepted = updated.find(b => b.id === bookingId);
      if (accepted) saveStoredBooking(accepted);
      return updated;
    });
    toast({
      title: "Booking accepted",
      description: "Booking request has been accepted.",
    });
  }

  const handleDecline = (bookingId : string) => {
    setHostBookings((prev) => {
      const updated = prev.map((booking) => 
        booking.id === bookingId? {...booking, status: "cancelled"} as Booking : booking
      );
      const declined = updated.find(b => b.id === bookingId);
      if (declined) saveStoredBooking(declined);
      return updated;
    });
    toast({
      title: "Booking Rejected",
      description: "Booking request has been declined",
    })
  }

  const handleDeleteConfirm = () => {
    if (deletingPropertyId) {
      const deletedProperty = hostProperties.find(p => p.id === deletingPropertyId);
      deleteStoredProperty(deletingPropertyId);
      setHostProperties((prev) => prev.filter((p) => p.id !== deletingPropertyId));
      setDeletingPropertyId(null);
      toast({
        title: 'Property deleted',
        description: `${deletedProperty?.title || 'Property'} has been successfully deleted.`,
      });
    }
  };

  // const hostBookings = bookings.filter((b) =>
  //   hostProperties.some((p) => p.id === b.propertyId)
  // );

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              Host Dashboard
            </h1>
            <p className="text-muted-foreground">
              Manage your properties and bookings
            </p>
          </div>
          <Link href="/host/add">
            <Button className="bg-primary text-primary-foreground">
              <Plus size={18} className="mr-2" />
              Add Property
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3 mb-8">
          <Card className="p-6 border-border">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">
              Total Properties
            </h3>
            <p className="text-3xl font-bold text-foreground">{hostProperties.length}</p>
          </Card>
          <Card className="p-6 border-border">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">
              Upcoming Bookings
            </h3>
            <p className="text-3xl font-bold text-foreground">
              {hostBookings.filter((b) => b.status === 'confirmed' || b.status === 'upcoming').length}
            </p>
          </Card>
          <Card className="p-6 border-border">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">
              Avg Rating
            </h3>
            <p className="text-3xl font-bold text-foreground">
              {(
                hostProperties.reduce((sum, p) => sum + p.rating, 0) /
                (hostProperties.length || 1)
              ).toFixed(2)}
            </p>
          </Card>
        </div>

        {/* Properties Table */}
        <Card className="border-border overflow-hidden mb-8">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                    Property
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground hidden md:table-cell">
                    Location
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                    Price/Night
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground hidden lg:table-cell">
                    Rating
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {hostProperties.map((property) => (
                  <tr key={property.id} className="hover:bg-muted transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
                          <Image
                            src={property.image}
                            alt={property.title}
                            fill
                            className="object-cover"
                            sizes="40px"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-foreground truncate">
                            {property.title}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {property.capacity.bedrooms} beds
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground hidden md:table-cell">
                      {property.location.city}, {property.location.state}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-foreground">
                      ${property.pricePerNight}
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground hidden lg:table-cell">
                      {property.rating.toFixed(2)} ★
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2 flex-wrap">
                        <Link href={`/property/${property.id}`}>
                          <button className="p-2 hover:bg-muted rounded transition" title="View">
                            <Eye size={16} className="text-foreground" />
                          </button>
                        </Link>
                        <Link href={`/host/edit/${property.id}`}>
                          <button className="p-2 hover:bg-muted rounded transition" title="Edit">
                            <Edit size={16} className="text-foreground" />
                          </button>
                        </Link>
                        <button 
                          onClick={() => setDeletingPropertyId(property.id)}
                          className="p-2 hover:bg-red-100 text-red-600 rounded transition" 
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Booking Requests */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-6">
            Recent Booking Requests
          </h2>
          <div className="space-y-4">
            {hostBookings.slice(0, 5).map((booking) => {
              const property = hostProperties.find((p) => p.id === booking.propertyId);
              if (!property) return null;

              return (
                <Card key={booking.id} className="p-6 border-border">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground mb-2">
                        {property.title}
                      </h3>
                      <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 text-sm text-muted-foreground flex-wrap">
                        <div className="flex items-center gap-1">
                          <Calendar size={16} />
                          {booking.checkIn.toLocaleDateString()} -{' '}
                          {booking.checkOut.toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <Users size={16} />
                          {booking.guests} guest{booking.guests !== 1 ? 's' : ''}
                        </div>
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${booking.status === 'confirmed'
                            ? 'bg-green-100 text-green-800'
                            : booking.status === 'cancelled'
                            ? "bg-red-100 text-red-800"
                            : "bg-blue-100 text-blue-800"
                          }`}
                      >
                        {booking.status.charAt(0).toUpperCase() +
                          booking.status.slice(1)}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-3 pt-4 border-t border-border">
                    <Button 
                      variant="outline" 
                      size="sm"
                      disabled={booking.status !== "upcoming"}
                      onClick={() => setBookingAction({
                        id: booking.id,
                        action: "accept",
                      })}
                    >
                      Accept
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      disabled={booking.status !== "upcoming"}
                      onClick={() => setBookingAction({
                        id: booking.id,
                        action: "decline",
                      })}
                    >
                      Decline
                    </Button>
                  </div>
                </Card>
              );
            })}

            {hostBookings.length === 0 && (
              <Card className="p-8 border-border text-center">
                <p className="text-muted-foreground">No booking requests</p>
              </Card>
            )}
          </div>
        </div>
      </div>

      <Footer />

      <AlertDialog open={deletingPropertyId !== null} onOpenChange={(open) => !open && setDeletingPropertyId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your property listing from Havenly.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-red-600 hover:bg-red-700 text-white border-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={bookingAction !== null} onOpenChange={(open) => !open && setBookingAction(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {bookingAction?.action === "accept"
                ? "Confirm Booking"
                : "Decline Booking"}
            </AlertDialogTitle>
              
            <AlertDialogDescription>
              {bookingAction?.action === "accept"
                ? "Are you sure you want to confirm this booking?"
                : "Are you sure you want to decline this booking?"}
            </AlertDialogDescription>
          </AlertDialogHeader>
              
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
              
            <AlertDialogAction onClick={handleBookingAction}>
              Yes
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
}
