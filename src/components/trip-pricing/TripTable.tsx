
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface TripPrice {
  id: string;
  from_city: string;
  to_city: string;
  vehicle_type: string;
  price: number;
  trip_type: string;
}

interface TripTableProps {
  tripPrices: TripPrice[];
  onTripDeleted: () => void;
}

export function TripTable({ tripPrices, onTripDeleted }: TripTableProps) {
  const deleteTripPrice = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا السعر؟')) return;

    try {
      const { error } = await supabase
        .from('trip_pricing')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('تم حذف سعر الرحلة بنجاح');
      onTripDeleted();
    } catch (error) {
      console.error('Error deleting trip price:', error);
      toast.error('خطأ في حذف سعر الرحلة');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>أسعار الرحلات</CardTitle>
      </CardHeader>
      <CardContent>
        {tripPrices.length === 0 ? (
          <p className="text-center text-gray-500 py-8">لا توجد أسعار رحلات</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-right p-3">من</th>
                  <th className="text-right p-3">إلى</th>
                  <th className="text-right p-3">نوع المركبة</th>
                  <th className="text-right p-3">السعر</th>
                  <th className="text-right p-3">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {tripPrices.map((trip) => (
                  <tr key={trip.id} className="border-b hover:bg-gray-50">
                    <td className="p-3">{trip.from_city}</td>
                    <td className="p-3">{trip.to_city}</td>
                    <td className="p-3">
                      <Badge variant="outline">{trip.vehicle_type}</Badge>
                    </td>
                    <td className="p-3 font-medium">{trip.price} ريال</td>
                    <td className="p-3">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteTripPrice(trip.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
