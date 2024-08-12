Run the server by using node index in the terminal.

currently navigation is only implemented on the home page. Can use the back button to return to previous page.

The public/non logged in users should have links to the home, about us, shop and item pages
home - redirects to home index page
about us - displays about us page
shop - provides a list of shop locations
item - will provide a list of all available items

Staff users can log in (username: Manager, password: Manager1)
                        (username: Volunteer1, password: Volunteer1)

Managers have access to another link on the nav bar (Admin) which takes them to the admin page where they can add and delete users. (looking to expand functionality). Admin page is hidden for public and volunteer users.

Volunteers have access to the Inventory page from the navbar. This currently allows all volunteers to add items, update items and delete items(if sold out). (working on functionality to assign volunteers to specific shops and only be able to interact with the items assigned to that shop and implementing image uploads.)

logged in users have access to a logout button in the home page navbar which will log the user out and cancel the session. Will then redirect user to home page.
