const searchBox = document.querySelector('#search');

searchBox.addEventListener('keyup', function (event) {
    // Check if key code is 13, the Enter key
    if (event.keyCode === 13) {
        // Cancel the default action, if needed
        event.preventDefault();
        // Trigger the button element with a click
        search(event);
    }
});

function search(event) {
    // Store the input value
    const input = document.querySelector('#search').value;
    // Remove leading and trailing spaces
    const query = input.trim();

    // Clear any previous results
    $('#results').empty();

    // Create a div for the loading animation
    let loadingContainer = document.createElement('div');
    loadingContainer.classList.add('container');
    loadingContainer.classList.add('text-center');
    $(loadingContainer).attr('id', 'loading');

    let loading = document.createElement('div');
    loading.classList.add('spinner-grow');
    loading.classList.add('text-dark');
    loading.role = 'status';
    let loadingText = document.createElement('span');
    loadingText.classList.add('sr-only');
    loadingText.appendChild(document.createTextNode('Loading...'));
    loading.appendChild(loadingText);
    loadingContainer.appendChild(loading);

    document.getElementById('results').appendChild(loadingContainer);

    // Get Wikipedia results
    fetchWikipedia(query);
};

function fetchWikipedia(query) {
    // Base endpoint
    var url = 'https://en.wikipedia.org/w/api.php';
    // A cleaner method of passing parameters
    var params = {
        action: 'query',
        format: 'json',
        prop: 'pageimages%7Cpageterms&',
        generator: 'prefixsearch',
        redirects: 1,
        piprop: 'thumbnail',
        pithumbsize: 250,
        pilimit: 20,
        wbptterms: 'description',
        gpssearch: query
    };
    // Append parameters to the end of the URL
    url = url + '?origin=*';
    Object.keys(params).forEach(function (key) { url += '&' + key + '=' + params[key]; });

    // Make the API GET request
    $.get(url, data => {
        // Log results to console for debugging purposes
        console.log(data);
        // Make sure results array isn't empty
        if (Object.values(data.query.pages).length !== 0) {
            // Get the first page in the results
            let page = Object.values(data.query.pages)[0];
            let title = page.title;
            let description = page.terms.description[0];
            // Capitalize the first word of the sentence
            description = description.charAt(0).toUpperCase() + description.slice(1);

            let entry = $('<div>', {
                'class': 'media'
            });
            if (page['thumbnail']) {
                let image = page.thumbnail.source;
                $('<img>', {
                    'class': 'align-self-start mr-3',
                    src: image
                }).appendTo(entry);
            }
            let entryBody = $('<div>', {
                'class': 'media-body'
            });
            $('<h5>', {
                'class': 'mt-0',
                text: title
            }).appendTo(entryBody);
            $(entryBody).append(description);
            let readmore = $('<p>');
            $('<a>', {
                html: 'Read more <i class="fas fa-external-link-alt"></i>',
                title: 'Open in Wikipedia',
                href: `https://en.wikipedia.org/?curid=${page.pageid}`,
                target: '_blank'
            }).appendTo(readmore);

            $(entryBody).append(readmore);
            entry.append(entryBody);

            // <div class='media'>
            //     <img src='/assets/wikipedia.png' class='align-self-start mr-3' alt='...'>
            //     <div class='media-body'>
            //         <h5 class='mt-0'>Top-aligned media</h5>
            //         <p>Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante sollicitudin. Cras purus odio, vestibulum in vulputate at, tempus viverra turpis. Fusce condimentum nunc ac nisi vulputate fringilla. Donec lacinia congue felis in faucibus.</p>
            //     </div>
            // </div>

            $('#results').append(entry);
        }
    })
        // .then(() => {
        //     $('#loading').remove();
        // })
        .fail(() => {
            console.error('Wikipedia Failed');
        })

}