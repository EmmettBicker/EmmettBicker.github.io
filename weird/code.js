window.onload = function() {
start_time = Date.now()
start_time_two = 0
elipse_elapsed_time = 0
previous_time = Date.now()
mouse_pos_x = 0
mouse_pos_y = 0
document.onmousemove = function(event) {
    mouse_pos_x = event.pageX
    mouse_pos_y = event.pageX
}


const letters = ["W", "E", "B", "S", "I","T","EA", "space",
                 "W2", "E2", "B2", "S2", "I2","T2","EA2",];

const States = {
    Intro: 0,
    Door: 1,
    Church: 2,
    Spring: 3
}

current_state = States.Intro
for (let letter in letters) {
    var l =  document.getElementById(letters[letter])
    l.style.position = 'absolute';
}

_body1 = document.getElementById('the_body1')
_body2 = document.getElementById('the_body2')
_door = document.getElementById('door')

function x(fn, timeout) {
    
    if ( current_state == States.Intro)
    { 
        
        res = elipse(false,120)
        
        if (res) {
            
            current_state = States.Door;
            
        }
        else {
            
            _body1.style.backgroundImage = "url(blackscreen.png)"
            _body2.style.backgroundImage = "url(blackscreen.png)"
            _door.style.visibility = 'hidden';
        }

    }
    console.log(current_state)
    if (current_state == States.Door) 
    { 
        _body1.style.backgroundImage = "url(grass.png)"
        document.getElementById('the_body2').style.backgroundImage = "url(grass.png)"
        document.getElementById('door').style.visibility = 'visible';
        document.getElementById('door').addEventListener(
            'click', 
            function() {
                was_clicked = door_onclick();
                if (was_clicked) {
                    current_state = States.Church;
                    
                }
            }
            , true);
        
    }
    


    previous_time = Date.now() 
    setTimeout(function() {
        x(x, timeout); // Call the function again after 200ms
    }, timeout);
    
}
has_clicked_door_before = false
function door_onclick() {
    if (!has_clicked_door_before) 
    {
        return true;
    }
    return false;

}

function elipse(shouldStop, starting_pos)  {
    var elapsed_time = Date.now() - start_time
    if (elapsed_time > 10_000 || shouldStop) {
        for (let letter in letters) {
        letter = document.getElementById(letters[letter])
            letter.innerHTML = " ";
        }
        if (elapsed_time >11_000 || shouldStop) {
            document.getElementById("the_body1").style.transition = "0.5s"
            document.getElementById("the_body2").style.transition = "0.5s"
            document.getElementById("the_body1").style.filter = "brightness(0)";
            document.getElementById("the_body2").style.transition = "brightness(0)";
            document.getElementById('the_body1').style.backgroundImage = "url(grass.png)"
            document.getElementById('the_body2').style.backgroundImage = "url(grass.png)"
        
        }

        if (elapsed_time >12_000 || shouldStop) {
            
            document.getElementById("the_body1").style.filter = "brightness(1)";
            document.getElementById("the_body2").style.transition = "brightness(1)";
            return true;
        }
        
        
    };
    
    var elipse_escape_time = 6000
    var wrapper = document.getElementById("wrapper")
    var log = document.getElementById("log")
    
    
    if (start_time_two < 1 && elapsed_time > elipse_escape_time) {
        start_time_two = Date.now();
    }
    
    var speed_factor = 1/1000
    var elipse_speed_factor = Math.pow((Date.now() - start_time)/5000,2)
    elipse_elapsed_time += (Date.now() - previous_time) * elipse_speed_factor
    
    var modifier = 1/speed_factor
    var w = wrapper.offsetWidth
    var modified_t = (Date.now() % (100 * modifier)/ modifier);
    
    var elipise_t = elipse_elapsed_time % (100 * modifier)/ modifier
    
    if (elapsed_time > elipse_escape_time) {
        push_out_offset = Math.pow((Date.now() - start_time_two) / 1000,3 )
    }
    else {
        push_out_offset = 0
    }
    
    log.innerHTML = push_out_offset + " " + String(elapsed_time)
    

    for (let letter in letters) {
        idx = letter
        letter = document.getElementById(letters[letter])
        
        if (elapsed_time > 10000){
            letter.innerHTML = " ";
        }
        
        
        offset = Math.min(1,elipse_speed_factor) * (mouse_pos_x - w/2) / (w/2) * Math.PI/2
        x_coord = ((w-200+push_out_offset*20)/ 2) * Math.cos(elipise_t+Math.PI+ 0.4*idx) + (w)/2
        y_coord = (w/20)* Math.sin(elipise_t+Math.PI + 0.4*idx  )*(1+push_out_offset/2) + 100 + starting_pos

        
        letter.style.top = y_coord + 'px';
        letter.style.left = String(x_coord) + 'px';
    }

    return false;



}
window.requestAnimationFrame(x);
}
