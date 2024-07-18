import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private readonly selectedSedeKey = 'selectedSede';

  saveSelectedSede(sedeId: number): void {
    localStorage.setItem(this.selectedSedeKey, sedeId.toString());
  }

  getSelectedSede(): number | null {
    const savedSede = localStorage.getItem(this.selectedSedeKey);
    return savedSede ? parseInt(savedSede, 10) : null;
  }
}