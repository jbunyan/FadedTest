/**
 * (c) 2019 BlackBerry Limited. All rights reserved.
 *
 * @fileOverview RSSReader sample application for BlackBerry Dynamics.
 *
 * @description RSSReader sample application uses BlackBerry Dynamics (BBD) Plugin APIs such as HTTPRequest.
 *
 * @version 1.0
*/

var APP = {};

APP.showPage = function(page){
    var $page = $('#'+page);
    $('.page').addClass('d-none');
    $page.removeClass('d-none');
    return $page;
};

APP.viewList = function(){
    APP.showPage('container-list-wrapper');
};

APP.showDetails = function(e){
    var el = $(e.currentTarget);

    $('#container-details .title').html(el.data('name'));

    APP.RSS.URL = el.data('url');
    APP.RSS.ID = el.data('id');

    APP.renderRSSResponse();

    APP.showPage('container-details');

};

APP.renderRSSResponse = function(){
    window.plugins.GDHttpRequest.createRequest('GET', APP.RSS.URL, 30, false, null, null, null).send(
        function(response) {
            var responseObj = window.plugins.GDHttpRequest.parseHttpResponse(response), xmlDoc, $xmlDoc, content = '';

            if(responseObj.responseText){
                try{
                    xmlDoc = $.parseXML(responseObj.responseText);
                } catch(e){
                    alert('Can\'t parse RSS feed. Are you sure that information about RSS feed correct?');
                    APP.showPage('container-list-wrapper');
                }


                $xmlDoc = $(xmlDoc);

                $xmlDoc.find('item').each(function(){
                    var item = $(this);

                    content += '<li><a href="#" data-icon="info"><h3>' + item.find('title').text() + '</h3><div>' + item.find('description').text() + '</div></a></li>';
                });

                APP.feedsContainer.html(content).trigger('refresh').listview('refresh');
            }else{
                alert("RSS Feed not exist");
                APP.showPage('container-list-wrapper');
            }
        },
        function(error) {
            alert('ERROR: ' + error);
            APP.feedsContainer.html("<p><b>Invalid URL!</b></p>").trigger('refresh').listview('refresh');
        }
    );
};

APP.newFeed = function(){
    APP.showPage('container-add');
};

APP.addFeed = function(){
    var newName = $('#add-rss-feed-name').val(),
        newUrl = $('#add-rss-feed-url').val();
    if(!newName || !newUrl){
        alert('Please fill all fields');
        return;
    }

    APP.RSSList.push({
        name: newName,
        url: newUrl
    });

    APP.saveLocalStorage();
    APP.renderList();
    APP.viewList();

    $('#container-add').find('input[type=text]').val('');
};

APP.deleteItem = function(e){
    var $deleteItem = $(e.currentTarget),
        id = $deleteItem.data('id');

    $deleteItem.closest('li').remove();
    APP.deleteRSSFeed(id);
};

APP.deleteCurrentItem = function(){
    APP.deleteRSSFeed(APP.RSS.ID);
    $('#list-container-list li[data-id="'+APP.RSS.ID+'"]').remove();
    APP.viewList();
};

APP.deleteRSSFeed = function(id){
    APP.RSSList.splice(id, 1);

    APP.saveLocalStorage();
    APP.updateRSSList();
};

APP.saveLocalStorage = function(){
    localStorage.rssFeeds = JSON.stringify(APP.RSSList);
};

APP.editList = function(e){
    var $edit = $(e.currentTarget), info = [];

    $edit.toggleClass('active');

    if($edit.hasClass('active')){
        $('#list-container-list li').each(function(){
            el = $(this);
            info.push({
                id: el.data('id'),
                name: el.find('.name').html(),
                url: el.find('.url').html()
            })
        });

        $('#list-container-list').find('li').remove();

        APP.updateRSSList();

        for(var i = 0, m = info.length; i<m; i++){
            $('#list-container-list').append(
                '<li><a href="#" class="details">' + info[i].name +
                '<br><span class="url">' + info[i].url +
                '</span></a><a href="#" class="delete-list-item" data-id="' + info[i].id +
                '"></a></li>'
            );
        }
        APP.updateRSSList();
    }else{
        APP.renderList();
    }
};

APP.updateRSSList = function(){
    var list = $('#list-container-list');
    list.trigger('refresh').listview('refresh');
};

APP.renderList = function(){
    $('#list-container-list').empty();

    if(localStorage.rssFeeds && localStorage.rssFeeds.length){
        var list = JSON.parse(localStorage.rssFeeds);

        APP.RSSList = list;

        for(var i = 0, m = list.length; i<m; i++){
            $('#list-container-list').append(
                '<li data-id="' + i + '"><a href="#" class="details" data-id="' + i +
                '" data-name="' + list[i].name + '" data-url="' + list[i].url +
                '"><span class="name">' + list[i].name +
                '</span><br><span class="url">' + list[i].url +
                '</span></a></li>'
            );
        }
        APP.updateRSSList();
    }
};

APP.deviceReady = function(){

    APP.RSSList = [];

    APP.RSS = {};

    localStorage.rssFeeds = JSON.stringify([{
        name: 'BBC rss',
        url: 'http://feeds.bbci.co.uk/news/rss.xml'
    }]);

    APP.feedsContainer = $('#container-details #feeds');

    $(document).on('touchstart', '#container-list-wrapper .details', _.bind(APP.showDetails, this));

    $(document).on('touchstart', '#feeds-list', _.bind(APP.viewList, this));

    $(document).on('touchstart', '#add-feed', _.bind(APP.newFeed, this));

    $(document).on('touchstart', '#edit-element', _.bind(APP.editList, APP));

    $(document).on('touchstart', '#add-rss-feed', _.bind(APP.addFeed, APP));

    $(document).on('touchstart', '.delete-list-item', _.bind(APP.deleteItem, APP));
    $(document).on('touchstart', '#delete-element', _.bind(APP.deleteCurrentItem, APP));

    $(document).on('touchstart', '#refresh-element', _.bind(APP.renderRSSResponse, APP));

    APP.renderList();
};

document.addEventListener("deviceready", function(){
    $(function(){
        APP.deviceReady();
    });
}, false);
