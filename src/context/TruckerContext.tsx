import React, { createContext, useContext, useState, useEffect } from 'react';

export type TripStatus = 'en_curso' | 'completado';
export type ActivityType = 'conduccion' | 'descanso' | 'carga' | 'descarga' | 'paseo';

export interface LocationInfo {
  country: string;
  town: string;
}

export interface Activity {
  id: string;
  type: ActivityType;
  startTime: string;
  endTime?: string;
  location: LocationInfo;
  notes?: string;
}

export interface Trip {
  id: string;
  startDate: string;
  endDate?: string;
  startLocation: LocationInfo;
  endLocation?: LocationInfo;
  status: TripStatus;
  startKm: number;
  endKm?: number;
  activities: Activity[];
}

export interface FuelLog {
  id: string;
  date: string;
  liters: number;
  cost: number;
  km: number;
  location: LocationInfo;
}

interface TruckerData {
  trips: Trip[];
  fuelLogs: FuelLog[];
  currentTripId: string | null;
}

interface TruckerContextType {
  data: TruckerData;
  startTrip: (location: LocationInfo, startKm: number) => void;
  endTrip: (location: LocationInfo, endKm: number) => void;
  addActivity: (activity: Omit<Activity, 'id'>) => void;
  endCurrentActivity: (endTime: string) => void;
  addFuelLog: (log: Omit<FuelLog, 'id'>) => void;
  deleteFuelLog: (id: string) => void;
  deleteTrip: (id: string) => void;
}

const defaultData: TruckerData = {
  trips: [],
  fuelLogs: [],
  currentTripId: null,
};

const TruckerContext = createContext<TruckerContextType | undefined>(undefined);

export const TruckerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<TruckerData>(() => {
    const saved = localStorage.getItem('trucker_data');
    return saved ? JSON.parse(saved) : defaultData;
  });

  useEffect(() => {
    localStorage.setItem('trucker_data', JSON.stringify(data));
  }, [data]);

  const generateId = () => crypto.randomUUID();

  const startTrip = (location: LocationInfo, startKm: number) => {
    const newTrip: Trip = {
      id: generateId(),
      startDate: new Date().toISOString(),
      startLocation: location,
      status: 'en_curso',
      startKm,
      activities: []
    };
    setData(prev => ({
      ...prev,
      trips: [...prev.trips, newTrip],
      currentTripId: newTrip.id
    }));
  };

  const endTrip = (location: LocationInfo, endKm: number) => {
    setData(prev => {
      const updatedTrips = prev.trips.map(trip =>
        trip.id === prev.currentTripId
          ? { ...trip, status: 'completado' as TripStatus, endDate: new Date().toISOString(), endLocation: location, endKm }
          : trip
      );
      return { ...prev, trips: updatedTrips, currentTripId: null };
    });
  };

  const addActivity = (activity: Omit<Activity, 'id'>) => {
    setData(prev => {
      if (!prev.currentTripId) return prev;

      const newActivity = { ...activity, id: generateId() };
      const updatedTrips = prev.trips.map(trip => {
        if (trip.id === prev.currentTripId) {
          return { ...trip, activities: [...trip.activities, newActivity] };
        }
        return trip;
      });
      return { ...prev, trips: updatedTrips };
    });
  };

  const endCurrentActivity = (endTime: string) => {
    setData(prev => {
      if (!prev.currentTripId) return prev;

      const updatedTrips = prev.trips.map(trip => {
        if (trip.id === prev.currentTripId && trip.activities.length > 0) {
          const acts = [...trip.activities];
          const lastAct = acts[acts.length - 1];
          if (!lastAct.endTime) {
            acts[acts.length - 1] = { ...lastAct, endTime };
          }
          return { ...trip, activities: acts };
        }
        return trip;
      });
      return { ...prev, trips: updatedTrips };
    });
  };

  const addFuelLog = (log: Omit<FuelLog, 'id'>) => {
    setData(prev => ({
      ...prev,
      fuelLogs: [{ ...log, id: generateId() }, ...prev.fuelLogs].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    }));
  };

  const deleteFuelLog = (id: string) => {
    setData(prev => ({
      ...prev,
      fuelLogs: prev.fuelLogs.filter(log => log.id !== id)
    }));
  };

  const deleteTrip = (id: string) => {
    setData(prev => ({
      ...prev,
      trips: prev.trips.filter(t => t.id !== id),
      currentTripId: prev.currentTripId === id ? null : prev.currentTripId
    }));
  };

  return (
    <TruckerContext.Provider value={{
      data,
      startTrip,
      endTrip,
      addActivity,
      endCurrentActivity,
      addFuelLog,
      deleteFuelLog,
      deleteTrip
    }}>
      {children}
    </TruckerContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useTruckerContext = () => {
  const context = useContext(TruckerContext);
  if (context === undefined) {
    throw new Error('useTruckerContext must be used within a TruckerProvider');
  }
  return context;
};
