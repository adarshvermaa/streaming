// src/KafkaManager.ts
import { Kafka, Producer, Consumer, logLevel, KafkaMessage } from "kafkajs";

export class KafkaManager {
  private static instance: KafkaManager;
  private kafka: Kafka;
  public producer: Producer;
  public consumer: Consumer;

  /**
   * Private constructor to enforce singleton usage.
   * @param brokerList - Array of Kafka broker addresses.
   * @param clientId - A client identifier for your Kafka client.
   */
  private constructor(brokerList: string[], clientId: string) {
    this.kafka = new Kafka({
      clientId,
      brokers: brokerList,
      logLevel: logLevel.ERROR, // Adjust log level as needed
    });

    // Initialize the producer
    this.producer = this.kafka.producer();

    // Initialize the consumer with a default group (adjust the groupId as needed)
    this.consumer = this.kafka.consumer({ groupId: `${clientId}-group` });
  }

  /**
   * Returns the singleton instance of KafkaManager.
   * If it hasn't been initialized yet, it creates one.
   * @param brokerList - Array of Kafka broker addresses.
   * @param clientId - A client identifier for your Kafka client.
   */
  public static getInstance(
    brokerList: string[],
    clientId: string
  ): KafkaManager {
    if (!KafkaManager.instance) {
      KafkaManager.instance = new KafkaManager(brokerList, clientId);
    }
    return KafkaManager.instance;
  }

  /**
   * Connects the producer.
   */
  public async connectProducer(): Promise<void> {
    await this.producer.connect();
    console.log("Kafka Producer connected");
  }

  /**
   * Disconnects the producer.
   */
  public async disconnectProducer(): Promise<void> {
    await this.producer.disconnect();
    console.log("Kafka Producer disconnected");
  }

  /**
   * Connects the consumer.
   */
  public async connectConsumer(): Promise<void> {
    await this.consumer.connect();
    console.log("Kafka Consumer connected");
  }

  /**
   * Disconnects the consumer.
   */
  public async disconnectConsumer(): Promise<void> {
    await this.consumer.disconnect();
    console.log("Kafka Consumer disconnected");
  }

  /**
   * Sends messages to a specified topic.
   * @param topic - The topic to send messages to.
   * @param messages - An array of message objects with key and value.
   */
  public async sendMessage(
    topic: string,
    messages: { key: string; value: string }[]
  ): Promise<void> {
    await this.producer.send({
      topic,
      messages,
    });
    console.log(`Messages sent to topic ${topic}`);
  }

  /**
   * Subscribes the consumer to a topic.
   * @param topic - The topic to subscribe to.
   * @param fromBeginning - Whether to read messages from the beginning.
   */
  public async subscribe(topic: string, fromBeginning = true): Promise<void> {
    await this.consumer.subscribe({ topic, fromBeginning });
    console.log(`Subscribed to topic ${topic}`);
  }

  /**
   * Runs the consumer with a message handler.
   * @param eachMessageHandler - A handler function to process each message.
   */
  public async runConsumer(
    eachMessageHandler: (payload: {
      topic: string;
      partition: number;
      message: KafkaMessage;
    }) => Promise<void>
  ): Promise<void> {
    await this.consumer.run({
      eachMessage: eachMessageHandler,
    });
    console.log("Kafka consumer is running");
  }
}
