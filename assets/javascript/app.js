
$(document).ready(function () {

    // event listeners
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

    // 
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
        // reinitialize the games results back to zero and clear the timer!
        trivia.currentSet = 0;
        trivia.correct = 0;
        trivia.incorrect = 0;
        trivia.unanswered = 0;
        clearInterval(trivia.timerId);

        // Using Jquery to show the game contentsshow game section
        $('#game').show();

        //  make the last results empty out of the box
        $('#results').html('');

        // Using Jquery to show the timer and make it appear in the correct div.
        $('#timer').text(trivia.timer);

        // once the game has started remove the start button.
        $('#start').hide();

        $('#remaining-time').show();

        // ask first question
        trivia.nextQuestion();

    },
    // method to loop through and display questions and options 
    nextQuestion: function () {

        // set timer to 20 seconds each question
        trivia.timer = 10;
        $('#timer').removeClass('last-seconds');
        $('#timer').text(trivia.timer);

        // to prevent timer speed up
        if (!trivia.timerOn) {
            trivia.timerId = setInterval(trivia.timerRunning, 1000);
        }

        // gets all the questions then indexes the current questions
        var questionContent = Object.values(trivia.questions)[trivia.currentSet];
        $('#question').text(questionContent);

        // an array of all the user options for the current question
        var questionOptions = Object.values(trivia.options)[trivia.currentSet];

        // creates all the trivia guess options in the html
        $.each(questionOptions, function (index, key) {
            $('#options').append($('<button class="option btn btn-info btn-lg">' + key + '</button>'));
        })

    },
    // method to decrement counter and count unanswered if timer runs out
    timerRunning: function () {
        // if timer still has time left and there are still questions left to ask
        if (trivia.timer > -1 && trivia.currentSet < Object.keys(trivia.questions).length) {
            $('#timer').text(trivia.timer);
            trivia.timer--;
            if (trivia.timer === 4) {
                $('#timer').addClass('last-seconds');
            }
        }
        // the time has run out and increment unanswered, run result
        else if (trivia.timer === -1) {
            trivia.unanswered++;
            trivia.result = false;
            clearInterval(trivia.timerId);
            resultId = setTimeout(trivia.guessResult, 1000);
            $('#results').html('<h3>Out of time! The answer was ' + Object.values(trivia.answers)[trivia.currentSet] + '</h3>');
        }
        // if all the questions have been shown end the game, show results
        else if (trivia.currentSet === Object.keys(trivia.questions).length) {

            // adds results of game (correct, incorrect, unanswered) to the page
            $('#results')
                .html('<h3>Thank you for playing!</h3>' +
                    '<p>Correct: ' + trivia.correct + '</p>' +
                    '<p>Incorrect: ' + trivia.incorrect + '</p>' +
                    '<p>Unaswered: ' + trivia.unanswered + '</p>' +
                    '<p>Please play again!</p>');

            // hide game sction
            $('#game').hide();

            // show start button to begin a new game
            $('#start').show();
        }

    },
    // method to evaluate the option clicked
    guessChecker: function () {

        // timer ID for gameResult setTimeout
        var resultId;

        // the answer to the current question being asked
        var currentAnswer = Object.values(trivia.answers)[trivia.currentSet];

        // if the text of the option picked matches the answer of the current question, increment correct
        if ($(this).text() === currentAnswer) {
            // turn button green for correct
            $(this).addClass('btn-success').removeClass('btn-info');

            trivia.correct++;
            clearInterval(trivia.timerId);
            resultId = setTimeout(trivia.guessResult, 1000);
            $('#results').html('<h3>Correct Answer!</h3>');
        }
        // else the user picked the wrong option, increment incorrect
        else {
            // turn button clicked red for incorrect
            $(this).addClass('btn-danger').removeClass('btn-info');

            trivia.incorrect++;
            clearInterval(trivia.timerId);
            resultId = setTimeout(trivia.guessResult, 1000);
            $('#results').html('<h3>Better luck next time! ' + currentAnswer + '</h3>');
        }

    },
    // method to remove previous question results and options
    guessResult: function () {

        // increment to next question set
        trivia.currentSet++;

        // remove the options and results
        $('.option').remove();
        $('#results h3').remove();

        // begin next question
        trivia.nextQuestion();

    }

}