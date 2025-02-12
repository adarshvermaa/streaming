// src/kafkaWrapper.ts
import { KafkaMessage } from "kafkajs";

/**
 * A higher‑order function that wraps a Kafka message handler.
 * It catches any errors thrown by the handler and logs an error message.
 *
 * @param handler - The original Kafka message handler.
 * @returns A new function that wraps the original handler with error handling.
 */
export function withKafkaErrorHandling(
  handler: (payload: {
    topic: string;
    partition: number;
    message: KafkaMessage;
  }) => Promise<void>
) {
  return async (payload: {
    topic: string;
    partition: number;
    message: KafkaMessage;
  }) => {
    try {
      await handler(payload);
    } catch (error) {
      console.error("Error processing Kafka message:", error);
      // Optionally, add additional error handling logic here
    }
  };
}
