# ALL DOGS GO TO HEAVEN 

## [Play the Game!](https://amaliabm.github.io/All-dogs-go-to-heaven/)

# Description

This game is inspired by my dog London, with whom I had the privilege of living for over 14 years. During that time, I learned the importance of healthy nutrition for animals and how it can greatly improve their quality and length of life.

The game takes place in the sky, where the main character, London, must avoid crashing into clouds and dancing toxic chocolates, while collecting as many health points as possible through nutritious food. Each healthy item she collects will increase her health score.

# Main Functionalities

- Character Movement: The main character, London, moves up and down using the keyboard arrow keys. This allows the player to position her in front of healthy foods or avoid colliding with harmful items.

- Point Collection: Every time London collides with a healthy food item, she earns points. These are referred to as health points.

- Obstacles to Avoid: Players must avoid colliding with clouds, which come in two sizes and change speed depending on the level. Starting from level 2, dancing toxic chocolates also appear and must be avoided.

- Unlockable Levels: The game includes up to 6 levels. In level 5, a bonus mode called "Bonus Stage" activates for 20 seconds. This is displayed on screen as a "Health Boost", during which only healthy food items appear to help you earn more points.

- Scoring System: Different foods grant different point values — some add 1 point, others 2, and some add fractional points. The point values were designed to reflect a realistic approach to natural animal nutrition: certain foods are more beneficial and should be offered more often, while others are still healthy but should be given in smaller amounts.

# Backlog Functionalities

- Improve the pause function in the game

- Add more levels

- Enable screen changes with each level

- Solapamiento de algunos elementos en nivel 5, cuando bonus stage. 

# Technologies used

- HTML
- CSS + Inline CSS Styling
- JavaScript (Vanilla JS and modern ES6+, with a strong focus on object-oriented programming)
- DOM Manipulation: appendChild used for dynamic DOM updates
- Web Storage API (localStorage): storing and retrieving persistent data
- Template Literals: for dynamic in-game messages via string interpolation
- setInterval / setTimeout: used to control the timing of message displays and visual elements
- Number Formatting with toFixed(2): to avoid long decimal numbers in scores
- JSON.parse() / JSON.stringify(): to convert between plain text and JavaScript objects

# States

Splash Screen → Game Start 
Game Screen → Main Gameplay - Game Screen
Game Over → Game Over Screen

# Proyect Structure

Main.js: Contains the main structure of the game, including DOM manipulation, sounds, level configuration, game variables, scoring, button events, and character interactions. It also manages game start, spawners (like clouds), the game loop, collisions, final score, rankings, and the Bonus Stage in level 5. Additionally, it includes functions to display messages on screen during collisions or when the game ends.

London.js: Defines the main character, including its image, movements, size, and dimensions.

Healthy foods:

    pollitoasado.js: Defines the importance of roasted chicken in the game, its image, movement, size, appearance, and DOM manipulation.

    manzana.js: Similar to pollitoasado.js, but with variations in size and appearance timing to reduce overlap.

Bonus Stage foods:

    .js: Files that manage additional healthy foods during the Bonus Stage, with varying sizes. Their appearance is triggered for 20 seconds in main.js, though the overlap could be improved.

Negative elements:

    nubes.js: Defines the appearance, image, movement, and speed of clouds, with variable size that affects their behavior on screen.

    chocolate.js: Defines the appearance and function of chocolate, a negative item that causes "game over" upon collision. Its zigzag movement makes it distinct from other negative elements.



# Extra Links 

### Sketch
[Link](https://excalidraw.com/#json=0QRYciyTGybqN4-6x3A3v,OW3yjQjwJ7VV_c7zJGcFqAm)


### Slides
[Link](www.your-slides-url-here.com)

## Deploy
[Link](https://amaliabm.github.io/All-dogs-go-to-heaven/) All-dogs-go-to-heaven
