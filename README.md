Foodie
======

A social network for food enthusiasts, who want to to share dining experiences.
For the course, IT2805- Web Technologies






Technologies used:

*AngularJs*


AngularJS is an open-source web application framework maintained by Google and a community of individual developers and corporations to help the process of building powerful, high-quality single-page applications be as easy as possible.
AngularJS has an elegant structure to it, and enables developers to make more modern web-pages that are more like deskop-applications in the sense that you can do a lot on one page without reloading all the time. AngularJS is gaining popularity quickly, and with good reason.

On their webpage they write: "HTML is great for declaring static documents, but it falters when we try to use it for declaring dynamic views in web-applications. AngularJS lets you extend HTML vocabulary for your application. The resulting environment is extraordinarily expressive, readable, and quick to develop."

Using Angular is more complicated than making a static webpage, and although some of the challenges related to making the site dynamic and not having to reload when the user visits another page of the site are abstracted away, everything is coded/written by hand.

Why we used it: Many aspects of dynamic pages, such as displaying all recipies underneath eachother without knowing how many there will be, is easier in Angular. For practical requirements such as this, and for making the browsing experience more smooth by avoiding reloading, we chose Angular. Also, we think Angular is the future, and wanted to become more comfortable with the framework.

Learn more here: https://docs.angularjs.org/misc/faq




*Bootstrap*


Bootstrap is a free collection of tools for creating websites and web applications. It contains CSS for typography, forms, buttons, navigation and other interface components, as well as optional JavaScript extensions. It also includes a grid-system for structuring content.
We have used it for styling mostly.

Why we used it: The styling defaults (font-styles, etc, etc) that you get with Bootstrap are better than the regular defaults, but most of the Bootstrap defaults have been overwritten by us. Bootstrap will also help you with a grid-system for helping you structure your pages, but we've not used this. They also provide with some HTML-structures that are common for web-pages, and we've made use of one of these for displaying notifications.

Learn more here: http://getbootstrap.com/


*CSS*


For the project we used alot of custom styles and almost everything you see on the page is hand-written.

*SASS*


Sass is a CSS extension scripting language that "compiles" to CSS. It enables you to make styles in a more efficient and organized way than when writing in CSS. SASS has a wide variaty of addiotional functions including mixins, functions, inheritance, and control structures and statements like "if" "else" "for" etc. This makes it feel more like a full programming-language, not just markup, and opens for much more modular and dynamic markup.

For organizing the markup, we used the SMACSS architecture, where the markup are divided into many partial files that are organized into category-folders and imported from the main style-sheet.

Learn more here: http://sass-lang.com/ 
and here: https://smacss.com/


*Compass*


Compass is a SASS-extension with many helpful mixins to make your life easier while writing markup. The mixins we used for this project are browser related, specifically for transitions, transformations and image-treatment. For example if you want a gradient background you would have to write the same effect multiple times with fallback for all browsers (webkit, moz, etc.). What Compass does is to generate all possible fallbacks for you, it will even write experimental hacks to simulate the effect in "stone-aged"-browsers without the support for it.

Learn more here: http://compass-style.org/



*XML*


The faq section of the site uses XML data. This demonstrate well how a web page
made in AngularJs should handle an API endpoint that only serves XML data.

*JSON*


All API endpoints serve or accept data in the JSON format, except for the faq section. JSON and JavaScript is tightly coupled, since it uses JavaScript syntax. AngularJs also prefer the use of JSON, and additional steps are required to deserialize XML. 



*Form Controls*

There a three different forms for this webpage. A recipe, group and an account
registration form. All forms contain validation functionality, and displays
the errors either when attempting to submit or when a form element loses it's
focus. The latter approch offer a more instant form of feedback to the user.

Custom validation for some elements has also been created. The recipe form
for example requires that the user has at least added one ingredient and at least
one recipe step before submitting the form.

The reason for front end validation of forms  is to offer instant feedback to the user about potential form errors. 
The user will probably have a better experience when
errors are prevented before pressing the submit button. And a message that provide tailored instructions on how to correct an error, will positively affect the user experience.
