import { Component, OnInit, ViewChild } from '@angular/core';
import { from, fromEvent, interval, Observable, Subscription, Subject, timer } from 'rxjs';
import { map, delay, filter, tap, take, first, last, debounceTime, takeWhile, takeUntil } from 'rxjs/operators';
import { MatRipple } from '@angular/material';

@Component({
  selector: 'app-operators',
  templateUrl: './operators.component.html',
  styleUrls: ['./operators.component.css']
})
export class OperatorsComponent implements OnInit {

  @ViewChild(MatRipple, {static:false}) ripple: MatRipple;
  private searchInput:string = '';

  constructor() { }

  ngOnInit() {
  }

  mapClick(){
    from([1,2,3,4,5,6,7])
    .pipe(
      map(i => 2 * i),
      map(i => 10 * i),
      delay(1000)
    )
    .subscribe(i => console.log(i))

    fromEvent(document, 'click')
    .pipe(
      map((e: MouseEvent) => ({x:e.screenX, y:e.screenY}))
    )
    .subscribe((pos) => console.log(pos))
  }

  filterClick() {
    from([1,2,3,4,5,6,7])
    .pipe(
      filter(i => i % 2 == 1)
    )
    .subscribe(i => console.log(i))

    interval(1000)
    .pipe(
      filter(i => i % 2 == 0),
      map(i => 'Value: ' + i)
    )
    .subscribe(i => console.log(i))
  }

  tapClick() {
    interval(1000)
    .pipe(
      tap(i => console.log('')),
      tap(i => console.warn('Before filtering: ', i)),
      filter(i => i % 2 == 0),
      tap(i => console.warn('After filtering: ', i)),
      map(i => 'Value: ' + i),
      tap(i => console.warn('After map: ', i)),
    )
    .subscribe(i => console.log(i))
  }

  takeClick(){
    const observable = new Observable((observer) => {
      let i;
      for(i=0;i < 20;i++){
        setTimeout(() => observer.next(Math.floor(Math.random() * 100)), i * 100);
      }
      setTimeout( () => observer.complete, i * 100 );
    });

    const s:Subscription = observable
    .pipe(
      tap(i => console.log(i)),
      //take(10)
      //first()
      //last()
    )
    .subscribe(
      v => console.log('Output: ', v),
      (error) => console.log(error),
      () => console.log('Complete!')
    )

    const interv = setInterval(() => {
      console.log('Checking...');
      if(s.closed){
        console.warn('Subscription CLOSED!');
        clearInterval(interv);
      }
    }, 200)
  }

  launchRipple() {
    const rippleRef = this.ripple.launch({
      persistent: true, centered: true
    });

    rippleRef.fadeOut();
  }

  debounceTimeClick(){
    fromEvent(document, 'click')
    .pipe(
      tap((e) => console.log('Click')),
      debounceTime(1000)
    )
    .subscribe(
      (e:MouseEvent) => {
         console.log('Click with debounceTime', e)
         this.launchRipple()
      }
    )
  }

  searchEntry$:Subject<string> = new Subject<string>();

  searchBy_UsingDebounce(event){
    this.searchEntry$.next(this.searchInput);
  }

  debounceTimeSearchClick() {
    this.searchEntry$
    .pipe(debounceTime(300))
    .subscribe((s) => console.log(s))
  }

  takeWhileClick() {
    interval(500)
    .pipe( takeWhile((value, index) => (value < 5)) )
    .subscribe(
      (i) => console.log('takeWhile: ', i),
      (error) => console.log(error),
      () => console.log('Completed!')
    );
  }

  takeUntilClick() {

    let duetime$ = timer(500);

    interval(500)
    .pipe( takeUntil(duetime$) )
    .subscribe(
      (i) => console.log('takeWhile: ', i),
      (error) => console.log(error),
      () => console.log('Completed!')
    );
  }

}
