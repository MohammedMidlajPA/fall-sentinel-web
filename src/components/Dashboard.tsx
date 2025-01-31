import { useEffect, useState } from "react";
import { ref, onValue, update } from 'firebase/database';
import { database } from '@/lib/firebase';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertCircle, CheckCircle2, Clock } from "lucide-react";

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
  const [activeReports, setActiveReports] = useState(0);
  const [averageResponseTime, setAverageResponseTime] = useState("2h 30m");

  useEffect(() => {
    const reportsRef = ref(database, 'reports');
    const unsubscribe = onValue(reportsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        setReports(data);
        setActiveReports(Object.values(data).filter((report: Report) => report.status === "pending").length);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleResolve = async (reportId: string) => {
    try {
      const reportRef = ref(database, `reports/${reportId}`);
      await update(reportRef, {
        status: "resolved"
      });
    } catch (error) {
      console.error("Error resolving report:", error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
        <Card className="bg-gradient-to-br from-white to-gray-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-yellow-500" />
              Active Reports
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{activeReports}</div>
            <p className="text-sm text-muted-foreground">
              Pending investigation
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-white to-gray-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-500" />
              Average Response Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{averageResponseTime}</div>
            <p className="text-sm text-muted-foreground">
              Time to resolution
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-white to-gray-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              System Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-500">Online</div>
            <p className="text-sm text-muted-foreground">
              All systems operational
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px] pr-4">
            <div className="space-y-4">
              {Object.entries(reports).map(([id, report]) => (
                <Card key={id} className="bg-gradient-to-br from-white to-gray-50">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold mb-1">
                          Train {report.trainNumber} - Cabin {report.cabin}
                        </h3>
                        <Badge 
                          variant={report.status === "pending" ? "destructive" : "default"}
                          className="mb-2"
                        >
                          {report.status}
                        </Badge>
                      </div>
                      {report.status === "pending" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleResolve(id)}
                        >
                          Mark as Resolved
                        </Button>
                      )}
                    </div>
                    <div className="grid gap-2 text-sm">
                      <div className="grid grid-cols-2 gap-1">
                        <span className="font-medium">Problem Type:</span>
                        <span>{report.problem}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-1">
                        <span className="font-medium">Location:</span>
                        <span>{report.location}</span>
                      </div>
                      <div className="mt-2">
                        <span className="font-medium">Description:</span>
                        <p className="mt-1 text-muted-foreground">{report.description}</p>
                      </div>
                      <div className="mt-2 text-xs text-muted-foreground">
                        Reported: {new Date(report.timestamp).toLocaleString()}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;