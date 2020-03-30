import { SpeechConfig, AudioConfig, SpeechRecognizer } from "microsoft-cognitiveservices-speech-sdk";

export interface ISpeechRescognitionService {
	/**
	 * Starts listening for a while.
	 * @returns Returns the understood phrases and words as a string.
	 */
	listen(): Promise<string>;
}

export class SpeechRecognitionService implements ISpeechRescognitionService {
	private subscriptionKey = "06f71dcab9f148e193c4a418d589b5a3";
	private serviceRegion = "westeurope";
	private recognizer: SpeechRecognizer;

	constructor() {
		const speechConfig = SpeechConfig.fromSubscription(this.subscriptionKey, this.serviceRegion);
		speechConfig.speechRecognitionLanguage = "en-US";
		const audioConfig = AudioConfig.fromDefaultMicrophoneInput();
		this.recognizer = new SpeechRecognizer(speechConfig, audioConfig);
	}

	listen(): Promise<string> {
		const promise: Promise<string> = new Promise<string>((resolve, reject) => {
			this.recognizer.recognizeOnceAsync((speechRecognitionResult) => {
				const recognizedText = speechRecognitionResult.text;
				resolve(recognizedText);
			}, recognitionError => {
				reject(new Error(recognitionError));
			});
		});

		return promise;
	}

}