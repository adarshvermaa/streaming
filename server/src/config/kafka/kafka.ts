import { Kafka, Consumer, Producer } from 'kafkajs';
import { Server } from 'socket.io';
import { ENV } from '../env';
const kafka = new Kafka({
  clientId: 'socket-server',
  brokers: [ENV.KAFKA_BROKER],
});

const producer: Producer = kafka.producer();
const consumer: Consumer = kafka.consumer({ groupId: ENV.KAFKA_GROUP_ID });

export const setupKafka = async (io: Server): Promise<void> => {
  try {
    // Connect the producer
    await producer.connect();
    console.log('Kafka producer connected.');

    // Connect the consumer
    await consumer.connect();
    console.log('Kafka consumer connected.');

    // Subscribe to a Kafka topic
    await consumer.subscribe({ topic: ENV.KAFKA_TOPIC, fromBeginning: true });

    // Handle Kafka messages
    consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        console.log(`Received message: ${message.value?.toString()} on topic: ${topic}`);
        // Emit the Kafka message to connected Socket.IO clients
        io.emit('kafka-message', message.value?.toString());
      },
    });

    console.log('Kafka consumer running.');
  } catch (err) {
    console.error('Error setting up Kafka:', err);
  }
};

export const sendToKafka = async (topic: string, message: string): Promise<void> => {
  try {
    await producer.send({
      topic,
      messages: [{ value: message }],
    });
    console.log(`Message sent to Kafka topic ${topic}: ${message}`);
  } catch (err) {
    console.error('Error sending message to Kafka:', err);
  }
};
