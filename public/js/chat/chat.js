/**
 * Created by yudha on 26/12/15.
 * below still hardcoded, and still dummy, notification has shown, minus: notification time and onclick remove/
 * change style to disable on notification icon
 */
<!-- Include the PubNub Library -->
var chatParameter = [];
var senderId = '';
var chatFeature;

// user properties
var name='';
var firstname='';
var lastname='';
var roles='';
var channel='';
var phone='';
var status='';


$(function () {
    // check if user has assigned to roles ??
    if(user.roles === undefined || user.roles.length == 0){
        alertify.set({ delay: 10000 });
        alertify.error("<strong>Roles </strong>for current user is undefined yet!! Please contact system admin");
    }else{
        // initialize user properties
        name        = user.name;
        firstname   = user.firstname;
        lastname    = user.lastname;
        roles       = user.roles[0].name;
        channel     = 'op-'+user.channel;
        phone       = user.phone_number;
        status      = user.status;

        // initialize chat featre using PubNub
        InitChat();

        // listening to 'OPERATOR' channel for group and 'OP-USERNAME' channel for private
        SubscribeChat();
    }

});

/**
 * Initializing chat feature
 * @constructor
 */
function InitChat() {
    chatFeature = PUBNUB.init({
        publish_key: pubkey,
        subscribe_key: subkey,
        ssl : (('https:' == document.location.protocol) ? true : false),
        uuid: 'op-'+name
    });
}

/**
 * Initializing for subscribe on group channel and private channel
 * @constructor
 */
function SubscribeChat() {
    // Subscribe/listen to the OPERATOR channel
    chatFeature.subscribe({
        channel: [roles,channel],
        message: function (m) {
            // handle times
            var times = moment(m.time,"DD/MM/YYYY HH:mm:ss").fromNow();

            // user notification should be here
            if (!m.receiver_id || 0 === m.receiver_id.length) {
                // it means users are not serviced yet.
                // then push notifications to all operator
                // if notification with this id not exist then create it
                if ($('#cn_' + m.sender_id).length === 0) {
                    //console.log(m);




                    // debugging to see the data
                    // console.log(m.user_name+'||'+JSON.stringify(GetParam(m.sender_id)));
                }
                var serviced = false;
            } else {
                var serviced = true;
                // users has been serviced
                // if users have been chat with this operator, then just change the style
                if ($('#ss_'+ m.sender_id).length !== 0) {
                    // users has old notification then remove it
                    // alert($('#ss_'+ m.sender_id).length);
                    $('div#ss_'+ m.sender_id).remove();
                    // create new notification
                }
            }
            // Set parameter for the next usage of AppendChat function
            SetParam(m.sender_id, m);
            if ($('#cn_' + m.sender_id)!==0) {
                $('#cn_' + m.sender_id).remove();
            }
            $('#chat-notification ul').prepend('<li class="edumix-sticky-title" id="cn_' + m.sender_id + '"><a href="#" onclick="AppendChat(\'' + m.sender_id + '\','+serviced+')"><h3 class="text-black "> <i class="icon-warning"></i>' + m.user_name + '<span class="text-red fontello-record" ></span></h3><p class="text-black">'+times+'</p></a></li>');

            // append chat to chat-conversation div
            $('.chat-conversation').append(m.text);

            // $('.chat-logs').append(m.command+'<br />');
            //console.log(m);
        },
        /**
         * using callback
         */
        connect: function () {
            console.log("Connected")
        },
        disconnect: function () {
            console.log("Disconnected")
        },
        reconnect: function () {
            console.log("Reconnected")
        },
        error: function () {
            console.log("Network Error")
        }
    });
}

/**
 * Append chat to chat-conversation box on chat panel
 * @param senderId
 * @param serviced
 * @constructor
 */
function AppendChat(senderId,serviced) {
    var obj = GetParam(senderId);

    // move to div slim scroll
    $('.slim-scroll').prepend('<div id="ss_' + obj.sender_id + '"><i class="fontello-megaphone"></i><a href="#"><h3>' + obj.user_name + ' <span class="text-green fontello-record"></span></h3><p>Just Now !</p></a></div>');

    // remove old notification
    $('#cn_' + obj.sender_id).remove();

    //alert($('.chat-bottom').find('div').attr('id',senderId).attr('id'));
    //if ($('div#cb_' + obj.sender_id).length === 0) {
    if (!serviced) {
        $('.chat-bottom').append('<div id=\"cb_'+ obj.sender_id + '\"class="chat-list chat-active">' +
            '<a class="chat-pop-over" data-title="' + obj.user_name + '" href="#">' + obj.user_name + '</a>' +
            '<div class="webui-popover-content">' +
            '<div class="chat-conversation">' +
            '<p>' + obj.text + '</p>' +
            '</div>' +
            '<div class="textarea-nest">' +
            '<div class="form-group">' +
            '<span class="fontello-attach"></span>' +
            '<span class="fontello-camera"></span>' +
            '</div>' +
            '<div class="form-group">' +
            '<textarea class="form-control chat-text" onkeyup="" rows="3"></textarea>' +
            '</div>' +
            '<button type="submit" class="btn pull-right btn-default btn-ajaib" onclick="publish(\'' + obj.sender_id + '\')">Submit</button>' +
            '</div>' +
            '</div>' +
            '</div>');
        // reload js
        load_js();
    } else {
        // if chat bottom with this id exist, then just append text
        //$('#cb_'+obj.sender_id);

        // blinking chat bottom
    }
}

/**
 * It used to reload webuipopover.js, because after render on the fly, the popup doesn't show
 */
function load_js() {
    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'http://ajaib-local/js/jquery.webui-popover.js';
    head.appendChild(script);

    $('.chat-pop-over').webuiPopover({
        placement: 'auto',
        padding: false,
        width: '300',//can be set with  number
        //height:'300',//can be set with  number
        height: '400',//can be set with  number
        animation: '',
        offsetTop: -18,  // offset the top of the popover
        multi: true,//allow other popovers in page at same time
        dismissible: false, // if popover can be dismissed by  outside click or escape key
        closeable: true//display close button or not
    });
}

/**
 * function to publish message/chat text to users
 * @param senderId
 */
function publish(senderId) {
    // decrypt sender id
    var geoip   = Cookies.get('geoip');
    // get detail message from sender id decrypted
    var obj=GetParam(senderId);
    var text = $('.chat-text').val();
    var datetime = "LastSync: " + new Date().today() + " @ " + new Date().timeNow();
    chatFeature.publish({
        channel: 'ch-'+obj.sender_id,
        message: {
            "token": 'token value',
            "user_channel": channel,
            "user_name": roles+'-'+firstname,
            "text": text,
            "ip": geoip.ip_address,
            "sender_id": channel.split('-')[1],
            "receiver_id": '085432123456',
            "time": datetime
        }
    });

    // append the text to conversation area
    $('.chat-conversation').append('<p>'+text+'</p>');

    // set chat text to null
    $('.chat-text').val('')
}

function whileTyping() {

}

// For todays date;
Date.prototype.today = function () {
    return ((this.getDate() < 10) ? "0" : "") + this.getDate() + "/" + (((this.getMonth() + 1) < 10) ? "0" : "") + (this.getMonth() + 1) + "/" + this.getFullYear();
}

// For the time now
Date.prototype.timeNow = function () {
    return ((this.getHours() < 10) ? "0" : "") + this.getHours() + ":" + ((this.getMinutes() < 10) ? "0" : "") + this.getMinutes() + ":" + ((this.getSeconds() < 10) ? "0" : "") + this.getSeconds();
}

function SetParam(senderId, messageObject) {
    chatParameter[senderId] = messageObject;
}

function GetParam(senderId) {
    return chatParameter[senderId];
}

function DiffTheTimes() {
    var now  = "04/09/2013 15:00:00";
    var then = "02/09/2013 14:20:30";

    var ms = moment(now,"DD/MM/YYYY HH:mm:ss").diff(moment(then,"DD/MM/YYYY HH:mm:ss"));
    var d = moment.duration(ms);
    var s = Math.floor(d.asHours()) + moment.utc(ms).format(":mm:ss");
}
