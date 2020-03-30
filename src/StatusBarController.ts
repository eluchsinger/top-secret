import { window, Disposable, StatusBarAlignment, StatusBarItem, ExtensionContext } from 'vscode';

export interface IStatusBarController {
	setup(): void;
}

export class StatusBarController implements IStatusBarController, Disposable {
	private listenStatusbarItem?: StatusBarItem;


	setup(): void {
		this.listenStatusbarItem = window.createStatusBarItem(StatusBarAlignment.Left, 100);
		this.listenStatusbarItem.text = "$(feedback) Listen!";
		this.listenStatusbarItem.command = "top-secret.listen";
		this.listenStatusbarItem.show();
		console.info("Setup of the StatusBar has finished.");
	}

	dispose() {
		this.listenStatusbarItem?.dispose();
	}

}