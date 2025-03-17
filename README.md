## Project Features and Improvements

### User Features
1. Tipping Feature
I implemented a tipping functionality that allows users to add a tip for the delivery driver during the checkout process. Users can enter a custom amount, and the tip is added to the total price during checkout and charged correctly through Stripe.

2. Order Cancellation
I implemented a feature that allows users to cancel their orders, provided that the order had just been created and the order status is still 'New'. Once cancelled, it is reflected on the order details page.

### Admin Features

1. Order Management and Archival
On the admin side, I implemented functionality to manage the cancelled orders. If the user cancelled their order, the order will automatically transition from the active tab to the archived tab, allowing the admins to easily track and manage the statuses of orders.

## What I Learned

Through the completion of this project, I gained a lot of experience primarily working with Supabase and Stripe, especially in the following areas:

* Supabase: I learned how to use Supabase for user authentication, managing storage, and interacting with the databases to fetch and manipulate the data. I implemented real-time subscriptions and query handling to ensure that admins and users can see the updates dynamically for the order statuses.

* Stripe: I integrated Stripe for processing payments and this gave me a deeper understanding of handling payments and ensuring secure transactions.

* Frontend/Backend Development: I also improved my skills in full-stack development by handling the integration of the frontend and backend components of the application. This project gave me a hands-on experience of working with the project workflow and creating user experiences.

