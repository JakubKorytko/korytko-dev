'use client';

import React, { useState, useEffect, useMemo } from 'react';

function Clock() {
  const [time, setTime] = useState<Date>(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formattedDate = useMemo<string>(
    () => time.toLocaleString('en-US', { month: 'numeric', year: 'numeric', day: 'numeric' }),
    [time],
  );

  const formattedTime = useMemo<string>(
    () => time.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }),
    [time],
  );

  return (
    <div className="w-full h-full flex items-end md:items-center flex-col md:flex-row justify-around md:justify-end">
      <div className="mr-1 md:mr-0">
        {formattedTime}
      </div>
      <div className="md:mx-2 mr-1 md:mr-1.5">
        {formattedDate}
      </div>
    </div>
  );
}

export default Clock;
