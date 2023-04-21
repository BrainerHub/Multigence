import { TestBed } from '@angular/core/testing';

import { QuestionaryService } from './questionary.service';

describe('QuestionaryService', () => {
  let service: QuestionaryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QuestionaryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
