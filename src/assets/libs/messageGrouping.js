(function(services) {
    class MessageGrouper {
        Group(messages, names) {
            var grouped = [];
            if (messages == null) {return grouped;}

            for(var i = 0; i < messages.length; i++) {
                var message = messages[i];
                var code = message.code != null ? message.code : message.OperatorIndex;
                var time = new Date(this.MessageDateToDate(message.Dated || message.date));
                var groupedMessage = {
                    type: code,
                    messages: [
                        { 
                            msg: message.Message || message.msg
                        }
                    ],
                    time: `${this.AddZero(time.getHours())}:${this.AddZero(time.getMinutes())}`,
                    isLink: message.isLink || false,
                    isWhisper: message.isWhisper || false,
                    Name: ""
                };

                if(message.isLink == undefined || message.isLink == false) { 
                    for(var k = i + 1; k < messages.length; k++) {
                        var olderMessage = messages[k];
                        var olderCode = olderMessage.code != null ? olderMessage.code : olderMessage.OperatorIndex;

                        var messageTime = this.MessageDateToDate(olderMessage.Dated || olderMessage.date);
                        var diff = (messageTime - time) / 1000;

                        if(olderMessage.isWhisper == undefined) {olderMessage.isWhisper = false;}
                        if(olderMessage.isLink == undefined) {olderMessage.isLink = false;}
                        if(
                            olderCode == code &&
                            diff <= 10 &&
                            olderMessage.isLink == groupedMessage.isLink &&
                            olderMessage.isWhisper == groupedMessage.isWhisper) {

                                olderMessage.msg = olderMessage.Message || olderMessage.msg;
                                groupedMessage.messages.push(olderMessage);
                                var lineTime = this.MessageDateToDate(olderMessage.Dated || olderMessage.date);
                                groupedMessage.time = `${this.AddZero(lineTime.getHours())}:${this.AddZero(lineTime.getMinutes())}`;
                        } else {
                            break;
                        }
                    } 
                }
                grouped.push(groupedMessage);
                i += groupedMessage.messages.length - 1;
            }
            return grouped;
        }

        AddZero(string) {
            if(Number(string) < 10) {string = String("0"+string);}
            return string;
        }

        MessageDateToDate(date) {
            if(date instanceof Date) {return date;}

            var time = date.split("T");
            if(time.length > 1) {
                time = time[1];
            } else {time = time[0];}

            var timeSplit = time.split(":");
            var currentDate = new Date();
            currentDate.setHours(timeSplit[0]);
            currentDate.setMinutes(timeSplit[1]);
            currentDate.setSeconds(timeSplit[2].split("Z")[0]);
            return currentDate;
        }
    }

    services.Add("MessageGrouper", new MessageGrouper());
})(woServices);