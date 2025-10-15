import { Component } from '@angular/core';
import { HeroSectionComponent } from '../../components/hero-section/hero-section.component';
import { GallerySectionComponent } from '../../components/gallery-section/gallery-section.component';
import { AboutSectionComponent } from '../../components/about-section/about-section.component';
@Component({
  selector: 'ink-home',
  standalone: true,
  imports: [HeroSectionComponent, GallerySectionComponent, AboutSectionComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent { }
