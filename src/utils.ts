
export function addClass(element:HTMLElement, clazz:string) {

    element.setAttribute('class', element.getAttribute('class') + ' ' + clazz);
}

export function removeClass(element:HTMLElement, clazz:string) {

    let classContent = element.getAttribute('class');
    let classIndex = classContent.indexOf(clazz);
    if( classIndex >= 0) {
        classContent = classContent.substring(0, classIndex) + ' ' + classContent.substring(classIndex + clazz.length, classContent.length);
        element.setAttribute('class', classContent);
    }
}

export function setClasses(element:HTMLElement, classes:Array<string>) {

    let classContent = '';
    classes.forEach((clazz) => {
       if( classContent.length > 0) classContent += ' ';
       classContent += clazz;
    });
    element.setAttribute('class', classContent);
}
