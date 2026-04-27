export interface User {
  id: number;
  username: string;
  role: 'admin' | 'user';
}

export interface Event {
  id: number;
  name: string;
  date: string;
  location: string;
  description: string;
}

export interface Car {
  id: number;
  eventId: number;
  makeModel: string;
  owner: string;
  participantNumber: string;
  category: string;
  photoUrl: string | null;
}
