import { useEffect, useState } from "react";
import { ref, onValue } from 'firebase/database';
import { database } from '@/lib/firebase';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Report {
  trainNumber: string;
  cabin: string;
  problem: string;
  location: string;
  description: string;
  timestamp: string;
  status: "pending" | "resolved";
}

const Dashboard = () => {
  const [reports, setReports] = useState<Record<string, Report>>({});

  useEffect(() => {
    const reportsRef = ref(database, 'reports');
    const unsubscribe = onValue(reportsRef, (snapshot) => {
      if (snapshot.exists()) {
        setReports(snapshot.val());
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Active Sensors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0/12</div>
            <p className="text-xs text-muted-foreground">
              <span className="flex h-3 w-3 rounded-full bg-red-500 mr-2" />
              Offline
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Response Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">--</div>
            <p className="text-xs text-muted-foreground">System Offline</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">Offline</div>
            <p className="text-xs text-muted-foreground">All systems inactive</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Recent Reports</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Object.entries(reports).map(([id, report]) => (
            <Card key={id}>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  Train {report.trainNumber}
                  <Badge variant={report.status === "pending" ? "destructive" : "default"}>
                    {report.status}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p><strong>Cabin:</strong> {report.cabin}</p>
                  <p><strong>Problem:</strong> {report.problem}</p>
                  <p><strong>Location:</strong> {report.location}</p>
                  <p><strong>Description:</strong> {report.description}</p>
                  <p className="text-sm text-muted-foreground">
                    Reported: {new Date(report.timestamp).toLocaleString()}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;