// GET ITEMS FROM HTML
let sum = document.querySelector('.sum');
let but = document.querySelector('.button');
let load = document.querySelector('.loading');
let scor = document.querySelector('.score');
let curSpeed = document.querySelector('.curSpeed');
let spUpdCost = document.querySelector('.spUpdCost');
let curNum = document.querySelector('.curNum');
let numUpdCost = document.querySelector('.numUpdCost');
let spdBt = document.querySelector('.spdBt');
let numBt = document.querySelector('.numBt');
let blocks = document.querySelectorAll('.block');

//INIT SOME VARIABLES
let fieldblock = [];
let arr = [];
let a = [];
let b = [];

//COLORS
let colors = {
    1: 'FD8A8A', 2: 'F1F7B5', 3: 'A8D1D1', 4: '9EA1D4',
    5: '243763', 6: 'FF6E31', 7: 'FFEBB7', 8: 'AD8E70',
    9: 'C0EEE4', 10: 'F8F988', 11: 'FFCAC8', 12: 'FF9E9E',
    13: 'FFFBEB', 14: '495579', 15: '263159', 16: '251749',
    17: '00FFF6', 18: '00E7FF', 19: '009EFF', 20: '0014FF',
}

//GET ITEMS FROM LOCALSTORAGE
let score = +localStorage.getItem('score') || 0;
let summ = +localStorage.getItem('sum') || 0
let time = +localStorage.getItem('time') || 70;
let cost1 = +localStorage.getItem('cost1') || 4500;
let cost2 = +localStorage.getItem('cost2') || 4500;
let currNum = +localStorage.getItem('currNum') || 1;
let state = +localStorage.getItem('state') || 0;

//SET STARTS STATE TO VARIABLES
scor.textContent = `Score: ${numToRead(score)}`;
sum.textContent = `Sum: ${numToRead(summ)}`;
curNum.textContent = numToRead(currNum);
numUpdCost.textContent = numToRead(cost1);
curSpeed.textContent = time/10 + 's'
spUpdCost.textContent = numToRead(cost2);
let color = '#ff0ff0';
let field = [
    [0,0,0,0],
    [0,0,0,0],
    [0,0,0,0],
    [0,0,0,0],
    [0,0,0,0],
    [0,0,0,0],
];

if (localStorage.getItem('field')){
    let help = localStorage.getItem('field').split(',');
    for(let i = 0; i<6;i++){
        for (let j = 0; j<4; j++){
        field[i][j] = help[i*4+j];
        }
    }
}

for (let block of blocks) {
    arr.push(block);
}

for (let block of blocks) {
    block.onclick = function () {
        if (a.length===0) {
            a.push(arr.indexOf(block));
            a.push(+field[(Math.floor(+a[0]/4))][a[0]%4]);
            a.push('a');
            block.classList.add('active');
        }
        else if (b.length===0  && arr.indexOf(block)!==a[0]){
            b.push(arr.indexOf(block))
            b.push(+field[(Math.floor(+b[0]/4))][b[0]%4]);
            b.push('b');
            if (a[1]===b[1]){
                arr[b[0]].textContent = +b[1]*2===0 ? '' : +b[1]*2;
                arr[a[0]].textContent = '';
                field[Math.floor(b[0]/4)][b[0]%4]=+b[1]*2
                field[Math.floor(a[0]/4)][a[0]%4]=0
                arr[a[0]].classList.remove('active');
                a = [];
                b = [];
                draw();
            }else {
                [arr[a[0]].textContent,arr[b[0]].textContent]=[arr[b[0]].textContent,arr[a[0]].textContent];
                [field[Math.floor(b[0]/4)][b[0]%4],field[Math.floor(a[0]/4)][a[0]%4]] = [field[Math.floor(a[0]/4)][a[0]%4],field[Math.floor(b[0]/4)][b[0]%4]];
                arr[a[0]].classList.remove('active');
                a = [];
                b = [];
                draw();
            }
        }else if (a.length!==0 && b.length===0 && arr.indexOf(block)===a[0]) {
            arr[a[0]].classList.remove('active');
                a = [];
                b = [];
        }
    }
}

function numToRead(num) {
    let arr = String(num).split('');
    let time = '';
    let res = '';
    for (let i = 1; i<=arr.length; i++){
        time = arr[arr.length-i];
        res = time+res;
        if (i%3===0){
            time = ','
            res = time+res;
        }
    }
    if (res[0]===','){
        res = res.split('').splice(1).join('');
    }
    return res;
}

for (let i = 0; i<6 ; i++) {
    fieldblock[i] = [];
    for (let j = 0; j<4; j++) {
        fieldblock[i][j] = blocks[i*4+j];
    }
}

function currentSum() {
    res = 0
    for (let i = 0; i<6 ; i++) {
        for (let j = 0; j<4; j++) {
            res+=+field[i][j];
        }
    }
    return +res
}

function scoreupdate(score, sum) {
    return score + sum
}

numBt.onclick = function () {
    check = buying(score,cost1);
    if (check){
        score = score-cost1;
        cost1=Math.round(cost1*3.7);
        for(let i = 0; i<field.length; i++){
            for(let j = 0; j< field[0].length; j++){
               if (field[i][j]<=+currNum){
                field[i][j]*=2;
               }
            }
        }
        draw();
        currNum*=2;
        curNum.textContent = numToRead(currNum);
        numUpdCost.textContent = numToRead(cost1);
    }
}

spdBt.onclick = function () {
    check = buying(score,cost2);
    if (check){
        score = score-cost2;
        cost2=Math.round(cost2*3.4);
        time--;
        curSpeed.textContent = time/10 + 's'
        spUpdCost.textContent = numToRead(cost2);
    }
}

function buying(score,cost) {
    if (score>=cost){
        return true;
    }
    else return false;
}

function getPow(int) {
    res = 0
    temp = int
    while (temp > 1) {
        temp /= 2
        res += 1
    }
    return res
}

function draw () {
    for (let i = 0; i<6 ; i++) {
        for (let j = 0; j<4; j++) {
            if (field[i][j]!=0)
            if (+field[i][j]>999999999){
                fieldblock[i][j].textContent = (field[i][j]/1000000).toFixed(0) + 't';
                fieldblock[i][j].style.fontSize = 0.75+'em';
                fieldblock[i][j].style.backgroundColor = `#${colors[getPow(field[i][j])%20]}`
            }else if (+field[i][j]>999999) {
                fieldblock[i][j].textContent = (field[i][j]/1000000).toFixed(0) + 'm';
                fieldblock[i][j].style.fontSize = 0.75+'em';
                fieldblock[i][j].style.backgroundColor = `#${colors[getPow(field[i][j])%20+1]}`
            }else if (+field[i][j]>999){
                fieldblock[i][j].textContent = (field[i][j]/1000).toFixed(0) + 'k';
                fieldblock[i][j].style.fontSize = 0.75+'em';
                fieldblock[i][j].style.backgroundColor = `#${colors[getPow(field[i][j])%20+1]}`
            }else{
                fieldblock[i][j].textContent = field[i][j];
                fieldblock[i][j].style.fontSize = 1+'em';
                fieldblock[i][j].style.backgroundColor = `#${colors[getPow(field[i][j])%20+1]}`
            }  
            else{
                fieldblock[i][j].textContent = ''
                fieldblock[i][j].style.backgroundColor = `#fff`
            }
        }
    }
}
draw();

function crColor(num) {
    arr = String(num).split('');
    arr.length = 6;
    res = '#';
    for (let i = 1; i<7; i++){
        if (arr[arr.length-i]) {
            res+=arr[arr.length-i];
        }else {
            res+='0';
        }
    }
    return res;
}

function spawn () {
    start:
    for (let i = 0; i<6 ; i++) {
        for (let j = 0; j<4; j++) {
            if (field[i][j]==0) {
                field[i][j]=currNum;
                break start;
            }
        }
    }
}

function State () {
    this.state = state;
}

State.prototype.inc = function () {
    this.state++;
    this.update();
}

State.prototype.click = function () {
    this.state += 5;
    this.update();
}

State.prototype.update = function () {
    while (this.state>100) {
        this.state-=100;
        spawn();
        draw();
    }
}

let states = new State();
states.click();

but.onclick = () => {
    states.click();
}

setInterval(() => {
    load.style.background = `linear-gradient(to right, ${color} ${states.state}%, transparent ${states.state+2}%)`;
    states.inc();
    localStorage.setItem('field',field);
    localStorage.setItem('score',score);
    localStorage.setItem('state',states.state);
    localStorage.setItem('currNum',currNum);
    localStorage.setItem('cost1',cost1);
    localStorage.setItem('cost2',cost2);
    localStorage.setItem('time',time);
    localStorage.setItem('sum', currentSum());
    
},time);
setInterval(() => {
    score = scoreupdate(score, currentSum());
    sum.textContent = `Sum: ${numToRead(currentSum())}`;
    scor.textContent = `Score: ${numToRead(score)}`;
},1000)