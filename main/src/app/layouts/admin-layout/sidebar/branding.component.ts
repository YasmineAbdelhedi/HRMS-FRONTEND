import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-branding',
  standalone: true,
  imports: [RouterModule],
  template: `
    <div class="branding">
      <a [routerLink]="['/']" class="branding-link">
        <div class="logo-container">
          <div class="logo-icon">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="40" height="40" rx="10" fill="url(#gradient)"/>
              <path d="M20 10L28 16V24L20 30L12 24V16L20 10Z" fill="white" opacity="0.9"/>
              <defs>
                <linearGradient id="gradient" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
                  <stop stop-color="#667eea"/>
                  <stop offset="1" stop-color="#764ba2"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div class="logo-text">
            <span class="logo-title">HRMS</span>
            <span class="logo-subtitle">Admin Panel</span>
          </div>
        </div>
      </a>
    </div>
  `,
  styles: [`
    .branding {
      padding: 20px 16px;
      border-bottom: 1px solid #e2e8f0;
      
      .branding-link {
        text-decoration: none;
        display: block;
        transition: all 0.3s ease;
        
        &:hover {
          transform: translateX(4px);
          
          .logo-icon svg {
            transform: rotate(5deg) scale(1.05);
          }
        }
      }
      
      .logo-container {
        display: flex;
        align-items: center;
        gap: 12px;
      }
      
      .logo-icon {
        svg {
          display: block;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          filter: drop-shadow(0 2px 8px rgba(102, 126, 234, 0.3));
        }
      }
      
      .logo-text {
        display: flex;
        flex-direction: column;
        gap: 2px;
        
        .logo-title {
          font-size: 20px;
          font-weight: 800;
          letter-spacing: -0.5px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          line-height: 1;
        }
        
        .logo-subtitle {
          font-size: 11px;
          font-weight: 600;
          color: #718096;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
      }
    }
  `],

  host: { 'attr.data-component-id': 'admin-branding' },
})
export class BrandingComponent {
  constructor() { }
}
