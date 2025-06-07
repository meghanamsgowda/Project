export class Label {
    id!:any;
  name: string;
  color!: string;
  description?: string;
 
  constructor(id:any,name: string, color: string, description?: string) {
     this.id = id ;
    this.name = name;
    this.color = color;
    this.description = description || '';
  }
}
export interface Item {
  id: number;
  name: string; // Used for Subject
  description: string; // Used for Sender (mock)
  date: string; // Added for Date column (you might use Date type depending on API)
  labels: Label[]; // Array of assigned labels
}