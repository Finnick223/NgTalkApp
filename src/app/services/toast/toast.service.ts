import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  constructor(private messageService: MessageService) {}

  success(summary: string, detail?: string): void {
    this.show('success', summary, detail);
  }

  error(summary: string, detail?: string): void {
    this.show('error', summary, detail);
  }

  info(summary: string, detail?: string): void {
    this.show('info', summary, detail);
  }

  warn(summary: string, detail?: string): void {
    this.show('warn', summary, detail);
  }

  private show(severity: string, summary: string, detail?: string): void {
    this.messageService.add({ severity, summary, detail, life: 4000 });
  }
}
