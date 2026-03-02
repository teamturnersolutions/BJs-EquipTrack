export type TeamMember = {
  id: number;
  name: string;
};

export type InventoryItem = {
  id: number;
  name: string;
  status: 'Available' | 'Checked Out';
  checkedOutBy?: string; // TeamMember name
  checkedOutById?: number; // TeamMember ID
  checkedOutDate?: string; // ISO string
  checkedInDate?: string; // ISO string
};
