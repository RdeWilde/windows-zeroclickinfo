var cross = '<img src="css/imgs/icon_xon.v101.png" class="ddg_close_zeroclick" onclick="hideZeroClick();"/>';
var cross_answer = '<img src="css/imgs/icon_xon.v101.png" class="ddg_close_zeroclick_answer" onclick="hideZeroClick();"/>';

function nothingFound(query)
{
    var ddg_result = document.getElementById("ddg_zeroclick");
    if (ddg_result !== null){
        ddg_result.className = 'ddg_answer';
        ddg_result.innerHTML =  'No zero click results found.'  
                             +  '<a id="nothing_found_more" href="https://duckduckgo.com/?q='
                             +      encodeURIComponent(query)
                             +  '">See DuckDuckGo results</a>'  
                             +  cross_answer;
    }
}

function more (query)
{
    window.location.href = "http://duckduckgo.com/?q=" + encodeURIComponent(query);
}

function hideZeroClick()
{
    var ddg_result = document.getElementById("ddg_zeroclick");
    if (ddg_result !== null){
        ddg_result.style.display = 'none';
    }
}

function showZeroClick()
{
    var ddg_result = document.getElementById("ddg_zeroclick");
    if (ddg_result !== null){
        ddg_result.style.display = 'block';
    }
}

function createResultDiv()
{  
    var result = document.getElementById("results");
    var ddg_result = document.getElementById("ddg_zeroclick");
    showZeroClick();
    if (ddg_result === null) {
        result.innerHTML = '<div id="ddg_zeroclick"></div>';
        ddg_result = document.getElementById("ddg_zeroclick");
    } 

    return ddg_result;
}

function createRedirDiv(redirect){
    var ddg_result = document.getElementById("ddg_zeroclick");
    if (ddg_result !== null){
      ddg_result.className = 'ddg_answer';
      ddg_result.innerHTML = 'Wait for redirect or '  
                           + '<a id="redirect" href="' + redirect + '">Click here</a>'
                           + cross_answer;
    }
}

function displayAnswer(res, answer, query)
{
    var ddg = document.getElementById('ddg_zeroclick');
    if (ddg === null){
        createResultDiv();
    }   
    
    if (res['Redirect'] !== ""){ 
        createRedirDiv(res['Redirect']);
        //document.getElementById('redirect').click();
        window.location.href = res['Redirect'];
        return;
    }

    if (answer === '') {
        return;
    }
    
    var ddg_result = createResultDiv();
    ddg_result.className = "ddg_answer";
    ddg_result.innerHTML = answer + cross_answer;
    
    ddg_result.innerHTML += '<br /> <br />'
                         +  '<div id="others_div">'  
                         +    '<a class="ddg_more_answer" href="https://duckduckgo.com/?q='
                         +      encodeURIComponent(query)
                         +    '">More results</a>' 
                         +    '<img src="css/imgs/icon_16.png"/>'
                         +  '</div>';
}

function displaySummary(res, query) {
    var result = '';

    var img_url = res['AbstractURL'];
    var official_site = '';
    var first_category = ''
    var hidden_categories = '';
    var wrapper_class = res['Image'] ? 'ddg_zeroclick_abstract' : 'ddg_zeroclick_abstract_full';

    if (res['Results'].length !== 0) {
        if(res['Results'][0]['Text'] === "Official site") {
            official_site = ' | ' + res['Results'][0]['Result'];
            img_url = res['Results'][0]['FirstURL'];
        }
    }

    result += '<div id="ddg_zeroclick_header">'
           +    '<a href="' + res['AbstractURL'] + '">'
           +        (res['Heading'] === ''? "&nbsp;": res['Heading']) 
           +    '</a>' 
           +    cross
           +  '</div>';
    
    
    var source_base_url = res['AbstractURL'].match(/http.?:\/\/(.*?\.)?(.*\..*?)\/.*/)[2];

    
    result += '<div id="' + wrapper_class + '">' 
           +    '<div class="ddg_abstract_text" onmouseover="this.className+=\' ddg_summary_selected\'" onmouseout="this.className=\'ddg_abstract_text\'"'
           +          'onclick="window.location.href=\'' + res['AbstractURL'] + '\'">' 
           +      res['Abstract']
           +    '</div>' 
           +    '<div id="ddg_zeroclick_official_links">' 
           +      '<img src="http://duckduckgo.com/i/'+ source_base_url +'.ico" />'
           +      '<a href="' + res['AbstractURL'] + '"> More at ' 
           +          res['AbstractSource'] 
           +      '</a>' + official_site 
           +    '</div>'
           +  '</div>' 
           +  '<div class="clear"></div>';

    if (res['Image'] !== ""){
        result += '<div id="ddg_zeroclick_image">' 
               +    '<a href="' + img_url +'">'
               +      '<img class="ddg_zeroclick_img" src="' + res['Image'] + '"/>' 
               +    '</a>'
               +  '</div>';
    }
          
    result += '<br />'
           +  '<div id="others_div">'  
           +    '<a class="ddg_more" href="https://duckduckgo.com/?q='
           +        encodeURIComponent(query)
           +    '">More results</a>' 
           +    '<img src="css/imgs/icon_16.png"/>'
           +  '</div>';

    var ddg_result = createResultDiv();
    ddg_result.className = '';
    ddg_result.innerHTML = result ;
}

function disambigClick (topic)
{
    var dis_href = topic.match(/http:\/\/.*\/(.*)/)[1];
    dis_href = dis_href.replace(/_/gi, " ");    

    document.getElementById('search_wrapper').value = decodeURIComponent(dis_href);
    search(decodeURIComponent(dis_href).toLowerCase(), true);
}

function displayDisambiguationTopic(res, query, i)
{
    var topics = '';
    var icon_dis;

    for (var j = 0; j < res['RelatedTopics'][i]['Topics'].length; j++){
        if (j + i >= 3)
            break;

        icon_dis = res['RelatedTopics'][i]['Topics'][j]['Icon']['URL'] !== '' ? 
                  icon_dis = '<img src="' + res['RelatedTopics'][i]['Topics'][j]['Icon']['URL'] +'"/>' : '';

        topics += '<div class="wrapper" onmouseover="this.className+=\' ddg_selected\'"'
               +      'onmouseout="this.className=\'wrapper\'"' 
               +      'onclick="disambigClick(\''+ res['RelatedTopics'][i]['Topics'][j]['FirstURL'] +'\');">'
               +    '<div class="icon_disambig">' 
               +      icon_dis 
               +    '</div>' 
               +    '<div class="ddg_zeroclick_disambig">' 
               +        res['RelatedTopics'][i]['Topics'][j]['Result'] 
               +    '</div>' 
               +  '</div>';
    }

    return topics;
}

function displayDisambiguation(res, query)
{    
    var result = '';
    result += '<div id="ddg_zeroclick_header">'
           +    '<a href="https://duckduckgo.com/?q='  
           +      encodeURIComponent(query) +'"> Meanings of ' + res['Heading']  
           +    '</a>'  
           +    cross
           +  '</div>';

    var disambigs = ''
    var hidden_disambigs = '';
    var others = '';
    var nhidden = 0;
    var icon_dis = '';
    var j = 0;

    for (var i = 0; i < 4; i++){
        if (i === res['RelatedTopics'].length)
            break;

        if (res['RelatedTopics'].length === 0) { 
            break; 
        }else if (!res['RelatedTopics'][i]['Result'] && res['RelatedTopics'][i]['Topics'] && i < 3){
            disambigs += displayDisambiguationTopic (res, query, i);
            break;
        }

        if (i < 3 && res['RelatedTopics'][i]['Result']) {
            icon_dis = res['RelatedTopics'][i]['Icon']['URL'] !== '' ?
                      '<img src="' + res['RelatedTopics'][i]['Icon']['URL'] +'" />' : '';

            disambigs += '<div class="wrapper" onmouseover="this.className+=\' ddg_selected\'"'
                      +       'onmouseout="this.className=\'wrapper\'"' 
                      +       'onclick="disambigClick(\''+ res['RelatedTopics'][i]['FirstURL'] +'\');">'
                      +     '<div class="icon_disambig">' 
                      +       icon_dis 
                      +     '</div>' 
                      +     '<div class="ddg_zeroclick_disambig">' 
                      +        res['RelatedTopics'][i]['Result'] 
                      +     '</div>' 
                      +  '</div>';
          } 
    }
    
    result += '<div id="ddg_zeroclick_abstract">' 
           +      disambigs 
           +  '</div>'
           +  '<div class="clear"></div>';
     
    result += '<br />'
           +  '<div id="others_div">'  
           +    '<a class="ddg_more" href="https://duckduckgo.com/?q=' + encodeURIComponent(query) + '">'    
           +        'More results'
           +    '</a>' 
           +    '<img src="css/imgs/icon_16.png"/>'
           +  '</div>';         

    var ddg_result = createResultDiv();
    ddg_result.className = '';
    ddg_result.innerHTML = result;
}

function displayCategory(res, query){
    var result = '';
    result += '<div id="ddg_zeroclick_header">'
           +    '<a href="https://duckduckgo.com/?q='  
           +      encodeURIComponent(query) +'"> Meanings of ' 
           +      res['Heading'] 
           +    '</a>' 
           +    cross 
           +  '</div>';
    
    var categories = '';
    var hidden_categories = '';
    var nhidden = 0;
    var cat_img = '';

    for (var i = 0; i < 4; i++){
        if (res['RelatedTopics'].length === 0)
            break;
      
        cat_img = (res['RelatedTopics'][i]['Icon']['URL'] === "") ? '' : '<img src="' + res['RelatedTopics'][i]['Icon']['URL'] +'" />';        
        
        if (i <= 2) {
            categories += '<div class="wrapper" onmouseover="this.className+=\' ddg_selected\'" onmouseout="this.className=\'wrapper\'"' 
                       +        'onclick="disambigClick(\''+ res['RelatedTopics'][i]['FirstURL'] +'\');">' 
                       +    '<div class="icon_category">' 
                       +      cat_img 
                       +    '</div>' 
                       +    '<div class="ddg_zeroclick_category_item">' 
                       +      res['RelatedTopics'][i]['Result'] 
                       +    '</div>'
                       +  '</div>';
        } 
    }

    result += '<div id="ddg_zeroclick_abstract">' 
           +    categories
           +  '</div>';
                
    result += '<br />'
           +  '<div id="others_div">'  
           +    '<a class="ddg_more" href="https://duckduckgo.com/?q='
           +      encodeURIComponent(query)
           +    '">More results</a>' 
           +    '<img src="css/imgs/icon_16.png"/>'
           +  '</div>';       

    var ddg_result = createResultDiv();
    ddg_result.className = '';
    ddg_result.innerHTML = result;
}

function renderZeroClick(res, query)
{
    if (res['AnswerType'] !== "") {
        displayAnswer(res, res['Answer'], query);
    } else if (res['Type'] == 'A' && res['Abstract'] !== "") {
        displaySummary(res, query);
    } else {
        switch (res['Type']){
            case 'E':
                displayAnswer(res, res['Answer'], query);
                break;

            case 'A':
                displayAnswer(res, res['Answer'], query);
                break;

            case 'C':
                displayCategory(res, query);
                break;

            case 'D':
                displayDisambiguation(res, query);
                break;

            default:
                createResultDiv();
                nothingFound(query);
                break;
                    
        }
    }
}

function query(q, callback, meaning){
  var req = new XMLHttpRequest();

  if (meaning)
  	req.open('GET', 'http://api.duckduckgo.com?q=' + encodeURIComponent(q) + '&format=json&no_redirect=1&d=1', true);
  else
  	req.open('GET', 'http://api.duckduckgo.com?q=' + encodeURIComponent(q) + '&format=json&no_redirect=1', true);  
	
  req.onreadystatechange = function(data) {
      if (req.readyState != 4) { return; }
      var res = JSON.parse(req.responseText);
      callback(res);
  }
  req.send(null);
}

function search(q, meanings){   
    query(q, function(response){
        renderZeroClick(response, q);
    }, meanings);
}

function initDDG () {
    System.Gadget.settingsUI = "settings.html";
	  System.Gadget.onSettingsClosed = setSettings;

    //nasty hack
    setInterval( function(){
        document.body.style.height = (59 + document.getElementById('results').clientHeight) + "px";
      }, 200);


    /*document.getElementById("search_button").onmousedown = function(){
      this.style.background = "url(css/imgs/search_active.png)";
      this.style.backgroundRepeat = "no-repeat scroll 0 0 transparent"; 
    }
    document.getElementById("search_button").onmouseup = function(){
      this.style.background = "url(css/imgs/search_inactive.png)";
      this.style.backgroundRepeat = "no-repeat scroll 0 0 transparent"; 
    }*/


    document.getElementById("search_button").onclick = function(){
      var el = document.getElementById('search_wrapper');
      if (el.value !== '')
          search(el.value, false);
      else
          return false;
    };
    document.getElementById("search_wrapper").onkeyup = function(){
      var key = event.keyCode;
      var el = document.getElementById('search_wrapper');
      if (key === 13 && el.value !== "")
          search(el.value, false);
      else 
        return false;
    };
}




/************************
 *
 *   SETTINGS
 *
 *************************/
var ddgSets;	
var sets;

function loadSetts()
{
    ddgSets = new GetDDGSettings()
    colors.value = ddgSets.background === '' ? "red" : ddgSets.background;
	  System.Gadget.onSettingsClosing = ClosingSets;
}

function GetDDGSettings()
{
    this.background = System.Gadget.Settings.readString("background");
}

function SaveSettings()
{  
    System.Gadget.Settings.writeString("background", colors.value);
    ddgSets.background = colors.value;
}

function setSettings()
{
    sets = new GetDDGSettings();
    var transparency = sets.background === "red" ? "#CD473B" : "transparent";
    var bg = document.getElementById('header');
    bg.style.backgroundImage = 'url("css/imgs/bckgs/' + sets.background +'.png")';
    bg.style.backgroundRepeat = "repeat-x scroll 0 0 " + transparency;
}

//do this before close sets
function ClosingSets(event)
{
	if (event.closeAction == event.Action.commit){
      SaveSettings();
	}
	event.cancel = false;
}
