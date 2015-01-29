window.onload = function() {
    // note there is a typo in the video, document.getElementByID where D is capital results in an undefined type error
    document.getElementById('output').innerHTML = 'test'; 
};

function saveDemoInput() {
    console.log(document.getElementsByName('demo-input')[0].value);
    };
