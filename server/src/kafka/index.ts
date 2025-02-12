// src/server.ts
import { ENV } from "../config/env";
import { KafkaManager } from "./KafkaManager";
import { withKafkaErrorHandling } from "./kafkaWrapper";

// Export an array of topics to be used by your application.
export const KafkaTopic = ["topic_1", "topic_3", "topic_2", "topic_4"];

export class KafkaConnections {
  public static createKafkaConnections(): void {
    // Set up your Kafka connection parameters
    const brokers = ENV.KAFKA_BROKER
      ? ENV.KAFKA_BROKER.split(",")
      : ["localhost:9092"];
    const clientId = ENV.KAFKA_CLIENT_ID || "my-kafka-client";

    // Get the singleton KafkaManager instance
    const kafkaManager = KafkaManager.getInstance(brokers, clientId);

    async function run() {
      // Connect the producer and consumer
      await kafkaManager.connectProducer();
      await kafkaManager.connectConsumer();

      // Create an admin client using the internal Kafka instance.
      // Note: Accessing the private member via bracket notation.
      const admin = kafkaManager["kafka"].admin();
      await admin.connect();

      // List the topics currently available in the Kafka cluster.
      const existingTopics = await admin.listTopics();
      await admin.disconnect();

      // Check if each topic in KafkaTopic exists
      for (const topic of KafkaTopic) {
        if (!existingTopics.includes(topic)) {
          throw new Error(
            `Topic "${topic}" is not available in the Kafka cluster.`
          );
        }
      }

      // Subscribe to each topic from the KafkaTopic array
      for (const topic of KafkaTopic) {
        console.log(`Subscribing to topic: ${topic}`);
        await kafkaManager.subscribe(topic, true);
      }

      // Run the consumer with the error-handled message handler
      await kafkaManager.runConsumer(
        withKafkaErrorHandling(async ({ topic, partition, message }) => {
          // Your message processing logic here
          console.log(
            `Received message on ${topic} [partition ${partition}]: ${message.value?.toString()}`
          );
          // You can also perform additional actions here (e.g., updating a database)
          // You can also perform additional actions here (e.g., updating a database)
        })
      );

      // Optionally, send a test message to one of the topics (e.g., the first one)
      await kafkaManager.sendMessage(KafkaTopic[0], [
        { key: "test-key", value: "Hello from Kafka!" },
      ]);
    }

    run().catch((error) => {
      console.error("Error running Kafka manager:", error);
    });
  }
}
