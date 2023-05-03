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
  current = 0;
  answers: any[] = [];
  scope: any;
  params: any
  event: any;
  rootScope: any;
  last: boolean = false;
  amountParamsVisible: boolean
  count = 0;
  datacount:any;
  coursesPercentage: number;
  selectedCourses: any = {};
  pointCount = 22;
  progress = 0;
  maxPoint:any;
  nextQue:any;
  QuestionData:any;
  questions: any;
  nextBtn:boolean = true;
  boxes = [{
    label: 'course 1',
    id: 1
  },
  {
    label: 'course 2',
    id: 2
  },
  {
    label: 'course 3',
    id: 3
  },
  {
    label: 'course 4',
    id: 4
  }]
  QuizShow:boolean = false;
  constructor(
    public router: Router,
    private formBuilder: FormBuilder,
    modalRef: BsModalRef,
    private modalService: BsModalService,
    private userService: UserService,
    public route: ActivatedRoute,
    private questionaryService: QuestionaryService
  ) {
    setInterval(()=> {
      if(this.progress < 100){
        this.progress = this.progress;
      }
      else{
        this.progress = 0;
      }
    }, 100);
  }

  ngOnInit() {
    this.current = 0;
    this.getMe();
    //this.handleLanguageChange();
   //this.loadQuestionary();
  }

  selectCourse(coursId:any) {
    if (!!!coursId) return;
    this.selectedCourses[coursId] = !this.selectedCourses[coursId];
    const arr = _.toArray(this.selectedCourses);
    const trues = _.filter(arr, r => r === true).length;
    const arrLength = this.boxes.length;
    this.coursesPercentage = (trues / arrLength) * 100;
  }
 
  openModal() {
    this.modalRef = this.modalService.show(this.template, {
      animated: true,
      backdrop: 'static',
    });
   // this.getUserQuestionaries();
  }

  QuizStart(){
    this.modalRef.hide();
    this.QuizShow = true;
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

  decrement(index: number): void {
   if(this.availablePoints() < this.maxPoint){
      this.answers[index] = (this.answers[index] || 0) - 1;
    }
  }
  next(): void {
     this.getUserQuestionaries();
     this.availablePoints();
    //  if( this.current === 2){
    //    this.completed = true;
    //  }
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
    this.userService.postUserQuestionaryAnswer(userId,questionaryId, answer);
   //return this.userService.postUserQuestionaryAnswer(userId,questionaryId, answer);
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
            this.shuffleOptions();
           // this.addGuards();
           if(_.every(questions, this.isNotAnswered)){
               this.openModal();
           }
           //debugger
           this.questionary.questions = questions;
            //this.questionary = questionary;
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
    this.userService
      .getUserQuestionaries(this.user.uuid)
      .subscribe((res) => {
        if(res.length > 0){
           //this.QuestionData = res[0];
           this.questionary = res[0];
           this.maxPoint = res[0].max_points;
           var userId = this.user.uuid;
           var queId = res[0].uuid;
          this.applyAnswers(this.questionary.uuid, this.questionary.questions);
        }
        else{
          this.questionary = null;
        }
       // this.applyAnswers(queId,this.QuestionData.questions)
      });
  }
 
  isNegative(value: number): boolean {
    return value < 0;
  }
}
