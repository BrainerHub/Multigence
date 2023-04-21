import { Component, ElementRef, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { UserService } from 'app/services/user.service';
import * as _ from 'lodash';
import { QuestionaryService } from 'app/services/questionary.service';

@Component({
  selector: 'app-questionary',
  templateUrl: './questionary.component.html',
  styleUrls: ['./questionary.component.scss'],
})
export class QuestionaryComponent {
  optionsForm!: FormGroup;
  @ViewChild('template') template: TemplateRef<HTMLDivElement>;
  modalRef: BsModalRef;
  user: any;
  data: any;
  departments: any;
  organization: any;
  completed: boolean = false;
  // private _: any;
  questionary: any;
  current: number;
  answers: any[] = [];
  scope: any;
  params: any
  event: any;
  rootScope: any;
  last: boolean;
  amountParamsVisible: boolean
  count = 0;
  constructor(
    public router: Router,
    private formBuilder: FormBuilder,
    modalRef: BsModalRef,
    private modalService: BsModalService,
    private userService: UserService,
    public route: ActivatedRoute,
    private questionaryService: QuestionaryService
  ) {}

  ngOnInit() {
    this.getMe();
    this.loadQuestionary();
    //this.handleLanguageChange();
  }

  openModal() {
    this.modalRef = this.modalService.show(this.template, {
      animated: true,
      backdrop: 'static',
    });
  }
  availablePoints(values:any ) {
    if (!this.questionary) {
      return 0;
    }
    return this.questionary['max_points'] - this.totalPoints(values);
  }

  totalPoints(values?: number[]): number {
    if (values === undefined) {
      values = this.answers;
    }
    return values.reduce(function (a, b) {
      return (a || 0) + (b || 0);
    }, 0);
  }

  next(): void {
    if (this.current < this.totalQuestions()) {
      this.postAnswers().subscribe(this.moveToNextQuestion, this.moveToNextQuestion);
    }
  }

  moveToNextQuestion(): void {
    this.current++;
    this.completed = this.current === this.totalQuestions();
    if (!this.completed) {
      if (this.currentQuestion().answered) {
        return this.moveToNextQuestion();
      }
      this.shuffleOptions();
      this.answers = [];
      window.scrollTo(0, 0);
    }
  }
  shuffleOptions(): void {
    const question = this.currentQuestion();
    question.options = this._.shuffle(question.options);
  }
  get _(): any {
    return _;
  }

  totalQuestions(): number {
    if (!this.questionary) {
      return 0;
    }
    return this.questionary.questions.length;
  }

  postAnswers() {
    const question = this.currentQuestion();
    const options = question.options.map((option: any, index: any) => {
      const points = this.answers[index] || 0;
      return {
        uuid: option.uuid,
        points: points,
      };
    });
    const answer = {
      questionId: question.uuid,
      options: options,
    };
    return this.questionaryService.postAnswer(this.questionary.uuid, answer);
  }
  currentQuestion(): any {
    return this.questionary.questions[this.current];
  }
 
  increment(index: number): void {
    //debugger
    if (this.count < 22) {
      this.count++;
    }
  
    
    if (this.availablePoints('id') > 0) {
      this.answers[index] = (this.answers[index] || 0) + 1;
    }
  }

  decrement(index: number): void {
    if (this.count > 0) {
      this.count--;
    }
   
    if (this.availablePoints('id') < this.questionary.max_points) {
      this.answers[index] = (this.answers[index] || 0) - 1;
    }
  }

  loadQuestionary() {
   this.questionaryService.getAll(this.user, this.params).subscribe((questionaries: string | any[]) => {
     this.current = 0;
    //   if (questionaries.length > 0) {
    //     const questionary = questionaries[0];
    //     this.applyAnswers(questionary.uuid, questionary.questions).then(questions => {
    //       if (questions.every(this.isNotAnswered)) {
    //         this.openModal();
    //       }
    //       questionary.questions = questions;
    //       this.questionary = questionary;
    //       this.shuffleOptions();
    //       this.addGuards();
    //       if (this.currentQuestion().answered) {
    //         this.moveToNextQuestion();
    //       }
    //     });
    //     console.debug('Loaded questionary', this.questionary);
    // } else {
    //   this.questionary = null;
    // }
      } 
  )}

  applyAnswers(questionaryId: number, questions: any[]) {
    this.questionaryService.getAnswers(questionaryId).subscribe((answers: any) => {
      questions.map(question => {
        const answer = _.find(answers, { uuid: question.uuid });
        question.answered = answer !== undefined && answer.options && answer.options.length > 0;
        return question;
      });
    });
  }

  addGuards(){

  }
  // handleLanguageChange(): void {
  //   const langListener = this.rootScope.on('lang:change', () => {
  //     this.loadQuestionary();
  //   });
  //   this.scope.on((destroyed:any, ) => {
  //     langListener(); // stop listening
  //   });
  // }
   isNotAnswered(question:any): boolean {
    return !question.answered;
  }

  
  hasQuestionId(uuid: string) {
    return function(answer: any) {
      return answer.questionId === uuid;
    };
  }
  
  getMe() {
    this.userService.getMe().subscribe((res: any) => {
      this.user = res;
      this.organization = res.company;
      this.getOrganization();
      this.getUserQuestionaries();
    //  this.openModal();
    });
  }
  getOrganization() {
    this.userService.getOrganization(this.organization).subscribe((res) => {});
  }

  getUserQuestionaries() {
    this.userService
      .getUserQuestionaries(this.organization)
      .subscribe((res) => {
        this.questionary = res[0].questions[0];
        console.log(this.questionary,"ques.....")
      });
  }
 

  isNegative(value: number): boolean {
    return value < 0;
  }
}
