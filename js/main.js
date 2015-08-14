/* Tash-had Saqif. 8/13/15 */
var articlesUrl = [];
var articleThumbnail = [];
var articleTitle = [];

var tumblrFirstBlog = "http://api.tumblr.com/v2/blog/good-news-network.tumblr.com/posts/?";
var tumblrSecondBlog = "http://api.tumblr.com/v2/blog/webofgoodnews.com/posts/?";
var tumblrAPIKey = "AR53KZcOUK8PYzyebMamkQYeMxMJ3CJwGes6L5Fhbw49LBlUB1"

var redditRecentTop = "http://www.reddit.com/r/upliftingnews/top.json?";
var redditTopWeek = "http://www.reddit.com/r/UpliftingNews/top.json?sort=top&t=week";
var redditTopAll = "http://www.reddit.com/r/UpliftingNews/top.json?sort=top&t=all";


$(document).ready(function() {
    msieversion();
    fetchTumblr(tumblrFirstBlog);
    fetchArticles(redditRecentTop);
    fetchTumblr(tumblrSecondBlog);
    fetchArticles(redditTopAll);
    fetchArticles(redditTopWeek);

});


function msieversion() {

    var ua = window.navigator.userAgent;
    var msie = ua.indexOf("MSIE ");
    if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) {
        alert("Uh oh! I've detected Internet Explorer " + parseInt(ua.substring(msie + 5, ua.indexOf(".", msie))) + ". This webpage would work better on any other browser.");
    } else {
        return false;
    }
}

function loadClick() {
    var totalLength = articlesUrl.length;
    document.getElementById("contentGrid").innerHTML = "";
    completeFunction(totalLength);
    $("#loadButton").hide();
}

function completeFunction(loopLength) {

    var count = 0;
    while (count < loopLength) {
        if (notUndefined(articleTitle[count])) {
            articleTitle[count] = toTitleCase(articleTitle[count]);
            count++;
        }
    }
    var x = 0;
    while (x < loopLength) {
        var existing = document.getElementById("contentGrid").innerHTML;
        document.getElementById("contentGrid").innerHTML = existing + "<li><a href=" + articlesUrl[x] + " class=contentLink target='_blank'><span class=titleText>" + articleTitle[x] + "</span><img src=" + articleThumbnail[x] + "></a></li>";
        x++;
    }

    $("#contentGrid").hide();
    $("#contentGrid").slideDown(1000);
}

function fetchArticles(redditApi) {
    try {
        $.ajax({
            url: redditApi,
            dataType: 'json',
            type: 'GET',
            cache: false,
            success: function(data) {
                $(data.data.children).each(function(index, value) {
                    var articleLink = value.data.url;
                    var articleThumbnailCon = value.data.thumbnail;
                    var articleTitleCon = value.data.title;

                    if (preventDuplicate(articleLink, articlesUrl) && preventDuplicate(articleThumbnailCon, articleThumbnail) && preventDuplicate(articleTitleCon, articleTitle)) {
                        articlesUrl.push(articleLink);
                        articleThumbnail.push(articleThumbnailCon);
                        articleTitle.push(articleTitleCon);
                    }
                });
            }
        });
    } catch (err) {
        console.log("err");
    }
}

tumblrJsonCallback = function(data) {
    try {
        $(data.response.posts).each(function(index, value) {
            if (value.type === "photo") {
                try {
                    var articleLink = value.source_url;
                    var articleTitleCon = value.slug;

                    if (preventDuplicate(articleLink, articlesUrl) && preventDuplicate(articleTitleCon, articleTitle)) {
                        $(value.photos).each(function(idx, val) {
                            var articleThumbnailCon = val.original_size.url;
                            if (preventDuplicate(articleThumbnailCon, articleThumbnail)) {

                                articleThumbnail.push(articleThumbnailCon);
                                articlesUrl.push(articleLink);
                                articleTitle.push(articleTitleCon);
                            }
                        });
                    }
                } catch (err) {
                    console.log("err");
                }
            } else {
                try {
                    var articleLink = value.url;
                    var articleThumbnailCon = value.link_image;
                    var articleTitleCon = value.title;

                    if (preventDuplicate(articleLink, articlesUrl) && preventDuplicate(articleThumbnailCon, articleThumbnail) && preventDuplicate(articleTitleCon, articleTitle)) {
                        articlesUrl.push(articleLink);
                        articleThumbnail.push(articleThumbnailCon);
                        articleTitle.push(articleTitleCon);
                    }
                } catch (err) {
                    console.log("err");
                }
            }
        });
    } catch (err) {
        console.log("err");
    }
}


function fetchTumblr(apiLink) {
    try {
        $.ajax({
            url: apiLink,
            dataType: "jsonp",
            type: "GET",
            data: {
                api_key: tumblrAPIKey,
                jsonp: "tumblrJsonCallback"
            }
        });
    } catch (err) {
        console.log("err");

    }
}

function notUndefined(sampleValue) {
    if (sampleValue !== 'undefined' && typeof(sampleValue) !== undefined && sampleValue !== undefined) {
        return true;
    } else {
        return false;
    }
}

function preventDuplicate(testValue, testArray) {
    if (testArray.indexOf(testValue) === -1 && testValue !== 'undefined' && testValue !== undefined && testValue !== 'default' && typeof(testValue) !== undefined) {
        return true;
    } else {
        return false;
    }
}

function toTitleCase(str) {
    titleConvert = str.replace("-", " ");
    return titleConvert.replace(/\w\S*/g, function(txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}

function randomArticle() {
    var randomIndex = Math.floor((Math.random() * articlesUrl.length) + 1);
    window.open(articlesUrl[randomIndex]);
}

function aboutClick() {
    var info = "The purpose of Posl is to provide you with uplifting news stories. In contrast to what we generally see in everyday news, Posl aims to spread the good things happening in the world. Posl fetches news articles from the following sources:";
    var sourceOne = "<br><a href='http://www.reddit.com/r/upliftingnews/' target=_blank>Reddit - UpliftingNews</a>";
    var sourceTwo = "<br><a href='http://www.webofgoodnews.com/' target=_blank>Web Of Good News</a>";
    var sourceThree = "<br><a href='http://www.good-news-network.tumblr.com/' target=_blank>Tumblr - Good News Network</a>";
    var openSource = "<br><br>Also, this project is opensource and <a href='http://github.com/tash-had/posl' target=_blank>can be found on my GitHub</a>";

    alertify.alert(info + sourceOne + sourceTwo + sourceThree + openSource);
}