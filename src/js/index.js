console.log("Hello World!");

const form = document.querySelector('#search-form');

form.addEventListener('submit', search);

function search(event) {
    event.preventDefault();

    const input = document.querySelector('#search').value;
    const query = input.trim();

    fetchWikipedia(query);
};

function fetchWikipedia(query) {
    const endpoint = `https://en.wikipedia.org/w/api.php?action=query&list=search&prop=info&inprop=url&utf8=&format=json&origin=*&srlimit=20&srsearch=${query}`;
    $.get(endpoint, data => {
        console.log(data);
    })
        .fail(() => {
            console.error("Wikipedia Failed");
        })
}
