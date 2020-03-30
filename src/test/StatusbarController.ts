// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { window, Disposable, StatusBarAlignment, StatusBarItem, ExtensionContext } from 'vscode';

export interface IStatusBarController {
	setup(): void;
}

export class StatusBarController implements IStatusBarController, Disposable {

	private listenStatusbarItem?: StatusBarItem;

	constructor(private context: ExtensionContext) {

	}

	setup(): void {
		this.listenStatusbarItem = window.createStatusBarItem(StatusBarAlignment.Left, 100);
		this.listenStatusbarItem.text = "$(feedback) Listen!";
		this.listenStatusbarItem.show();
		console.info("Setup of the StatusBar has finished.");
	}

	dispose() {
		this.listenStatusbarItem?.dispose();
	}

}