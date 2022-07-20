/*
    @file: fetch.js
    @author: Pengcheng Xu (pcxu@bu.edu)
    This file contains implementation of fetching function

*/

const dataBtn = document.getElementById('getData');
const resetBtn = document.getElementById('reset');
dataBtn.addEventListener('click', fetchData);
resetBtn.addEventListener('click', clearDisplay);

// The URL to store the json file
// const URL = "./myJson.json";
const URL = "http://pengcheng-xu.cloud/assets/jsons/myJson.json";

// fetch function
async function fetchData() {
    const res = await fetch(URL, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    });

    // check response status 
    if ( res.status == 200 ) {
        const data = await res.json();
        let output = "";
        let tempString = '';

        Object.entries(data).forEach( entry => {
            tempString += `<li> ${entry[0]} : ${entry[1]} </li>`
        } );

        output += `<ul> ${tempString} </ul>`;
        const box = document.getElementById("infoBox");
        box.innerHTML = output;

    } else {
        alert(" Response error! ");
        return;
    }
}

// clear function
function clearDisplay() {
    document.getElementById("infoBox").innerHTML = "";
}