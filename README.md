# archer-callouts

The **archer-callouts.js** is a small javascript library for easily creating fancy callout elements. 
Basically, designed for the use in archer graphics it is completely independent from the archer-graphics.js library and can be used by its own in any html website.

Even if the implementation is not perfect yet, it is already good enough for the most usual use cases. 

The following issues have to be done for the first major release:
-	Improve render performance
-	Remove unused legacy code
-	Refactor code for better readability
-	Optimize programming interface
-	Add source code documentation

##Build it
```
> npm install
> npm run-script build
```

##Use it

```javascript
//Get the container element for the callout
var container = document.getElementById('container');

//Get the source element for the callout
var sourceElement = document.getElementById('source-element');

//Create a callout and add it to a container.
var callout = calloutManager.create(container);

//Bind the callout to the source element
callout.bind(sourceElement);

//Set the content of the callout. Currently there are two sections that can //be set separately. Use html to format your content to your needs.
callout.sections[0].content = '<h1>Title</h1>';
callout.sections[1].content = '<p>This is a callout</p>';

//Show the callout
callout.show();

//Call updatePosition() eache time the position of the source element changes
callout.updatePosition();

//Hide the callout
callout.hide();
```

##Example
[little-planes]: https://wiki.archer.graphics/download/attachments/16121938/Bildschirmfoto%202018-04-24%20um%2008.53.46.png?version=1&modificationDate=1524552995776&api=v2 "bla"
