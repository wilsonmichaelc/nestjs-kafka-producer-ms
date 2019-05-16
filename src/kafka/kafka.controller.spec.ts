import { Logger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { KafkaController } from './kafka.controller';
import { KafkaPayload } from './kafka.interfaces';
import { KafkaService } from './kafka.service';

describe('Kafka Controller', () => {
  let controller: KafkaController;
  let kafkaService: KafkaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [KafkaController],
      providers: [KafkaService, Logger],
    }).compile();

    controller = module.get<KafkaController>(KafkaController);
    kafkaService = module.get<KafkaService>(KafkaService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('produce', () => {
    it('should return a boolean', async () => {
      const payload: KafkaPayload = {
        topic: 'test',
        message: 'test',
      };
      jest
        .spyOn(kafkaService, 'produce')
        .mockImplementation(() => Promise.resolve(true));

      controller.produce(payload).then(result => {
        expect(result).toBe(true);
      });
    });
  });
});
