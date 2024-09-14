//Author : Weizley Alexandre Lopes Manuel
//Description: A code typing game in javaScript
//Date: 26-08-2024


// Array of code snippets
const codeSnippets = [
  'for (let i = 0; i < 10; i++) {\n\tconsole.log("Number: " + i);\n}\n',
  'function greet(name) {\n\treturn "Hello, " + name + "!";\n}\n',
  'const numbers = [1, 2, 3, 4, 5];\nconst doubled = numbers.map(n => n * 2);\n',
  'if (isRaining) {\n\tconsole.log("Take an umbrella!");\n} else {\n\tconsole.log("No need for an umbrella.");\n}\n',
  'class Person {\n\tconstructor(name, age) {\n\t\tthis.name = name;\n\t\tthis.age = age;\n\t}\n\tgreet() {\n\t\tconsole.log("Hi, I am " + this.name);\n\t}\n}\n',
  'let sum = 0;\nfor (let i = 0; i < 100; i++) {\n\tsum += i;\n}\nconsole.log(sum);\n',
  'try {\n\tconsole.log("Trying something risky...");\n} catch (error) {\n\tconsole.error("An error occurred:", error);\n}\n',
  'const square = n => n * n;\nconsole.log(square(5));\n',
  'const promise = new Promise((resolve, reject) => {\n\tsetTimeout(() => resolve("Done!"), 1000);\n});\n',
  'document.querySelector("#button").addEventListener("click", () => {\n\talert("Button clicked!");\n});\n'
];

const snippetDescriptions = [
  'This snippet demonstrates a basic `for` loop in JavaScript that logs numbers from 0 to 9 to the console. It uses the `console.log` function to display each number along with a string label.',
  'This snippet defines a `greet` function that takes a `name` parameter and returns a greeting string that incorporates the name. The result is a personalized greeting message.',
  'This snippet creates an array of numbers and uses the `map` function to create a new array where each number is doubled. It showcases how to use the `map` method for transformation.',
  'This snippet demonstrates a conditional statement using `if-else`. It checks if a variable `isRaining` is true or false and logs different messages to the console based on the condition.',
  'This snippet defines a `Person` class with a constructor to initialize `name` and `age` properties and a `greet` method that logs a greeting message to the console. It illustrates basic class definition and method creation in JavaScript.',
  'This snippet calculates the sum of numbers from 0 to 99 using a `for` loop. The result',
  'This code snippet demonstrates the use of a "try-catch" block in JavaScript. It attempts to execute code within the "try" block, specifically logging the message "Trying something risky..." to the console. If an error occurs during the execution of the "try" block, the "catch" block will execute, logging the error message "An error occurred:" along with the error details.',
  'This snippet defines a simple arrow function called "square" that takes a single argument "n" and returns its square (i.e., n * n). The function is then called with the argument 5, and the result (25) is logged to the console.',
  'Here, a new Promise object is created. The promise takes two arguments, resolve and reject. Inside the promise, a setTimeout function is used to simulate an asynchronous operation that takes 1 second to complete. After 1 second, the promise is resolved with the value "Done!". This is a basic example of creating a promise that resolves after a delay.',
  'This snippet adds an event listener to a button element selected using document.querySelector("#button"). When the button is clicked, an alert box displaying the message "Button clicked!" will pop up. This is a typical way to handle user interactions in a web page.'
];

//Game variables
const gameTime = 30 * 1000; // 30 seconds
let timer = null;
let gameStart = null;
let gameEnded = false;
let correctKeystrokes = 0;
let gameResults = [];

function addClass(el, name) {
  el.className += ' ' + name;
};

function removeClass(el, name) {
  el.className = el.className.replace(name, '');
};

function randomCodeSnippet() {
  const randomIndex = Math.floor(Math.random() * codeSnippets.length);
  return randomIndex;  // This returns an index, which should be used to access the array
};



function skipTabSpaces(currentLetter) {
  let nextLetter = currentLetter.nextElementSibling;

  while (nextLetter && nextLetter.dataset.char === '\t') {
    removeClass(nextLetter, 'current');
    nextLetter = nextLetter.nextElementSibling;
  }

  if (nextLetter) {
    addClass(nextLetter, 'current');
    
    // Move cursor to the next non-tab letter
    const cursor = document.getElementById('cursor');
    const rect = nextLetter.getBoundingClientRect();
    cursor.style.top = rect.top + window.scrollY + 'px';
    cursor.style.left = rect.left + window.scrollX + 'px';
  }
};

function findFirstLetterInNextLine(currentLetter) {
  const letters = document.querySelectorAll('.letter');
  const currentRect = currentLetter.getBoundingClientRect();
  const currentTop = currentRect.top;

  let nextLineLetter = null;
  let minTopDifference = Infinity;

  for (let i = 0; i < letters.length; i++) {
    const letterRect = letters[i].getBoundingClientRect();
    const topDifference = letterRect.top - currentTop;

    if (topDifference > 0 && topDifference < minTopDifference) {
      minTopDifference = topDifference;
      nextLineLetter = letters[i];
    };
  };

  return nextLineLetter;
};

// Calculate WPM
function calculateWPM() {
  const timeElapsedInSeconds = (Date.now() - gameStart) / 1000;
  const timeElapsedInMinutes = timeElapsedInSeconds / 60;
  const wordsTyped = correctKeystrokes / 5;
  const wpm = wordsTyped / timeElapsedInMinutes;
  return Math.round(wpm);
};

function formatSnippet(snippet) {
  return snippet
    .split('')
    .map(char => {
      if (char === '\t') {
        return `<span class="letter" data-char="\t">&nbsp;&nbsp;&nbsp;&nbsp;</span>`;
      } else {
        // Use character reference if necessary
        const encodedChar = char === '"' ? '&quot;' : char === '&' ? '&amp;' : char;
        return `<span class="letter" data-char="${encodedChar}">${encodedChar}</span>`;
      };
    })
    .join('');
};

function newGame() {
  const randomIndex = randomCodeSnippet();
  const snippet = codeSnippets[randomIndex];
  const formattedSnippet = formatSnippet(snippet);
  removeClass(game, 'over');
  
  // Update the code display
  document.getElementById('code').innerHTML = `<div class="snippet">${formattedSnippet}</div>`;
  
  // Update the description display
  document.getElementById('description').textContent = snippetDescriptions[randomIndex];
  document.getElementById('info').innerHTML = '30';

  // Hide the "New Game" button
  document.getElementById('newGameBtn').style.display = 'none';
  
  // Set initial class for current letter
  addClass(document.querySelector('.snippet'), 'current');
  addClass(document.querySelector('.letter'), 'current');
  //Reset the game variables
  timer = null;
  gameEnded = false;
  correctKeystrokes = 0; 

};

function gameOver() {
  gameEnded = true;
  const wpm = calculateWPM();
  const timeElapsedInSeconds = (Date.now() - gameStart) / 1000;
  const endTime = new Date(); // Get the current time

  // Log WPM, time, and endTime to ensure they're correct
  console.log("Game Over - WPM:", wpm, "Time:", timeElapsedInSeconds, "End Time:", endTime);

  // Store the result with WPM, time taken, and the time the game ended
  gameResults.push({ wpm, time: timeElapsedInSeconds, endTime });

  // Save the game results to localStorage
  saveResultsToLocalStorage();

  // Update the display with the WPM result
  document.getElementById('info').innerHTML = `Time's up! Your WPM: ${wpm} !`;

  // Show the "New Game" button
  document.getElementById('newGameBtn').style.display = 'inline-block';

  // Display game results
  displayGameResults();
};

// Function to format time as HH:MM AM/PM
function formatTime(date) {
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  
  hours = hours % 12;
  hours = hours ? hours : 12; // If hour is 0, make it 12 (midnight case)
  
  const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
  return hours + ':' + formattedMinutes + ' ' + ampm;
};


// Function to display game results
function displayGameResults() {
  const resultList = document.getElementById('results');
  
  if (!resultList) {
    console.error('Result list not found!'); // Check if the element exists
    return;
  }

  resultList.innerHTML = ''; // Clear previous results

  // Sort the gameResults array by WPM in descending order
  const sortedResults = gameResults.sort((a, b) => b.wpm - a.wpm);

  sortedResults.forEach((result, index) => {
    const listItem = document.createElement('li');
    
    // Format the end time as HH:MM AM/PM
    const formattedTime = formatTime(result.endTime);

    // Log each result for debugging
    console.log(`Result #${index + 1}: WPM = ${result.wpm}, Time = ${result.time}, Ended = ${formattedTime}`);
    
    // Use spans to apply specific classes
    listItem.innerHTML = `
     <span class="index">#${index + 1}</span>
     <span class="wpm">WPM: ${result.wpm}</span>
     <span class="time">Time: ${result.time.toFixed(2)}s</span>
     <span class="ended">Ended: ${formattedTime}</span>
   `;
    resultList.appendChild(listItem);
  });
};

// Function to save results to localStorage
function saveResultsToLocalStorage() {
  console.log('Saving results to localStorage:', gameResults);
  localStorage.setItem('gameResults', JSON.stringify(gameResults));
};

// Function to load results from localStorage
function loadResultsFromLocalStorage() {
  const savedResults = localStorage.getItem('gameResults');
  console.log('Loaded results from localStorage:', savedResults);
  if (savedResults) {
    gameResults = JSON.parse(savedResults);
    displayGameResults(); // Display the results after loading them
  }
};

function decodeHtmlEntity(entity) {
  const txt = document.createElement('textarea');
  txt.innerHTML = entity;
  return txt.value;
};


function setMode(mode) {
    document.body.classList.remove('light-mode', 'terminal-mode', 'root');
    document.body.classList.add(mode);
};
setMode('root');
    
 
document.getElementById('game').addEventListener('keydown', (e) => {
  if (gameEnded) return; // Block typing if the game is over

  const key = e.key;
  const isLetterOrSymbol = key.length === 1;
  const isSpace = key === ' ';
  const currentLetter = document.querySelector('.letter.current');

  if (!currentLetter) return; // Prevent any issues if currentLetter is null

  if (!timer && isLetterOrSymbol) {
    gameStart = Date.now();
    timer = setInterval(() => {
      const msPassed = Date.now() - gameStart;
      const sLeft = Math.ceil((gameTime - msPassed) / 1000);

      if (sLeft > 0) {
        document.getElementById('info').innerHTML = sLeft;
      } else {
        clearInterval(timer);
        timer = null;
        gameOver();
        return;
      }
    }, 1000);
  }

  // Decode HTML entity
  const expectedEntity = currentLetter.dataset.char;
  const expected = decodeHtmlEntity(expectedEntity);
  console.log('Key pressed:', e.key);
  console.log('Expected character:', expected);

  if (key === 'Enter') {
    // Handle Enter key
    const nextLineLetter = findFirstLetterInNextLine(currentLetter);
    if (nextLineLetter) {
      removeClass(currentLetter, 'current');
      addClass(nextLineLetter, 'current');

      // Move cursor to the next line's first letter
      const cursor = document.getElementById('cursor');
      const rect = nextLineLetter.getBoundingClientRect();
      cursor.style.top = rect.top + window.scrollY - 5 + 'px';
      cursor.style.left = rect.left + window.scrollX + 'px';
    }
    e.preventDefault(); // Prevent default action of Enter key
    return;
  }

  if (key === 'Backspace') {
    // Handle Backspace key
    const previousLetter = currentLetter.previousElementSibling;

    if (previousLetter) {
      console.log('Current letter:', currentLetter);
      console.log('Previous letter:', previousLetter);

      // Move `current` class to previous letter
      removeClass(currentLetter, 'current');
      removeClass(currentLetter, 'correct');
      removeClass(currentLetter, 'incorrect');

      // Reset styles of the letter to which `current` is moved
      removeClass(previousLetter, 'correct');
      removeClass(previousLetter, 'incorrect');
      addClass(previousLetter, 'current');

      // Move cursor to the previous letter
      const cursor = document.getElementById('cursor');
      const rect = previousLetter.getBoundingClientRect();
      cursor.style.top = rect.top + window.scrollY + 'px';
      cursor.style.left = rect.left + window.scrollX + 'px';
    }
    e.preventDefault(); // Prevent default action of Backspace key
    return;
  }

  // Handle letters, symbols, and spaces
  if (isLetterOrSymbol || isSpace) {
    const expected = currentLetter.dataset.char; // Compare with the data-char attribute
    if (key === decodeHtmlEntity(expected)) {
      correctKeystrokes++; // Increment the correct keystrokes counter
      addClass(currentLetter, 'correct');
    } else {
      addClass(currentLetter, 'incorrect');
    }
    removeClass(currentLetter, 'current');
    
    if (currentLetter.nextElementSibling) {
      addClass(currentLetter.nextElementSibling, 'current');
    } else {
      // No more letters left, game is over
      clearInterval(timer); // Stop the timer
      timer = null;
      gameOver(); // End the game when the user finishes typing the snippet
      return;
    }

    // Move cursor to the next letter
    const nextLetter = document.querySelector('.letter.current');
    const cursor = document.getElementById('cursor');
    if (nextLetter) {
      const rect = nextLetter.getBoundingClientRect();
      cursor.style.top = rect.top + window.scrollY + 'px';
      cursor.style.left = rect.left + window.scrollX + 'px';
    }
  }
});


// Load results when the page is loaded
window.addEventListener('load', () => {
  loadResultsFromLocalStorage();
  displayGameResults(); // Ensure results are displayed after page load
});


document.getElementById('newGameBtn').addEventListener('click', () =>{ newGame(); });
document.getElementById('root').addEventListener('click', () => { setMode('root')});
document.getElementById('terminal').addEventListener('click', () => { setMode('terminal-mode')});
document.getElementById('light-mode').addEventListener('click', () => { setMode('light-mode')});


// Check if data is stored in localStorage


newGame();
