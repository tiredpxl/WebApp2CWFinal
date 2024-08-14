Run the server by using node index in the terminal.



The public/non logged in users should have links to the home, about us, shop and item pages
home - redirects to home index page
about us - displays about us page
What's in store - provides a list of all items in the db
Where you'll find us - provides the locations of all 4 shops

Staff users can log in (username: Manager, password: Manager1)
                        (username: Volunteer1, password: Volunteer1) Volunteer2 , Volunteer2 etc.

Managers have access to another link on the nav bar (Admin) which takes them to the admin page where they can add and delete users and select role (functionality missing for assign shop). Admin page is hidden for public and volunteer users.

Volunteers have access to the Inventory page from the navbar. This currently allows all volunteers to add items, and delete items(if sold out). (seeded volunteers have assigned shops, can only see the items that correspond to their assigned shop)

logged in users have access to a logout button in the home page navbar which will log the user out and cancel the session. Will then redirect user to home page.

register link in navbar for new users - not fully implemented, new users are registered as customers, username doesn't carry over to session, Manager can see newly registered users in admin panel.


Features -

Home Page - can hover over a list of collection images, clicking on a collection will bring the user to a page consisting of items from that collection.

What's in store - sort function to sort the items based on name a-z,z-a, and price high-low, low-high.

image uploads - half implemented, each item in the seed has an assigned image, when creating new items can upload an image alongside data and the item data registers, image doesn't.


