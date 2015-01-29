window.onload = function() {
    document.getElementByID('output').innerHTML = 'test';
}

function saveDemoInput() {
    console.log(document.getElementsByName('demo-input')[0].value);
    }
