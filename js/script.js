//seleccion de todos los elementos requeridos
const start_btn = document.querySelector(".start_btn button");
const info_box = document.querySelector(".info_box");
const exit_btn = info_box.querySelector(".buttons .quit");
const continue_btn = info_box.querySelector(".buttons .restart");
const quiz_box = document.querySelector(".quiz_box");
const result_box = document.querySelector(".result_box");
const option_list = document.querySelector(".option_list");
const time_line = document.querySelector("header .time_line");
const timeText = document.querySelector(".timer .time_left_txt");
const timeCount = document.querySelector(".timer .timer_sec");

//si el boton iniciar hace click
start_btn.onclick = ()=>{
    info_box.classList.add("activeInfo"); //ver cuadro info
}

//si el boton salir hace click
exit_btn.onclick = ()=>{
    info_box.classList.remove("activeInfo"); //ocultar cuadro info
}

//si el boton continuar hace click
continue_btn.onclick = ()=>{
    info_box.classList.remove("activeInfo"); //ocultar cuadro info
    quiz_box.classList.add("activeQuiz"); //ver cuadro info
    showQuetions(0); //llamar a mostrar preguntas funcion
    queCounter(1); //pasando un parametro al contador
    startTimer(30); //llamar tiempo de arranque
    startTimerLine(0); //llamando linea de tiempo inicial 
}

let timeValue =  30;
let que_count = 0;
let que_numb = 1;
let userScore = 0;
let counter;
let counterLine;
let widthValue = 0;

const restart_quiz = result_box.querySelector(".buttons .restart");
const quit_quiz = result_box.querySelector(".buttons .quit");

//si el boton repetir hace click 
restart_quiz.onclick = ()=>{
    quiz_box.classList.add("activeQuiz"); //mostrar cuadro de preguntas
    result_box.classList.remove("activeResult"); //ocultar cuadro de preguntas
    timeValue = 30; 
    que_count = 0;
    que_numb = 1;
    userScore = 0;
    widthValue = 0;
    showQuetions(que_count); //llamar mostrar preguntas funcion
    queCounter(que_numb); //pasar valor numerico al contador
    clearInterval(counter); //borrar contador
    clearInterval(counterLine); //borrar contador linea
    startTimer(timeValue); //llamar tiempo entumecido
    startTimerLine(widthValue); //llamar tiempo inicial linea
    timeText.textContent = "t/s="; //cambiar texto deltiempo a la izquierda
    next_btn.classList.remove("show"); //ocultar el boton siguiente
}

// si el boton salir hace click
quit_quiz.onclick = ()=>{
    window.location.reload(); //volver a cargar la ventana actual 
}

const next_btn = document.querySelector("footer .next_btn");
const bottom_ques_counter = document.querySelector("footer .total_que");

// si el boton siguiente hace click
next_btn.onclick = ()=>{
    if(que_count < questions.length - 1){ //si recuento de preguntas es menor que longitud total de preguntas
        que_count++; //incremento del valor contador
        que_numb++; //aumentar el valor entumecido
        showQuetions(que_count); //llamaar mostrar preguntas
        queCounter(que_numb); //pasar valor entumecido al contador
        clearInterval(counter); //borrar contador
        clearInterval(counterLine); //borrar contador linea
        startTimer(timeValue); //llamar tiempo entumecido
        startTimerLine(widthValue); //llamar temporiador linea de inicio
        timeText.textContent = "t/s="; //cambiar texto del tiempo a la izquierda
        next_btn.classList.remove("show"); //ocultar el boton siguiente
    }else{
        clearInterval(counter); //borrar contador
        clearInterval(counterLine); //borrar contador linear
        showResult(); //llamar funsion resultado 
    }
}

// getting questions and options from array
function showQuetions(index){
    const que_text = document.querySelector(".que_text");

    //creating a new span and div tag for question and option and passing the value using array index
    let que_tag = `<span>${questions[index].numb}${':) '}${questions[index].question}</span>`;
    let option_tag = `<div class="option"><span><span id='literal'>A.</span>${questions[index].options[0]}</span></div>`
                   + `<div class="option"><span><span id='literal'>B.</span>${questions[index].options[1]}</span></div>`
                   + `<div class="option"><span><span id='literal'>C.</span>${questions[index].options[2]}</span></div>`
                   + `<div class="option"><span><span id='literal'>D.</span>${questions[index].options[3]}</span></div>`;

    que_text.innerHTML = que_tag; //adding new span tag inside que_tag
    option_list.innerHTML = option_tag; //adding new div tag inside option_tag
    
    const option = option_list.querySelectorAll(".option");

    // set onclick attribute to all available options
    for(i=0; i < option.length; i++){
        option[i].setAttribute("onclick", "optionSelected(this)");
    }
}
// creating the new div tags which for icons
let tickIconTag = '<div class="icon tick"><i class="fas fa-check"></i></div>';
let crossIconTag = '<div class="icon cross"><i class="fas fa-times"></i></div>';

//if user clicked on option
function optionSelected(answer){
    clearInterval(counter); //clear counter
    clearInterval(counterLine); //clear counterLine
    let userAns = answer.textContent; //getting user selected option
    let correcAns = questions[que_count].answer; //getting correct answer from array
    const allOptions = option_list.children.length; //getting all option items
    
    if(userAns == correcAns){ //if user selected option is equal to array's correct answer
        userScore += 1; //upgrading score value with 1
        answer.classList.add("correct"); //adding green color to correct selected option
        answer.insertAdjacentHTML("beforeend", tickIconTag); //adding tick icon to correct selected option
        console.log("Correct Answer");
        console.log("Your correct answers = " + userScore);
    }else{
        answer.classList.add("incorrect"); //adding red color to correct selected option
        answer.insertAdjacentHTML("beforeend", crossIconTag); //adding cross icon to correct selected option
        console.log("Wrong Answer");

        for(i=0; i < allOptions; i++){
            if(option_list.children[i].textContent == correcAns){ //if there is an option which is matched to an array answer 
                option_list.children[i].setAttribute("class", "option correct"); //adding green color to matched option
                option_list.children[i].insertAdjacentHTML("beforeend", tickIconTag); //adding tick icon to matched option
                console.log("Auto selected correct answer.");
            }
        }
    }
    for(i=0; i < allOptions; i++){
        option_list.children[i].classList.add("disabled"); //once user select an option then disabled all options
    }
    next_btn.classList.add("show"); //show the next button if user selected any option
}

function showResult(){
    info_box.classList.remove("activeInfo"); //hide info box
    quiz_box.classList.remove("activeQuiz"); //hide quiz box
    result_box.classList.add("activeResult"); //show result box
    const scoreText = result_box.querySelector(".score_text");
    if (userScore > 6){ // if user scored more than 3
        //creating a new span tag and passing the user score number and total question number
        let scoreTag = `<p green><span> Felicidades! 🎉, tienes  ${userScore} sobre ${questions.length} </span> <br> APROBASTE SIGUE ADELANTE!!</p>`;
        scoreText.innerHTML = scoreTag;  //adding new span tag inside score_Text
        result_box.classList.add('green');
        result_box.classList.remove('red');
        
    }
    else if(userScore > 3){ // if user scored more than 1
        let scoreTag = `<p><span> Muy bien! 🎉, tienes  ${userScore} sobre ${questions.length} </span> <br> APROBASTE SIGUE ADELANTE!!</P>`;
        scoreText.innerHTML = scoreTag;
        result_box.classList.add('green');
        result_box.classList.remove('red');
    }
    else{ // if user scored less than 1
        let scoreTag = `<p><span> Losiento! 😐, solo tienes  ${userScore} sobre ${questions.length} </span> <br> REPROVASTE SIGUE ADELANTE!!</P>`;
        scoreText.innerHTML = scoreTag;
        result_box.classList.add('red');
        result_box.classList.remove('green');
    }
}

function startTimer(time){
    counter = setInterval(timer, 1000);
    function timer(){
        timeCount.textContent = time; //changing the value of timeCount with time value
        time--; //decrement the time value
        if(time < 9){ //if timer is less than 9
            let addZero = timeCount.textContent; 
            timeCount.textContent = "0" + addZero; //add a 0 before time value
        }
        if(time < 0){ //if timer is less than 0
            clearInterval(counter); //clear counter
            timeText.textContent = "t/x="; //change the time text to time off
            const allOptions = option_list.children.length; //getting all option items
            let correcAns = questions[que_count].answer; //getting correct answer from array
            for(i=0; i < allOptions; i++){
                if(option_list.children[i].textContent == correcAns){ //if there is an option which is matched to an array answer
                    option_list.children[i].setAttribute("class", "option correct"); //adding green color to matched option
                    option_list.children[i].insertAdjacentHTML("beforeend", tickIconTag); //adding tick icon to matched option
                    console.log("Time Off: Auto selected correct answer.");
                }
            }
            for(i=0; i < allOptions; i++){
                option_list.children[i].classList.add("disabled"); //once user select an option then disabled all options
            }
            next_btn.classList.add("show"); //show the next button if user selected any option
        }
    }
}

function startTimerLine(time){
    counterLine = setInterval(timer, 32);
    function timer(){
        time += 0.32; //valoracion del valor del tiempo de actualizacion 0.32
        time_line.style.width = time + "px"; //aumento de la anchura de la linea px del tomo por valor del tiempo
        if(time > 320){ //si valor de tiempo es mayor que 320
            clearInterval(counterLine); //borrar linea contador o contraria
        }
    }
}

function queCounter(index){
    //creating a new span tag and passing the question number and total question
    let totalQueCounTag = `<span><p>${index}</p> de <p>${ questions.length}</p> Preguntas</span>`;
    bottom_ques_counter.innerHTML = totalQueCounTag;  //adding new span tag inside bottom_ques_counter
}