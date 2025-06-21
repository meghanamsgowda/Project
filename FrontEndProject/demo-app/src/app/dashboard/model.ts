export class Label {
    id!:number;
  name!: string;
  color!: string;
  description!: string;
 
  
}
export interface Item {
  id: number;
  name: string; // Used for Subject
  description: string; // Used for Sender (mock)
  date: string; // Added for Date column (you might use Date type depending on API)
  labels: Label[]; // Array of assigned labels
}