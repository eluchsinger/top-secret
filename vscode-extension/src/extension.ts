// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { StatusBarController } from './StatusbarController';
import { SpeechRecognitionService } from './SpeechRecognitionService';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "top-secret" is now active!');

	const speechRecognitionService = new SpeechRecognitionService();
	const statusBarController = new StatusBarController();
	statusBarController.setup();
	context.subscriptions.push(statusBarController);

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let listenCommand = vscode.commands.registerCommand('top-secret.listen', async () => {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		vscode.window.showInformationMessage("Listening...");
		var result = await speechRecognitionService.listen();
		vscode.window.showInformationMessage(`Heard: ${result}`);
	});

	context.subscriptions.push(listenCommand);
}


// this method is called when your extension is deactivated
export function deactivate() { }
