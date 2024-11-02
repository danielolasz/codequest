import { NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';
import { lucideStar } from '@ng-icons/lucide';
import { HlmButtonModule } from '@spartan-ng/ui-button-helm';
import { BrnDialogRef, injectBrnDialogContext } from '@spartan-ng/ui-dialog-brain';
import { HlmIconModule, provideIcons } from '@spartan-ng/ui-icon-helm';

@Component({
  selector: 'app-reward-dialog',
  standalone: true,
  imports: [HlmIconModule, NgClass, HlmButtonModule],
  providers: [provideIcons({ lucideStar })],
  templateUrl: './reward-dialog.component.html',
  styleUrl: './reward-dialog.component.scss'
})
export class RewardDialogComponent {
    private readonly _dialogRef = inject<BrnDialogRef<number>>(BrnDialogRef);
    private readonly _dialogContext = injectBrnDialogContext<{ userName: string }>();

    protected readonly username = this._dialogContext.userName;
    isClicked: boolean[] = [false, false, false];
    rewardScore: number = 0;
    hoverIndex: number = -1;

    public reward(rewardIndex: number): void {
      this.clearClicked();

      for (let i = 0; i < rewardIndex; i++) {
        this.isClicked[i] = true;
      }

      this.rewardScore = rewardIndex;
    }

    private clearClicked(): void {
      for (let i = 0; i < this.isClicked.length; i++) {
        this.isClicked[i] = false;
      }
    }

    public setHover(index: number): void {
      this.hoverIndex = index + 1;
    }
  
    public clearHover(): void {
      this.hoverIndex = -1;
    }

    public submit(): void {
      this._dialogRef.close(this.rewardScore);
    }
}
