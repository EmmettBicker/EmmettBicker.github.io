document.addEventListener("DOMContentLoaded", function()
{
    document.querySelector("#HappyButton").addEventListener("click", function()
    {
        document.querySelector("#ResponseText").innerHTML = "Thank you!";

    });

    document.querySelector("#SadButton").addEventListener("click", function()
    {
        document.querySelector("#ResponseText").innerHTML = "Aw, I hope I can make a better one soon!";


    });

});

