function calculate() {
    const must = new Set([...form.elements['include-must']].filter(i => i.checked).map(i => Number(i.value)));
    const mustNot = new Set([...form.elements['include-must-not']].filter(i => i.checked).map(i => Number(i.value)));
    const availableDigits = new Set([1,2,3,4,5,6,7,8,9].filter(digit => !mustNot.has(digit)));
    const validLengths = new Set([...form.elements['valid-length']].filter(i => i.checked).map(i => Number(i.value)));
    const combinations = findCombinations([...availableDigits], Number(form.elements['sum'].value)).filter(
        (combination) => {
            if (!hasAllValues(must, combination)) {
                return false;
            }
            if (!validLengths.has(combination.size)) {
                return false;
            }
            return true;
        }
    );
    displayCombinations(combinations);
}

function displayCombinations(combinations) {
    const results = document.querySelector('#results');
    results.replaceChildren();
    for (const c of combinations) {
        const root = document.querySelector('#combination-tpl').content.children[0].cloneNode();
        for (const digit of c) {
            root.append(digitNode(digit));
        }
        results.append(root);
    }
}

function digitNode(digit) {
    const root = document.querySelector('#digit-tpl').content.children[0].cloneNode();
    root.textContent = digit;
    return root;
}

function hasAllValues(mustHave, candidate) {
    for (let value of mustHave) {
      if (!candidate.has(value)) {
        return false;
      }
    }
    return true;
}

function findCombinations(arr, target) {
    let results = [];
  
    function helper(start, combination, sum) {
      if (sum === target) {
        results.push(new Set(combination));
        return;
      }
      if (sum > target) {
        return;
      }
      for (let i = start; i < arr.length; i++) {
        combination.push(arr[i]);
        helper(i + 1, combination, sum + arr[i]);
        combination.pop();
      }
    }
  
    helper(0, [], 0);
  
    return results;
}

let form; 
window.onload = () => {
    form = document.querySelector('#form');
    Array.from(form.querySelectorAll('input')).forEach(i => {
        i.addEventListener('change', () => calculate());
    });
    calculate();
};