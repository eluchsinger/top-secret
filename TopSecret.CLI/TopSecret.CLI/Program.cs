using System;
using System.Threading.Tasks;
using Microsoft.CognitiveServices.Speech;
using Microsoft.CognitiveServices.Speech.Dialog;
using Newtonsoft.Json;

namespace TopSecret.CLI
{
    internal class Program
    {
        private const string speechSubscriptionKey = "cae26e415d0c43ffac8f000d37d86b64"; // Your subscription key

        public static async Task RecognizeCommands()
        {
            var speechCommandsConfig = CustomCommandsConfig.FromSubscription("c619435a-6254-452f-a668-3fee02924e69", "cae26e415d0c43ffac8f000d37d86b64", "westus2");
            speechCommandsConfig.SetProperty(PropertyId.SpeechServiceConnection_RecoLanguage, "en-us");
            var connector = new DialogServiceConnector(speechCommandsConfig);

            //Console.WriteLine("Connecting...");
            //await connector.ConnectAsync();

            //
            // This code sets up handlers for events relied on by `DialogServiceConnector` to communicate its activities,
            // speech recognition results, and other information.
            //
            // ActivityReceived is the main way your client will receive messages, audio, and events
            connector.ActivityReceived += async (sender, activityReceivedEventArgs) =>
            {
                string output = "Activity received ";
                if (activityReceivedEventArgs.HasAudio)
                {
                    var activity = JsonConvert.DeserializeObject<ActivityModel>(activityReceivedEventArgs.Activity);
                    output += "it has audio ";

                    var synthesizer = new SpeechSynthesizer(SpeechConfig.FromSubscription(speechSubscriptionKey, "westus2"));
                    synthesizer.SynthesisCanceled += (sender, canceledEventArgs) =>
                    {
                        Console.WriteLine("Failed synthesizing");
                    };

                    var synthesisResult = await synthesizer.SpeakSsmlAsync(activity.Speak);
                }

                output += "\n\n" + activityReceivedEventArgs.Activity;
                Console.WriteLine(output);
            };

            // Canceled will be signaled when a turn is aborted or experiences an error condition
            connector.Canceled += (sender, canceledEventArgs) =>
            {
                Console.WriteLine($"Canceled, reason={canceledEventArgs.Reason}");
                if (canceledEventArgs.Reason == CancellationReason.Error)
                {
                    Console.WriteLine(
                        $"Error: code={canceledEventArgs.ErrorCode}, details={canceledEventArgs.ErrorDetails}");
                }
            };

            // Recognizing (not 'Recognized') will provide the intermediate recognized text
            // while an audio stream is being processed
            connector.Recognizing += (sender, recognitionEventArgs) =>
            {
                Console.WriteLine($"Recognizing! in-progress text={recognitionEventArgs.Result.Text}");
            };

            // Recognized (not 'Recognizing') will provide the final recognized text
            // once audio capture is completed
            connector.Recognized += (sender, recognitionEventArgs) =>
            {
                Console.WriteLine($"Final speech-to-text result: '{recognitionEventArgs.Result.Text}'");
            };

            // SessionStarted will notify when audio begins flowing to the service for a turn
            connector.SessionStarted += (sender, sessionEventArgs) =>
            {
                Console.WriteLine($"Now Listening! Session started, id={sessionEventArgs.SessionId}");
            };

            // SessionStopped will notify when a turn is complete and
            // it's safe to begin listening again
            connector.SessionStopped += (sender, sessionEventArgs) =>
            {
                Console.WriteLine($"Listening complete. Session ended, id={sessionEventArgs.SessionId}");
            };

            // Start sending audio
            try
            {
                // Start sending audio
                var result = await connector.ListenOnceAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Exception: {ex.ToString()}");
            }
        }

        private static async Task Main(string[] args)
        {
            //await RecognizeSpeechAsync();
            await RecognizeCommands();
            Console.WriteLine("Please press <Return> to continue.");
            Console.ReadLine();
        }
    }
}