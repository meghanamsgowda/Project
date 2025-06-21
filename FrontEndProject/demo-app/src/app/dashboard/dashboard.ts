// src/app/dashboard/dashboard.component.ts
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Item, Label } from './model';
import { LabelService } from '../label.service';

@Component({
  selector: 'app-dashboard',
    imports: [CommonModule, FormsModule],
    templateUrl: './dashboard.html',
    styleUrls: ['./dashboard.css']
})
export class Dashboard implements OnInit {

  // --- Properties for label management modal ---
  showManageLabelsModal: boolean = false;
  newLabelName: string = '';
  newLabelDescription: string = '';
  newLabelColor: string = '#007bff';
  editingLabel: Label | null = null;

  // --- New properties for label creation success message ---
  showLabelCreatedSuccess: boolean = false;
  labelCreatedMessage: string = '';

  // --- Data for labels (source of truth from LabelService) ---
  allLabels: Label[] = [];
  latestdata: Label[] = []; // Used for filter pills for consistency

  // --- Data for items displayed in the grid ---
  items: Item[] = [];

  // --- Internal "database" for items using dummy data ---
  // This initial data is used ONLY if no items are found in local storage on startup.
  private initialDummyItemsSource: Item[] = [
    { id: 1, name: 'Project Update', description: 'alice@example.com', date: '2025-04-20', labels: [] },
    { id: 2, name: 'Weekly Meeting', description: 'bob@example.com', date: '2025-04-21', labels: [] },
    { id: 3, name: 'Birthday Party', description: 'charlie@example.com', date: '2025-04-19', labels: [] },
    { id: 4, name: 'Reminder: Dentist Appointment', description: 'calendar@example.com', date: '2025-04-18', labels: [] },
    { id: 5, name: 'Invoice #12345', description: 'billing@example.com', date: '2025-04-17', labels: [] },
    { id: 6, name: 'Vacation Plans', description: 'david@example.com', date: '2025-04-16', labels: [] },
    { id: 7, name: 'Old Project Files', description: 'storage@example.com', date: '2025-04-01', labels: [] },
    { id: 8, name: 'Project Proposal', description: 'manager@example.com', date: '2025-04-15', labels: [] }
  ];

  // This holds the actual item data, loaded from Local Storage or initialized from `initialDummyItemsSource`.
  internalDummyItemsSource: Item[] = [];

  // --- Properties for item actions and filtering ---
  showLabelManagementDropdownFor: number | null = null;
  selectedItemIds: number[] = [];
  selectedFilterLabelIds: number[] = [];

  // --- Property for "select all" checkbox ---
  isAllSelected: boolean = false;

  // --- Properties for adding new items ---
  newItemName: string = '';
  newItemDescription: string = '';
  newItemDate: string = '';

  constructor(private cdr: ChangeDetectorRef, private labelService: LabelService) {}

  ngOnInit(): void {
    console.log('ngOnInit: Starting data initialization...');
    this.loadItemsFromLocalStorage(); // 1. Attempt to load items (with their labels) from local storage first.
    this.getAllLabelsAndInitializeData(); // 2. Fetch labels from backend and reconcile with loaded items.
  }

  // --- Local Storage Persistence Methods ---

  /**
   * Loads items from browser's Local Storage. If no items are found, initializes with `initialDummyItemsSource`.
   */
  private loadItemsFromLocalStorage(): void {
    try {
      const storedItems = localStorage.getItem('dashboardItems');
      if (storedItems) {
        // Parse the stored JSON string back into an array of Item objects
        this.internalDummyItemsSource = JSON.parse(storedItems);
        console.log('loadItemsFromLocalStorage: Items loaded from localStorage:', this.internalDummyItemsSource.length, 'items.');
      } else {
        // If nothing in local storage, use the initial dummy data as a base
        this.internalDummyItemsSource = [...this.initialDummyItemsSource];
        console.log('loadItemsFromLocalStorage: No items found in localStorage, initializing with dummy data.');
      }
    } catch (e) {
      console.error('loadItemsFromLocalStorage: Error loading items from localStorage (corrupted data?):', e);
      // Fallback to initial dummy data on error parsing
      this.internalDummyItemsSource = [...this.initialDummyItemsSource];
    }
  }

  /**
   * Saves the current state of `internalDummyItemsSource` to browser's Local Storage.
   */
  private saveItemsToLocalStorage(): void {
    try {
      localStorage.setItem('dashboardItems', JSON.stringify(this.internalDummyItemsSource));
      console.log('saveItemsToLocalStorage: Items saved to localStorage.');
    } catch (e) {
      console.error('saveItemsToLocalStorage: Error saving items to localStorage:', e);
    }
  }

  // --- Label Management Modal Methods ---

  openManageLabels(): void {
    this.showManageLabelsModal = true;
    this.resetLabelManagementForm();
    // Hide any previous success message when opening the modal
    this.showLabelCreatedSuccess = false;
    this.labelCreatedMessage = '';
    console.log('openManageLabels: Manage Labels modal opened.');
  }

  closeManageLabelsModal(): void {
    this.showManageLabelsModal = false;
    this.resetLabelManagementForm();
    // Hide any success message when closing the modal
    this.showLabelCreatedSuccess = false;
    this.labelCreatedMessage = '';
    // Refresh all data after modal is closed to reflect any changes made to labels themselves
    this.getAllLabelsAndInitializeData();
    console.log('closeManageLabelsModal: Manage Labels modal closed.');
  }

  createNewLabel(): void {
    if (this.newLabelName.trim()) {
      const newLabel: Label = {
        id: 0, // ID will be assigned by the backend service
        name: this.newLabelName.trim(),
        description: this.newLabelDescription.trim(),
        color: this.newLabelColor
      };

      this.labelService.createLabel(newLabel).subscribe({
        next: (responseLabel) => {
          console.log('createNewLabel: Label created successfully:', responseLabel);
          this.getAllLabelsAndInitializeData();
          this.resetLabelManagementForm();

          // Show success message
          this.labelCreatedMessage = `Label "${responseLabel.name}" created successfully!`;
          this.showLabelCreatedSuccess = true;
          setTimeout(() => {
            this.showLabelCreatedSuccess = false;
            this.labelCreatedMessage = '';
          }, 3000); // Message disappears after 3 seconds
        },
        error: (error) => {
          console.error('createNewLabel: Error creating label:', error);
          alert(`Failed to create label: ${error.message || 'Unknown error'}`); // Simple alert for error
          this.showLabelCreatedSuccess = false; // Ensure message is not shown on error
        }
      });
    } else {
      alert('Label Name is required.');
    }
  }

  editLabel(label: Label): void {
    this.editingLabel = { ...label };
    this.newLabelName = this.editingLabel.name;
    this.newLabelDescription = this.editingLabel.description || '';
    this.newLabelColor = this.editingLabel.color || '#007bff';
    // Hide success message if user starts editing
    this.showLabelCreatedSuccess = false;
    this.labelCreatedMessage = '';
    console.log('editLabel: Setting form for editing label:', label.name);
  }

  saveEditedLabel(): void {
    if (this.editingLabel && this.newLabelName.trim()) {
      const updatedLabel: Label = {
        ...this.editingLabel,
        name: this.newLabelName.trim(),
        description: this.newLabelDescription.trim(),
        color: this.newLabelColor
      };

      this.labelService.putLabel(updatedLabel.id, updatedLabel).subscribe({
        next: () => {
          console.log('saveEditedLabel: Label updated successfully:', updatedLabel);
          this.getAllLabelsAndInitializeData();
          this.resetLabelManagementForm();
          // Show success message for update
          this.labelCreatedMessage = `Label "${updatedLabel.name}" updated successfully!`;
          this.showLabelCreatedSuccess = true;
          setTimeout(() => {
            this.showLabelCreatedSuccess = false;
            this.labelCreatedMessage = '';
          }, 3000);
        },
        error: (error) => {
          console.error('saveEditedLabel: Error updating label:', error);
          alert(`Failed to update label: ${error.message || 'Unknown error'}`);
          this.showLabelCreatedSuccess = false;
        }
      });
    } else {
      alert('Label Name is required for editing.');
    }
  }

  deleteLabel(id: number): void {
    console.log('deleteLabel: Attempting to delete label with ID:', id);
    this.labelService.deleteLabel(id).subscribe({
      next: () => {
        console.log(`deleteLabel: Label with ID ${id} deleted successfully!`);
        this.getAllLabelsAndInitializeData(); // Refresh all labels and items
        // Show success message for deletion
        this.labelCreatedMessage = `Label deleted successfully!`;
        this.showLabelCreatedSuccess = true;
        setTimeout(() => {
          this.showLabelCreatedSuccess = false;
          this.labelCreatedMessage = '';
        }, 3000);
      },
      error: (error) => {
        console.error('deleteLabel: Error deleting label:', error);
        alert(`Failed to delete label: ${error.message || 'Unknown error'}`);
        this.showLabelCreatedSuccess = false;
      }
    });
  }

  cancelEdit(): void {
    this.editingLabel = null;
    this.resetLabelManagementForm();
    // Hide success message on cancel
    this.showLabelCreatedSuccess = false;
    this.labelCreatedMessage = '';
    console.log('cancelEdit: Label editing cancelled.');
  }

  private resetLabelManagementForm(): void {
    this.newLabelName = '';
    this.newLabelDescription = '';
    this.newLabelColor = '#007bff';
    this.editingLabel = null;
    console.log('resetLabelManagementForm: Label form reset.');
  }

  // --- Data Loading and Initialization Methods ---

  /**
   * Fetches all labels from the backend.
   * Then, it reconciles the labels on `internalDummyItemsSource` (which holds data from Local Storage)
   * with the freshly fetched `allLabels` to ensure consistency and up-to-date label details.
   * Finally, it loads and filters the items for display.
   */
  getAllLabelsAndInitializeData(): void {
    console.log('getAllLabelsAndInitializeData: Fetching labels...');
    this.labelService.getLabels().subscribe({
      next: (data) => {
        console.log('getAllLabelsAndInitializeData: LabelService.getLabels() emitted data:', data);
        this.allLabels = data;
        this.latestdata = data; // Keep latestdata in sync for filter pills

        // Create a map for quick lookup of current Label objects by their ID
        const labelMap = new Map<number, Label>();
        this.allLabels.forEach(label => labelMap.set(label.id, label));
        console.log('getAllLabelsAndInitializeData: Label map created for reconciliation.');

        // Reconcile labels on internalDummyItemsSource with freshly fetched labels.
        // This is CRITICAL for persistence: it replaces the potentially stale/partial label
        // objects from localStorage with the current, full Label objects from the backend.
        // It also removes any labels from items if that label was deleted from the backend.
        this.internalDummyItemsSource = this.internalDummyItemsSource.map(item => {
            const newItem = { ...item }; // Create a new item object to ensure immutability for change detection
            // Ensure item.labels is an array before mapping
            newItem.labels = Array.isArray(item.labels) ? item.labels
                .map(label => labelMap.get(label.id)) // Get the full Label object using the ID
                .filter((label): label is Label => label !== undefined) : []; // Filter out any labels that no longer exist in `allLabels`
            return newItem;
        });
        console.log('getAllLabelsAndInitializeData: Item labels reconciled with fetched labels.');

        // Optional: Dynamic assignment for new items or if no labels were stored.
        // This block applies labels to items ONLY IF they don't have any labels assigned,
        // which typically happens when `initialDummyItemsSource` is used (i.e., first load or cleared storage).
        // Added a condition: only auto-assign if there are labels available AND no labels are currently assigned.
        if (this.allLabels.length > 0 && this.internalDummyItemsSource.every(item => item.labels.length === 0)) {
             console.log('getAllLabelsAndInitializeData: Dynamically assigning initial labels to items (no existing labels found, for first run or cleared storage).');
             this.internalDummyItemsSource = this.internalDummyItemsSource.map((item, itemIndex) => {
                const newItem = { ...item, labels: [] as Label[] };
                const numLabelsToAssign = Math.min(2, this.allLabels.length);
                for (let i = 0; i < numLabelsToAssign; i++) {
                    const labelIndex = (itemIndex + i) % this.allLabels.length;
                    if (this.allLabels[labelIndex]) {
                        newItem.labels.push(this.allLabels[labelIndex]);
                    }
                }
                return newItem;
            });
            this.saveItemsToLocalStorage(); // Save these newly assigned initial labels
        }

        this.loadItems(); // Load and filter items based on the updated data
        this.cdr.detectChanges(); // Explicitly trigger change detection after all data is processed
      },
      error: (error) => {
        console.error('getAllLabelsAndInitializeData: Error fetching labels from LabelService:', error);
        // Clear all label-related data on error to reflect no labels are available
        this.allLabels = [];
        this.latestdata = [];
        // Ensure labels are cleared on items if label service fails to prevent stale data
        this.internalDummyItemsSource = this.internalDummyItemsSource.map(item => ({ ...item, labels: [] }));
        this.loadItems(); // Still try to load items even if label fetching failed (without labels)
        this.cdr.detectChanges(); // Explicitly trigger change detection
      },
      complete: () => {
        console.log('getAllLabelsAndInitializeData: LabelService.getLabels() observable completed.');
      }
    });
  }

  /**
   * Loads and filters the items to be displayed in the grid from `internalDummyItemsSource`.
   */
  loadItems(): void {
    console.log('loadItems: Loading and filtering items...');
    let filteredItems = [...this.internalDummyItemsSource]; // Create a mutable copy

    if (this.selectedFilterLabelIds.length > 0) {
      filteredItems = filteredItems.filter(item =>
        item.labels.some(label => this.selectedFilterLabelIds.includes(label.id))
      );
      console.log('loadItems: Items filtered by IDs:', this.selectedFilterLabelIds, 'Result:', filteredItems.length, 'items');
    }

    this.items = filteredItems;
    this.selectedItemIds = [];
    this.isAllSelected = false;
    this.showLabelManagementDropdownFor = null;
    console.log('loadItems: Displayed items updated. Total items:', this.items.length);
  }

  // --- Item Creation and Management ---

  createNewItem(): void {
    if (this.newItemName.trim() && this.newItemDate.trim()) {
      const newId = this.internalDummyItemsSource.length > 0 ?
        Math.max(...this.internalDummyItemsSource.map(i => i.id)) + 1 : 1;

      const newItem: Item = {
        id: newId,
        name: this.newItemName.trim(),
        description: this.newItemDescription.trim(),
        date: this.newItemDate,
        labels: []
      };
      this.internalDummyItemsSource.push(newItem);

      this.saveItemsToLocalStorage(); // Save after adding new item

      this.newItemName = '';
      this.newItemDescription = '';
      this.newItemDate = '';
      this.loadItems();
      console.log('createNewItem: New item created:', newItem);
    } else {
      alert('Please provide Subject and Date for the new item.');
    }
  }

  // --- Individual Item Label Management ---

  isLabelAssigned(item: Item, labelId: number): boolean {
    // Ensure item.labels is an array before calling .some()
    return Array.isArray(item.labels) && item.labels.some(l => l.id === labelId);
  }

  toggleLabelManagementDropdown(item: Item, event: MouseEvent): void {
    event.stopPropagation();
    this.showLabelManagementDropdownFor = this.showLabelManagementDropdownFor === item.id ? null : item.id;
    console.log('toggleLabelManagementDropdown: Dropdown for item', item.id, 'is now', this.showLabelManagementDropdownFor ? 'open' : 'closed');
  }

  closeLabelDropdown(): void {
    this.showLabelManagementDropdownFor = null;
    console.log('closeLabelDropdown: Individual label dropdown closed.');
  }

  toggleLabelAssignment(item: Item, labelId: number): void {
    console.log('toggleLabelAssignment: Toggling label', labelId, 'for item', item.id);
    const realItem = this.internalDummyItemsSource.find(i => i.id === item.id);
    if (!realItem) {
      console.error('toggleLabelAssignment: Real item not found for ID:', item.id);
      return;
    }

    const label = this.allLabels.find(l => l.id === labelId);
    if (!label) {
      console.error('toggleLabelAssignment: Label not found:', labelId);
      return;
    }

    if (this.isLabelAssigned(realItem, labelId)) {
      realItem.labels = realItem.labels.filter(l => l.id !== labelId);
      console.log(`toggleLabelAssignment: Label ${labelId} removed from item ${realItem.id}`);
    } else {
      realItem.labels = [...realItem.labels, label];
      console.log(`toggleLabelAssignment: Label ${labelId} assigned to item ${realItem.id}`);
    }
    this.saveItemsToLocalStorage(); // Save after label assignment change
    this.loadItems();
  }

  // --- Batch Operations ---

  toggleItemSelection(itemId: number): void {
    const index = this.selectedItemIds.indexOf(itemId);
    if (index > -1) {
      this.selectedItemIds = this.selectedItemIds.filter(id => id !== itemId);
    } else {
      this.selectedItemIds = [...this.selectedItemIds, itemId];
    }
    this.isAllSelected = this.items.length > 0 && this.selectedItemIds.length === this.items.length;
    this.cdr.detectChanges();
    console.log('toggleItemSelection: Selected item IDs:', this.selectedItemIds, 'Is All Selected:', this.isAllSelected);
  }

  toggleAllSelection(): void {
    this.isAllSelected = !this.isAllSelected;
    if (this.isAllSelected) {
      this.selectedItemIds = this.items.map(item => item.id);
      console.log('toggleAllSelection: All items selected:', this.selectedItemIds);
    } else {
      this.selectedItemIds = [];
      console.log('toggleAllSelection: All items deselected.');
    }
    this.cdr.detectChanges();
  }

  assignLabelToSelectedItems(labelId: number): void {
    console.log('assignLabelToSelectedItems: Called with labelId:', labelId, 'Selected item IDs:', this.selectedItemIds);

    if (this.selectedItemIds.length === 0) {
      alert('Please select items to assign a label.');
      return;
    }

    const labelToAssign = this.allLabels.find(l => l.id === labelId);
    if (!labelToAssign) {
      console.error('assignLabelToSelectedItems: Label not found:', labelId);
      alert('Selected label not found.');
      return;
    }

    let changesMade = false;
    this.internalDummyItemsSource.forEach(item => {
      if (this.selectedItemIds.includes(item.id)) {
        if (!this.isLabelAssigned(item, labelToAssign.id)) {
          item.labels = [...item.labels, labelToAssign];
          changesMade = true;
        }
      }
    });

    if (changesMade) {
      this.saveItemsToLocalStorage(); // Save after batch assignment
      this.selectedItemIds = [];
      this.loadItems();
    } else {
      console.log("assignLabelToSelectedItems: No new labels assigned to selected items.");
    }
  }

  removeLabelFromSelectedItems(labelId: number): void {
    console.log('removeLabelFromSelectedItems: Called with labelId:', labelId, 'Selected item IDs:', this.selectedItemIds);
    if (this.selectedItemIds.length === 0) {
      alert('Please select items to remove a label from.');
      return;
    }

    const labelToRemove = this.allLabels.find(l => l.id === labelId);
    if (!labelToRemove) {
      console.error('removeLabelFromSelectedItems: Label not found:', labelId);
      alert('Selected label not found.');
      return;
    }

    let changesMade = false;
    this.internalDummyItemsSource.forEach(item => {
      if (this.selectedItemIds.includes(item.id)) {
        if (this.isLabelAssigned(item, labelToRemove.id)) {
          item.labels = item.labels.filter(l => l.id !== labelToRemove.id);
          changesMade = true;
        }
      }
    });

    if (changesMade) {
      this.saveItemsToLocalStorage(); // Save after batch removal
      this.selectedItemIds = [];
      this.loadItems();
    }
  }

  // --- Filtering Methods ---

  toggleFilterLabel(labelId: number): void {
    console.log('toggleFilterLabel: Toggling filter for label ID:', labelId);
    const index = this.selectedFilterLabelIds.indexOf(labelId);
    if (index > -1) {
      this.selectedFilterLabelIds = this.selectedFilterLabelIds.filter(id => id !== labelId);
    } else {
      this.selectedFilterLabelIds = [...this.selectedFilterLabelIds, labelId];
    }
    this.loadItems();
    console.log('toggleFilterLabel: Current filter labels:', this.selectedFilterLabelIds);
  }

  clearFilter(): void {
    console.log('clearFilter: Clearing all filters.');
    this.selectedFilterLabelIds = [];
    this.loadItems();
    console.log('clearFilter: Filters cleared. All items should be visible now.');
  }

  // --- Utility Methods ---

  getContrastColor(hexColor: string | undefined): string {
    if (!hexColor) return '#333';

    const cleanHex = hexColor.startsWith('#') ? hexColor.slice(1) : hexColor;

    if (cleanHex.length !== 6) {
        console.warn(`Invalid hex color for contrast calculation: ${hexColor}. Defaulting to #333.`);
        return '#333';
    }

    const r = parseInt(cleanHex.substring(0, 2), 16);
    const g = parseInt(cleanHex.substring(2, 4), 16);
    const b = parseInt(cleanHex.substring(4, 6), 16);

    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

    return luminance > 0.5 ? '#333' : '#FFFFFF';
  }
}