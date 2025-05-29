# Chanelle's Personal Website

For my first web project, I created this website for my girlfriend so she could have a central place to share her writing and prefessional experience. My aim was to create a simplistic yet bright design; Easy to navigate and nice to look at. My tech stack was simply [Next.js](https://nextjs.org/) and [Supabase](https://supabase.com/). The bulk of this project came from developing what I call will "admin mode". This mode gives Chanelle the ability to edit parts of the website. Using a secret token passed in by her as a search parameter, she can update her biography, add and delete pieces of writing, and update her resume.

## Pages and Features

* **Home page**
    - The images showing her education and professional experience also function as links.
    - In admin mode, Chanelle can edit her biography right from the home page and save it just by clicking out of it.

* **Writing page**
    - This page displays all of Chanelle's work in a list. Users can get a filtered selection of the writing by searching for phrases in the titles and/or by choosing the organization they were written for.
    - Admin mode allows Chanelle to delete pieces and add new ones by filling out a form.

* **Resume page**
    - Users can preview and download Chanelle's resume from this page.
    - Chanelle can replace the current resume stored in the database with a new one by uploading it in admin mode.