import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';  // Import FormsModule
import { Item, Label } from './model';
import { LabelService } from '../label.service';
 
@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, FormsModule],  // Add FormsModule
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class Dashboard {
  popup: boolean = false;
  label: Label = new Label('','', '#007bff', ''); 
  editmood : boolean = false;
 
  showLabelManagementDropdownFor: number | null = null;
 

  showManageLabelsModal: boolean = false; // Controls visibility of the inline modal
  newLabelName: string = '';
  newLabelDescription: string = '';
  newLabelColor: string = '#007bff'; // Default color for new labels
  editingLabel: Label | null = null; // Tracks which label is being edited in the modal

  private dummyLabelsSource: Label[] = [
    { id: 1, name: 'Important', description: 'High priority items', color: '#dc3545' }, // Red
    { id: 2, name: 'Work', description: 'Work-related items', color: '#28a745' },      // Green
    { id: 3, name: 'Personal', description: 'Personal items', color: '#007bff' },      // Blue
    { id: 4, name: 'To-Do', description: 'Items requiring action', color: '#ffc107' },   // Yellow/Orange
    { id: 5, name: 'Archived', description: 'Archived items', color: '#6c757d' },     // Gray
    { id: 6, name: 'New Label', description: 'Newly created label', color: '#17a2b8' }, // Teal
    { id: 7, name: 'Test', description: 'For testing purposes', color: '#6610f2' }     // Purple
  ];
 
  // Dummy items, will be initialized with references to labels from dummyLabelsSource
  private dummyItemsSource: Item[] = [
    { id: 1, name: 'Project Update', description: 'alice@example.com', date: '2025-04-20', labels: [] },
    { id: 2, name: 'Weekly Meeting', description: 'bob@example.com', date: '2025-04-21', labels: [] },
    { id: 3, name: 'Birthday Party', description: 'charlie@example.com', date: '2025-04-19', labels: [] },
    { id: 4, name: 'Reminder: Dentist Appointment', description: 'calendar@example.com', date: '2025-04-18', labels: [] },
    { id: 5, name: 'Invoice #12345', description: 'billing@example.com', date: '2025-04-17', labels: [] },
    { id: 6, name: 'Vacation Plans', description: 'david@example.com', date: '2025-04-16', labels: [] },
    { id: 7, name: 'Old Project Files', description: 'storage@example.com', date: '2025-04-01', labels: [] },
    { id: 8, name: 'Project Proposal', description: 'manager@example.com', date: '2025-04-15', labels: [] }
  ];
 
 labels = [
    { name: 'Important', description: 'High priority items', color: 'red' },
    { name: 'Work', description: 'Work-related items', color: 'green' },
    { name: 'Personal', description: 'Personal items', color: 'blue' },
    { name: 'To-Do2', description: 'Items requiring action', color: 'brown' },
    { name: 'Archived', description: 'Archived items', color: 'lightgray' },
    { name: 'test', description: '', color: 'darkgoldenrod' } // Example with no description
  ];
  constructor(private cdr: ChangeDetectorRef,private labelService: LabelService) {}
 
  // ngOnInit() {
  //   console.log("Component initialized.");
  // }
 
  ManageLabels() {
    this.popup = true;
    this.cdr.detectChanges();
    console.log("Popup opened:", this.popup);
  }
 
  ClosePopup() {
    this.popup = false;
  }
 
submitLabel() {
  if (this.editmood) {
    // Find the index of the label being edited
    const index = this.labels.findIndex(l => l.name === this.label.name);
 
    if (index !== -1) {
      this.labels[index] = {
        ...this.label,
        description: this.label.description || ''  
      };
    }
  } else {
    // Add a new label
    this.labels.push({
      name: this.label.name,
      color: this.label.color,
      description: this.label.description || ''  
    });
  }
 
  this.editmood = false;  // Reset edit mode
  this.label = new Label('','', '#007bff', '');  // Clear form fields
  this.ClosePopup();
}
 
 
editLabel1(label: any) {
  this.editmood = true;  // Switch to edit mode
  this.label = {
    ...label,
    description: label.description || ''  // Ensures description is always a string
  };
}
 
 
 
deleteLabel1(label: any) {
  const index = this.labels.indexOf(label);
 
  if (index > -1) {
    this.labels.splice(index, 1);
    console.log(`Label deleted: ${JSON.stringify(label)}`);
  }
}
 
 
items: Item[] = [];
allLabels: Label[] = [];
selectedLabelIdForAssignment: number | null = null;
selectedFilterLabelIds: number[] = []; // Changed to array for multiple filter buttons
selectedItemIds: number[] = []; // For batch operations
 
newItemName: string = '';
newItemDescription: string = '';
newItemDate: string = ''; // Assuming a date for new items
 
private dummyLabels: Label[] = [
  { id: 1, name: 'Important' ,  color: ''},
  {
    id: 2, name: 'Work',
    color: ''
  },
  { id: 3, name: 'Personal',  color: '' },
  { id: 4, name: 'To-Do' ,  color: ''},
  { id: 5, name: 'Archived' ,  color: ''},
  { id: 6, name: 'New Label' ,  color: ''},
  { id: 7, name: 'Test' ,  color: ''}
];
 
private dummyItems: Item[] = [
  {
    id: 1,
    name: 'Project Update',
    description: 'alice@example.com',
    date: '2025-04-20',
    labels: [this.dummyLabels[0], this.dummyLabels[1]] // Important, Work
  },
  {
    id: 2,
    name: 'Weekly Meeting',
    description: 'bob@example.com',
    date: '2025-04-21',
    labels: [this.dummyLabels[1]] // Work
  },
  {
    id: 3,
    name: 'Birthday Party',
    description: 'charlie@example.com',
    date: '2025-04-19',
    labels: [this.dummyLabels[2]] // Personal
  },
  {
    id: 4,
    name: 'Reminder: Dentist Appointment',
    description: 'calendar@example.com',
    date: '2025-04-18',
    labels: [this.dummyLabels[0], this.dummyLabels[2], this.dummyLabels[3]] // Important, Personal, To-Do
  },
  {
    id: 5,
    name: 'Invoice #12345',
    description: 'billing@example.com',
    date: '2025-04-17',
    labels: [this.dummyLabels[1], this.dummyLabels[3]] // Work, To-Do
  },
  {
    id: 6,
    name: 'Vacation Plans',
    description: 'david@example.com',
    date: '2025-04-16',
    labels: [this.dummyLabels[0], this.dummyLabels[2]] // Important, Personal
  },
  {
    id: 7,
    name: 'Old Project Files',
    description: 'storage@example.com',
    date: '2025-04-01',
    labels: [this.dummyLabels[1], this.dummyLabels[4]] // Work, Archived
  },
  {
    id: 8,
    name: 'Project Proposal',
    description: 'manager@example.com',
    date: '2025-04-15',
    labels: [this.dummyLabels[0]] // Important
  }
];
 
 
// constructor(
//   private itemService: ItemService,
//   private labelService: LabelService,
//   private cdr: ChangeDetectorRef
// ) { }
 
ngOnInit(): void {
  this.loadItems();
  this.loadLabels();
  this.getAllLabels();
}
 
loadItems(): void {
  let filteredItems = [...this.dummyItems]; // Start with a copy of all items
  this.items = filteredItems;
  if (this.selectedFilterLabelIds.length > 0) {
    // Filter items that have AT LEAST ONE of the selected labels
    filteredItems = filteredItems.filter(item =>
      item.labels.some(label => this.selectedFilterLabelIds.includes(label.id))
    );
  }
 
  this.items = filteredItems;
  this.selectedItemIds = [];
  this.showLabelManagementDropdownFor = null;
  console.log('Dummy items loaded:', this.items);
}
 
loadLabels(): void {
  this.allLabels = [...this.dummyLabels]; // Create a copy of dummy labels
  console.log('Dummy labels loaded:', this.allLabels);
}
 
// Add New Item (modified to include a date)
createNewItem(): void {
  if (this.newItemName.trim() && this.newItemDate.trim()) {
    const newId = Math.max(...this.dummyItems.map(i => i.id)) + 1;
    const newItem: Item = {
      id: newId,
      name: this.newItemName.trim(),
      description: this.newItemDescription.trim(),
      date: this.newItemDate,
      labels: [] // New items start with no labels
    };
    this.dummyItems.push(newItem); // Add to dummy source
    this.newItemName = '';
    this.newItemDescription = '';
    this.newItemDate = '';
    this.loadItems(); // Reload to show new item
    console.log('Dummy item created:', newItem);
  } else {
    alert('Please provide Subject and Date for the new item.');
  }
}
 
// Individual Item Label Management
isLabelAssigned1(item: Item, labelId: number): boolean {
  return item.labels.some(l => l.id === labelId);
}
 
toggleLabelAssignment(item: Item, labelId: number): void {
  const itemIndex = this.dummyItems.findIndex(i => i.id === item.id);
  if (itemIndex === -1) return;
 
  const dummyItem = this.dummyItems[itemIndex];
  const label = this.allLabels.find(l => l.id === labelId);
 
  if (!label) {
    console.error('Label not found:', labelId);
    return;
  }
 
  if (this.isLabelAssigned(dummyItem, labelId)) {
    dummyItem.labels = dummyItem.labels.filter(l => l.id !== labelId);
    console.log(`Dummy Label ${labelId} removed from item ${dummyItem.id}`);
  } else {
    dummyItem.labels.push(label);
    console.log(`Dummy Label ${labelId} assigned to item ${dummyItem.id}`);
  }
  // Update the displayed item's labels
  item.labels = [...dummyItem.labels]; // Ensure UI updates
}
 
// Toggle the per-item label management dropdown
toggleLabelManagementDropdown(item: Item, event: MouseEvent): void {
  event.stopPropagation();
  this.showLabelManagementDropdownFor = this.showLabelManagementDropdownFor === item.id ? null : item.id;
}
 
closeLabelDropdown(): void {
  this.showLabelManagementDropdownFor = null;
}
 
 
// Batch Operations
toggleItemSelection(itemId: number): void {
  const index = this.selectedItemIds.indexOf(itemId);
  if (index > -1) {
    this.selectedItemIds.splice(index, 1);
  } else {
    this.selectedItemIds.push(itemId);
  }
  console.log('Selected item IDs:', this.selectedItemIds);
}
 
performBatchAssignment(): void {
  if (this.selectedItemIds.length > 0 && this.selectedLabelIdForAssignment) {
    const labelToAssign = this.allLabels.find(l => l.id === this.selectedLabelIdForAssignment);
    if (!labelToAssign) {
      alert('Selected label for assignment not found.');
      return;
    }
 
    this.dummyItems.forEach(item => {
      if (this.selectedItemIds.includes(item.id) && !this.isLabelAssigned(item, labelToAssign.id)) {
        item.labels.push(labelToAssign);
      }
    });
    console.log('Dummy batch assignment complete.');
    this.loadItems(); // Reload items to reflect changes
    this.selectedLabelIdForAssignment = null;
  } else {
    alert('Please select items and a label to assign.');
  }
}
 
performBatchRemoval(): void {
  if (this.selectedItemIds.length > 0 && this.selectedLabelIdForAssignment) {
    const labelToRemoveId = this.selectedLabelIdForAssignment;
 
    this.dummyItems.forEach(item => {
      if (this.selectedItemIds.includes(item.id) && this.isLabelAssigned(item, labelToRemoveId)) {
        item.labels = item.labels.filter(l => l.id !== labelToRemoveId);
      }
    });
    console.log('Dummy batch removal complete.');
    this.loadItems(); // Reload items to reflect changes
    this.selectedLabelIdForAssignment = null;
  } else {
    alert('Please select items and a label to remove.');
  }
}
 
// Filtering
toggleFilterLabel(labelId: number): void {
  const index = this.selectedFilterLabelIds.indexOf(labelId);
  if (index > -1) {
    this.selectedFilterLabelIds.splice(index, 1);
  } else {
    this.selectedFilterLabelIds.push(labelId);
  }
  this.loadItems(); // Reload items with new filter
  console.log('Filter labels:', this.selectedFilterLabelIds);
}
 
clearFilter(): void {
  this.selectedFilterLabelIds = [];
  this.loadItems();
  console.log('Filter cleared.');
}
 
openManageLabels1(): void {
  alert('This would navigate to/open the Label Management component/modal. (Dummy action)');
}
 
 
 
 
assignLabelToSelectedItems1(labelId: number): void {
  if (this.selectedItemIds.length === 0) {
    alert('Please select items to assign a label.');
    return;
  }
 
  const labelToAssign = this.allLabels.find(l => l.id === labelId);
  if (!labelToAssign) {
    console.error('Label not found:', labelId);
    alert('Selected label not found.');
    return;
  }
 
  // --- This is the critical part ---
  this.dummyItemsSource.forEach(item => {
    if (this.selectedItemIds.includes(item.id) && !this.isLabelAssigned(item, labelToAssign.id)) {
      item.labels.push(labelToAssign);
    }
  });
 
  this.selectedItemIds = []; // Clear selection after assignment
  this.loadItems(); // <--- This call should refresh the 'items' array
  console.log(`Label '${labelToAssign.name}' assigned to selected items.`);
}
 
// ... (other methods) ...
 
 openManageLabels(): void {
  this.showManageLabelsModal = true;
  // Reset form when opening modal
  this.resetLabelManagementForm();
  console.log('Manage Labels modal opened.');
}
 
closeManageLabelsModal(): void {
  this.showManageLabelsModal = false;
  this.resetLabelManagementForm(); // Reset form on close
  this.loadItems(); // Reload items to reflect any label changes
  console.log('Manage Labels modal closed.');
}
removeLabelFromSelectedItems(labelId: number): void {
  if (this.selectedItemIds.length === 0) {
    alert('Please select items to remove a label from.');
    return;
  }
 
  const labelToRemove = this.allLabels.find(l => l.id === labelId);
  if (!labelToRemove) {
    console.error('Label not found:', labelId);
    alert('Selected label not found.');
    return;
  }
 
  this.dummyItemsSource.forEach(item => {
    if (this.selectedItemIds.includes(item.id)) {
      item.labels = item.labels.filter(l => l.id !== labelId);
    }
  });
 
  this.selectedItemIds = []; // Clear selection after removal
  this.loadItems(); // Reload items to reflect changes
  console.log(`Label '${labelToRemove.name}' removed from selected items.`);
}
 
assignLabelToSelectedItems(labelId: number): void {
  console.log('assignLabelToSelectedItems called with labelId:', labelId);
  console.log('Currently selected item IDs:', this.selectedItemIds);
 
  if (this.selectedItemIds.length === 0) {
    alert('Please select items to assign a label.');
    return;
  }
 
  const labelToAssign = this.allLabels.find(l => l.id === labelId);
  if (!labelToAssign) {
    console.error('Label not found:', labelId);
    alert('Selected label not found.');
    return;
  }
 
  // Iterate over dummyItemsSource and update the labels
  let changesMade = false;
  this.dummyItemsSource.forEach(item => {
    if (this.selectedItemIds.includes(item.id)) {
      if (!this.isLabelAssigned(item, labelToAssign.id)) {
        item.labels.push(labelToAssign);
        console.log(`Assigned label '${labelToAssign.name}' to item ID: ${item.id}`);
        changesMade = true;
      } else {
        console.log(`Label '${labelToAssign.name}' already assigned to item ID: ${item.id}`);
      }
    }
  });
 
  if (changesMade) {
    console.log("Changes made to dummyItemsSource. Calling loadItems().");
    this.selectedItemIds = []; // Clear selection after assignment
    this.loadItems(); // Refresh the grid
  } else {
    console.log("No new labels assigned. Grid not refreshed.");
  }
}
 
// Ensure updateItemLabelsAfterChange is correct, as it's called after label management actions
private updateItemLabelsAfterChange(): void {
  console.log('updateItemLabelsAfterChange called.');
  this.dummyItemsSource.forEach(item => {
      // Re-map labels to ensure they are references to the current allLabels objects
      // and remove any labels that might have been deleted from allLabels
      item.labels = item.labels
          .map(assignedLabel => this.allLabels.find(ul => ul.id === assignedLabel.id))
          .filter((label): label is Label => label !== undefined); // Remove deleted labels and update properties
  });
  this.loadItems(); // Reload main item list to reflect label changes
  console.log('Dummy items source after label changes:', this.dummyItemsSource);
}
 
// Double check the isLabelAssigned method
isLabelAssigned(item: Item, labelId: number): boolean {
  // Ensure item.labels is not undefined or null before using .some()
  return item.labels && item.labels.some(l => l.id === labelId);
}
 
 
addLabel(): void {
  if (this.newLabelName.trim()) {
    const newId = this.allLabels.length > 0 ? Math.max(...this.allLabels.map(l => l.id)) + 1 : 1;
    const newLabel: Label = {
      id: newId,
      name: this.newLabelName.trim(),
      description: this.newLabelDescription.trim() || undefined,
      color: this.newLabelColor
    };
    this.allLabels.push(newLabel);
    this.dummyLabelsSource.push(newLabel); // Also add to the source dummy data
    this.resetLabelManagementForm();
    console.log('Dummy label added:', newLabel);
    this.updateItemLabelsAfterChange(); // Update items after label change
  } else {
    alert('Label Name is required.');
  }
}
 
editLabel(label: Label): void {
  this.editingLabel = { ...label }; // Create a copy to edit
  this.newLabelName = this.editingLabel.name;
  this.newLabelDescription = this.editingLabel.description || '';
  this.newLabelColor = this.editingLabel.color || '#007bff';
}
 
saveEditedLabel(): void {
  if (this.editingLabel && this.newLabelName.trim()) {
    const indexInAllLabels = this.allLabels.findIndex(l => l.id === this.editingLabel!.id);
    const indexInDummySource = this.dummyLabelsSource.findIndex(l => l.id === this.editingLabel!.id);
 
    if (indexInAllLabels > -1 && indexInDummySource > -1) {
      const updatedLabel: Label = {
        ...this.editingLabel,
        name: this.newLabelName.trim(),
        description: this.newLabelDescription.trim() || undefined,
        color: this.newLabelColor
      };
      this.allLabels[indexInAllLabels] = updatedLabel;
      this.dummyLabelsSource[indexInDummySource] = updatedLabel; // Update source too
      this.resetLabelManagementForm();
      this.editingLabel = null; // Exit edit mode
      console.log('Dummy label updated:', updatedLabel);
      this.updateItemLabelsAfterChange(); // Update items after label change
    }
  } else {
    alert('Label Name is required for editing.');
  }
}
 
cancelEdit(): void {
  this.editingLabel = null;
  this.resetLabelManagementForm();
}
 
deleteLabel(labelId: number): void {
  if (confirm('Are you sure you want to delete this label?')) {
    this.allLabels = this.allLabels.filter(l => l.id !== labelId);
    this.dummyLabelsSource = this.dummyLabelsSource.filter(l => l.id !== labelId); // Update source
 
    this.updateItemLabelsAfterChange(); // Remove deleted label from items
    console.log('Dummy label deleted:', labelId);
  }
}
 
private resetLabelManagementForm(): void {
  this.newLabelName = '';
  this.newLabelDescription = '';
  this.newLabelColor = '#007bff';
  this.editingLabel = null;
}
 
// Helper to ensure item labels are updated after any label creation/edit/deletion
private updateItemLabelsAfterChangea(): void {
  this.dummyItemsSource.forEach(item => {
      item.labels = item.labels
          .map(assignedLabel => this.allLabels.find(ul => ul.id === assignedLabel.id))
          .filter((label): label is Label => label !== undefined); // Remove deleted labels and update properties
  });
  this.loadItems(); // Reload main item list to reflect label changes
}
 
// Helper to determine contrast color (black or white) for a given background color
getContrastColor(hexColor: string | undefined): string {
  if (!hexColor) return '#333'; // Default to dark grey if no color
 
  const cleanHex = hexColor.startsWith('#') ? hexColor.slice(1) : hexColor;
 
  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);
 
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
 
  return luminance > 0.5 ? '#333' : '#FFFFFF';
}
 

//  createNewLabel(): void {
//     let newLabel: Label = {
//       id:10,
//       name: 'New Task',
//       color: 'Blue',
//       description: 'A newly created label from Angular.'
//     };

//     this.labelService.createLabel(newLabel).subscribe({
//       next: (responseLabel) => {
//         console.log('Label created successfully:', responseLabel);
//         this.getAllLabels(); // Refresh list after creating
//       },
//       error: (error) => {
//         console.error('Error creating label:', error);
//       }
//     });
//   }

  getAllLabels(): void {
    debugger
    this.labelService.getLabels().subscribe({
      next: (data) => {
        this.labels = data; 
        
        console.log('Fetched labels:', data);
      },
      error: (error) => {
        console.error('Error fetching labels:', error);
      }
    });
  }











}
 