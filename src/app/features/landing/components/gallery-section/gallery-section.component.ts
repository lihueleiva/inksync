import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TattooGalleryService } from '../../services/tattoo-gallery.service';
import { Tattoo } from '../../models/tattoo.model';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { toSignal } from '@angular/core/rxjs-interop';

type CategoryFilter = 'Todos' | Tattoo['category'];

@Component({
  selector: 'ink-gallery-section',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  templateUrl: './gallery-section.component.html',
  styleUrl: './gallery-section.component.scss'
})
export class GallerySectionComponent {
  private galleryService = inject(TattooGalleryService);

  public categories = signal<CategoryFilter[]>(['Todos', 'Realismo', 'Tradicional', 'Blackwork', 'Color']);
  public activeFilter = signal<CategoryFilter>('Todos');

  private allTattoos$ = this.galleryService.getTattoos();

  private allTattoos = toSignal(this.allTattoos$, { initialValue: [] });

  public filteredTattoos = computed(() => {
    const filter = this.activeFilter();
    if (filter === 'Todos') {
      return this.allTattoos();
    }
    return this.allTattoos().filter(tattoo => tattoo.category === filter);
  });

  setFilter(category: CategoryFilter) {
    this.activeFilter.set(category);
  }
}
