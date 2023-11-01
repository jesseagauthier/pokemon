
# This application is currently being rebuilt to showcase my latest skill set

# Pokemon Web App - Technical Brief

This repository contains a web application that interacts with the PokeAPI to display and manage information about Pokemon creatures. The application allows users to view, search, sort, catch, and release Pokemon.

## Key Features

1. **Data Retrieval and Display:**
   - The application fetches Pokemon data from the PokeAPI and updates the displayed Pokemon list.
   - Detailed information for each Pokemon, including abilities and moves, is retrieved and displayed.

2. **Sorting:**
   - Users can sort displayed Pokemon by experience points or name.
   - Sorting is achieved using the sorting function, which rearranges the displayed Pokemon array based on user-selected criteria.

3. **Search Functionality:**
   - Users can search for Pokemon by name using the search bar.
   - The search query filters displayed Pokemon based on the search term and updates the display.

4. **Catch and Release:**
   - Users can catch Pokemon, adding them to the "caught" list.
   - Caught Pokemon are stored in local storage and displayed in the appropriate section.
   - Caught Pokemon can be released, removing them from the caught list.

5. **Abilities and Moves:**
   - Users can view a selected Pokemon's abilities and moves by clicking the "Pokemon Information" button.

6. **Event Handling:**
   - Event listeners are used to respond to user interactions, such as sorting options, catch/release buttons, and ability/move display.

7. **Asynchronous Programming:**
   - The application employs asynchronous programming techniques for fetching and displaying Pokemon data.

## Technologies and Tools Used:

- HTML, CSS for user interface
- JavaScript for logic and interactivity
- Fetch API for data retrieval from the PokeAPI
- Local storage for storing caught Pokemon data
- ESLint for code quality
- Prettier for code formatting
- npm for package management

## Credits:

This web application was developed as part academic capstone Project. It demonstrates the use of fundamental web development concepts, including DOM manipulation, event handling, asynchronous programming, and API integration.

Feel free to contribute to the repository by reporting issues or suggesting improvements.

## Project: Pokedex by Jesse Gauthier

- **Name:** Jesse Gauthier
- **Student Number:** 41022443
- **Capstone Project:** Pokedex

I decided to integrate the main theme of Pokemon into my design. "Catch 'em all" was the inspiration for my layout. The user will be able to swipe to switch between each Pokemon. They will have the ability to catch any Pokemon, access the caught Pokemon, and release them if they reach the maximum number of caught Pokemon.

### Part 3:

While working on my Pokémon app, I had some problems keeping the Pokémon cards consistent. The main issue was that each Pokémon image had a different size, making it tricky to make them all look good when resizing them.
Another challenge I faced was placing the Pokéball in the right spot on each card to maintain a consistent look.
To fix the image size problem, I found a way to make all the Pokémon images the same size by resizing and cropping them while keeping their shape intact. This helped give the cards a nice and polished appearance.


#### Part 4:
Developing a search function that leveraged an API presented a considerable challenge during the creation of my project. The primary struggle lay in effectively querying and retrieving specific Pokémon data based on user input. Navigating the intricacies of API endpoints and parameters, while ensuring seamless integration with the user interface, proved to be complex. Overcoming this obstacle required careful consideration of API documentation, parsing response data, and handling potential errors or inconsistencies in the search results. The iterative process of refining the search logic, fine-tuning query parameters, and implementing real-time updates to display the matched Pokémon demanded dedicated effort and problem-solving. Ultimately, successfully implementing the search function enriched my experience by enhancing my understanding of API interactions and refining my ability to create dynamic and responsive user interfaces.
