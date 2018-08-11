(function(){
  document.addEventListener("DOMContentLoaded", function() {
    window.vcWidget = {
      loading: true,
      WIDGET_DOM_ID: 'vc-events-widget',
      dataEndpoint: 'https://s3.amazonaws.com/volunteercleanup-widget/events.json',
      ...window.vcWidget,
    };

    const app = window.vcWidget;
    app.buildListItem = (vcEvent) => {
      return `<div class="event">
        <div class="event-body">
          <div class="name">
            ${vcEvent.page_name}
          </div>
          <div class="date">
            ${vcEvent.start_at}
          </div>
        </div>
       <div class="event-link">
         <a class="event-btn" href="#">
           Join
         </a>
       </div>
      </div>`;
    };

    var xhr = new XMLHttpRequest();
    xhr.open('GET', app.dataEndpoint);
    xhr.send(null);

    const addDataToDom = (data) => {
      const events = JSON.parse(data);
      const containerEl = document.getElementById(app.WIDGET_DOM_ID);
      if (!containerEl) { throw Error('You must add <div id="vc-events-widget"></div> to the page.'); }
      if (!(events instanceof Array)) { throw Error('Data from endpoint is not an array'); }
      
      const htmlListOfEvents = events.slice(0,3).map((vcEvent, index) => {
        return app.buildListItem(vcEvent);
      });
      containerEl.innerHTML = ` <div class="event-container">
                                   <h1 class="event-header">Upcoming Events</h1>
                                   <div class="event-list">
                                   </div>
                                 </div>`;
      containerEl.insertAdjacentHTML('afterbegin', `<link rel="stylesheet" href="https://s3.amazonaws.com/volunteercleanup-widget/styles.js">`);
      document.querySelector('.event-list').innerHTML = htmlListOfEvents;
      app.loading = false;
    };

    xhr.onreadystatechange = () => {
      var DONE = 4; // readyState 4 means the request is done.
      var OK = 200; // status 200 is a successful return.
      if (xhr.readyState === DONE) {
        if (xhr.status === OK) {
          addDataToDom(xhr.responseText);
        } else {
          console.error('Error: ' + xhr.status);
        }
      }
    };
  });
})();
