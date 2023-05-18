import { Component, ElementRef,AfterViewInit, TemplateRef, ViewChild, Input } from '@angular/core';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { UserService } from 'app/services/user.service';
import * as _ from 'lodash';
import { QuestionaryService } from 'app/services/questionary.service';
import { Subscription } from 'rxjs';

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
  questionary: any;
  current = 0;
  answers: any[] = [];
  scope: any;
  params: any
  event: any;
  rootScope: any;
  amountParamsVisible: boolean
  count = 0;
  datacount:any;
  coursesPercentage: number;
  selectedCourses: any = {};
  progress = 0;
  maxPoint:any;
  nextQue:any;
  QuestionData:any;
  questions: any;
  nextBtn:boolean = true;
  modelShow:any ;
  closeResult: string;
  loadData :any;
  @ViewChild('content') content:any;
  //@Input() value: string;
  value: any;
  language:any;
  private subscription: Subscription;
  constructor(
    public router: Router,
    private formBuilder: FormBuilder,
     modalRef: BsModalRef,
    private modalService: BsModalService,
    private userService: UserService,
    public route: ActivatedRoute,
    private questionaryService: QuestionaryService,
    private modalservice: NgbModal
  ) {

  }

  ngOnInit() {
    this.getMe();
    this.subscription = this.userService.values$.subscribe(({ value1, value2 }) => {
      this.value = value1;
      this.language = value2;
      this.getMe();
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

 
  openModal(){
    this.modalservice.open(this.content, { centered: true });
  }

  QuizStart(){
    this.modalRef.hide();
  }
  
  availablePoints(values?:any) {
    if (!this.questionary) {
      return 0;
    }
    return this.maxPoint - this.totalPoints(values);
  }

  totalPoints(values?: number[]): number {
    if (values === undefined) {
      values = this.answers;
    }
    return values.reduce(function (a, b) {
      return (a || 0) + (b || 0);
    }, 0);
  }

  increment(index: number): void {
   if(this.availablePoints() > 0 ) {
    this.answers[index] = (this.answers[index] || 0) + 1;
    }
  }

  decrement(index: any): void {
   if(this.answers[index] > 0){
      if(this.availablePoints() < this.maxPoint){
        this.answers[index] = (this.answers[index] || 0) - 1;
      }
    }
  }

  next(): void {
    var uuid = localStorage.getItem("userId");
    var queId = localStorage.getItem("questionId");
    if (this.current < this.totalQuestions()) {
       this.postAnswers(uuid,queId);  
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
    }
  }

  shuffleOptions(): void {
    var question = this.currentQuestion();
    question.options = this._.shuffle(question.options);
  }
  
  get _(): any {
    return _;
  }

  totalQuestions() {
    if (!this.questionary) {
      return 0;
    }
    return this.questionary.questions.length;
  }


  postAnswers(userId:any, questionaryId:any) {
    var question = this.currentQuestion();
    var options = question.options.map((option: any, index: any) => {
      var points = this.answers[index] || 0;
      return {
        uuid: option.uuid,
        points: points,
      };
    });
    var answer = {
      questionId: question.uuid,
      options: options,
    };
   
   this.userService.postUserQuestionaryAnswer(userId, questionaryId, answer).subscribe((res: any) => {
       //this.getUserQuestionaries();
       window.location.reload();
   } )
  }

  currentQuestion(){
   localStorage.setItem("userId",this.user.uuid);
   localStorage.setItem("questionId",this.questionary.uuid)
    return this.questionary.questions[this.current]; 
  }
 
  applyAnswers(questionaryId: number, questions:any) {
    var userId = this.user.uuid;
    this.userService.getUserQuestionaryAnswers(questionaryId,userId).subscribe((answers: any) => {
      questions.map((question:any) => {
        var answer = _.find(answers, this.hasQuestionId(question.uuid));
        question.answered = answer !== undefined && answer.options && answer.options.length > 0;
        localStorage.setItem("aaa",question.answered);
           this.shuffleOptions();
           this.addGuards();
             if(_.every(questions,this.isNotAnswered)){
                if(question.text != 'Question 2' && question.text != 'Frage 2'){
                  this.openModal();
                } 
             }
            this.questionary.questions = questions;
             //this.questionary = question;
            if (this.currentQuestion().answered) {
               this.moveToNextQuestion();
            }
       return question;
      });
    });
  }

  addGuards(){

  }
  
   isNotAnswered(question:any) {
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
    });
  }

  getOrganization() {
    this.userService.getOrganization(this.organization).subscribe((res) => {});
  }

  getUserQuestionaries() {
    this.current = 0;
    this.value
   
      this.userService
      .getUserQuestionaries(this.user.uuid,this.loadData)
      .subscribe((res) => {
        if(res.length > 0){
           this.QuestionData = res[0];
           this.questionary = res[0];
           this.maxPoint = res[0].max_points;
           var userId = this.user.uuid;
           var queId = res[0].uuid;
           this.applyAnswers(queId,this.QuestionData.questions);
        }
       else{
          this.questionary = null;
        }
      }
      );
  }
 
  isNegative(value: number): boolean {
    return value < 0;
  }
}
