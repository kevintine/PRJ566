import React, { useState, useEffect } from 'react';

function MaintenanceScheduler() {
  const [maintenanceTasks, setMaintenanceTasks] = useState([]);
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    const calculateNextTaskIndex = () => {
      const now = new Date();
      const currentHour = now.getHours();

      // Define the start times for each task in local region time
      const taskStartTimes = [12, 15, 18, 20];
      
      // Find the index of the next task based on the current hour
      for (let i = 0; i < taskStartTimes.length; i++) {
        if (currentHour < taskStartTimes[i]) {
          return i;
        }
      }

      // If the current hour is after the last task, return the index of the first task
      return 0;
    };

    const updateCountdown = () => {
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();
      const currentSecond = now.getSeconds();

      // Define the start times for each task in local region time
      const taskStartTimes = [12, 15, 18, 20];

      // Find the index of the next task based on the current hour
      const nextTaskIndex = calculateNextTaskIndex();
      setCurrentTaskIndex(nextTaskIndex);

      // Calculate the time until the next task in seconds
      const nextTaskStartTime = taskStartTimes[nextTaskIndex];
      const timeUntilNextTask = ((nextTaskStartTime - currentHour) * 3600) + ((60 - currentMinute) * 60) - currentSecond;

      setCountdown(timeUntilNextTask);
    };

    // Update the countdown every second
    const interval = setInterval(updateCountdown, 1000);

    // Initial update
    updateCountdown();

    // Cleanup
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setMaintenanceTasks([
      { name: 'Lane Cleaning', details: 'Clean the lanes thoroughly.' },
      { name: 'Pinsetter Adjustment', details: 'Adjust the pinsetter mechanism.' },
      { name: 'Oil Application', details: 'Apply lane oil for better ball movement.' },
      { name: 'Ball Polishing', details: 'Polish all bowling balls.' },
      { name: 'Lane Inspection', details: 'Inspect the lanes for any damages.' }
    ]);
  }, []);

  const currentTask = maintenanceTasks[currentTaskIndex];

  // Function to format seconds into "00:00" format
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes < 10 ? '0' : ''}${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Scheduled Maintenance Task</h2>
      {currentTask && (
        <div style={styles.taskContainer}>
          <p style={styles.taskName}>{currentTask.name}</p>
          <p style={styles.taskDetails}>Description: {currentTask.details}</p>
          <p style={styles.countdown}>Next Maintenance in: <span style={{fontSize: '20px', marginRight: '10px'}}>{formatTime(countdown)} minutes</span></p>
        </div>
      )}
    </div>
  );
}
const styles = {
  title: {
    color: '#333',
    textAlign: 'center',
    marginBottom: '20px',
    fontSize: '28px',
    textTransform: 'uppercase',
  },
  taskContainer: {
    borderTop: '2px solid #ccc',
    paddingTop: '20px',
    marginTop: '20px', // Add some top margin for separation
  },
  taskName: {
    fontSize: '20px',
    fontWeight: 'bold',
    marginBottom: '20px', // Increased margin
    color: '#333',
  },
  taskDetails: {
    fontSize: '16px',
    color: '#666',
    marginBottom: '20px', // Increased margin
  },
  countdown: {
    fontSize: '16px',
    color: '#888',
    textAlign: 'right',
  },
};


export default MaintenanceScheduler;
