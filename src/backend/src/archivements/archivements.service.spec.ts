import { Test, TestingModule } from '@nestjs/testing';
import { ArchivementsService } from './archivements.service';

describe('ArchivementsService', () => {
  let service: ArchivementsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ArchivementsService],
    }).compile();

    service = module.get<ArchivementsService>(ArchivementsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
