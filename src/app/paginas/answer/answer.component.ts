import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AnswerI } from 'src/app/models/answer-i';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ServiceService } from 'src/app/Service/service.service';
import { AnswerService } from 'src/app/Service/answer.service';

@Component({
  selector: 'app-answer',
  templateUrl: './answer.component.html',
  styleUrls: ['./answer.component.css'],
  providers: [MessageService],
})
export class AnswerComponent implements OnInit {
  public form: FormGroup = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(10)]],
    rating: ['', []],
  });

  @Input() item: any;
  userLogged = this.authService.getUserLogged();
  constructor(
    private modalService: NgbModal,
    private answerService: AnswerService,
    private toastr: ToastrService,
    private route: Router,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    public authService: ServiceService
  ) {}

  answer: AnswerI = {
    userId: '',
    questionId: '',
    answer: '',
    position: 0,
  };

  ngOnInit(): void {}

  openVerticallyCentered(content: any) {
    this.modalService.open(content, { centered: true });
  }

  saveAnswer(): void {
    this.answer.questionId = this.item.id;
    this.authService.getUserLogged().subscribe({
      next: (value) => {
        this.answer.userId = value?.email ? value.email : '';
        this.answerService.saveAnswer(this.answer).subscribe({
          next: (v) => {
            if (v) {
              this.modalService.dismissAll();
              this.messageService.add({
                severity: 'success',
                summary: 'Se ha agregado la respuesta',
              });
              setTimeout(() => {
                window.location.reload();
              }, 1000);
            }
          },
          error: () =>
            this.messageService.add({
              severity: 'error',
              summary: 'Rectifique los datos',
              detail: '(Campos Vacios)-Intente de Nuevo',
            }),
          complete: () => console.info('complete'),
        });
      },
      error: (error) => console.log(error),
    });
  }
}
