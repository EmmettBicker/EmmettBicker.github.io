import { generatePerlinNoise, generatePerlinNoise2} from './perlin_noise.js';

var max_val = 0
var len = 10
var width = 10

const add2DArrays = (arr1, arr2) => 
    arr1.map((row, i) => 
      row.map((val, j) => 
        (Math.min(
            Math.max(val + arr2[i][j],0),
            9)) )
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
    const rowScale = perlinNoise2D.length / charactersPerRow;
    const colScale = perlinNoise2D[0].length / charactersPerRow;

    return Array.from({ length: charactersPerRow }, (_, rowIndex) => {
        const originalRowIndex = Math.floor(rowIndex * rowScale);
        const row = perlinNoise2D[originalRowIndex];
        let rowString = '';

        for (let i = 0; i < charactersPerRow; i++) {
            const index = Math.floor(i * colScale);
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
    

const lines = 40
const font_size = 100/lines + "vh"

var time_switched_to_noise = new Date() - 30000
var target_p_noise = generatePerlinNoise(20,20)
var frame_to_add = -1

var counter = 1
var p_noise_mult = 0.8

var str_arr = []

var sz = 100
var lastIter = new Date() 
var pnoise = create2DArray(sz)
var currentDate = new Date()
document.addEventListener('DOMContentLoaded', function() {
    // const texts = document.querySelectorAll('svg text');
    
    function animate() {
       
        // console.log(new Date() - lastIter)
        currentDate = new Date()
        // console.log(currentDate - time_switched_to_noise )
        if (currentDate - time_switched_to_noise > 1000) {
            time_switched_to_noise = new Date()
            // pnoise = target_p_noise
            const svg = document.getElementById('fullscreen-svg');
            const svgHeight = svg.clientHeight;
            var avg_char_height = svgHeight/lines 
            var svgWidth = svg.clientWidth;
            target_p_noise = generatePerlinNoise2(svgWidth,svgHeight, sz,sz, -0, p_noise_mult * (Math.sin(counter*1.5)+1)/2.7)
            frame_to_add = transitionalFrame(pnoise, target_p_noise,40)
            p_noise_mult = Math.min(p_noise_mult + 0.2,2)

            counter += 0.3
        }
        else {
            pnoise = add2DArrays(pnoise,frame_to_add)
        }
      
        const svg = document.getElementById('fullscreen-svg');
 
        const svgHeight = svg.clientHeight;
        while (svg.firstChild) {
            svg.removeChild(svg.firstChild);
        }
    
        var chars_to_reach_end = getCharsToReachEnd()
        // console.log(chars_to_reach_end)
        str_arr = perlinNoiseToStringArray(pnoise,chars_to_reach_end)
        var all_lines = Array(lines)
        for (let i = 0; i <= lines; i++)
        {  
            all_lines[i] = makeTextLine(i) 

        }

        try {
            addTextLines(all_lines);
        }
        catch {}

        // makeName()

        setTimeout(() => 
        {
            requestAnimationFrame(animate);
        },20)

        lastIter = new Date() 
    }

        animate();

});

function error_immune_animate() {
    try {
        animate();
    }
    catch {
        setTimeout(() => 
        {
            console.log("herhehr")
            error_immune_animate();
        },2000)

    }
}


var svgWidth = 0;
function addTextLines(lines) {
    const svg = document.getElementById('fullscreen-svg');
    const fragment = document.createDocumentFragment(); // Use a document fragment for better performance
    svgWidth = svg.clientWidth;
    lines.forEach(param_arr => {
        
        let text = param_arr[0];
        if (text === undefined) {
            text = "";
         
        }
        let color = param_arr[1];
        let x = param_arr[2];
        let y = param_arr[3];

        const newText = document.createElementNS("http://www.w3.org/2000/svg", "text");
        newText.setAttribute('x', svgWidth / 2);
        newText.setAttribute('y', y);
        newText.setAttribute('fill', color);
        newText.setAttribute('font-size', font_size);
        newText.setAttribute('font-family', "monospace");
        newText.setAttribute('text-anchor', "middle");
        newText.setAttribute('white-space', 'pre');
        newText.setAttribute('word-wrap', 'normal');
        newText.setAttribute('resize', 'none');

        
        newText.setAttribute('xml:space', 'preserve'); // Corrected attribute name
        newText.style.whiteSpace = 'pre';
        let tspanContent = ""
        if (text === undefined) {
            let tspanContent = ""
         
        }
        else{
            let tspanContent = text[0];
        }
        
        let currentFill = getFillForChar(text[0])
       
        for (let j = 1; j < text.length; j++) {
            let char = text[j];
            let fill = getFillForChar(char); // Helper function to get fill color for each character

            if (fill === currentFill) {
              
                tspanContent += char;
                currentFill = fill;
            } else {
                var newTspan = document.createElementNS("http://www.w3.org/2000/svg", "tspan");
                
                newTspan.textContent = tspanContent; // Set text content of <tspan>
              
                var f = getFillForChar(tspanContent.charAt(0));
                newTspan.setAttribute('fill', f); // Example attribute
    
                newText.appendChild(newTspan);
                tspanContent = char;
                currentFill = fill;
             
            }
        }
        var newTspan = document.createElementNS("http://www.w3.org/2000/svg", "tspan");
        
        newTspan.textContent = tspanContent; // Set text content of <tspan>
        
        var f = getFillForChar(tspanContent.charAt(0));
        newTspan.setAttribute('fill', f); // Example attribute
        newText.appendChild(newTspan);
        
        // print(calibrate(newText));
        // newText.innerHTML = tspanContent;
        fragment.appendChild(newText); // Append to fragment instead of svg directly
    });

    svg.appendChild(fragment); // Append all lines at once
}

function getFillForChar(char) {
    switch (char) {
        case "0":
            return "#000C18";
        case "1":
            return "#0096C7";
        case "2":
            return "#48CAE4";
        case "3":
            return "#90E0EF";
        case "4":
            return "#ADE8F4";
        case "5":
            return "#CAF0F8";
        default:
            return "#FFFFFF"; // Default fill color
    }
}


function getCharsToReachEnd() {
    const svg = document.getElementById('fullscreen-svg');
    const svgHeight = svg.clientHeight;
    var avg_char_height = svgHeight/lines 
    var svgWidth = svg.clientWidth;
    // Each monospaced character is 5/3 x more wide than tall
    var avg_char_width = avg_char_height / 1.64
    var chars_to_reach_end = svgWidth/avg_char_width

    return chars_to_reach_end
}


function makeTextLine(i) {
    const svg = document.getElementById('fullscreen-svg');
    const svgHeight = svg.clientHeight;

    
    
    var example = String.raw`XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX`

    var should_print_name = true
    if (getCharsToReachEnd() < example.length + 2) {
        should_print_name = false
    }

    var start = lines / 2 - 4
    var end = lines / 2 + 1
    var ret_val = str_arr[i]
    var current_line = str_arr[i]
    var color = "grey"
    var text_ls = 
    [
        String.raw` ___  XXXXXXXXXXXX   _   _   ___ _    _  XXXXXXXXX`.replace(/ /g, '\u00A0'),
        String.raw`| __|_ __  _ __  ___| |_| |_| _ |_)__| |_____ _ _ `.replace(/ /g, '\u00A0'),
        String.raw`| _|| '  \| '  \/ -_)  _|  _| _ \ / _| / / -_) '_|`.replace(/ /g, '\u00A0'),
        String.raw`|___|_|_|_|_|_|_\___|\__|\__|___/_\__|_\_\___|_|  `.replace(/ /g, '\u00A0'),

    ]
    var str_start = getCharsToReachEnd() / 2 - example.length/2
    var str_end = getCharsToReachEnd() / 2 + example.length/2 -1
    if (i < end && i > start && should_print_name)  
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
               
                    ret_val = ret_val.replaceAt(j,""+current_line.charAt(Math.floor(j)))
                }
            }
        }
    }
    return [ret_val, 
            color,
            4,
            i* svgHeight/lines]
}

// function makeName() {
//     const svg = document.querySelector('svg');
//     const svgHeight = svg.clientHeight;
//     var start = (lines/2) - 3
//     var text_ls = 
//     [
//         String.raw` ___  XXXXXXXXXXXX   _   _   ___ _    _   XXXXXXXX`,
//         String.raw`| __|_ __  _ __  ___| |_| |_| _ |_)__| |_____ _ _ `,
//         String.raw`| _|| '  \| '  \/ -_)  _|  _| _ \ / _| / / -_) '_|`,
//         String.raw`|___|_|_|_|_|_|_\___|\__|\__|___/_\__|_\_\___|_|  `,
//         String.raw`                                                  `,
//     ]
//     var avg_char_height = svgHeight/lines 
//     var svgWidth = svg.clientWidth;
//     // Each monospaced character is 5/3 x more wide than tall
//     var avg_char_width = avg_char_height / 1.66

//     for (let i = 0; i < text_ls.length; i++ ) {
//         var pixel_length = text_ls[i].length * avg_char_width
//         var start_px = svgWidth / 2 - pixel_length / 2

//         addTextLine(
//             [text_ls[i],
//                 "white",
//                 start_px ,
//                 (start + i)* (svgHeight/lines)
//             ]
//         )
//     }
// }


String.prototype.replaceAt = function(index, replacement) {
    return this.substring(0, index) + replacement + this.substring(index + replacement.length);
}
