console.log("Hello World!");

const searchBox = document.querySelector('#search');

searchBox.addEventListener("keyup", function(event) {
  // Number 13 is the "Enter" key on the keyboard
  if (event.keyCode === 13) {
    // Cancel the default action, if needed
    event.preventDefault();
    // Trigger the button element with a click
    search(event);
  }
});

function search(event) {
    const input = document.querySelector('#search').value;
    const query = input.trim();

    fetchWikipedia(query);
};

function fetchWikipedia(query) {
    const endpoint = `https://en.wikipedia.org/w/api.php?action=query&list=search&prop=info&inprop=url&utf8=&format=json&origin=*&srlimit=20&srsearch=${query}`;
    $.get(endpoint, data => {
        console.log(data)
        let title = `<b>${data.query.search[0].title}</b>`;
        // let link = `<a href=\"${}\"><i class=\"fas fa-external-link-square-alt\"></i></a>`
        let snippet = `<p>${data.query.search[0].snippet}</p>`;
        $("#results").append(`<div>${title + snippet}</div>`);
    })
        .fail(() => {
            console.error("Wikipedia Failed");
        })
}
