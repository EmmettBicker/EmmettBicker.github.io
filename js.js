import { generatePerlinNoise } from './perlin_noise.js';

var max_val = 0
var len = 10
var width = 10

const add2DArrays = (arr1, arr2) => 
    arr1.map((row, i) => 
      row.map((val, j) => 
        Math.min(
            Math.max(val + arr2[i][j],0),
            9))
    );

const transitionalFrame = (arr1, arr2,n_frames) => 
    arr1.map((row, i) => 
        row.map((val, j) => 
            (arr2[i][j] - val) / n_frames)
    );
    
function create2DArray(x) {
    return Array(x).fill().map(() => Array(x).fill(0));
}

function perlinNoiseToStringArray(perlinNoise2D, charactersPerRow) {
    return perlinNoise2D.map(row => {
        let rowString = '';
        for (let i = 0; i < charactersPerRow; i++) {
            const index = Math.floor(i * row.length / charactersPerRow);
            const value = Math.floor(row[index] * 2);
            rowString += value.toString();
        }
        return rowString;
    });
}

// const turnArrToBrightness = (arr1) => 
//         arr1.map((row, i) => 
//           row.map((val, j) => 
//             char_to_brightness(val))
//         );


// const brightness_arr = "$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\\|()1{}[]?-_+~<>i!lI;:^'."
// const char_to_brightness = (n) => {
//     /*
//     0 to max val

//     0 to length 

//     val = val * length/val
//     */
//     var percentage = n / max_val
//     var idx = brightness_arr.length * percentage;
//     console.log(n < max_val)
//     return brightness_arr.charAt(idx);

// }
    

const lines = 60
const font_size = 100/lines + "vh"

var time_switched_to_noise = new Date() - 30000
var target_p_noise = generatePerlinNoise(70,70)
var frame_to_add = -1

var p_noise_gradual_addon = 0.2
var p_noise_mult = 1 - p_noise_gradual_addon

var str_arr = []

var pnoise = create2DArray(lines)
document.addEventListener('DOMContentLoaded', function() {
    const texts = document.querySelectorAll('svg text');
    
    function animate() {
       
        var currentDate = new Date() 
        console.log('g')
        // console.log(currentDate - time_switched_to_noise )
        if (currentDate - time_switched_to_noise > 1000) {
            time_switched_to_noise = new Date()
            // pnoise = target_p_noise
            target_p_noise = generatePerlinNoise(70,70, 0, p_noise_mult)
            frame_to_add = transitionalFrame(pnoise, target_p_noise,50)
            p_noise_mult = Math.min(p_noise_mult + 0.2,2)
        }
        else {
            pnoise = add2DArrays(pnoise,frame_to_add)
        }
      
        const svg = document.querySelector('svg');
 
        const svgHeight = svg.clientHeight;
        while (svg.firstChild) {
            svg.removeChild(svg.firstChild);
        }
    
        var chars_to_reach_end = getCharsToReachEnd()
    
        str_arr = perlinNoiseToStringArray(pnoise,chars_to_reach_end)

        for (let i = 1; i < lines; i++)
        {
            
            addTextLine(makeTextLine(i));
        }

        // makeName()

        setTimeout(() => 
        {
            requestAnimationFrame(animate);
        },30)

        
    }

    animate();
});



function addTextLine(param_arr) {
    
    var text = param_arr[0]
    var color = param_arr[1]
    var x = param_arr[2]
    var y = param_arr[3]


    const svg = document.querySelector('svg');

    const newText = document.createElementNS("http://www.w3.org/2000/svg", "text");
    newText.setAttribute('x', x);
    newText.setAttribute('y', y);
    newText.setAttribute('fill', color);
    newText.setAttribute('font-size', font_size);
    newText.setAttribute('xml:space', 'preseve');

    newText.textContent = text;
    
    var output = newText.cloneNode();

    
    var arr = Array.from(text)
  
    for (let j = 0; j < arr.length; j++){ 
        let char = arr[j]
        
  
        const tspan = document.createElementNS("http://www.w3.org/2000/svg", "tspan");
        tspan.textContent = char;
        tspan.setAttribute('opacity', 1);
        if (char == "0") {
            tspan.setAttribute('fill', "black");
        }
        else if (char == "1") {
            tspan.setAttribute('fill', "#0096C7");
        }
        else if (char == "2") {
            tspan.setAttribute('fill', "#48CAE4");
        }
        else if (char == "3") {
            tspan.setAttribute('fill', "#90E0EF");
        }
        else if (char == "4") {
            tspan.setAttribute('fill', "#ADE8F4");
        }
        else if (char == "5") {
            tspan.setAttribute('fill', "#CAF0F8");
        }
        output.appendChild(tspan);
    };

    
    svg.appendChild(output);
    
}

function getCharsToReachEnd() {
    const svg = document.querySelector('svg');
    const svgHeight = svg.clientHeight;
    
    var avg_char_height = svgHeight/lines 
    var svgWidth = svg.clientWidth;
    // Each monospaced character is 5/3 x more wide than tall
    var avg_char_width = avg_char_height / 1.64
    var chars_to_reach_end = svgWidth/avg_char_width
    return chars_to_reach_end
}


function makeTextLine(i) {
    const svg = document.querySelector('svg');
    const svgHeight = svg.clientHeight;
    var example = String.raw`XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX`
    var start = lines / 2 - 4
    var end = lines / 2 + 1
    var ret_val = str_arr[i]
    var current_line = str_arr[i]
    var color = "grey"
    var text_ls = 
    [
        String.raw` ___  XXXXXXXXXXXX   _   _   ___ _    _  XXXXXXXXX`,
        String.raw`| __|_ __  _ __  ___| |_| |_| _ |_)__| |_____ _ _ `,
        String.raw`| _|| '  \| '  \/ -_)  _|  _| _ \ / _| / / -_) '_|`,
        String.raw`|___|_|_|_|_|_|_\___|\__|\__|___/_\__|_\_\___|_|  `,

    ]
    var str_start = getCharsToReachEnd() / 2 - example.length/2
    var str_end = getCharsToReachEnd() / 2 + example.length/2 -1
    if (i < end && i > start) 
    {
        ret_val = str_arr[i].substring(0,str_start)
                    + text_ls[i-start-1]
                    + str_arr[i].substring(str_end,getCharsToReachEnd() )
        color = "white";
        
        if (ret_val.indexOf("X") > -1) 
        {
            for (let j = str_start; j <= str_end; j++) 
            {
                if (ret_val.charAt(j) == 'X') {
               
                    ret_val = ret_val.replaceAt(j,current_line[Math.floor(j)] +"")
                }
            }
        }
    }
    return [ret_val, 
            color,
            4,
            i* svgHeight/lines]
}

function makeName() {
    const svg = document.querySelector('svg');
    const svgHeight = svg.clientHeight;
    var start = (lines/2) - 3
    var text_ls = 
    [
        String.raw` ___  XXXXXXXXXXXX   _   _   ___ _    _   XXXXXXXX`,
        String.raw`| __|_ __  _ __  ___| |_| |_| _ |_)__| |_____ _ _ `,
        String.raw`| _|| '  \| '  \/ -_)  _|  _| _ \ / _| / / -_) '_|`,
        String.raw`|___|_|_|_|_|_|_\___|\__|\__|___/_\__|_\_\___|_|  `,
        String.raw`                                                  `,
    ]
    var avg_char_height = svgHeight/lines 
    var svgWidth = svg.clientWidth;
    // Each monospaced character is 5/3 x more wide than tall
    var avg_char_width = avg_char_height / 1.66

    for (let i = 0; i < text_ls.length; i++ ) {
        var pixel_length = text_ls[i].length * avg_char_width
        var start_px = svgWidth / 2 - pixel_length / 2

        addTextLine(
            [text_ls[i],
                "white",
                start_px ,
                (start + i)* (svgHeight/lines)
            ]
        )
    }
}


String.prototype.replaceAt = function(index, replacement) {
    return this.substring(0, index) + replacement + this.substring(index + replacement.length);
}
