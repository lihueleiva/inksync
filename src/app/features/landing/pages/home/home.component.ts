import { Component } from '@angular/core';
import { HeroSectionComponent } from '../../components/hero-section/hero-section.component';
import { GallerySectionComponent } from '../../components/gallery-section/gallery-section.component';
import { AboutSectionComponent } from '../../components/about-section/about-section.component';
import { ProcessCareSectionComponent } from '../../components/process-care-section/process-care-section.component';
import { ContactFormSectionComponent } from '../../components/contact-form-section/contact-form-section.component';


@Component({
  selector: 'ink-home',
  standalone: true,
  imports: [HeroSectionComponent, GallerySectionComponent, AboutSectionComponent, ProcessCareSectionComponent, ContactFormSectionComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent { }
