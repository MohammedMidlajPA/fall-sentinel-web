import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import VideoUpload from "./VideoUpload";
import { toast } from "@/hooks/use-toast";
import { ref, set } from 'firebase/database';
import { database } from '@/lib/firebase';

const PassengerDashboard = () => {
  const [formData, setFormData] = useState({
    trainNumber: "",
    cabin: "",
    problem: "",
    location: "",
    description: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const reportRef = ref(database, `reports/${Date.now()}`);
      await set(reportRef, {
        ...formData,
        timestamp: new Date().toISOString(),
        status: "pending"
      });
      
      toast({
        title: "Report Submitted",
        description: "Your report has been successfully submitted.",
      });
      
      setFormData({
        trainNumber: "",
        cabin: "",
        problem: "",
        location: "",
        description: ""
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit report. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="container mx-auto px-4 py-24">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-6">
          <div className="p-6 rounded-2xl card-gradient">
            <h3 className="text-xl font-semibold mb-4">Report an Issue</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Train Number</label>
                <Input
                  name="trainNumber"
                  value={formData.trainNumber}
                  onChange={handleChange}
                  placeholder="Enter train number"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Cabin Number</label>
                <Input
                  name="cabin"
                  value={formData.cabin}
                  onChange={handleChange}
                  placeholder="Enter cabin number"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Type of Problem</label>
                <Input
                  name="problem"
                  value={formData.problem}
                  onChange={handleChange}
                  placeholder="e.g., Security, Maintenance, Emergency"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Location</label>
                <Input
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Specific location in train"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <Textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Provide detailed description of the issue"
                  required
                  className="min-h-[100px]"
                />
              </div>
              <Button type="submit" className="w-full">
                Submit Report
              </Button>
            </form>
          </div>
        </div>

        <div className="space-y-6">
          <VideoUpload />
          <div className="p-6 rounded-2xl card-gradient">
            <h3 className="text-xl font-semibold mb-4">Recent Reports</h3>
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Your recent reports will appear here. You can track their status and updates.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PassengerDashboard;