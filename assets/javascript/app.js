$(document).ready(function () {
    $("#remaining-time").hide();
    $("#start").on('click', trivia.startGame);
    $(document).on('click', '.option', trivia.guessChecker);
})
var trivia = {
    // set the properties of the game for number of correct, incorrect, unanswered, as well as the timer.
    correct: 0,
    incorrect: 0,
    unanswered: 0,
    currentSet: 0,
    timer: 20,
    timerOn: false,
    timerId: '',
    // The trivia questions to be displayed in the jumbotron!
    questions: {
        q1: 'What is the only mammal that can truly fly?',
        q2: 'Ice hockey pucks are made from what material??',
        q3: 'The headquarters of the United Nations is in what city?',
        q4: 'In the game of chess, how many pawns does each player start with?',
        q5: "Tenochtitlan, founded in 1324, is now known as what city?",
        q6: 'Located in southern Siberia, what lake is the deepest and largest freshwater lake in the world?',
        q7: "The Bill of Rights contains how many of the first amendments to the United States Constitution?",
        q8: "What is the tallest mountain in South America?",
        q9: "What is the world’s largest coral reef system?",
        q10: "Atlantis, Paradise Island is a famous resort located on which country’s coral based archipelago?"
    },
    // The possible answers to the trivia questions to be displayed immediately below the question.
    options: {
        q1: ['bat', 'howler monkey', 'bird', 'dog'],
        q2: ['my soul', 'vulcanized rubber', 'iron', 'elephant tusk'],
        q3: ['Toledo', 'Atlanta', 'New York', 'Philadelphia'],
        q4: ['7', '9', '10', '8'],
        q5: ['El Paso', 'Tijuana', 'Mexico City', 'Jamestown'],
        q6: ['Lake Erie', 'Lake Victoria', 'Lake Michigan', 'Lake Baikal'],
        q7: ['ten', 'twelve', 'thirteen', 'four'],
        q8: ['Mount Olympus', 'Mount Everest', 'Mount Aconcagua', 'K2'],
        q9: ['Apo Reef', 'Amazon Reef', 'The Great Barrier Reef', 'Mesoamerican Reef'],
        q10: ['Haiti', 'Japan', 'India', 'The Bahamas']
    },
    //answers to the multiple choice qustions. These answers will be displayed if the question is answered wrong or if left unanswered.
    answers: {
        q1: 'bat',
        q2: 'vulcanized rubber',
        q3: 'New York',
        q4: '8',
        q5: 'Mexico City',
        q6: 'Lake Baikal',
        q7: 'ten',
        q8: 'Mount Aconcagua',
        q9: 'The Great Barrier Reef',
        q10: 'The Bahamas'
    },
    // Start the game by pushing the button!
    startGame: function () {
        // initialize the games results back to zero and clear the timer!
        trivia.currentSet = 0;
        trivia.correct = 0;
        trivia.incorrect = 0;
        trivia.unanswered = 0;
        clearInterval(trivia.timerId);
        // Using Jquery to show the game contents in the game section of the jumbotron
        $('#game').show();
        //  make the last results empty out of the box
        $('#results').html('');
        // Use Jquery to show the timer and make it appear in the correct div.
        $('#timer').text(trivia.timer);
        // once the game has started remove the start button.
        $('#start').hide();
        //And show the remaining time for the user to guess at the question.
        $('#remaining-time').show();
        // calling the function for the next question to appear.
        trivia.nextQuestion();
    },
        // function for trivia questions to appear one after the other. 
    nextQuestion: function () {
        // initiate the timer for each question- 15 seconds per question.
        trivia.timer = 15;
        $('#timer').removeClass('last-seconds');
        $('#timer').text(trivia.timer);
        // setting the interval on the timer to count down 1 second at a time.
        if (!trivia.timerOn) {
            trivia.timerId = setInterval(trivia.timerRunning, 1000);
        }
        // variable to obtain all of the questions
        var questionContent = Object.values(trivia.questions)[trivia.currentSet];
        // place the question into the div for the question content.
        $('#question').text(questionContent);
        // create an array for the multiple choice answers so that the user can answer the currently displayed question.
        var questionOptions = Object.values(trivia.options)[trivia.currentSet];
        // creates each possible answer as an html button.
        $.each(questionOptions, function (index, key) {
            $('#options').append($('<button class="option btn btn-info btn-lg">' + key + '</button>'));
        })
    },
    // Now a function to decrease the timer at 1 second while the user is attempting to answer the question.
    // If the timer runs out while the user is attempting to guess this function will also log the answer as unanswered.
    timerRunning: function () {
        if (trivia.timer > -1 && trivia.currentSet < Object.keys(trivia.questions).length) {
            $('#timer').text(trivia.timer);
            trivia.timer--;
            if (trivia.timer === 4) {
                $('#timer').addClass('last-seconds');
            }
        }
        else if (trivia.timer === -1) {
            trivia.unanswered++;
            trivia.result = false;
            clearInterval(trivia.timerId);
            resultId = setTimeout(trivia.guessResult, 1000);
            $('#results').html('<h3>You fool! You have run out of time! The answer was ' + Object.values(trivia.answers)[trivia.currentSet] + '</h3>');
        }
        else if (trivia.currentSet === Object.keys(trivia.questions).length) {
            // The results of the game aggregated and displayed to the results div once the game has been completed.
            $('#results')
                .html('<h3>Not bad... </h3>' +
                    '<p>Questions correctly answered: ' + trivia.correct + '</p>' +
                    '<p>Questions incorrectly answered: ' + trivia.incorrect + '</p>' +
                    '<p>Doh! Questions that you did not answer: ' + trivia.unanswered + '</p>' +
                    '<p>Play again??</p>');
            // once the results have been displayed and the game is complete, remove the game contents and then....
            $('#game').hide();
            // display the start button again so that user can play again.
            $('#start').show();
        }
    },
    // this function allows the game to match the user's answer and decide if it is correct or incorrect. 
    guessChecker: function () {
        var resultId;
        var currentAnswer = Object.values(trivia.answers)[trivia.currentSet];
        // if user's choice is correct, then log the status of the question.
        if ($(this).text() === currentAnswer) {
            // turn button green for correct
            $(this).addClass('btn-success').removeClass('btn-info');

            //increment the correct questions answered.
            trivia.correct++;
            clearInterval(trivia.timerId);
            resultId = setTimeout(trivia.guessResult, 1000);
            $('#results').html('<h3>Well done, my young padawan! You have chosen wisely!</h3>');
        }
        else {
            $(this).addClass('btn-danger').removeClass('btn-info');
            trivia.incorrect++;
            clearInterval(trivia.timerId);
            resultId = setTimeout(trivia.guessResult, 1000);
            $('#results').html('<h3>You fool! You answered incorrectly! The right answer was... ' + currentAnswer + '</h3>');
        }
    },
    // this function is to move on to the next question once the previous question has been attempted by the user...
    guessResult: function () {
        trivia.currentSet++;
        $('.option').remove();
        $('#results h3').remove();
        trivia.nextQuestion();

    }
}