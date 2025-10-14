import { Component } from '@angular/core';
import { HeroSectionComponent } from '../../components/hero-section/hero-section.component';
import { GallerySectionComponent } from '../../components/gallery-section/gallery-section.component';

@Component({
  selector: 'ink-home',
  standalone: true,
  imports: [HeroSectionComponent, GallerySectionComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent { }
