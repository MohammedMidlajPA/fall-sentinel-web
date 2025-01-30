import { useState, useEffect } from "react";
import { ref, onValue } from "firebase/database";
import { database } from "@/lib/firebase";
import { toast } from "@/hooks/use-toast";

const Dashboard = () => {
  const [status, setStatus] = useState("connected");
  const [alerts, setAlerts] = useState([
    {
      id: 1,
      type: "Fall Detected",
      location: "Platform 3",
      timestamp: new Date().toISOString(),
    },
  ]);

  useEffect(() => {
    const alertsRef = ref(database, 'alerts');
    const unsubscribe = onValue(alertsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const newAlert = {
          id: Date.now(),
          type: data.type || "Alert",
          location: data.location || "Unknown",
          timestamp: data.timestamp || new Date().toISOString(),
        };
        
        setAlerts(prev => [newAlert, ...prev]);
        
        // Show toast notification
        toast({
          title: "New Alert!",
          description: `${newAlert.type} detected at ${newAlert.location}`,
        });
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <section className="section-padding pt-32">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">System Dashboard</h2>
          <div
            className={`px-4 py-2 rounded-full text-sm ${
              status === "connected"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {status === "connected" ? "System Online" : "System Offline"}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Status Cards */}
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="p-6 rounded-2xl card-gradient">
                <h3 className="text-sm font-medium text-black/60 mb-4">
                  Active Sensors
                </h3>
                <p className="text-3xl font-semibold">12/12</p>
              </div>
              <div className="p-6 rounded-2xl card-gradient">
                <h3 className="text-sm font-medium text-black/60 mb-4">
                  Response Time
                </h3>
                <p className="text-3xl font-semibold">124ms</p>
              </div>
            </div>

            {/* Hardware Status */}
            <div className="p-6 rounded-2xl card-gradient">
              <h3 className="text-sm font-medium text-black/60 mb-4">
                Hardware Status
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>ESP32</span>
                  <span className="px-2 py-1 rounded-full bg-green-100 text-green-800 text-xs">
                    Connected
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Ultrasonic Sensor</span>
                  <span className="px-2 py-1 rounded-full bg-green-100 text-green-800 text-xs">
                    Active
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Emergency Button</span>
                  <span className="px-2 py-1 rounded-full bg-green-100 text-green-800 text-xs">
                    Ready
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Alert Feed */}
          <div className="rounded-2xl card-gradient p-6">
            <h3 className="text-sm font-medium text-black/60 mb-4">
              Recent Alerts
            </h3>
            <div className="space-y-4">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className="p-4 rounded-lg bg-black/5 space-y-2 animate-fade-in"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{alert.type}</span>
                    <span className="text-sm text-black/40">
                      {new Date(alert.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-sm text-black/60">{alert.location}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;