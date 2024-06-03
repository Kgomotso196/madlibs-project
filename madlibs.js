function parseStory(rawStory) {
  const parseWord = (word) => {
    if (/\[v\]/.test(word)) return { words: word.slice(0, -3), pos: 'verb' };
    if (/\[n\]/.test(word)) return { words: word.slice(0, -3), pos: 'noun' };
    if (/\[a\]/.test(word)) return { words: word.slice(0, -3), pos: 'adjective' };
    return { words: word };
  };

  return rawStory.split(' ').map(parseWord);
}

getRawStory()
  .then(parseStory)
  .then((processedStory) => {
    console.log(processedStory);

    const editCard = document.querySelector('.madLibsEdit');
    const previewCard = document.querySelector('.madLibsPreview');
    const previewInputs = [];

    processedStory.forEach((wordObj) => {
      if (wordObj.pos) {
        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = wordObj.pos;
        input.maxLength = 20;
        input.style.width = '50px';
        editCard.appendChild(input);

        const previewInput = document.createElement('input');
        previewInput.type = 'text';
        previewInput.placeholder = wordObj.pos;
        previewInput.maxLength = 20;
        previewInput.readOnly = true;
        previewInput.style.width = '50px';
        previewCard.appendChild(previewInput);

        previewInputs.push(previewInput);

        input.addEventListener('input', () => {
          previewInput.value = input.value;
          adjustInputWidth(previewInput);
        });

        adjustInputWidth(previewInput);
      } else {
        const editText = document.createElement('span');
        editText.innerText = ` ${wordObj.words}`;
        editCard.appendChild(editText);

        const previewText = document.createElement('span');
        previewText.innerText = ` ${wordObj.words}`;
        previewCard.appendChild(previewText);
      }
    });

    const blanks = document.querySelectorAll('.madLibsEdit input');
    blanks.forEach((blank, i) => {
      blank.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          if (i < blanks.length - 1) {
            blanks[i + 1].focus();
          }
        }
      });
    });

    const reset = document.querySelector('.reset');
    const outputBlanks = document.querySelectorAll('.madLibsPreview input');

    reset.addEventListener('click', () => {
      blanks.forEach((blank, i) => {
        blank.value = '';
        outputBlanks[i].value = blank.placeholder;
        adjustInputWidth(outputBlanks[i]);
      });
    });

    const sound = document.querySelector('#audioo');
    const startSound = document.querySelector('.play');
    startSound.addEventListener('click', () => sound.play());

    const stopSound = document.querySelector('.pause');
    stopSound.addEventListener('click', () => sound.pause());
  });

function adjustInputWidth(input) {
  input.style.width = 'auto';
  input.style.width = input.scrollWidth + 'px';
}
