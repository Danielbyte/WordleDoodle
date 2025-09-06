let animationPeriod = 0.03;

wrapTitleWithSpanTag();

//Function wraps each of the title element (wordledoodle) into a span tag so that it can hav the jiggle animation when user hovers above
function wrapTitleWithSpanTag () {
  //grab title element
  const titleElement = document.getElementById('title');
  const text = titleElement.textContent;

  titleElement.textContent = '';

  //Break down the contents/word of title element into its constituent characters and store in array
  [...text].forEach((character, index) => {
    const spanElement = document.createElement('span');
    spanElement.textContent = character;
    spanElement.style.animationDelay = `${(index * animationPeriod)}s`;
    titleElement.appendChild(spanElement);
  });
}