function createPlayerLobbyTable(players){
    var html = "<tr><th>#</th><th>name</th><th>ready</th></tr>";
    var i = 1;
    for(var player of players){
        
        var rdy = "";
        if(player.name != name) rdy += "id='checkbox' disabled";
        if(player.ready) rdy += " checked";

        rdy = '<input type="checkbox" onclick="ready()"' + rdy + ">"


        html += "<tr><td>" + i++ + "</td><td>" + player.name + "</td><td>" + rdy + "</td></tr>";
    }
    return '<table class="table">' + html + "</table>";
}


