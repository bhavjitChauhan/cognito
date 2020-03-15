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

    $("#results").empty();

    let loadingContainer = document.createElement("div");
    loadingContainer.classList.add("container");
    loadingContainer.classList.add("text-center");
    $(loadingContainer).attr("id","loading");

    let loading = document.createElement("div");
    loading.classList.add("spinner-grow");
    loading.classList.add("text-dark");
    loading.role = "status";
    let loadingText = document.createElement("span");
    loadingText.classList.add("sr-only");
    loadingText.appendChild(document.createTextNode("Loading..."));
    loading.appendChild(loadingText);
    loadingContainer.appendChild(loading);

    document.getElementById("results").appendChild(loadingContainer);

    fetchWikipedia(query);
};

function fetchWikipedia(query) {
    var url = "https://en.wikipedia.org/w/api.php"; 
    var params = {
        action: "query",
        format: "json",
        prop: "pageimages%7Cpageterms&",
        generator: "prefixsearch",
        redirects: 1,
        piprop: "thumbnail",
        pithumbsize: 250,
        pilimit: 20,
        wbptterms: "description",
        gpssearch: query
    };

    url = url + "?origin=*";
    Object.keys(params).forEach(function(key){url += "&" + key + "=" + params[key];});

    $.get(url, data => {
        console.log(data);
        if(Object.values(data.query.pages).length !== 0) {
            let page = Object.values(data.query.pages)[0];
            let title = page.title;
            let description = page.terms.description[0];
            description = description.charAt(0).toUpperCase() + description.slice(1);
            let readmore = $('<p>');
            $('<a>', {
                html: 'Read more <i class="fas fa-external-link-alt"></i>',
                title: 'Open in Wikipedia',
                href: `https://en.wikipedia.org/?curid=${page.pageid}`,
                target: '_blank'
            }).appendTo(readmore);


            let entry = document.createElement("div");
            entry.classList.add("media");
            if (page["thumbnail"]) {
                let image = page.thumbnail.source;
                let icon = document.createElement("img");
                icon.classList.add("align-self-start");
                icon.classList.add("mr-3");
                icon.src = image;
                entry.append(icon);
            }            
            let entryBody = document.createElement("div");
            entryBody.classList.add("media-body");
            let heading = document.createElement("h5");
            heading.classList.add("mt-0");
            heading.append(document.createTextNode(title));
            $(entryBody).append(heading);
            $(entryBody).append(description);
            $(entryBody).append(readmore);
            entry.append(entryBody);

            // <div class="media">
            //     <img src="/assets/wikipedia.png" class="align-self-start mr-3" alt="...">
            //     <div class="media-body">
            //         <h5 class="mt-0">Top-aligned media</h5>
            //         <p>Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante sollicitudin. Cras purus odio, vestibulum in vulputate at, tempus viverra turpis. Fusce condimentum nunc ac nisi vulputate fringilla. Donec lacinia congue felis in faucibus.</p>
            //     </div>
            // </div>

            $("#results").append(entry);
        }
    })
        // .then(() => {
        //     $("#loading").remove();
        // })
        .fail(() => {
            console.error("Wikipedia Failed");
        })
    
}