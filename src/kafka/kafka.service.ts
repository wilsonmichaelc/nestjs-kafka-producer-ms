import { Injectable } from '@nestjs/common';
import { KafkaClient, Producer } from 'kafka-node';
import { Subject } from 'rxjs';

import { KafkaPayload } from './kafka.interfaces';

@Injectable()
export class KafkaService {
    client: KafkaClient;

    producer: Producer = null;
    public producerEvents = new Subject<any>();
    public producerErrors = new Subject<any>();

    constructor() {
        // Create a client ... aka connection to kafak host
        this.client = new KafkaClient({ kafkaHost: 'localhost:9092' });
        // Initialize the producer
        this.initialize();
    }

    initialize(): void {
        if (!this.producer) {
            // Create a new producer
            this.producer = new Producer(this.client);
            // When the producer is ready, make it available for use
            this.producer.on('ready', () => {
                this.producerEvents.next('Ready!');
            });
            // Listen for producer errors and make them available
            this.producer.on('error', error => {
                this.producerErrors.next(error);
            });
        }
    }

    produce(kp: KafkaPayload): Promise<boolean> {
        return new Promise(resolve => {
            if (!!this.producer) {
                // Construct a payload
                const payload = [
                    { topic: kp.topic, messages: kp.message, partition: 0 },
                ];

                // Send the payload
                this.producer.send(payload, (err, data) => {
                    if (err) {
                        this.producerErrors.next(err);
                        resolve(false);
                    }
                    this.producerEvents.next(data);
                    resolve(true);
                });
            } else {
                resolve(false);
            }
        });
    }
}
