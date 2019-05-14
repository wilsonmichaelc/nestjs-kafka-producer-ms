import { Body, Controller, Logger, Post } from '@nestjs/common';

import { KafkaPayload } from './kafka.interfaces';
import { KafkaService } from './kafka.service';

@Controller('kafka')
export class KafkaController {

    constructor(private kafkaService: KafkaService, private logger: Logger) {
        /*
         *  Optionally, subscribe to producer events and errors
         */
        this.kafkaService.producerEvents.subscribe((event) => {
            logger.log('Producer Event', JSON.stringify(event));
        });

        this.kafkaService.producerErrors.subscribe((error) => {
            logger.error('Producer Error', JSON.stringify(error));
        });
    }

    @Post('produce')
    produce(@Body() payload: KafkaPayload): Promise<boolean> {
        return this.kafkaService.produce(payload);
    }

}
