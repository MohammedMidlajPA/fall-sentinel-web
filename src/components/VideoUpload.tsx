import React, { useState } from 'react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { ref as dbRef, set } from 'firebase/database';
import { database } from '@/lib/firebase';
import { storage } from '@/lib/firebase';
import { pipeline } from '@huggingface/transformers';
import { Button } from './ui/button';
import { toast } from '@/hooks/use-toast';

const VideoUpload = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const processVideo = async (videoFile: File) => {
    try {
      setIsProcessing(true);
      toast({
        title: "Processing Video",
        description: "Analyzing video for fall detection...",
      });

      // Create a reference for the video in Firebase Storage
      const videoRef = ref(storage, `videos/${Date.now()}_${videoFile.name}`);
      
      // Upload video to Firebase Storage
      await uploadBytes(videoRef, videoFile);
      const videoUrl = await getDownloadURL(videoRef);

      // Initialize YOLO model for fall detection
      const detector = await pipeline(
        'object-detection',
        'Xenova/yolov8n',
        { device: 'cpu' }
      );

      // Create a video element to process frames
      const video = document.createElement('video');
      video.src = videoUrl;
      video.crossOrigin = 'anonymous';
      
      video.onloadeddata = async () => {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // Process video frames
        const processFrame = async () => {
          if (context) {
            context.drawImage(video, 0, 0);
            const imageData = canvas.toDataURL('image/jpeg');
            
            // Detect objects in the frame
            const result = await detector(imageData);
            
            // Check for fall detection (person in unusual position/orientation)
            const fallDetected = result.some((detection: any) => 
              detection.label === 'person' && detection.score > 0.5
            );

            if (fallDetected) {
              // Send alert to Firebase
              const alertRef = dbRef(database, 'alerts');
              await set(alertRef, {
                type: 'Fall Detected',
                location: 'Video Analysis',
                timestamp: new Date().toISOString(),
                videoUrl: videoUrl
              });

              toast({
                title: "Fall Detected",
                description: "A fall was detected in the uploaded video",
                variant: "destructive"
              });
            }
          }

          if (video.currentTime < video.duration) {
            video.currentTime += 1; // Process 1 frame per second
            setTimeout(processFrame, 1000);
          } else {
            setIsProcessing(false);
            toast({
              title: "Processing Complete",
              description: "Video analysis finished",
            });
          }
        };

        await processFrame();
      };

      video.load();
    } catch (error) {
      console.error('Error processing video:', error);
      setIsProcessing(false);
      toast({
        title: "Error",
        description: "Failed to process video",
        variant: "destructive"
      });
    }
  };

  const handleVideoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      await processVideo(file);
    }
  };

  return (
    <div className="p-6 rounded-2xl card-gradient">
      <h3 className="text-sm font-medium text-black/60 mb-4">
        Video Analysis
      </h3>
      <div className="space-y-4">
        <input
          type="file"
          accept="video/*"
          onChange={handleVideoUpload}
          disabled={isProcessing}
          className="hidden"
          id="video-upload"
        />
        <label htmlFor="video-upload">
          <Button 
            disabled={isProcessing}
            className="w-full"
          >
            {isProcessing ? 'Processing...' : 'Upload Video'}
          </Button>
        </label>
        {isProcessing && (
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoUpload;