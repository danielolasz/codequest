import { Component, inject } from '@angular/core';
import { BrnDialogRef, injectBrnDialogContext } from '@spartan-ng/ui-dialog-brain';

@Component({
  selector: 'app-reward-dialog',
  standalone: true,
  imports: [],
  templateUrl: './reward-dialog.component.html',
  styleUrl: './reward-dialog.component.scss'
})
export class RewardDialogComponent {
    private readonly _dialogRef = inject<BrnDialogRef<number>>(BrnDialogRef);
    private readonly _dialogContext = injectBrnDialogContext<{ userName: string }>();

    protected readonly username = this._dialogContext.userName;

    public reward(reward: number): void {
        this._dialogRef.close(reward);
    }
}
