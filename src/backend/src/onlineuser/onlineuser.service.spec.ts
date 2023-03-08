import { Test, TestingModule } from '@nestjs/testing';
import { OnlineuserService } from './onlineuser.service';

describe('OnlineUserService', () => {
  let service: OnlineuserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OnlineuserService],
    }).compile();

    service = module.get<OnlineuserService>(OnlineuserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
